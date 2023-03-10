from inference_models.inference_model import InferenceModel, InferencePromptWithHistoricalContext

class GPTTurbo(InferenceModel):

    def __init__(self):
        super().__init__()
        self.name = "gpt_turbo"
        self.display_name = "Chat GPT"
        self.openai_model_name = "gpt-3.5-turbo"
        self.temperature = 0.2
        self.default_prompt_seed = "The following text is a conversation between you and User. Respond to User with only the code requested and nothing else."

    def inference_prompt(self, inference_prompt, previous_context):
        prompt = self.default_prompt_seed
        if previous_context and len(previous_context) > 0:
            prompt += "\n\nGiven the previous conversation context:\n\n\"\n%s\n\"" % previous_context
        next_statement = "\n\nUser: " + inference_prompt
        prompt += "\n\nRespond to User's next statement:" + next_statement
        return InferencePromptWithHistoricalContext(prompt, (previous_context or '') + next_statement)
