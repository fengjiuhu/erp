"""Workflow process models."""
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProcessDefinition:
    id: int
    name: str
    version: int


@dataclass
class ProcessInstance:
    id: int
    process_def_id: int
    status: str
    created_at: datetime
