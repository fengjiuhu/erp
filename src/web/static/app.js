const NAV_LINKS = {
  dashboard: { label: 'Dashboard', path: '/dashboard.html' },
  iam: { label: 'IAM & Security', path: '/iam.html' },
  integration: { label: 'Integration', path: '/integration.html' },
  office: { label: 'Office Suite', path: '/office.html' },
  oa: { label: 'OA / Workflow', path: '/oa.html' },
  hrm: { label: 'HRM', path: '/hrm.html' },
  finance: { label: 'Finance', path: '/finance.html' },
  supply: { label: 'Supply Chain', path: '/supply.html' },
  project: { label: 'Project Mgmt', path: '/project.html' },
  crm: { label: 'CRM & Tickets', path: '/crm.html' },
  knowledge: { label: 'Knowledge & Learning', path: '/knowledge.html' },
  mobile: { label: 'Portal & Mobile', path: '/mobile.html' },
  itsm: { label: 'ITSM & BI', path: '/itsm.html' },
  developer: { label: 'Developer', path: '/developer.html' },
  asset: { label: 'Asset', path: '/asset.html' },
};

const MODULE_TASKS = {
  iam: [
    ['iam:create_user', 'Create User'],
    ['iam:sync_ldap', 'Sync LDAP'],
    ['security:waf', 'WAF Filter'],
  ],
  integration: [
    ['integration:kafka', 'Kafka enqueue'],
  ],
  office: [
    ['document:edit', 'Document edit'],
    ['communication:chat', 'Chat message'],
    ['calendar:remind', 'Calendar remind'],
  ],
  oa: [
    ['oa:approval', 'Generic approval'],
  ],
  hrm: [
    ['hrm:payroll', 'Payroll run'],
  ],
  finance: [
    ['finance:expense', 'Expense claim'],
  ],
  supply: [
    ['supply:po', 'Purchase order'],
  ],
  project: [
    ['project:gantt', 'Gantt data'],
  ],
  crm: [
    ['crm:pipeline', 'Pipeline'],
    ['ticket:create', 'Create ticket'],
  ],
  knowledge: [
    ['knowledge:search', 'Knowledge search'],
    ['learning:exam', 'Exam scheduling'],
  ],
  mobile: [
    ['mobile:approve', 'Mobile approval'],
    ['portal:todo', 'Portal todos'],
  ],
  itsm: [
    ['itsm:monitor', 'Monitor'],
    ['bi:dashboard', 'BI dashboard'],
  ],
  developer: [
    ['developer:form', 'Form designer'],
  ],
  asset: [
    ['asset:audit', 'Asset audit'],
  ],
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
  const allowed = ['dashboard', ...modules];
  allowed.forEach((key) => {
    const item = NAV_LINKS[key];
    if (!item) return;
    const a = document.createElement('a');
    a.href = item.path;
    a.textContent = item.label;
    a.className = key === activeKey ? 'active' : '';
    nav.appendChild(a);
  });
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.id = 'logout';
  logoutBtn.onclick = logout;
  nav.appendChild(logoutBtn);
}

function renderTasks(moduleKey) {
  const container = document.getElementById('tasks');
  if (!container) return;
  const list = MODULE_TASKS[moduleKey] || [];
  container.innerHTML = '';
  list.forEach(([value, label]) => {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${value}"> ${label}`;
    container.appendChild(row);
  });
}

async function runSelected(moduleKey) {
  const output = document.getElementById('output');
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('run');
  const selected = Array.from(document.querySelectorAll('#tasks input[type=checkbox]:checked')).map((c) => c.value);
  if (!selected.length) {
    statusEl.textContent = 'Pick at least one task.';
    return;
  }
  btn.disabled = true;
  statusEl.textContent = 'Running...';
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
    statusEl.textContent = 'Done';
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
    document.getElementById('body').innerHTML = '<p class="warning">No permission for this module.</p>';
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
  me.modules.forEach((m) => {
    const card = document.createElement('a');
    card.href = NAV_LINKS[m].path;
    card.className = 'card';
    card.innerHTML = `<h3>${NAV_LINKS[m].label}</h3><p>Open module workspace</p>`;
    grid.appendChild(card);
  });
}

async function createUser() {
  const statusEl = document.getElementById('create-status');
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const department = document.getElementById('new-department').value;
  const modules = Array.from(document.querySelectorAll('#module-select input[type=checkbox]:checked')).map((c) => c.value);
  statusEl.textContent = 'Submitting...';
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
  statusEl.textContent = `Created user ${data.created}`;
}

function renderModuleSelector() {
  const box = document.getElementById('module-select');
  Object.entries(NAV_LINKS).forEach(([key, meta]) => {
    if (key === 'dashboard') return;
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${key}"> ${meta.label}`;
    box.appendChild(row);
  });
}

window.AppUI = {
  bootstrapModulePage,
  initDashboard,
  createUser,
  renderModuleSelector,
};
