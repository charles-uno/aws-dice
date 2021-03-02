#!/usr/bin/env python3

import flask
import os
import requests


foo = os.environ.get("FOO")


app = flask.Flask(__name__)


@app.route("/")
def index():

    try:
        reply = requests.get("http://eb-back:5000")
        data = reply.json()["data"]
    except Exception as exc:
        data = exc

    return f"Hello world! ... {foo} ... {data}"
