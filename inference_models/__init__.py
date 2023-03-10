from inference_models import gpt_turbo

gtp_turbo = gpt_turbo.GPTTurbo()

all_models = [gpt_turbo]

def model_by_name(name):
    for model in all_models:
        if model.name == name:
            return model

    raise ValueError("No model found with name: %s" % name)
