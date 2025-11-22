"""Audit log models."""
from dataclasses import dataclass
from datetime import datetime


@dataclass
class AuditLog:
    id: int
    actor: str
    action: str
    created_at: datetime
