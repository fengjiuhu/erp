"""User and organization models."""
from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: int
    username: str
    status: str
    created_at: datetime
