class InferencePrompt:

    def __init__(self, prompt):
        self.prompt = prompt

"""
Defines an inference prompt that also includes the historical conversation context of that prompt.
"""
class InferencePromptWithHistoricalContext(InferencePrompt):

    def __init__(self, prompt, context):
        super().__init__(prompt)
        self.context = context


class InferenceModel:

    inference_prompt_name = 'inference_prompt'
    context_name = 'context_name'

    def __init__(self):
        self.default_prompt_seed = ""
        self.name = "inference_model"
        self.display_name = "Inference Model"
        self.openai_model_name = None
        self.end_token = None
        self.temperature = 1
        self.frequency_penalty = 0
        self.presence_penalty = 0

    def inference_prompt(self, inference_input):
        raise NotImplementedError("Not implemented!")
