#!/usr/bin/env python3

import flask


app = flask.Flask(__name__)


@app.route("/")
@app.route("/index")
def index():
    return "Hello world!"
