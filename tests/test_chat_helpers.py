from inference_models.chat_helpers import _extract_code_block, trim_context

def test_extract_code_block():
    # Test case 1: Code block exists
    text1 = "Here is some text before the code block\n\n```\nprint('hello world')\nprint('goodbye world')\n```\n\nHere is some text after the code block"
    assert _extract_code_block(text1) == "\nprint('hello world')\nprint('goodbye world')\n"
    # Test case 2: No code block exists
    text2 = "Here is some text that doesn't have a code block"
    assert _extract_code_block(text2) is None
    # Test case 3: Code block at beginning of string
    text3 = "```\nprint('hello world')\nprint('goodbye world')\n```\n\nHere is some text after the code block"
    assert _extract_code_block(text3) == "\nprint('hello world')\nprint('goodbye world')\n"
    # Test case 4: Code block at end of string
    text4 = "Here is some text before the code block\n\n```\nprint('hello world')\nprint('goodbye world')\n```"
    assert _extract_code_block(text4) == "\nprint('hello world')\nprint('goodbye world')\n"
    # Test case 5: Multiple code blocks exist
    text5 = "Here is some text before the first code block\n\n```\nprint('hello world')\nprint('goodbye world')\n```\n\nHere is some text before the second code block\n\n```\nprint('foo')\nprint('bar')\n```\n\nHere is some text after the second code block"
    assert _extract_code_block(text5) == "\nprint('hello world')\nprint('goodbye world')\n"

def test_trim_context():
    context = [
        {'role': 'system', 'content': 'Hello! How can I assist you today?'},
        {'role': 'user', 'content': 'I need some help with my account'}
    ]
    expected_output = [
        {'role': 'system', 'content': 'Hello! How can I assist you today?'},
        {'role': 'user', 'content': 'I need some help with my account'}
    ]
    assert trim_context(context) == expected_output

    # Test when more than 1000 tokens
    context = [
        {'role': 'system', 'content': 'Hello! How can I assist you today?'},
        {'role': 'user', 'content': 'I need some help with my account'}
    ]
    context += [{'role': 'user', 'content': 'This is a message.'}] * 1000
    assert trim_context(context) != context

    # Test when all messages are system messages
    context = [
        {'role': 'system', 'content': 'Hello! How can I assist you today?'},
        {'role': 'system', 'content': 'How can I help you?'},
        {'role': 'system', 'content': 'Is there anything I can help you with?'},
        {'role': 'system', 'content': 'Sorry, I cannot assist with that.'},
    ]
    expected_output = context
    assert trim_context(context) == expected_output

    # Test when system messages are more than 1000 tokens
    system_messages = [{'role': 'system', 'content': 'Hello, '}]
    context = system_messages + [{'role': 'system', 'content': 'This is a message.'}] * 1000
    expected_output = []
    assert trim_context(context) == expected_output
