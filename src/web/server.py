"""Lightweight multi-page web UI with session auth and module-level permissions.

Endpoints
- GET /login                -> login page (public)
- GET /dashboard.html       -> protected landing page
- GET /<module>.html        -> protected module pages
- POST /api/login           -> authenticate (default admin/admin)
- POST /api/logout          -> drop session
- POST /api/users           -> admin-only user creation & permission assignment
- GET /api/me               -> current user context
- POST /api/run             -> run tasks concurrently with permission checks

The server keeps an in-memory user store and session registry for demo purposes
and reuses the existing thread pool helper for concurrency.
"""
import json
import mimetypes
import secrets
import uuid
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple

from src.common.runtime import run_concurrent
from src.services.asset import AssetService
from src.services.crm import CRMService, TicketService
from src.services.bi import BIService
from src.services.developer import DeveloperService
from src.services.finance import FinanceService
from src.services.hrm import HRMService
from src.services.iam import IAMService
from src.services.integration import IntegrationService
from src.services.itsm import ITSMService
from src.services.knowledge import KnowledgeService, LearningService
from src.services.mobile import MobileService
from src.services.oa import OAService
from src.services.office import CalendarTaskService, CommunicationService, DocumentService
from src.services.portal import PortalService
from src.services.project import ProjectService
from src.services.security import SecurityService
from src.services.supply_chain import SupplyChainService

UI_DIR = Path(__file__).resolve().parent / "static"

MODULES = {
    "iam": "IAM & Security",
    "integration": "Integration",
    "office": "Office",
    "oa": "OA",
    "hrm": "HRM",
    "finance": "Finance",
    "supply": "Supply Chain",
    "project": "Project",
    "crm": "CRM & Tickets",
    "knowledge": "Knowledge & Learning",
    "mobile": "Portal & Mobile",
    "itsm": "ITSM & BI",
    "developer": "Developer",
    "asset": "Asset",
}

DEFAULT_ADMIN = {
    "password": "admin",
    "modules": list(MODULES.keys()),
    "department": "HQ",
    "role": "admin",
}


USER_DB: Dict[str, Dict[str, object]] = {"admin": DEFAULT_ADMIN.copy()}
SESSIONS: Dict[str, str] = {}


class DemoHandler(BaseHTTPRequestHandler):
    services = {
        "iam": IAMService(),
        "integration": IntegrationService(),
        "security": SecurityService(),
        "document": DocumentService(),
        "communication": CommunicationService(),
        "calendar": CalendarTaskService(),
        "oa": OAService(),
        "hrm": HRMService(),
        "finance": FinanceService(),
        "supply": SupplyChainService(),
        "project": ProjectService(),
        "crm": CRMService(),
        "ticket": TicketService(),
        "knowledge": KnowledgeService(),
        "learning": LearningService(),
        "mobile": MobileService(),
        "portal": PortalService(),
        "itsm": ITSMService(),
        "bi": BIService(),
        "developer": DeveloperService(),
        "asset": AssetService(),
    }

    task_registry: Dict[str, Tuple[str, Callable[[], object]]] = {
        "iam:create_user": ("iam", lambda: DemoHandler.services["iam"].create_user({"username": "web"})),
        "iam:sync_ldap": ("iam", lambda: DemoHandler.services["iam"].sync_ldap()),
        "security:waf": ("iam", lambda: DemoHandler.services["security"].waf_filter({"path": "/"})),
        "integration:kafka": ("integration", lambda: DemoHandler.services["integration"].kafka_enqueue("events", {"source": "ui"})),
        "document:edit": ("office", lambda: DemoHandler.services["document"].edit(1, "draft")),
        "communication:chat": ("office", lambda: DemoHandler.services["communication"].chat("general", "hello")),
        "calendar:remind": ("office", lambda: DemoHandler.services["calendar"].remind(101)),
        "oa:approval": ("oa", lambda: DemoHandler.services["oa"].generic_approval({"type": "leave"})),
        "hrm:payroll": ("hrm", lambda: DemoHandler.services["hrm"].payroll_run("2025-12")),
        "finance:expense": ("finance", lambda: DemoHandler.services["finance"].expense_claim({"employee_id": 1, "total": 99.9})),
        "supply:po": ("supply", lambda: DemoHandler.services["supply"].purchase_order({"vendor": "ACME"})),
        "project:gantt": ("project", lambda: DemoHandler.services["project"].gantt(5)),
        "crm:pipeline": ("crm", lambda: DemoHandler.services["crm"].pipeline("proposal")),
        "ticket:create": ("crm", lambda: DemoHandler.services["ticket"].ticket({"title": "VPN"})),
        "knowledge:search": ("knowledge", lambda: DemoHandler.services["knowledge"].search("SSO")),
        "learning:exam": ("knowledge", lambda: DemoHandler.services["learning"].exam({"course_id": 7})),
        "mobile:approve": ("mobile", lambda: DemoHandler.services["mobile"].approve(12)),
        "portal:todo": ("mobile", lambda: DemoHandler.services["portal"].todo_center(1)),
        "itsm:monitor": ("itsm", lambda: DemoHandler.services["itsm"].monitor({"cpu": 70})),
        "bi:dashboard": ("itsm", lambda: DemoHandler.services["bi"].dashboard({"scope": "company"})),
        "developer:form": ("developer", lambda: DemoHandler.services["developer"].form_designer({"fields": []})),
        "asset:audit": ("asset", lambda: DemoHandler.services["asset"].audit(2)),
    }

    def log_message(self, fmt, *args):
        # Keep console noise minimal during tests/dev
        return

    # --- session helpers -------------------------------------------------
    def _parse_cookies(self) -> Dict[str, str]:
        raw = self.headers.get("Cookie")
        if not raw:
            return {}
        cookie = SimpleCookie()
        cookie.load(raw)
        return {k: v.value for k, v in cookie.items()}

    def _current_user(self) -> Optional[Tuple[str, Dict[str, object]]]:
        cookies = self._parse_cookies()
        token = cookies.get("session")
        if not token:
            return None
        username = SESSIONS.get(token)
        if not username:
            return None
        user = USER_DB.get(username)
        if not user:
            return None
        return username, user

    def _require_auth(self) -> Optional[Tuple[str, Dict[str, object]]]:
        user = self._current_user()
        if not user:
            self._send_json({"error": "unauthorized"}, HTTPStatus.UNAUTHORIZED)
        return user

    # --- response helpers -----------------------------------------------
    def _send_json(self, payload: Dict, status: HTTPStatus = HTTPStatus.OK):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_file(self, path: Path):
        if not path.exists() or not path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content = path.read_bytes()
        mime, _ = mimetypes.guess_type(str(path))
        content_type = mime or "application/octet-stream"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def _redirect(self, location: str):
        self.send_response(HTTPStatus.FOUND)
        self.send_header("Location", location)
        self.end_headers()

    # --- routing ---------------------------------------------------------
    def do_GET(self):  # noqa: N802
        if self.path == "/":
            user = self._current_user()
            target = "/dashboard.html" if user else "/login.html"
            self._redirect(target)
            return

        if self.path.startswith("/static/"):
            self._serve_file(UI_DIR / self.path.replace("/static/", ""))
            return

        if self.path.endswith(".html"):
            if self.path == "/login.html":
                self._serve_file(UI_DIR / "login.html")
                return
            user = self._current_user()
            if not user:
                self._redirect("/login.html")
                return
            self._serve_file(UI_DIR / self.path.strip("/"))
            return

        if self.path == "/api/me":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            self._send_json(
                {
                    "username": username,
                    "modules": user.get("modules", []),
                    "department": user.get("department"),
                    "role": user.get("role"),
                }
            )
            return

        self.send_error(HTTPStatus.NOT_FOUND)

    def do_POST(self):  # noqa: N802
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode() or "{}")
        except json.JSONDecodeError:
            self._send_json({"error": "invalid JSON"}, HTTPStatus.BAD_REQUEST)
            return

        if self.path == "/api/login":
            username = data.get("username", "")
            password = data.get("password", "")
            user = USER_DB.get(username)
            if not user or user.get("password") != password:
                self._send_json({"error": "invalid credentials"}, HTTPStatus.UNAUTHORIZED)
                return
            token = secrets.token_hex(16)
            SESSIONS[token] = username
            self.send_response(HTTPStatus.OK)
            body = json.dumps({"ok": True, "modules": user["modules"]}).encode()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Set-Cookie", f"session={token}; HttpOnly; Path=/")
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path == "/api/logout":
            cookies = self._parse_cookies()
            token = cookies.get("session")
            if token and token in SESSIONS:
                SESSIONS.pop(token)
            self._send_json({"ok": True})
            return

        if self.path == "/api/users":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            if user.get("role") != "admin":
                self._send_json({"error": "forbidden"}, HTTPStatus.FORBIDDEN)
                return
            new_username = data.get("username") or f"user-{uuid.uuid4().hex[:6]}"
            password = data.get("password") or "changeme"
            modules = [m for m in data.get("modules", []) if m in MODULES]
            department = data.get("department", "General")
            USER_DB[new_username] = {
                "password": password,
                "modules": modules or ["office"],
                "department": department,
                "role": data.get("role", "user"),
            }
            self._send_json({"ok": True, "created": new_username})
            return

        if self.path == "/api/run":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            requested: List[str] = data.get("tasks") or []
            unknown = [t for t in requested if t not in self.task_registry]
            if unknown:
                self._send_json({"error": f"Unknown tasks: {', '.join(unknown)}"}, HTTPStatus.BAD_REQUEST)
                return

            # permission guard
            forbidden = [t for t in requested if self.task_registry[t][0] not in user["modules"]]
            if forbidden:
                self._send_json({"error": f"No permission for tasks: {', '.join(forbidden)}"}, HTTPStatus.FORBIDDEN)
                return

            tasks = [self.task_registry[t][1] for t in requested]
            results = run_concurrent(tasks)
            ordered = {task: results[idx] for idx, task in enumerate(requested)}
            self._send_json({"results": ordered, "user": username})
            return

        self.send_error(HTTPStatus.NOT_FOUND)


def run_server(host: str = "0.0.0.0", port: int = 8000):
    server = HTTPServer((host, port), DemoHandler)
    print(f"Serving demo UI on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
