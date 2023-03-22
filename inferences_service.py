from typing import Dict, Any

import openai
import session_manager
import inference_models
import chat_helpers
from inference_models.inference_model import ChatInferencePrompt, InferenceModel
from chat_helpers import CodeInferenceResult

code_generator = inference_models.code_generator.CodeGenerator()
all_models = code_generator

def infer_code_generator(model_name: str, inference_dict: Dict[str, str]) -> CodeInferenceResult:
    inference_input = inference_dict[InferenceModel.inference_prompt_name]
    current_file_text = inference_dict[InferenceModel.current_file_text_name]
    previous_messages: [Dict[str, str]] = session_manager.get_model_context(model_name)
    inference_prompt: ChatInferencePrompt = code_generator.inference_prompt(inference_input, current_file_text, previous_messages)
    inference_result: Dict[str, str] = _get_chat_inference(code_generator, inference_prompt.messages)

    # Construct new conversation history context
    # This conversation history context is a list of messages for chat inference.
    new_context: [Dict[str, str]] = inference_prompt.messages
    new_context.append(inference_result)
    session_manager.set_model_context(model_name, new_context)

    # Return just the code supplied from the latest message to the caller.
    code_result: CodeInferenceResult = chat_helpers.get_code_from_inference(inference_result)
    return code_result

def infer(inference_input: Dict[str, Any], openai_api_key: str, openai_organization_id: str) -> CodeInferenceResult:
    """inference_input is expected to be a dictionary with keys and values specific to the model."""
    _update_api_keys(openai_api_key, openai_organization_id)
    return infer_code_generator(code_generator.name, inference_input)

def get_prompt(model: str) -> str:
    match model:
        case code_generator.name:
            return code_generator.default_prompt_seed
        case _:
            raise ValueError("Invalid model name found.")

def _get_inference(model: InferenceModel, prompt: str):
    print("Full inference string: %s" % prompt)
    inference = openai.Completion.create(
        model=model.openai_model_name,
        prompt=prompt,
        max_tokens=model.max_tokens,
        stop=model.end_token,
        temperature=model.temperature,
        presence_penalty=model.presence_penalty,
        frequency_penalty=model.frequency_penalty)
    print("Returned inference: %s" % inference)
    return inference

def _get_chat_inference(model: InferenceModel, messages: [Dict[str, str]]) -> Dict[str, str]:
    print("Full inference string: %s" % messages)
    inference = openai.ChatCompletion.create(
        model=model.openai_model_name,
        messages=messages,
        max_tokens=model.max_tokens,
        stop=model.end_token,
        temperature=model.temperature,
        presence_penalty=model.presence_penalty,
        frequency_penalty=model.frequency_penalty)
    print("Returned inference: %s" % inference)
    message = inference.choices[0].message
    return {'role': message.role, 'content': message.content}

def _update_api_keys(openai_api_key: str, openai_organization_id: str):
    openai.api_key = openai_api_key
    openai.organization = openai_organization_id

    session_manager.set_openai_key(openai_api_key)
    session_manager.set_openai_organization_id(openai_organization_id)
