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
    card_cta: '进入工作台',
    quick_tasks: '快捷操作',
    run_selected: '执行所选任务',
    pick_one: '请先选择至少一个任务',
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
    integration_center: '功能集成中心',
    integration_hint: '从导航快速切换模块，保持页面衔接顺畅',
    feature_header: '能力覆盖总览',
    feature_hint: '对照需求清单，查看当前进展',
    status_ready: '就绪',
    status_in_progress: '进行中',
    status_planned: '规划中',
    doc_editor: '在线文档编辑',
    doc_editor_hint: '创建并保存一份实时协作文档，带协作者列表',
    doc_title: '标题',
    doc_body: '正文',
    doc_collaborators: '协作者',
    doc_collaborators_placeholder: '例如：小王、小李，逗号分隔',
    save_document: '保存并生成版本',
    chat_send: '发送群聊/会议消息',
    chat_send_hint: '模拟 IM 或视频会议中的发言/共享',
    chat_channel: '频道',
    chat_message: '消息内容',
    send_chat: '发送',
    latest_activity: '最近动态',
    latest_activity_hint: '展示刚刚提交的文档版本与聊天记录',
    refresh: '刷新',
    expense_form: '费用报销单',
    expense_form_hint: '录入类别、金额与说明，并生成审批流',
    expense_type: '报销类别',
    expense_amount: '金额',
    expense_desc: '说明',
    submit_expense: '提交报销',
    expense_list_hint: '展示刚刚提交的报销及审批去向',
    approval_form: '提交流程单',
    approval_form_hint: '模拟请假/报销/采购等审批提交流程',
    approval_type: '流程类型',
    approval_amount: '金额/天数',
    approval_reason: '事由',
    submit_approval: '提交审批',
    approval_list_hint: '查看提交过的流程及下一步',
    feed_empty: '暂无数据，提交一条看看效果',
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
    card_cta: 'Open workspace',
    quick_tasks: 'Quick actions',
    run_selected: 'Run selected tasks',
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
    integration_center: 'Integration Hub',
    integration_hint: 'Switch across modules without losing context',
    feature_header: 'Capability coverage',
    feature_hint: 'Track live progress against the scope',
    status_ready: 'Ready',
    status_in_progress: 'In progress',
    status_planned: 'Planned',
    doc_editor: 'Document editor',
    doc_editor_hint: 'Create and save a collaborative document with collaborators',
    doc_title: 'Title',
    doc_body: 'Body',
    doc_collaborators: 'Collaborators',
    doc_collaborators_placeholder: 'e.g. Alice, Bob (comma separated)',
    save_document: 'Save & version',
    chat_send: 'Send chat/meeting message',
    chat_send_hint: 'Simulate IM or meeting broadcast',
    chat_channel: 'Channel',
    chat_message: 'Message',
    send_chat: 'Send',
    latest_activity: 'Latest activity',
    latest_activity_hint: 'Recently saved docs and chat posts',
    refresh: 'Refresh',
    expense_form: 'Expense claim',
    expense_form_hint: 'Capture category, amount, and justification',
    expense_type: 'Category',
    expense_amount: 'Amount',
    expense_desc: 'Description',
    submit_expense: 'Submit expense',
    expense_list_hint: 'See newly submitted claims and routing',
    approval_form: 'Submit request',
    approval_form_hint: 'Send leave/expense/procurement for approval',
    approval_type: 'Request type',
    approval_amount: 'Amount / days',
    approval_reason: 'Reason',
    submit_approval: 'Submit for approval',
    approval_list_hint: 'Review submitted forms and next steps',
    feed_empty: 'Nothing yet — submit to see results',
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
  async features() {
    const res = await fetch('/api/features');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return { areas: [] };
    }
    return res.json();
  },
  async saveDocument(payload) {
    const res = await fetch('/api/office/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async sendChat(payload) {
    const res = await fetch('/api/office/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async officeFeed() {
    const res = await fetch('/api/office/feed');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return { documents: [], messages: [] };
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async submitApproval(payload) {
    const res = await fetch('/api/oa/approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async listApprovals() {
    const res = await fetch('/api/oa/approvals');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return { items: [] };
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async submitExpense(payload) {
    const res = await fetch('/api/finance/expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense: payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    return data;
  },
  async listExpenses() {
    const res = await fetch('/api/finance/expenses');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return { items: [] };
    }
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

function toggleSelectable(btn) {
  const selected = btn.dataset.selected === 'true';
  btn.dataset.selected = (!selected).toString();
  if (!selected) {
    btn.classList.add('pill-active');
  } else {
    btn.classList.remove('pill-active');
  }
}

function renderTasks(moduleKey) {
  const container = document.getElementById('tasks');
  if (!container) return;
  const meta = resolveModuleMeta(moduleKey);
  const list = (meta === null || meta === void 0 ? void 0 : meta.tasks) || [];
  const lang = currentLang();
  container.innerHTML = '';
  container.classList.add('pill-group');
  list.forEach((task) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill';
    btn.textContent = task.label[lang];
    btn.dataset.value = task.id;
    btn.dataset.selected = 'false';
    btn.onclick = () => toggleSelectable(btn);
    container.appendChild(btn);
  });
}

async function runSelected(moduleKey) {
  const output = document.getElementById('output');
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('run');
  const selected = Array.from(document.querySelectorAll('#tasks button[data-value]'))
    .filter((c) => c.dataset.selected === 'true')
    .map((c) => c.dataset.value || '');
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
  const lang = currentLang();
  const integration = document.getElementById('integration-center');
  if (integration) {
    integration.innerHTML = '';
    modules.forEach((m) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill';
      btn.textContent = m.label[lang];
      btn.onclick = () => {
        window.location.href = m.path;
      };
      integration.appendChild(btn);
    });
  }
  const grid = document.getElementById('module-grid');
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

  const featureContainer = document.getElementById('feature-map');
  if (featureContainer) {
    featureContainer.innerHTML = '';
    try {
      const { areas } = await ApiClient.features();
      areas.forEach((area) => {
        const card = document.createElement('div');
        card.className = 'card feature-card';
        const title = document.createElement('div');
        title.className = 'card-title';
        title.innerHTML = `<h3>${area.title[lang]}</h3>`;
        card.appendChild(title);
        const list = document.createElement('ul');
        list.className = 'feature-list';
        area.items.forEach((item) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${item.name[lang]}</span>${renderStatus(item.status)}`;
          list.appendChild(li);
        });
        card.appendChild(list);
        featureContainer.appendChild(card);
      });
    } catch (err) {
      featureContainer.innerHTML = `<p class="warning">${I18N[lang].load_error}</p>`;
    }
  }
}

function renderStatus(status) {
  const keyMap = {
    ready: 'status_ready',
    in_progress: 'status_in_progress',
    planned: 'status_planned',
  };
  const label = I18N[currentLang()][keyMap[status]];
  return `<span class="status-pill ${status}">${label}</span>`;
}

async function refreshOfficeFeed() {
  const feed = document.getElementById('office-feed');
  if (!feed) return;
  feed.innerHTML = '';
  const lang = currentLang();
  try {
    const { documents, messages } = await ApiClient.officeFeed();
    if (!documents.length && !messages.length) {
      feed.innerHTML = `<p class="muted">${I18N[lang].feed_empty}</p>`;
      return;
    }
    documents.forEach((doc) => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `<p class="feed-title">${doc.title} · v${doc.version}</p><p class="feed-meta">${doc.updated_by || ''}</p>`;
      feed.appendChild(div);
    });
    messages.forEach((msg) => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `<p class="feed-title">#${msg.channel}</p><p class="feed-meta">${msg.from || ''} · ${msg.message}</p>`;
      feed.appendChild(div);
    });
  } catch (err) {
    feed.innerHTML = `<p class="warning">${(err || {}).message || err}</p>`;
  }
}

async function refreshApprovalFeed() {
  const feed = document.getElementById('approval-feed');
  if (!feed) return;
  feed.innerHTML = '';
  const lang = currentLang();
  try {
    const { items } = await ApiClient.listApprovals();
    if (!items.length) {
      feed.innerHTML = `<p class="muted">${I18N[lang].feed_empty}</p>`;
      return;
    }
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      const form = item.form || {};
      div.innerHTML = `<p class="feed-title">${form.type || 'form'} · ${item.status}</p><p class="feed-meta">${form.reason || ''} · ${item.next_step || ''}</p>`;
      feed.appendChild(div);
    });
  } catch (err) {
    feed.innerHTML = `<p class="warning">${(err || {}).message || err}</p>`;
  }
}

async function refreshExpenseFeed() {
  const feed = document.getElementById('expense-feed');
  if (!feed) return;
  feed.innerHTML = '';
  const lang = currentLang();
  try {
    const { items } = await ApiClient.listExpenses();
    if (!items.length) {
      feed.innerHTML = `<p class="muted">${I18N[lang].feed_empty}</p>`;
      return;
    }
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      const exp = item.expense || {};
      div.innerHTML = `<p class="feed-title">${exp.type || 'expense'} · ${item.status}</p><p class="feed-meta">${exp.description || ''} · ${exp.amount || ''} · ${item.next_approver || ''}</p>`;
      feed.appendChild(div);
    });
  } catch (err) {
    feed.innerHTML = `<p class="warning">${(err || {}).message || err}</p>`;
  }
}

function initOfficeWorkbench() {
  const docForm = document.getElementById('doc-form');
  const docOutput = document.getElementById('doc-output');
  const docStatus = document.getElementById('doc-status');
  if (docForm) {
    docForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = (document.getElementById('doc-title') || {}).value || '';
      const content = (document.getElementById('doc-content') || {}).value || '';
      const collabs = ((document.getElementById('doc-collab') || {}).value || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (docStatus) docStatus.textContent = I18N[currentLang()].submitting;
      try {
        const data = await ApiClient.saveDocument({ title, content, collaborators: collabs });
        if (docOutput) docOutput.textContent = JSON.stringify(data, null, 2);
        if (docStatus) docStatus.textContent = I18N[currentLang()].done;
        refreshOfficeFeed();
      } catch (err) {
        if (docOutput) docOutput.textContent = err.toString();
        if (docStatus) docStatus.textContent = err.message || 'Failed';
      }
    });
  }

  const chatForm = document.getElementById('chat-form');
  const chatOutput = document.getElementById('chat-output');
  const chatStatus = document.getElementById('chat-status');
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const channel = (document.getElementById('chat-channel') || {}).value || 'general';
      const message = (document.getElementById('chat-message') || {}).value || '';
      if (chatStatus) chatStatus.textContent = I18N[currentLang()].running;
      try {
        const data = await ApiClient.sendChat({ channel, message });
        if (chatOutput) chatOutput.textContent = JSON.stringify(data, null, 2);
        if (chatStatus) chatStatus.textContent = I18N[currentLang()].done;
        refreshOfficeFeed();
      } catch (err) {
        if (chatOutput) chatOutput.textContent = err.toString();
        if (chatStatus) chatStatus.textContent = err.message || 'Failed';
      }
    });
  }

  const refreshBtn = document.getElementById('office-refresh');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshOfficeFeed);
  refreshOfficeFeed();
}

function initOAWorkbench() {
  const form = document.getElementById('approval-form');
  const output = document.getElementById('approval-output');
  const statusEl = document.getElementById('approval-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = (document.getElementById('approval-type') || {}).value || 'leave';
      const amount = parseFloat((document.getElementById('approval-amount') || {}).value || '0');
      const reason = (document.getElementById('approval-reason') || {}).value || '';
      if (statusEl) statusEl.textContent = I18N[currentLang()].submitting;
      try {
        const data = await ApiClient.submitApproval({ type, amount, reason });
        if (output) output.textContent = JSON.stringify(data, null, 2);
        if (statusEl) statusEl.textContent = I18N[currentLang()].done;
        refreshApprovalFeed();
      } catch (err) {
        if (output) output.textContent = err.toString();
        if (statusEl) statusEl.textContent = err.message || 'Failed';
      }
    });
  }
  const refreshBtn = document.getElementById('approval-refresh');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshApprovalFeed);
  refreshApprovalFeed();
}

function initFinanceWorkbench() {
  const form = document.getElementById('expense-form');
  const output = document.getElementById('expense-output');
  const statusEl = document.getElementById('expense-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = (document.getElementById('expense-type') || {}).value || 'travel';
      const amount = parseFloat((document.getElementById('expense-amount') || {}).value || '0');
      const description = (document.getElementById('expense-desc') || {}).value || '';
      if (statusEl) statusEl.textContent = I18N[currentLang()].submitting;
      try {
        const data = await ApiClient.submitExpense({ type, amount, description });
        if (output) output.textContent = JSON.stringify(data, null, 2);
        if (statusEl) statusEl.textContent = I18N[currentLang()].done;
        refreshExpenseFeed();
      } catch (err) {
        if (output) output.textContent = err.toString();
        if (statusEl) statusEl.textContent = err.message || 'Failed';
      }
    });
  }
  const refreshBtn = document.getElementById('expense-refresh');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshExpenseFeed);
  refreshExpenseFeed();
}

async function createUser() {
  const statusEl = document.getElementById('create-status');
  const username = (document.getElementById('new-username') || {}).value || '';
  const password = (document.getElementById('new-password') || {}).value || '';
  const department = (document.getElementById('new-department') || {}).value || '';
  const modules = Array.from(document.querySelectorAll('#module-select button[data-module]'))
    .filter((c) => c.dataset.selected === 'true')
    .map((c) => c.dataset.module || '');
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
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill';
    btn.textContent = meta.label[lang];
    btn.dataset.module = meta.key;
    btn.dataset.selected = 'false';
    btn.onclick = () => toggleSelectable(btn);
    box.appendChild(btn);
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
  initOfficeWorkbench,
  initOAWorkbench,
  initFinanceWorkbench,
};
