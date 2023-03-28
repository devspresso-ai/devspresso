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
    # If there is no code block extracted, return the inference as plain text
    if code_block is None:
        return CodeInferenceResult(content, 'text')
    # Get the string up until the first newline, which will contain the language of the code if any.
    lines = code_block.split("\n")
    language = lines[0].strip()
    # If there is a language, strip it from the start.
    if len(language) > 0:
        code_block = code_block[code_block.find(language) + len(language):]

    return CodeInferenceResult(code_block.strip(), language)

def trim_context(context: [Dict[str, str]]) -> [Dict[str, str]]:
    """Trims the context to the last 1000 tokens. This is used to optimize inference speed."""
    if context is None:
        return None
    total_tokens = 0
    # Accounts for multiple possible system messages, but as of now only 1 is possible.
    system_messages = []
    conversation_messages = []
    # Iterate backwards so that the conversation_messages begin with the latest message.
    for message in context[::-1]:
        if message['role'] == 'system':
            system_messages.append(message)
        else:
            conversation_messages.append(message)

    for message in system_messages:
        total_tokens += len(message['content'].split(" "))

    # If somehow the system messages are more than 1000 tokens, just nuke the context.
    if total_tokens > 1000:
        return []

    for i in range(len(conversation_messages)):
        message = conversation_messages[i]
        total_tokens += len(message['content'].split(" "))
        if total_tokens > 1000:
            # Trim conversation_messages to the latest i messages.
            conversation_messages = conversation_messages[:i]
            # Return all conversation messages, keeping in mind that the list is reversed.
            new_context = conversation_messages + system_messages
            return new_context[::-1]

    return context

def _extract_code_block(text: str) -> Optional[str]:
    start_index = text.find("```")
    if start_index == -1:
        return None
    end_index = text.rfind("```", start_index + 3)
    if end_index == -1:
        return None
    return text[start_index + 3:end_index]
