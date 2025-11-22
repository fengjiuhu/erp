"""Department model."""
from dataclasses import dataclass


@dataclass
class Department:
    id: int
    name: str
    parent_id: int | None = None
