"""Mobile office stubs."""
from typing import Dict, Any


class MobileService:
    def approve(self, task_id: int) -> Dict[str, Any]:
        return {"action": "mobile_approve", "task_id": task_id}

    def punch(self, user_id: int) -> Dict[str, Any]:
        return {"action": "mobile_punch", "user_id": user_id}

    def reimburse(self, claim_id: int) -> Dict[str, Any]:
        return {"action": "mobile_reimburse", "claim_id": claim_id}

    def im(self, channel: str, message: str) -> Dict[str, Any]:
        return {"action": "mobile_im", "channel": channel, "message": message}

    def portal(self, user_id: int) -> Dict[str, Any]:
        return {"action": "mobile_portal", "user_id": user_id}
