"""Entrypoint demonstrating concurrent execution of platform stubs.
Run with `python -m src.main` to see batched tasks dispatched via a thread pool.
"""
from src.common.runtime import run_concurrent
from src.services.iam import IAMService
from src.services.integration import IntegrationService
from src.services.security import SecurityService
from src.services.office import DocumentService, CommunicationService, CalendarTaskService
from src.services.oa import OAService
from src.services.hrm import HRMService
from src.services.finance import FinanceService
from src.services.supply_chain import SupplyChainService
from src.services.project import ProjectService
from src.services.crm import CRMService, TicketService
from src.services.knowledge import KnowledgeService, LearningService
from src.services.mobile import MobileService
from src.services.portal import PortalService
from src.services.itsm import ITSMService
from src.services.bi import BIService
from src.services.developer import DeveloperService
from src.services.asset import AssetService


def demo_tasks():
    iam = IAMService()
    integration = IntegrationService()
    security = SecurityService()
    document = DocumentService()
    comms = CommunicationService()
    calendar = CalendarTaskService()
    oa = OAService()
    hrm = HRMService()
    finance = FinanceService()
    supply = SupplyChainService()
    project = ProjectService()
    crm = CRMService()
    ticket = TicketService()
    knowledge = KnowledgeService()
    learning = LearningService()
    mobile = MobileService()
    portal = PortalService()
    itsm = ITSMService()
    bi = BIService()
    dev = DeveloperService()
    assets = AssetService()

    return [
        lambda: iam.create_user({"username": "alice"}),
        lambda: iam.sync_ldap(),
        lambda: integration.kafka_enqueue("events", {"hello": "world"}),
        lambda: security.waf_filter({"path": "/api"}),
        lambda: document.edit(1, "draft"),
        lambda: comms.chat("general", "hi"),
        lambda: calendar.remind(42),
        lambda: oa.generic_approval({"type": "leave"}),
        lambda: hrm.payroll_run("2025-11"),
        lambda: finance.expense_claim({"employee_id": 1, "total": 100}),
        lambda: supply.purchase_order({"vendor": "ACME"}),
        lambda: project.gantt(8),
        lambda: crm.pipeline("proposal"),
        lambda: ticket.ticket({"title": "VPN issue"}),
        lambda: knowledge.search("SSO"),
        lambda: learning.exam({"course_id": 5}),
        lambda: mobile.approve(99),
        lambda: portal.todo_center(1),
        lambda: itsm.monitor({"cpu": 70}),
        lambda: bi.dashboard({"scope": "company"}),
        lambda: dev.form_designer({"fields": []}),
        lambda: assets.audit(10),
    ]


def main():
    results = run_concurrent(demo_tasks())
    for idx in sorted(results):
        print(f"Task {idx}: {results[idx]}")


if __name__ == "__main__":
    main()
