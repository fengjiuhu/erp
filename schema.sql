-- ERP platform consolidated schema
-- Engine: MySQL 8.0+

CREATE TABLE department (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(50) NOT NULL,
    parent_id     BIGINT NULL,
    leader_id     BIGINT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department_parent FOREIGN KEY (parent_id) REFERENCES department(id)
);

CREATE TABLE position (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL,
    level      INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `user` (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    username     VARCHAR(50) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    real_name    VARCHAR(50) NOT NULL,
    phone        VARCHAR(20),
    email        VARCHAR(100),
    dept_id      BIGINT,
    position_id  BIGINT,
    status       TINYINT NOT NULL DEFAULT 1, -- 1 enabled, 0 disabled
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_department FOREIGN KEY (dept_id) REFERENCES department(id),
    CONSTRAINT fk_user_position FOREIGN KEY (position_id) REFERENCES position(id)
);

CREATE TABLE role (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE permission (
    id        BIGINT PRIMARY KEY AUTO_INCREMENT,
    type      VARCHAR(20) NOT NULL, -- menu/button/api
    code      VARCHAR(100) NOT NULL UNIQUE,
    name      VARCHAR(100) NOT NULL,
    parent_id BIGINT NULL,
    CONSTRAINT fk_permission_parent FOREIGN KEY (parent_id) REFERENCES permission(id)
);

CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES `user`(id),
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE role_permission (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission(id)
);

CREATE TABLE process_definition (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    `key`       VARCHAR(100) NOT NULL,
    version     INT NOT NULL,
    form_schema JSON,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_process_def_key_version (`key`, version)
);

CREATE TABLE process_instance (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    process_def_id  BIGINT NOT NULL,
    business_id     BIGINT,
    starter_id      BIGINT NOT NULL,
    status          TINYINT NOT NULL, -- 1 running, 2 approved, 3 rejected, 4 revoked
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_process_instance_def FOREIGN KEY (process_def_id) REFERENCES process_definition(id),
    CONSTRAINT fk_process_instance_starter FOREIGN KEY (starter_id) REFERENCES `user`(id)
);

CREATE TABLE task (
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    process_instance_id  BIGINT NOT NULL,
    assignee_id          BIGINT NOT NULL,
    node_key             VARCHAR(100) NOT NULL,
    action               VARCHAR(50), -- approve/reject/submit
    comment              VARCHAR(255),
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at         DATETIME,
    CONSTRAINT fk_task_instance FOREIGN KEY (process_instance_id) REFERENCES process_instance(id),
    CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES `user`(id)
);

CREATE TABLE folder (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    parent_id  BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_folder_parent FOREIGN KEY (parent_id) REFERENCES folder(id)
);

CREATE TABLE document (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    path       VARCHAR(500) NOT NULL,
    type       VARCHAR(50) NOT NULL,
    owner_id   BIGINT NOT NULL,
    folder_id  BIGINT,
    version    INT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_owner FOREIGN KEY (owner_id) REFERENCES `user`(id),
    CONSTRAINT fk_document_folder FOREIGN KEY (folder_id) REFERENCES folder(id)
);

CREATE TABLE document_version (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id  BIGINT NOT NULL,
    version      INT NOT NULL,
    path         VARCHAR(500) NOT NULL,
    remark       VARCHAR(255),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_version_doc FOREIGN KEY (document_id) REFERENCES document(id)
);

CREATE TABLE employee (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id      BIGINT NOT NULL UNIQUE,
    hire_date    DATE NOT NULL,
    resign_date  DATE,
    id_card      VARCHAR(20),
    birthday     DATE,
    contract_end DATE,
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES `user`(id)
);

CREATE TABLE attendance_record (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id   BIGINT NOT NULL,
    record_time   DATETIME NOT NULL,
    type          TINYINT NOT NULL, -- 1 clock-in, 2 clock-out
    source        TINYINT NOT NULL, -- 1 mobile, 2 device
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employee(id),
    INDEX idx_attendance_employee_time (employee_id, record_time)
);

CREATE TABLE leave_request (
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id          BIGINT NOT NULL,
    type                 VARCHAR(50) NOT NULL,
    start_time           DATETIME NOT NULL,
    end_time             DATETIME NOT NULL,
    reason               VARCHAR(255),
    process_instance_id  BIGINT,
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employee(id),
    CONSTRAINT fk_leave_process FOREIGN KEY (process_instance_id) REFERENCES process_instance(id)
);

CREATE TABLE asset (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    category_id BIGINT,
    code        VARCHAR(50) NOT NULL UNIQUE,
    location    VARCHAR(255),
    owner_id    BIGINT,
    status      TINYINT NOT NULL, -- 1 in-store, 2 loaned, 3 scrapped
    CONSTRAINT fk_asset_owner FOREIGN KEY (owner_id) REFERENCES `user`(id)
);

CREATE TABLE expense_claim (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id         BIGINT NOT NULL,
    total_amount        DECIMAL(12,2) NOT NULL,
    description         VARCHAR(255),
    process_instance_id BIGINT,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_employee FOREIGN KEY (employee_id) REFERENCES employee(id),
    CONSTRAINT fk_expense_process FOREIGN KEY (process_instance_id) REFERENCES process_instance(id)
);

CREATE TABLE expense_item (
    id        BIGINT PRIMARY KEY AUTO_INCREMENT,
    claim_id  BIGINT NOT NULL,
    amount    DECIMAL(12,2) NOT NULL,
    category  VARCHAR(50) NOT NULL,
    remark    VARCHAR(200),
    CONSTRAINT fk_expense_item_claim FOREIGN KEY (claim_id) REFERENCES expense_claim(id)
);

-- Helpful indexes
CREATE INDEX idx_user_dept ON `user`(dept_id);
CREATE INDEX idx_user_position ON `user`(position_id);
CREATE INDEX idx_permission_parent ON permission(parent_id);
CREATE INDEX idx_process_instance_status ON process_instance(status, created_at);
CREATE INDEX idx_task_assignee ON task(assignee_id, completed_at);
CREATE INDEX idx_document_folder ON document(folder_id);
CREATE INDEX idx_document_owner ON document(owner_id);
CREATE INDEX idx_employee_hire_date ON employee(hire_date);
CREATE INDEX idx_expense_claim_employee ON expense_claim(employee_id, created_at);
CREATE INDEX idx_expense_item_claim ON expense_item(claim_id);
