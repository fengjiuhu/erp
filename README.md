# ERP Platform Schema & Docs

[English](#english) | [简体中文](#简体中文)

## English

### Overview
This repository now contains two pieces:
- `schema.sql` with a concise, SQL-first starting point for IAM, BPM, DMS, HR, Assets, Expenses.
- `src/` with lightweight, multi-threaded Python stubs for every capability in the functional checklist, so you can invoke and extend each feature with minimal overhead.

### Quickstart
1. Choose a MySQL 8.0+ (or compatible) database.
2. Run the schema to create all tables:
   ```bash
   mysql -u <user> -p <database> < schema.sql
   ```
3. Explore runnable code stubs with a bounded thread pool:
   ```bash
   python -m src.main
   ```
4. Extend any service under `src/services/` to plug in real logic per feature bullet.

### Project Layout Highlights
- `config/` centralizes basic runtime toggles and logging defaults.
- `src/common/` provides shared helpers, validators, and constants.
- `src/api/`, `src/dao/`, `src/models/`, `src/workflow/`, `src/events/`, `src/jobs/`, and `src/plugins/` mirror the suggested layered architecture so each feature can evolve independently while staying organized.

### ER Coverage Checklist
- **Users & Org:** `user`, `department`, `position`
- **Permissions:** `role`, `permission`, `user_role`, `role_permission`
- **Workflow (BPM):** `process_definition`, `process_instance`, `task`
- **Documents (DMS):** `folder`, `document`, `document_version`
- **HR:** `employee`, `attendance_record`, `leave_request`
- **Assets:** `asset`
- **Expenses:** `expense_claim`, `expense_item`

### Notes
- Timestamps use `DATETIME` for compatibility; adjust to `TIMESTAMP WITH TIME ZONE` if your engine supports it.
- Indices and foreign keys are included for common join paths and integrity.
- Extend fields (e.g., soft delete, tenant_id, tags) as needed for multi-tenant or multi-region deployments.

---

## 简体中文

### 概览
本仓库现包含两部分：
- `schema.sql` 提供面向 IAM、流程审批、文档、人力、资产、报销的 SQL 起始脚本。
- `src/` 目录提供覆盖功能清单的 Python 并发代码骨架，可在低资源开销下触发每个能力并继续扩展。

### 快速开始
1. 准备 MySQL 8.0+ 数据库。
2. 执行建表脚本：
   ```bash
   mysql -u <user> -p <database> < schema.sql
   ```
3. 运行并发示例，体验线程池派发：
   ```bash
   python -m src.main
   ```
4. 在 `src/services/` 下为任意功能点添加真实实现逻辑。

### ER 覆盖清单
- **用户与组织：** `user`, `department`, `position`
- **权限系统：** `role`, `permission`, `user_role`, `role_permission`
- **流程审批：** `process_definition`, `process_instance`, `task`
- **文档管理：** `folder`, `document`, `document_version`
- **人力资源：** `employee`, `attendance_record`, `leave_request`
- **资产管理：** `asset`
- **费用报销：** `expense_claim`, `expense_item`

### 备注
- 时间字段默认 `DATETIME`，如需时区信息可改为 `TIMESTAMP WITH TIME ZONE`。
- 已添加常用索引与外键，便于查询与保证数据一致性。
- 可按需要扩展字段（如软删除、tenant_id、标签等）以支持多租户或多区域部署。
