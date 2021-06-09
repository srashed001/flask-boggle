

class BoggleGame {

    constructor(boardId, timerLength){
        this.words = new Set()
        this.board = $(`#${boardId}`)
        this.score = 0
        this.secs = timerLength
    

        this.timer = setInterval(this.reduceTime.bind(this), 1000)

        $(".guess-form", this.board).on("submit", this.handleSubmit.bind(this))
    }

    reduceTime(){
        this.secs += -1
        this.showTimer()

        if(this.secs === 0){
            clearInterval(this.timer);
            $(".guess-form", this.board).hide()
            this.endGame();
        }
    }

    showTimer(){
        $('.timer', this.board).text(this.secs)
    }

    showMessage(msg, cls){
        $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`)
    }

    showScore(){
        $('.score', this.board).text(this.score)
    }

    showWords(word){
        $('.words-list', this.board).append(`<li>${word}</li>`)

    }
 
    async handleSubmit(evt){
        evt.preventDefault();

        const $guess = $('#guess', this.board)
        // extract guess value from the form and assign it to a variable 
        let guess = $guess.val()
        // if there is no guess val, return out of function 
        if (!guess) return 
        // check if guess has already been made, check against words set 
        if (this.words.has(guess)){
            this.showMessage("Guess has already been made, try another word", 'err');
            return;
        }

        console.log('hello')

        // check against our server to see if word is a valid word
        const response = await axios.get("/check-guess-validity",{params: {guess: guess}})
        let res = response.data.result 

        // if data response returns result is not a word, let user know words is not valid 
        if (res === "not-word") {
            this.showMessage(`${guess} is not a valid word, please try again`, 'err')
        }
        // if data response returns result is a valid word, but not on board, let user know to try again
        else if (res === "not-on-board"){
            this.showMessage(`${guess} is not a word on this board, please try again`, 'err')
        }
        // data response return result is a valid word and is also on the board 
        else {
            // add guess to list of words already guessed
            this.score += guess.length
            this.showScore()
            this.words.add(guess)
            this.showWords(guess)
            this.showMessage(`${guess} was added!`, 'ok')
        }

        $guess.val('')
    }

    async endGame(){
        $('#current-game').prepend("<button class='start-new-game'>Start New Game</button>")
        $('.start-new-game', this.board).on("click", this.handleNewGame.bind(this))
        const resp = await axios.post("/score", {score: this.score});
        if(resp.data.record){
            this.showMessage(`New Record: ${this.score}`, 'ok');
        } else {
            this.showMessage(`Final score: ${this.score}`)
        }
    }

    handleNewGame(){
        window.location.reload(true)
    }


}