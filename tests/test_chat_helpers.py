from chat_helpers import _extract_code_block

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
