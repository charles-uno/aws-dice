#!/usr/bin/env python3

import flask
import random


app = flask.Flask(__name__)


@app.route("/")
def roll_dice():
    vals = [random.randrange(1, 7) for _ in range(3)]
    return flask.jsonify(data=vals), 200
