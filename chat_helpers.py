from typing import Dict, Optional

class CodeInferenceResult:
    """Represents the result of an inference request"""

    def __init__(self, value: str, language: str):
        self.value = value
        self.language = language

def get_conversation_string(context: [Dict[str, str]]) -> Optional[str]:
    """Returns a string representation of the conversation history"""
    if context is None:
        return None
    return "\n".join([f"{message['role']}: {message['content']}" for message in context])

def get_code_from_inference(inference: Dict[str, str]) -> CodeInferenceResult:
    """Returns the code from the inference result"""
    content = inference['content']
    code_block = _extract_code_block(content)
    # Get the string up until the first newline, which will contain the language of the code if any.
    lines = code_block.split("\n")
    language = lines[0].strip()
    # If there is a language, strip it from the start.
    if len(language) > 0:
        code_block = code_block[code_block.find(language) + len(language):]
    if code_block is None:
        return CodeInferenceResult(content, 'text')

    return CodeInferenceResult(code_block.strip(), language)

def _extract_code_block(text: str) -> Optional[str]:
    start_index = text.find("```")
    if start_index == -1:
        return None
    end_index = text.find("```", start_index + 3)
    if end_index == -1:
        return None
    return text[start_index + 3:end_index]
