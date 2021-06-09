from boggle import Boggle
from flask import Flask, json, render_template, request, session, jsonify, flash


app = Flask(__name__)
app.config["SECRET_KEY"] = 'CHAND'

boggle_game = Boggle()

@app.route('/')
def create_game_board():
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session['highscore']

    return render_template('home.html', board = board, highscore = highscore)

@app.route("/check-guess-validity")
def check_guess_validity():
    board = session['board']
    word = request.args['guess']
 
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/score", methods=['POST'])
def check_high_score():

    score =  request.json["score"]
    high_score = session.get('highscore', 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, high_score)

    return jsonify(record=score > high_score)




        

