"""Auth middleware stub."""

def authenticate(request):
    return {"authenticated": True, "user_id": request.get("user_id")}
