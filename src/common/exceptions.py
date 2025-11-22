"""Shared exception classes."""

class ERPError(Exception):
    """Base exception for the ERP platform."""


class ValidationError(ERPError):
    """Raised when input validation fails."""
