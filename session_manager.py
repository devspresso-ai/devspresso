from flask import session

MODEL_CONTEXT_KEY = "model-context"

def _get_session_context():
    context = session.get(MODEL_CONTEXT_KEY)
    if context is None:
        print("Creating new context")
        context = dict()
        session[MODEL_CONTEXT_KEY] = context
    return context

def _new_model_context(context, model_name, value):
    context[model_name] = value
    return context


def get_model_context(model_name):
    return _get_session_context().get(model_name)


def set_model_context(model_name, value):
    print("Updating context for model %s with value %s" % (model_name, value))
    new_context = _new_model_context(_get_session_context(), model_name, value)
    session[MODEL_CONTEXT_KEY] = new_context
