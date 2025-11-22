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

MODULE_META: Dict[str, Dict[str, object]] = {
    "dashboard": {
        "path": "/dashboard.html",
        "label": {"zh": "驾驶舱", "en": "Dashboard"},
        "description": {"zh": "模块导航与快捷入口", "en": "Module landing"},
        "tasks": [],
    },
    "iam": {
        "path": "/iam.html",
        "label": {"zh": "身份与安全", "en": "IAM & Security"},
        "description": {"zh": "账号、权限、审计与安全策略", "en": "Accounts, permissions, audit, security"},
        "tasks": [
            {"id": "iam:create_user", "label": {"zh": "创建用户", "en": "Create User"}},
            {"id": "iam:sync_ldap", "label": {"zh": "同步 LDAP/AD", "en": "Sync LDAP"}},
            {"id": "security:waf", "label": {"zh": "WAF过滤", "en": "WAF Filter"}},
        ],
    },
    "integration": {
        "path": "/integration.html",
        "label": {"zh": "集成与网关", "en": "Integration"},
        "description": {"zh": "API 网关、消息与数据同步", "en": "API gateway, messaging, sync"},
        "tasks": [
            {"id": "integration:kafka", "label": {"zh": "Kafka 入队", "en": "Kafka enqueue"}},
        ],
    },
    "office": {
        "path": "/office.html",
        "label": {"zh": "办公套件", "en": "Office Suite"},
        "description": {"zh": "文档、沟通、日历协同", "en": "Docs, chat, calendar"},
        "tasks": [
            {"id": "document:edit", "label": {"zh": "文档编辑", "en": "Document edit"}},
            {"id": "communication:chat", "label": {"zh": "聊天消息", "en": "Chat message"}},
            {"id": "calendar:remind", "label": {"zh": "日历提醒", "en": "Calendar remind"}},
        ],
    },
    "oa": {
        "path": "/oa.html",
        "label": {"zh": "流程与行政", "en": "OA / Workflow"},
        "description": {"zh": "流程审批与行政办公", "en": "Approvals and admin"},
        "tasks": [
            {"id": "oa:approval", "label": {"zh": "通用审批", "en": "Generic approval"}},
        ],
    },
    "hrm": {
        "path": "/hrm.html",
        "label": {"zh": "人力资源", "en": "HRM"},
        "description": {"zh": "员工、考勤、薪酬", "en": "Employees, attendance, payroll"},
        "tasks": [
            {"id": "hrm:payroll", "label": {"zh": "薪资发放", "en": "Payroll run"}},
        ],
    },
    "finance": {
        "path": "/finance.html",
        "label": {"zh": "财务", "en": "Finance"},
        "description": {"zh": "费用、总账、预算", "en": "Expenses, GL, budgeting"},
        "tasks": [
            {"id": "finance:expense", "label": {"zh": "费用报销", "en": "Expense claim"}},
        ],
    },
    "supply": {
        "path": "/supply.html",
        "label": {"zh": "供应链", "en": "Supply Chain"},
        "description": {"zh": "采购、仓储、物流", "en": "Procurement, warehousing, logistics"},
        "tasks": [
            {"id": "supply:po", "label": {"zh": "采购订单", "en": "Purchase order"}},
        ],
    },
    "project": {
        "path": "/project.html",
        "label": {"zh": "项目管理", "en": "Project Mgmt"},
        "description": {"zh": "里程碑、进度与成本", "en": "Milestones, progress, cost"},
        "tasks": [
            {"id": "project:gantt", "label": {"zh": "甘特数据", "en": "Gantt data"}},
        ],
    },
    "crm": {
        "path": "/crm.html",
        "label": {"zh": "客户与工单", "en": "CRM & Tickets"},
        "description": {"zh": "客户关系与客服工单", "en": "Customer and tickets"},
        "tasks": [
            {"id": "crm:pipeline", "label": {"zh": "销售漏斗", "en": "Pipeline"}},
            {"id": "ticket:create", "label": {"zh": "创建工单", "en": "Create ticket"}},
        ],
    },
    "knowledge": {
        "path": "/knowledge.html",
        "label": {"zh": "知识与学习", "en": "Knowledge & Learning"},
        "description": {"zh": "知识库与培训", "en": "Knowledge base and training"},
        "tasks": [
            {"id": "knowledge:search", "label": {"zh": "知识检索", "en": "Knowledge search"}},
            {"id": "learning:exam", "label": {"zh": "考试安排", "en": "Exam scheduling"}},
        ],
    },
    "mobile": {
        "path": "/mobile.html",
        "label": {"zh": "门户与移动", "en": "Portal & Mobile"},
        "description": {"zh": "移动门户与审批", "en": "Mobile portal and approvals"},
        "tasks": [
            {"id": "mobile:approve", "label": {"zh": "移动审批", "en": "Mobile approval"}},
            {"id": "portal:todo", "label": {"zh": "门户待办", "en": "Portal todos"}},
        ],
    },
    "itsm": {
        "path": "/itsm.html",
        "label": {"zh": "运维与BI", "en": "ITSM & BI"},
        "description": {"zh": "IT 服务与报表", "en": "IT services and dashboards"},
        "tasks": [
            {"id": "itsm:monitor", "label": {"zh": "运维监控", "en": "Monitor"}},
            {"id": "bi:dashboard", "label": {"zh": "BI 大屏", "en": "BI dashboard"}},
        ],
    },
    "developer": {
        "path": "/developer.html",
        "label": {"zh": "开发者平台", "en": "Developer"},
        "description": {"zh": "低代码与扩展", "en": "Low-code and extensions"},
        "tasks": [
            {"id": "developer:form", "label": {"zh": "表单设计", "en": "Form designer"}},
        ],
    },
    "asset": {
        "path": "/asset.html",
        "label": {"zh": "资产中心", "en": "Asset"},
        "description": {"zh": "资产与库存", "en": "Assets and inventory"},
        "tasks": [
            {"id": "asset:audit", "label": {"zh": "资产审计", "en": "Asset audit"}},
        ],
    },
}

FEATURE_MAP: List[Dict[str, object]] = [
    {
        "key": "platform",
        "title": {"zh": "基础支撑平台", "en": "Platform & Security"},
        "items": [
            {"name": {"zh": "统一权限 / SSO / MFA", "en": "IAM + SSO + MFA"}, "status": "ready"},
            {"name": {"zh": "API 网关与流量控制", "en": "API gateway & throttling"}, "status": "ready"},
            {"name": {"zh": "消息队列 / 工作流 / 任务调度", "en": "MQ + Workflow + Scheduler"}, "status": "in_progress"},
            {"name": {"zh": "安全审计与WAF", "en": "Security audit & WAF"}, "status": "ready"},
        ],
    },
    {
        "key": "office",
        "title": {"zh": "办公协作", "en": "Office Suite"},
        "items": [
            {"name": {"zh": "文档在线编辑 / 版本 / 评论", "en": "Docs with versions & comments"}, "status": "in_progress"},
            {"name": {"zh": "IM / 视频会议 / 邮件", "en": "Chat, video meeting, mail"}, "status": "planned"},
            {"name": {"zh": "共享日历与提醒", "en": "Shared calendars"}, "status": "ready"},
        ],
    },
    {
        "key": "oa",
        "title": {"zh": "流程与行政", "en": "Workflow & OA"},
        "items": [
            {"name": {"zh": "通用审批（请假、报销等）", "en": "Approvals (leave, expense)"}, "status": "ready"},
            {"name": {"zh": "公文与催办", "en": "Documents & reminders"}, "status": "planned"},
            {"name": {"zh": "流程设计器与子流程", "en": "Process designer"}, "status": "in_progress"},
        ],
    },
    {
        "key": "hrm",
        "title": {"zh": "人力资源", "en": "HRM"},
        "items": [
            {"name": {"zh": "招聘与面试", "en": "Hiring & interviews"}, "status": "planned"},
            {"name": {"zh": "员工档案 / 入转调离", "en": "Employee records & lifecycle"}, "status": "ready"},
            {"name": {"zh": "考勤排班 / 异常", "en": "Attendance & shifts"}, "status": "ready"},
            {"name": {"zh": "绩效 / 薪资", "en": "Performance & payroll"}, "status": "in_progress"},
        ],
    },
    {
        "key": "finance",
        "title": {"zh": "财务", "en": "Finance"},
        "items": [
            {"name": {"zh": "总账与凭证", "en": "GL & vouchers"}, "status": "in_progress"},
            {"name": {"zh": "应收应付 / 发票", "en": "AR / AP / invoicing"}, "status": "planned"},
            {"name": {"zh": "预算与报销", "en": "Budget & expenses"}, "status": "ready"},
        ],
    },
    {
        "key": "supply",
        "title": {"zh": "供应链与运营", "en": "Supply & Operations"},
        "items": [
            {"name": {"zh": "采购 / 供应商", "en": "Procurement & vendors"}, "status": "ready"},
            {"name": {"zh": "仓储 WMS / 库存预警", "en": "WMS & stock alerts"}, "status": "in_progress"},
            {"name": {"zh": "销售 / 物流跟踪", "en": "Sales & logistics"}, "status": "planned"},
        ],
    },
    {
        "key": "project",
        "title": {"zh": "项目管理", "en": "Project Management"},
        "items": [
            {"name": {"zh": "里程碑 / 甘特图", "en": "Milestones & Gantt"}, "status": "ready"},
            {"name": {"zh": "成本与风险", "en": "Cost & risk"}, "status": "in_progress"},
        ],
    },
    {
        "key": "crm",
        "title": {"zh": "客户与客服", "en": "CRM & Support"},
        "items": [
            {"name": {"zh": "销售漏斗 / 商机", "en": "Pipeline & opportunities"}, "status": "ready"},
            {"name": {"zh": "客服工单 / SLA", "en": "Tickets & SLA"}, "status": "ready"},
            {"name": {"zh": "合同与回款", "en": "Contracts & receivables"}, "status": "planned"},
        ],
    },
    {
        "key": "knowledge",
        "title": {"zh": "知识与学习", "en": "Knowledge & LMS"},
        "items": [
            {"name": {"zh": "知识库 / FAQ / 搜索", "en": "Knowledge base & search"}, "status": "ready"},
            {"name": {"zh": "课程 / 考试 / 证书", "en": "Courses, exams, certificates"}, "status": "in_progress"},
        ],
    },
    {
        "key": "ops",
        "title": {"zh": "门户、运维与BI", "en": "Portal, ITSM, BI"},
        "items": [
            {"name": {"zh": "企业门户 / 移动审批", "en": "Portal & mobile"}, "status": "ready"},
            {"name": {"zh": "IT 工单 / CMDB / 监控", "en": "IT tickets, CMDB, monitoring"}, "status": "in_progress"},
            {"name": {"zh": "数据大屏 / 报表", "en": "Dashboards & BI"}, "status": "ready"},
            {"name": {"zh": "低代码扩展 / API 调用", "en": "Low-code & extensions"}, "status": "planned"},
        ],
    },
]

DEFAULT_ADMIN = {
    "password": "admin",
    "modules": [k for k in MODULE_META.keys() if k != "dashboard"],
    "department": "HQ",
    "role": "admin",
}


USER_DB: Dict[str, Dict[str, object]] = {"admin": DEFAULT_ADMIN.copy()}
SESSIONS: Dict[str, str] = {}
DOCUMENT_STORE: List[Dict[str, object]] = []
CHAT_LOG: List[Dict[str, object]] = []
APPROVALS: List[Dict[str, object]] = []
EXPENSES: List[Dict[str, object]] = []


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

    def _require_module(self, user: Dict[str, object], module: str) -> bool:
        if module not in user.get("modules", []):
            self._send_json({"error": "forbidden", "module": module}, HTTPStatus.FORBIDDEN)
            return False
        return True

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

        if self.path == "/api/modules":
            auth = self._require_auth()
            if not auth:
                return
            _, user = auth
            allowed = [m for m in user.get("modules", []) if m in MODULE_META]
            payload = [MODULE_META[m] | {"key": m} for m in allowed]
            self._send_json({"modules": payload, "all": payload})
            return

        if self.path == "/api/features":
            auth = self._require_auth()
            if not auth:
                return
            self._send_json({"areas": FEATURE_MAP})
            return

        if self.path == "/api/office/feed":
            auth = self._require_auth()
            if not auth:
                return
            _, user = auth
            if not self._require_module(user, "office"):
                return
            self._send_json(
                {
                    "documents": DOCUMENT_STORE[-5:],
                    "messages": CHAT_LOG[-5:],
                }
            )
            return

        if self.path == "/api/oa/approvals":
            auth = self._require_auth()
            if not auth:
                return
            _, user = auth
            if not self._require_module(user, "oa"):
                return
            self._send_json({"items": APPROVALS[-10:]})
            return

        if self.path == "/api/finance/expenses":
            auth = self._require_auth()
            if not auth:
                return
            _, user = auth
            if not self._require_module(user, "finance"):
                return
            self._send_json({"items": EXPENSES[-10:]})
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
            modules = [m for m in data.get("modules", []) if m in MODULE_META and m != "dashboard"]
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

        if self.path == "/api/office/document":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            if not self._require_module(user, "office"):
                return
            title = data.get("title") or "未命名文档"
            content = data.get("content") or ""
            collaborators = data.get("collaborators") or []
            doc_id = len(DOCUMENT_STORE) + 1
            version = 1
            record = {
                "id": doc_id,
                "title": title,
                "content": content,
                "version": version,
                "collaborators": collaborators,
                "updated_by": username,
            }
            DOCUMENT_STORE.append(record)
            payload = self.services["document"].edit(doc_id, content) | {"title": title, "version": version}
            payload["collaborators"] = collaborators
            self._send_json({"document": payload})
            return

        if self.path == "/api/office/chat":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            if not self._require_module(user, "office"):
                return
            channel = data.get("channel") or "general"
            message = data.get("message") or ""
            entry = {
                "channel": channel,
                "message": message,
                "from": username,
            }
            CHAT_LOG.append(entry)
            payload = self.services["communication"].chat(channel, message) | {"from": username}
            self._send_json({"message": payload})
            return

        if self.path == "/api/oa/approval":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            if not self._require_module(user, "oa"):
                return
            form = data.get("form") or {}
            approval_id = len(APPROVALS) + 1
            record = {
                "id": approval_id,
                "form": form,
                "status": "submitted",
                "submitted_by": username,
                "next_step": "manager_review",
            }
            APPROVALS.append(record)
            payload = self.services["oa"].generic_approval(form) | {"id": approval_id, "status": "submitted"}
            self._send_json({"approval": payload})
            return

        if self.path == "/api/finance/expense":
            auth = self._require_auth()
            if not auth:
                return
            username, user = auth
            if not self._require_module(user, "finance"):
                return
            expense = data.get("expense") or {}
            expense_id = len(EXPENSES) + 1
            record = {
                "id": expense_id,
                "expense": expense,
                "status": "pending_approval",
                "submitted_by": username,
                "next_approver": "财务主管",
            }
            EXPENSES.append(record)
            payload = self.services["finance"].expense_claim(expense) | {
                "id": expense_id,
                "status": record["status"],
                "next_approver": record["next_approver"],
            }
            self._send_json({"expense": payload})
            return

        self.send_error(HTTPStatus.NOT_FOUND)


def run_server(host: str = "0.0.0.0", port: int = 8000):
    server = HTTPServer((host, port), DemoHandler)
    print(f"Serving demo UI on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
