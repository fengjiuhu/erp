"""Validation helpers."""
from src.common.exceptions import ValidationError


def require_fields(payload, fields):
    missing = [f for f in fields if f not in payload]
    if missing:
        raise ValidationError(f"Missing fields: {', '.join(missing)}")
    return payload
