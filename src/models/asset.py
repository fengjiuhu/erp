"""Asset models."""
from dataclasses import dataclass


@dataclass
class Asset:
    id: int
    name: str
    status: str
