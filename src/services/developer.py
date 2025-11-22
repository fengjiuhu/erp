"""Low-code and extension platform stubs."""
from typing import Dict, Any


class DeveloperService:
    def form_designer(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "form_designer", "schema": schema}

    def workflow_designer(self, bpmn: str) -> Dict[str, Any]:
        return {"action": "workflow_designer", "bpmn": bpmn}

    def api_invocation(self, name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "api_invocation", "name": name, "payload": payload}

    def plugin(self, manifest: Dict[str, Any]) -> Dict[str, Any]:
        return {"action": "plugin", "manifest": manifest}

    def custom_report(self, query: str) -> Dict[str, Any]:
        return {"action": "custom_report", "query": query}
