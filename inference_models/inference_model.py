from typing import Dict

class InferencePrompt:

    def __init__(self, prompt: str):
        self.prompt = prompt

class InferencePromptWithHistoricalContext(InferencePrompt):
    """Defines an inference prompt that also includes the historical conversation context of that prompt."""

    def __init__(self, prompt: str, context: str):
        super().__init__(prompt)
        self.context = context

class ChatInferencePrompt(InferencePrompt):
    """Defines an inference prompt that represents a chat inference. The chat inference context is fully contained in messages, including the existing prompt."""

    def __init__(self, messages: [Dict[str, str]]):
        super().__init__('')
        self.messages = messages

class InferenceModel:

    inference_prompt_name = "inference_prompt"

    def __init__(self):
        self.default_prompt_seed = ""
        self.name = "inference_model"
        self.display_name = "Inference Model"
        self.openai_model_name = "text-davinci-003"
        self.max_tokens = 200
        self.end_token = None
        self.temperature = 1
        self.frequency_penalty = 0
        self.presence_penalty = 0

    def inference_prompt(self, inference_input: str) -> InferencePrompt:
        raise NotImplementedError("Not implemented!")
