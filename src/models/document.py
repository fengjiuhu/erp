"""Document management models."""
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Document:
    id: int
    name: str
    version: int
    created_at: datetime
