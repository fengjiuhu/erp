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
    load_error: '数据加载失败',
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
    load_error: 'Failed to load data',
  },
};

const MODULE_FALLBACKS = {
  dashboard: {
    key: 'dashboard',
    path: '/dashboard.html',
    label: { zh: '驾驶舱', en: 'Dashboard' },
    description: { zh: '模块导航与快捷入口', en: 'Module landing' },
    tasks: [],
  },
};

let moduleCache = [];
let meCache = null;

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

const ApiClient = {
  async me() {
    const res = await fetch('/api/me');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return null;
    }
    return res.json();
  },
  async modules() {
    const res = await fetch('/api/modules');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return { modules: [] };
    }
    return res.json();
  },
  async runTasks(tasks) {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async createUser(payload) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
};

async function loadContext() {
  const [me, modules] = await Promise.all([ApiClient.me(), ApiClient.modules()]);
  meCache = me;
  moduleCache = modules.modules || [];
  return { me, modules: moduleCache };
}

function logout() {
  fetch('/api/logout', { method: 'POST' }).finally(() => {
    window.location.href = '/login.html';
  });
}

function resolveModuleMeta(key) {
  return moduleCache.find((m) => m.key === key) || MODULE_FALLBACKS[key];
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

  const dashboard = resolveModuleMeta('dashboard');
  if (dashboard) modules = [dashboard, ...modules];

  modules.forEach((meta) => {
    const a = document.createElement('a');
    a.href = meta.path;
    a.textContent = meta.label[lang];
    a.className = meta.key === activeKey ? 'active' : '';
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
  const meta = resolveModuleMeta(moduleKey);
  const list = (meta === null || meta === void 0 ? void 0 : meta.tasks) || [];
  const lang = currentLang();
  container.innerHTML = '';
  list.forEach((task) => {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${task.id}"> ${task.label[lang]}`;
    container.appendChild(row);
  });
}

async function runSelected(moduleKey) {
  const output = document.getElementById('output');
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('run');
  const selected = Array.from(document.querySelectorAll('#tasks input[type=checkbox]:checked')).map((c) => c.value);
  if (!selected.length) {
    if (statusEl) statusEl.textContent = I18N[currentLang()].pick_one || '';
    return;
  }
  if (btn) btn.disabled = true;
  if (statusEl) statusEl.textContent = I18N[currentLang()].running;
  try {
    const data = await ApiClient.runTasks(selected);
    if (output) output.textContent = JSON.stringify(data, null, 2);
    if (statusEl) statusEl.textContent = I18N[currentLang()].done;
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || 'Error';
    if (output) output.textContent = err.toString();
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function bootstrapModulePage(moduleKey) {
  try {
    const { me, modules } = await loadContext();
    if (!me) return;
    const userInfo = document.getElementById('user-info');
    if (userInfo) userInfo.textContent = `${me.username} · ${me.department ?? ''}`;
    buildNav(modules, moduleKey);
    const hasAccess = modules.some((m) => m.key === moduleKey) || moduleKey === 'dashboard';
    if (!hasAccess) {
      const body = document.getElementById('body');
      if (body) body.innerHTML = `<p class="warning">${I18N[currentLang()].no_permission}</p>`;
      return;
    }
    if (moduleKey !== 'dashboard') {
      renderTasks(moduleKey);
      const runBtn = document.getElementById('run');
      if (runBtn) runBtn.onclick = () => runSelected(moduleKey);
    }
  } catch (error) {
    const body = document.getElementById('body');
    if (body) body.innerHTML = `<p class="warning">${I18N[currentLang()].load_error}</p>`;
  }
}

async function initDashboard() {
  const { me, modules } = await loadContext();
  if (!me) return;
  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.textContent = `${me.username} · ${me.department ?? ''}`;
  buildNav(modules, 'dashboard');
  const grid = document.getElementById('module-grid');
  const lang = currentLang();
  if (grid) {
    grid.innerHTML = '';
    modules.forEach((m) => {
      const card = document.createElement('a');
      card.href = m.path;
      card.className = 'card';
      card.innerHTML = `<h3>${m.label[lang]}</h3><p>${I18N[lang].card_cta}</p>`;
      grid.appendChild(card);
    });
  }
}

async function createUser() {
  const statusEl = document.getElementById('create-status');
  const username = (document.getElementById('new-username') || {}).value || '';
  const password = (document.getElementById('new-password') || {}).value || '';
  const department = (document.getElementById('new-department') || {}).value || '';
  const modules = Array.from(document.querySelectorAll('#module-select input[type=checkbox]:checked')).map((c) => c.value);
  if (statusEl) statusEl.textContent = I18N[currentLang()].submitting;
  try {
    const data = await ApiClient.createUser({ username, password, department, modules });
    if (statusEl) statusEl.textContent = t('created_user')(data.created);
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || 'Failed';
  }
}

function renderModuleSelector() {
  const box = document.getElementById('module-select');
  const lang = currentLang();
  if (!box) return;
  box.innerHTML = '';
  const selectable = moduleCache.filter((m) => m.key !== 'dashboard');
  selectable.forEach((meta) => {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" value="${meta.key}"> ${meta.label[lang]}`;
    box.appendChild(row);
  });
}

function setModuleCopy(moduleKey) {
  const meta = resolveModuleMeta(moduleKey);
  const lang = currentLang();
  if (!meta) return;
  const titleEl = document.getElementById('module-title');
  const descEl = document.getElementById('module-desc');
  if (titleEl) titleEl.textContent = meta.label[lang];
  if (descEl) descEl.textContent = meta.description[lang];
  document.title = meta.label[lang];
}

function applyI18n() {
  const lang = currentLang();
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = I18N[lang][key];
    if (typeof val === 'function') return;
    el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
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
