"""Project models."""
from dataclasses import dataclass
from datetime import date


@dataclass
class Project:
    id: int
    name: str
    start_date: date
