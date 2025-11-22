"""Application-wide configuration defaults."""
import os

APP_NAME = "erp-platform"
ENV = os.getenv("APP_ENV", "development")
MAX_WORKERS = int(os.getenv("APP_MAX_WORKERS", "8"))
