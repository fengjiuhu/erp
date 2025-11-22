"""Permission and role models."""
from dataclasses import dataclass


@dataclass
class Role:
    id: int
    name: str


@dataclass
class Permission:
    id: int
    code: str
    type: str
