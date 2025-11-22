"""Finance ERP stubs."""
from typing import Dict, Any


class FinanceService:
    def ledger(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "ledger", "entry": entry}

    def voucher(self, voucher: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "voucher", "voucher": voucher}

    def close_period(self, period: str) -> Dict[str, Any]:
        return {"action": "close_period", "period": period}

    def report(self, report_type: str) -> Dict[str, Any]:
        return {"action": "report", "type": report_type}

    def accounts_receivable(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "accounts_receivable", "payload": payload}

    def accounts_payable(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "accounts_payable", "payload": payload}

    def invoice(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "invoice", "data": data}

    def reconciliation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "reconciliation", "payload": payload}

    def budget_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "budget_plan", "plan": plan}

    def budget_adjust(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "budget_adjust", "payload": payload}

    def budget_monitor(self, period: str) -> Dict[str, Any]:
        return {"action": "budget_monitor", "period": period}

    def expense_claim(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "expense_claim", "payload": payload}

    def ocr_receipt(self, image_path: str) -> Dict[str, Any]:
        return {"action": "ocr_receipt", "image_path": image_path}

    def fixed_asset_depreciation(self, asset_id: int) -> Dict[str, Any]:
        return {"action": "depreciation", "asset_id": asset_id}

    def asset_journal(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "asset_journal", "payload": payload}
