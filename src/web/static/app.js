const LANG_STORAGE_KEY = 'erp_lang';

const I18N = {
  zh: {
    brand: '企业协同平台',
    subtitle: '统一门户 · 业务中心',
    login_title: '登录',
    login_button: '登录',
    login_tip: '默认管理员：admin / admin',
    signing_in: '正在登录...',
    login_failed: '登录失败',
    login_success: '登录成功，跳转中...',
    modules_header: '可访问的模块',
    nav_logout: '退出',
    card_cta: '打开模块工作台',
    quick_tasks: '快捷任务',
    run_selected: '执行勾选任务',
    pick_one: '请至少选择一个任务',
    running: '执行中...',
    done: '完成',
    awaiting: '等待执行...',
    admin_create: '管理员 · 创建用户并分配模块',
    create_user: '创建用户',
    username: '用户名',
    password: '密码',
    department: '部门',
    submitting: '提交中...',
    created_user: (u) => `已创建用户 ${u}`,
    no_permission: '无权限访问该模块。',
    language_toggle: '中文 / English',
    dashboard_subtitle: '模块导航与快捷入口',
  },
  en: {
    brand: 'Enterprise Platform',
    subtitle: 'Unified portal · Business center',
    login_title: 'Sign in',
    login_button: 'Sign in',
    login_tip: 'Default admin: admin / admin',
    signing_in: 'Signing in...',
    login_failed: 'Login failed',
    login_success: 'Success, redirecting...',
    modules_header: 'Your modules',
    nav_logout: 'Logout',
    card_cta: 'Open module workspace',
    quick_tasks: 'Quick tasks',
    run_selected: 'Run selected',
    pick_one: 'Pick at least one task.',
    running: 'Running...',
    done: 'Done',
    awaiting: 'Awaiting execution...',
    admin_create: 'Admin · Create user & assign modules',
    create_user: 'Create user',
    username: 'Username',
    password: 'Password',
    department: 'Department',
    submitting: 'Submitting...',
    created_user: (u) => `Created user ${u}`,
    no_permission: 'No permission for this module.',
    language_toggle: '中文 / English',
    dashboard_subtitle: 'Module landing',
  },
};

function currentLang() {
  const cached = localStorage.getItem(LANG_STORAGE_KEY);
  return cached === 'en' ? 'en' : 'zh';
}

function setLang(lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

function t(key) {
  const lang = currentLang();
  const val = I18N[lang][key];
  return typeof val === 'function' ? val : () => val;
}

const NAV_LINKS = {
  dashboard: { label: { zh: '驾驶舱', en: 'Dashboard' }, path: '/dashboard.html' },
  iam: { label: { zh: '身份与安全', en: 'IAM & Security' }, path: '/iam.html' },
  integration: { label: { zh: '集成与网关', en: 'Integration' }, path: '/integration.html' },
  office: { label: { zh: '办公套件', en: 'Office Suite' }, path: '/office.html' },
  oa: { label: { zh: '流程与行政', en: 'OA / Workflow' }, path: '/oa.html' },
  hrm: { label: { zh: '人力资源', en: 'HRM' }, path: '/hrm.html' },
  finance: { label: { zh: '财务', en: 'Finance' }, path: '/finance.html' },
  supply: { label: { zh: '供应链', en: 'Supply Chain' }, path: '/supply.html' },
  project: { label: { zh: '项目管理', en: 'Project Mgmt' }, path: '/project.html' },
  crm: { label: { zh: '客户与工单', en: 'CRM & Tickets' }, path: '/crm.html' },
  knowledge: { label: { zh: '知识与学习', en: 'Knowledge & Learning' }, path: '/knowledge.html' },
  mobile: { label: { zh: '门户与移动', en: 'Portal & Mobile' }, path: '/mobile.html' },
  itsm: { label: { zh: '运维与BI', en: 'ITSM & BI' }, path: '/itsm.html' },
  developer: { label: { zh: '开发者平台', en: 'Developer' }, path: '/developer.html' },
  asset: { label: { zh: '资产中心', en: 'Asset' }, path: '/asset.html' },
};

const MODULE_TASKS = {
  iam: [
    ['iam:create_user', { zh: '创建用户', en: 'Create User' }],
    ['iam:sync_ldap', { zh: '同步 LDAP/AD', en: 'Sync LDAP' }],
    ['security:waf', { zh: 'WAF过滤', en: 'WAF Filter' }],
  ],
  integration: [
    ['integration:kafka', { zh: 'Kafka 入队', en: 'Kafka enqueue' }],
  ],
  office: [
    ['document:edit', { zh: '文档编辑', en: 'Document edit' }],
    ['communication:chat', { zh: '聊天消息', en: 'Chat message' }],
    ['calendar:remind', { zh: '日历提醒', en: 'Calendar remind' }],
  ],
  oa: [
    ['oa:approval', { zh: '通用审批', en: 'Generic approval' }],
  ],
  hrm: [
    ['hrm:payroll', { zh: '薪资发放', en: 'Payroll run' }],
  ],
  finance: [
    ['finance:expense', { zh: '费用报销', en: 'Expense claim' }],
  ],
  supply: [
    ['supply:po', { zh: '采购订单', en: 'Purchase order' }],
  ],
  project: [
    ['project:gantt', { zh: '甘特数据', en: 'Gantt data' }],
  ],
  crm: [
    ['crm:pipeline', { zh: '销售漏斗', en: 'Pipeline' }],
    ['ticket:create', { zh: '创建工单', en: 'Create ticket' }],
  ],
  knowledge: [
    ['knowledge:search', { zh: '知识检索', en: 'Knowledge search' }],
    ['learning:exam', { zh: '考试安排', en: 'Exam scheduling' }],
  ],
  mobile: [
    ['mobile:approve', { zh: '移动审批', en: 'Mobile approval' }],
    ['portal:todo', { zh: '门户待办', en: 'Portal todos' }],
  ],
  itsm: [
    ['itsm:monitor', { zh: '运维监控', en: 'Monitor' }],
    ['bi:dashboard', { zh: 'BI 大屏', en: 'BI dashboard' }],
  ],
  developer: [
    ['developer:form', { zh: '表单设计', en: 'Form designer' }],
  ],
  asset: [
    ['asset:audit', { zh: '资产审计', en: 'Asset audit' }],
  ],
};

const MODULE_COPY = {
  iam: { zh: ['身份与安全', '账号、权限、审计与安全策略'], en: ['IAM & Security', 'Accounts, permissions, audit, and security policies'] },
  integration: { zh: ['集成与网关', 'API 网关、消息与数据同步'], en: ['Integration', 'API gateway, messaging, and sync'] },
  office: { zh: ['办公套件', '文档、沟通、日历协同'], en: ['Office Suite', 'Docs, chat, and calendar collaboration'] },
  oa: { zh: ['流程与行政', '流程审批与行政办公'], en: ['OA / Workflow', 'Approvals and administrative flows'] },
  hrm: { zh: ['人力资源', '员工、考勤、薪酬'], en: ['HRM', 'Employees, attendance, payroll'] },
  finance: { zh: ['财务', '费用、总账、预算'], en: ['Finance', 'Expenses, GL, budgeting'] },
  supply: { zh: ['供应链', '采购、仓储、物流'], en: ['Supply Chain', 'Procurement, warehousing, logistics'] },
  project: { zh: ['项目管理', '里程碑、进度与成本'], en: ['Project Mgmt', 'Milestones, progress, cost'] },
  crm: { zh: ['客户与工单', '客户关系与客服工单'], en: ['CRM & Tickets', 'Customer relations and tickets'] },
  knowledge: { zh: ['知识与学习', '知识库与培训'], en: ['Knowledge & Learning', 'Knowledge base and training'] },
  mobile: { zh: ['门户与移动', '移动门户与审批'], en: ['Portal & Mobile', 'Mobile portal and approvals'] },
  itsm: { zh: ['运维与BI', 'IT 服务与报表'], en: ['ITSM & BI', 'IT services and dashboards'] },
  developer: { zh: ['开发者平台', '低代码与扩展'], en: ['Developer', 'Low-code and extensions'] },
  asset: { zh: ['资产中心', '资产与库存'], en: ['Asset', 'Assets and inventory'] },
  dashboard: { zh: ['驾驶舱', '模块导航与快捷入口'], en: ['Dashboard', 'Module landing'] },
};

function logout() {
  fetch('/api/logout', { method: 'POST' }).finally(() => {
    window.location.href = '/login.html';
  });
}

async function fetchMe() {
  const res = await fetch('/api/me');
  if (res.status === 401) {
    window.location.href = '/login.html';
    return null;
  }
  return res.json();
}

function buildNav(modules, activeKey) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = '';
  const lang = currentLang();

  const langBtn = document.createElement('button');
  langBtn.textContent = I18N[lang].language_toggle;
  langBtn.className = 'ghost';
  langBtn.onclick = () => {
    const next = currentLang() === 'zh' ? 'en' : 'zh';
    setLang(next);
    window.location.reload();
  };
  nav.appendChild(langBtn);

  const allowed = ['dashboard', ...modules];
  allowed.forEach((key) => {
    const item = NAV_LINKS[key];
    if (!item) return;
    const a = document.createElement('a');
    a.href = item.path;
    a.textContent = item.label[lang];
    a.className = key === activeKey ? 'active' : '';
    nav.appendChild(a);
  });
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = I18N[lang].nav_logout;
  logoutBtn.id = 'logout';
  logoutBtn.onclick = logout;
  nav.appendChild(logoutBtn);
}

function renderTasks(moduleKey) {
  const container = document.getElementById('tasks');
  if (!container) return;
  const list = MODULE_TASKS[moduleKey] || [];
  const lang = currentLang();
  container.innerHTML = '';
  list.forEach(([value, label]) => {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${value}"> ${label[lang]}`;
    container.appendChild(row);
  });
}

async function runSelected(moduleKey) {
  const output = document.getElementById('output');
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('run');
  const selected = Array.from(document.querySelectorAll('#tasks input[type=checkbox]:checked')).map((c) => c.value);
  if (!selected.length) {
    statusEl.textContent = I18N[currentLang()].pick_one;
    return;
  }
  btn.disabled = true;
  statusEl.textContent = I18N[currentLang()].running;
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: selected }),
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl.textContent = data.error || 'Failed';
      output.textContent = data.error || 'Error';
      return;
    }
    output.textContent = JSON.stringify(data, null, 2);
    statusEl.textContent = I18N[currentLang()].done;
  } catch (err) {
    statusEl.textContent = 'Error';
    output.textContent = err.toString();
  } finally {
    btn.disabled = false;
  }
}

async function bootstrapModulePage(moduleKey) {
  const me = await fetchMe();
  if (!me) return;
  document.getElementById('user-info').textContent = `${me.username} · ${me.department}`;
  buildNav(me.modules, moduleKey);
  if (!me.modules.includes(moduleKey) && moduleKey !== 'dashboard') {
    document.getElementById('body').innerHTML = `<p class="warning">${I18N[currentLang()].no_permission}</p>`;
    return;
  }
  if (moduleKey !== 'dashboard') {
    renderTasks(moduleKey);
    const runBtn = document.getElementById('run');
    if (runBtn) runBtn.onclick = () => runSelected(moduleKey);
  }
}

async function initDashboard() {
  const me = await fetchMe();
  if (!me) return;
  document.getElementById('user-info').textContent = `${me.username} · ${me.department}`;
  buildNav(me.modules, 'dashboard');
  const grid = document.getElementById('module-grid');
  const lang = currentLang();
  me.modules.forEach((m) => {
    const card = document.createElement('a');
    card.href = NAV_LINKS[m].path;
    card.className = 'card';
    card.innerHTML = `<h3>${NAV_LINKS[m].label[lang]}</h3><p>${I18N[lang].card_cta}</p>`;
    grid.appendChild(card);
  });
}

async function createUser() {
  const statusEl = document.getElementById('create-status');
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const department = document.getElementById('new-department').value;
  const modules = Array.from(document.querySelectorAll('#module-select input[type=checkbox]:checked')).map((c) => c.value);
  statusEl.textContent = I18N[currentLang()].submitting;
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, department, modules }),
  });
  const data = await res.json();
  if (!res.ok) {
    statusEl.textContent = data.error || 'Failed';
    return;
  }
  statusEl.textContent = I18N[currentLang()].created_user(data.created);
}

function renderModuleSelector() {
  const box = document.getElementById('module-select');
  const lang = currentLang();
  Object.entries(NAV_LINKS).forEach(([key, meta]) => {
    if (key === 'dashboard') return;
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${key}"> ${meta.label[lang]}`;
    box.appendChild(row);
  });
}

function setModuleCopy(moduleKey) {
  const copy = MODULE_COPY[moduleKey];
  const lang = currentLang();
  if (!copy) return;
  const [title, desc] = copy[lang];
  const titleEl = document.getElementById('module-title');
  const descEl = document.getElementById('module-desc');
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  document.title = title;
}

function applyI18n() {
  const lang = currentLang();
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = I18N[lang][key];
    if (typeof val === 'function') {
      return;
    }
    el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = I18N[lang][key];
    if (val) el.setAttribute('placeholder', val);
  });
}

window.AppUI = {
  bootstrapModulePage,
  initDashboard,
  createUser,
  renderModuleSelector,
  setModuleCopy,
  applyI18n,
};
