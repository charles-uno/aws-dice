#!/usr/bin/env python3

import flask
import flask_cors
import random

app = flask.Flask(__name__)
cors = flask_cors.CORS(app)


@app.route("/")
def roll_dice():
    vals = [random.randrange(-1, 2) for _ in range(4)]
    response = flask.jsonify(data=vals)
    return response, 200
