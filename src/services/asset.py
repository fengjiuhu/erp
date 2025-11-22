"""Asset lifecycle stubs."""
from typing import Dict, Any


class AssetService:
    def register(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "asset_register", "asset": payload}

    def borrow(self, asset_id: int, user_id: int) -> Dict[str, Any]:
        return {"action": "asset_borrow", "asset_id": asset_id, "user_id": user_id}

    def audit(self, asset_id: int) -> Dict[str, Any]:
        return {"action": "asset_audit", "asset_id": asset_id, "status": "ok"}
