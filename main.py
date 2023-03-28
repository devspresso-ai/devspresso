import json

import authentication_service
import inferences_service
import os
import session_manager
from constants import INFERENCE_VALUE_RESPONSE_KEY, INFERENCE_LANGUAGE_RESPONSE_KEY, OPENAI_KEY_PARAM_NAME, \
    OPENAI_ORGANIZATION_ID_PARAM_NAME, CURRENT_FILE_TEXT_PARAM_NAME
from inference_models.chat_helpers import CodeInferenceResult
from dotenv import load_dotenv
from inference_models import inference_model
from flask import Flask, request, Response, render_template, redirect, url_for
from flask_sslify import SSLify

app = Flask(__name__)
SSLify(app)
load_dotenv()

# Configure environment keys.
app.secret_key = os.getenv("FLASK_SESSION_KEY")

@app.route("/")
def index():
    if session_manager.get_auth_key() is None:
        return redirect(url_for('login'))

    # When home page is loaded, clear previous context to establish a new conversation.
    session_manager.clear_all_model_contexts()
    openai_key: str = session_manager.get_openai_key() or os.getenv("OPENAI_API_KEY")
    openai_organization_id: str = session_manager.get_openai_organization_id() or os.getenv("OPENAI_ORGANIZATION_ID")
    return render_template(
        'index.html',
        inference_prompt_name=inference_model.InferenceModel.inference_prompt_name,
        inference_value_response_key=INFERENCE_VALUE_RESPONSE_KEY,
        inference_language_response_key=INFERENCE_LANGUAGE_RESPONSE_KEY,
        current_file_text_param_name=CURRENT_FILE_TEXT_PARAM_NAME,
        openai_key_param_name=OPENAI_KEY_PARAM_NAME,
        openai_organization_id_param_name=OPENAI_ORGANIZATION_ID_PARAM_NAME,
        openai_key_prefill_value=openai_key,
        openai_organization_id_prefill_value=openai_organization_id)

@app.route("/contact")
def contact():
    return render_template('contact.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route ("/login")
def login():
    return render_template('login.html', google_client_id=os.getenv("GOOGLE_CLIENT_ID"))

@app.route ("/authenticate_completion", methods=['POST'])
def authenticate_completion():
    credential = request.form['credential']
    if authentication_service.verify_token(credential):
        session_manager.set_auth_key(credential)

    return redirect(url_for('index'))

@app.route("/infer", methods=['POST'])
def infer():
    inference_input: str = request.json
    openai_api_key: str = request.args[OPENAI_KEY_PARAM_NAME]
    openai_organization_id: str = request.args[OPENAI_ORGANIZATION_ID_PARAM_NAME]
    inference: CodeInferenceResult = inferences_service.infer(
        inference_input,
        openai_api_key,
        openai_organization_id)
    response = Response(
        response=json.dumps({
            INFERENCE_VALUE_RESPONSE_KEY: inference.value,
            INFERENCE_LANGUAGE_RESPONSE_KEY: inference.language
        }),
        content_type='application/json')

    return response

@app.route("/clear", methods=['POST'])
def clear():
    session_manager.clear_all_model_contexts()
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

@app.route("/privacy_policy")
def privacy_policy():
    return render_template('privacy_policy.html')
