"""Minimal database config placeholder."""
import os

DB_DSN = os.getenv("APP_DB_DSN", "mysql+pymysql://user:password@localhost:3306/erp")
POOL_SIZE = int(os.getenv("APP_DB_POOL", "5"))
