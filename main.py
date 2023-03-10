import json
import inference_models
import inferences_service
import os
import openai
from datetime import timedelta
from dotenv import load_dotenv
from constants import INFERENCE_VALUE_KEY
from flask import Flask, request, Response, render_template

app = Flask(__name__)
load_dotenv()

# Configure environment keys.
app.secret_key = os.environ("FLASK_SESSION_KEY")

# Set session lengths to 60m
app.permanent_session_lifetime = timedelta(minutes=60)


@app.route("/")
def index():
    return render_template(
        'index.html',
        models=inference_models.all_models)

@app.route("/<string:model>/infer", methods=['POST'])
def infer(model):
    inference_input = request.args[INFERENCE_VALUE_KEY]

    inference_value = inferences_service.infer(model, json.loads(inference_input))
    response = Response(
        response=json.dumps({INFERENCE_VALUE_KEY: inference_value}),
        content_type='application/json')

    return response
