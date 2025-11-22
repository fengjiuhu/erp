"""Hook registration stub."""

HOOKS = {}


def register(name: str, handler):
    HOOKS[name] = handler
    return handler
