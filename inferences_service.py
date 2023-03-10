import openai
import session_manager
from inference_models import inference_model, gpt_turbo

def infer_gpt(model_name, inference_prompt):
    previous_context = session_manager.get_model_context(model_name)
    inference_prompt = gpt_turbo.inference_prompt(inference_prompt, previous_context)
    inference = _get_inference(gpt_turbo, inference_prompt.prompt)
    inference_value = "\n\nYou: %s" % inference.choices[0].text.strip()

    # Construct new conversation history context
    new_context = inference_prompt.context
    new_context += inference_value
    session_manager.set_model_context(model_name, new_context)

    return inference_value

def _get_inference(model: inference_model.InferenceModel, prompt: str):
    print("Full inference string: %s" % prompt)
    inference = openai.Completion.create(
        model=model.openai_model_name,
        prompt=prompt,
        max_tokens=4096,
        stop=model.end_token,
        temperature=model.temperature,
        presence_penalty=model.presence_penalty,
        frequency_penalty=model.frequency_penalty)
    print("Returned inference: %s" % inference)
    return inference

"""
inference_input is expected to be a dictionary with keys and values specific to the model.
"""
def infer(model_name, inference_input):
    match model_name:
        case gpt_turbo.name:
            return infer_gpt(
                inference_input[inference_model.inference_prompt_name])
        case _:
            raise ValueError("Invalid model name found.")

def get_prompt(model):
    match model:
        case gpt_turbo.name:
            return gpt_turbo.default_prompt_seed
        case _:
            raise ValueError("Invalid model name found.")
