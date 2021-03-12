#!/usr/bin/env python3

import flask
import flask_cors
import random

app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route("/")
@app.route("/api")
def roll_dice():
    vals = [random.randrange(-1, 2) for _ in range(4)]
    return flask.jsonify(data=vals), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
