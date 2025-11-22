"""Finance models."""
from dataclasses import dataclass
from decimal import Decimal


@dataclass
class Expense:
    id: int
    amount: Decimal
    category: str
