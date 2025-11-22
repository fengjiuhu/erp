"""HR models."""
from dataclasses import dataclass
from datetime import date


@dataclass
class Employee:
    id: int
    user_id: int
    hire_date: date
