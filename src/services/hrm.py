"""HR platform stubs."""
from typing import Dict, Any


class HRMService:
    def recruitment(self, req: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "recruitment", "request": req}

    def interview(self, candidate_id: int) -> Dict[str, Any]:
        return {"action": "interview", "candidate_id": candidate_id}

    def offer(self, candidate_id: int) -> Dict[str, Any]:
        return {"action": "offer", "candidate_id": candidate_id}

    def employee_profile(self, user_id: int) -> Dict[str, Any]:
        return {"action": "employee_profile", "user_id": user_id}

    def contract(self, user_id: int, op: str) -> Dict[str, Any]:
        return {"action": "contract", "user_id": user_id, "op": op}

    def onboarding(self, user_id: int) -> Dict[str, Any]:
        return {"action": "onboarding", "user_id": user_id}

    def attendance(self, employee_id: int, event: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "attendance", "employee_id": employee_id, "event": event}

    def leave(self, employee_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "leave", "employee_id": employee_id, "payload": payload}

    def scheduling(self, schedule: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "scheduling", "schedule": schedule}

    def kpi_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "kpi_plan", "plan": plan}

    def okr(self, okr: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "okr", "okr": okr}

    def performance_review(self, user_id: int) -> Dict[str, Any]:
        return {"action": "performance_review", "user_id": user_id}

    def payroll_structure(self, structure: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "payroll_structure", "structure": structure}

    def payroll_run(self, period: str) -> Dict[str, Any]:
        return {"action": "payroll_run", "period": period}
