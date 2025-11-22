"""Knowledge models."""
from dataclasses import dataclass


@dataclass
class Article:
    id: int
    title: str
