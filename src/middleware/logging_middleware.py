"""Logging middleware stub."""

def log_request(request):
    return {"logged": True, "path": request.get("path", "")}
