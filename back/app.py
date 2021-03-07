#!/usr/bin/env python3

import flask
import flask_cors
import random

app = flask.Flask(__name__)
cors = flask_cors.CORS(app)


@app.route("/")
def roll_dice():
    vals = [random.randrange(1, 7) for _ in range(3)]
    response = flask.jsonify(data=vals)
#    response.headers.add("Access-Control-Allow-Origin", "*")
#    response.headers.add("Access-Control-Allow-Headers", "*")
#    response.headers.add("Access-Control-Allow-Methods", "*")
    return response, 200
