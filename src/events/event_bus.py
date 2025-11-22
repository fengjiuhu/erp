"""Simple event bus stub."""

def emit(event_name: str, payload: dict):
    return {"emitted": event_name, "payload": payload}
