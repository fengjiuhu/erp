"""Rate limit middleware stub."""

def check_quota(request):
    return {"allowed": True, "client": request.get("client")}
