from flask import session
from typing import Any, Dict, Optional
from constants import OPENAI_KEY_PARAM_NAME, OPENAI_ORGANIZATION_ID_PARAM_NAME, GOOGLE_OAUTH_KEY

MODEL_CONTEXT_KEY: str = "model-context"

def _get_session_context() -> Dict[str, Any]:
    context: Dict[str, Any] = session.get(MODEL_CONTEXT_KEY, {})
    if context is None:
        print("Creating new context")
        context = {}
        session[MODEL_CONTEXT_KEY] = context
    return context

def _new_model_context(context: Dict[str, Any], model_name: str, value: Any) -> Dict[str, Any]:
    """Updates context with the model entry for the given model_name and value"""
    context[model_name] = value
    return context

def get_model_context(model_name: str) -> Optional[Any]:
    return _get_session_context().get(model_name)

def set_model_context(model_name: str, value: Any) -> None:
    print(f"Updating context for model {model_name} with value {value}")
    new_context = _new_model_context(_get_session_context(), model_name, value)
    session[MODEL_CONTEXT_KEY] = new_context

def clear_model_context(model_name: str):
    if model_name in _get_session_context():
        new_context = _get_session_context()
        del new_context[model_name]
        session[MODEL_CONTEXT_KEY] = new_context
        print("Model context cleared for %s" % model_name)

def clear_all_model_contexts():
    if MODEL_CONTEXT_KEY in session:
        del session[MODEL_CONTEXT_KEY]

def get_openai_key() -> Optional[str]:
    return session.get(OPENAI_KEY_PARAM_NAME)

def set_openai_key(value: str) -> None:
    session[OPENAI_KEY_PARAM_NAME] = value

def get_openai_organization_id() -> Optional[str]:
    return session.get(OPENAI_ORGANIZATION_ID_PARAM_NAME)

def set_openai_organization_id(value: str) -> None:
    session[OPENAI_ORGANIZATION_ID_PARAM_NAME] = value

def get_auth_key() -> Optional[str]:
    return session.get(GOOGLE_OAUTH_KEY)

def set_auth_key(value: str) -> None:
    session[GOOGLE_OAUTH_KEY] = value
