from flask import Flask, jsonify, render_template
from model import connect_to_db


app = Flask(__name__)


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)