from typing import Dict, Optional
from constants import CURRENT_FILE_TEXT_PARAM_NAME, ENVIRONMENT_CONTEXT_PARAM_NAME


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

    def __init__(self, seed_message: Optional[Dict[str, str]], messages: [Dict[str, str]]):
        super().__init__('')
        self._seed_message = seed_message
        self._messages = messages

    def get_messages(self):
        return [self._seed_message] + self._messages if self._seed_message is not None else self._messages

class InferenceModel:

    inference_prompt_name = "inference_prompt"
    current_file_text_name = CURRENT_FILE_TEXT_PARAM_NAME
    environment_context_name = ENVIRONMENT_CONTEXT_PARAM_NAME

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
