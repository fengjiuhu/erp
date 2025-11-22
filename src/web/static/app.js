// UI layer rebuilt for clarity: centralized i18n, API helpers, and module-specific controllers.
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
    card_cta: 'Open workbench',
    quick_tasks: 'Quick actions',
    run_selected: 'Run selected',
    pick_one: 'Choose at least one task',
    running: 'Running...',
    done: 'Done',
    awaiting: 'Awaiting...',
    admin_create: 'Admin · create user & assign modules',
    create_user: 'Create user',
    username: 'Username',
    password: 'Password',
    department: 'Department',
    submitting: 'Submitting...',
    created_user: (u) => `User ${u} created`,
    no_permission: 'No permission to access this module.',
    language_toggle: '中文 / English',
    dashboard_subtitle: 'Module navigation & quick links',
    load_error: 'Failed to load data',
    integration_center: 'Integration Center',
    integration_hint: 'Jump between modules with shared context',
    feature_header: 'Coverage overview',
    feature_hint: 'Compare against the capability list',
    status_ready: 'Ready',
    status_in_progress: 'In progress',
    status_planned: 'Planned',
    doc_editor: 'Document editor',
    doc_editor_hint: 'Create a collaborative doc with versioning',
    doc_title: 'Title',
    doc_body: 'Body',
    doc_collaborators: 'Collaborators',
    doc_collaborators_placeholder: 'e.g. Alex, Jamie separated by comma',
    save_document: 'Save document',
    chat_send: 'Send chat/meeting message',
    chat_send_hint: 'Simulate IM or meeting posts',
    chat_channel: 'Channel',
    chat_message: 'Message',
    send_chat: 'Send',
    latest_activity: 'Recent activity',
    latest_activity_hint: 'See submitted versions and chats',
    refresh: 'Refresh',
    expense_form: 'Expense claim',
    expense_form_hint: 'Enter category, amount, and description',
    expense_type: 'Type',
    expense_amount: 'Amount',
    expense_desc: 'Description',
    submit_expense: 'Submit expense',
    expense_list_hint: 'Latest submissions and routing',
    approval_form: 'Workflow form',
    approval_form_hint: 'Submit leave/expense/procurement requests',
    approval_type: 'Type',
    approval_amount: 'Amount/Days',
    approval_reason: 'Reason',
    submit_approval: 'Submit',
    approval_list_hint: 'Previously submitted flows',
    feed_empty: 'No data yet — submit one to see results',
  },
};

const MODULE_COPY = {
  dashboard: { title: '驾驶舱', desc: I18N.zh.dashboard_subtitle },
  office: { title: '办公套件', desc: '文档协作、即时沟通与日程共享' },
  oa: { title: '流程与行政', desc: '审批、公告、公文与行政流程' },
  finance: { title: '财务工作台', desc: '费用报销、总账预算与应收应付' },
  iam: { title: '身份与安全', desc: '账号、权限、审计与安全策略' },
  integration: { title: '集成与网关', desc: 'API、消息与数据同步' },
  hrm: { title: '人力资源', desc: '员工、考勤、薪酬' },
  supply: { title: '供应链', desc: '采购、仓储、物流' },
  project: { title: '项目管理', desc: '里程碑、进度与成本' },
  crm: { title: '客户与工单', desc: '客户关系与客服工单' },
  knowledge: { title: '知识与学习', desc: '知识库与培训' },
  mobile: { title: '门户与移动', desc: '移动门户与审批' },
  itsm: { title: '运维与BI', desc: 'IT 服务与报表' },
  developer: { title: '开发者平台', desc: '低代码与扩展' },
  asset: { title: '资产中心', desc: '资产与库存管理' },
};

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmt = (value) => (typeof value === 'function' ? value(AppUI.state.user?.username || '') : value);

const ApiClient = {
  async request(path, options = {}) {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  },
  me() {
    return this.request('/api/me');
  },
  modules() {
    return this.request('/api/modules');
  },
  features() {
    return this.request('/api/features');
  },
  runTasks(tasks) {
    return this.request('/api/run', { method: 'POST', body: JSON.stringify({ tasks }) });
  },
  createUser(payload) {
    return this.request('/api/users', { method: 'POST', body: JSON.stringify(payload) });
  },
  officeDocument(payload) {
    return this.request('/api/office/document', { method: 'POST', body: JSON.stringify(payload) });
  },
  officeChat(payload) {
    return this.request('/api/office/chat', { method: 'POST', body: JSON.stringify(payload) });
  },
  officeFeed() {
    return this.request('/api/office/feed');
  },
  oaSubmit(payload) {
    return this.request('/api/oa/approval', { method: 'POST', body: JSON.stringify(payload) });
  },
  oaFeed() {
    return this.request('/api/oa/approvals');
  },
  financeSubmit(payload) {
    return this.request('/api/finance/expense', { method: 'POST', body: JSON.stringify(payload) });
  },
  financeFeed() {
    return this.request('/api/finance/expenses');
  },
};

const Render = {
  nav(modules) {
    const nav = qs('#nav');
    if (!nav) return;
    nav.innerHTML = '';
    const langBtn = document.createElement('button');
    langBtn.className = 'ghost';
    langBtn.textContent = I18N[AppUI.state.lang].language_toggle;
    langBtn.onclick = () => AppUI.toggleLang();
    const logout = document.createElement('button');
    logout.className = 'ghost';
    logout.textContent = I18N[AppUI.state.lang].nav_logout;
    logout.onclick = () => AppUI.logout();
    modules.forEach((m) => {
      const a = document.createElement('a');
      a.href = m.path;
      a.textContent = fmt(m.label[AppUI.state.lang]);
      nav.appendChild(a);
    });
    nav.appendChild(langBtn);
    nav.appendChild(logout);
  },
  pillGroup(container, tasks) {
    container.innerHTML = '';
    tasks.forEach((task) => {
      const label = fmt(task.label[AppUI.state.lang]);
      const pill = document.createElement('label');
      pill.className = 'pill';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = task.id;
      pill.appendChild(input);
      pill.appendChild(document.createTextNode(label));
      container.appendChild(pill);
    });
  },
  moduleGrid(modules) {
    const grid = qs('#module-grid');
    if (!grid) return;
    grid.innerHTML = '';
    modules.forEach((m) => {
      const card = document.createElement('div');
      card.className = 'card';
      const title = document.createElement('h3');
      title.textContent = fmt(m.label[AppUI.state.lang]);
      const desc = document.createElement('p');
      desc.className = 'muted';
      desc.textContent = fmt(m.description[AppUI.state.lang]);
      const btn = document.createElement('a');
      btn.href = m.path;
      btn.className = 'primary';
      btn.textContent = I18N[AppUI.state.lang].card_cta;
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(btn);
      grid.appendChild(card);
    });
  },
  featureMap(areas) {
    const container = qs('#feature-map');
    if (!container) return;
    container.innerHTML = '';
    areas.forEach((area) => {
      const group = document.createElement('div');
      group.className = 'feature-card';
      const title = document.createElement('h4');
      title.textContent = fmt(area.title[AppUI.state.lang]);
      group.appendChild(title);
      const list = document.createElement('ul');
      area.items.forEach((item) => {
        const li = document.createElement('li');
        const name = fmt(item.name[AppUI.state.lang]);
        const status = item.status;
        const badge = document.createElement('span');
        badge.className = `pill status ${status}`;
        const key = `status_${status}`;
        badge.textContent = I18N[AppUI.state.lang][key];
        li.textContent = name;
        li.appendChild(badge);
        list.appendChild(li);
      });
      group.appendChild(list);
      container.appendChild(group);
    });
  },
  feed(listEl, items, renderItem) {
    listEl.innerHTML = '';
    if (!items.length) {
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = I18N[AppUI.state.lang].feed_empty;
      listEl.appendChild(p);
      return;
    }
    items.forEach((item) => listEl.appendChild(renderItem(item)));
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

const Modules = {
  async bootstrap(moduleKey) {
    await AppUI.loadIdentity();
    if (!AppUI.state.user) return;
    const allowed = AppUI.state.modules;
    Render.nav(allowed);
    const info = qs('#user-info');
    if (info) info.textContent = `${AppUI.state.user.username} · ${AppUI.state.user.department || ''}`;
    AppUI.setModuleCopy(moduleKey);
  },
  dashboard: {
    async init() {
      await Modules.bootstrap('dashboard');
      const modules = AppUI.state.modules;
      Render.moduleGrid(modules);
      const integration = qs('#integration-center');
      if (integration) Render.pillGroup(integration, modules.flatMap((m) => m.tasks || []));
      const featureResp = await ApiClient.features();
      Render.featureMap(featureResp.areas || []);
    },
  },
  office: {
    async init() {
      await Modules.bootstrap('office');
      AppUI.buildQuickTasks('office');
      AppUI.bindDocForm();
      AppUI.bindChatForm();
      await AppUI.refreshOfficeFeed();
      const btn = qs('#office-refresh');
      if (btn) btn.onclick = () => AppUI.refreshOfficeFeed();
    },
  },
  oa: {
    async init() {
      await Modules.bootstrap('oa');
      AppUI.buildQuickTasks('oa');
      AppUI.bindApprovalForm();
      await AppUI.refreshApprovalFeed();
      const btn = qs('#approval-refresh');
      if (btn) btn.onclick = () => AppUI.refreshApprovalFeed();
    },
  },
  finance: {
    async init() {
      await Modules.bootstrap('finance');
      AppUI.buildQuickTasks('finance');
      AppUI.bindExpenseForm();
      await AppUI.refreshExpenseFeed();
      const btn = qs('#expense-refresh');
      if (btn) btn.onclick = () => AppUI.refreshExpenseFeed();
    },
  },
};

const AppUI = {
  state: { lang: localStorage.getItem(LANG_STORAGE_KEY) || 'zh', user: null, modules: [] },

  applyI18n() {
    qsa('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && I18N[this.state.lang][key]) {
        el.textContent = fmt(I18N[this.state.lang][key]);
      }
    });
    qsa('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && I18N[this.state.lang][key]) {
        el.setAttribute('placeholder', fmt(I18N[this.state.lang][key]));
      }
    });
  },

  setModuleCopy(key) {
    const copy = MODULE_COPY[key];
    if (!copy) return;
    const title = qs('#module-title');
    const desc = qs('#module-desc');
    if (title) title.textContent = copy.title;
    if (desc) desc.textContent = copy.desc;
  },

  toggleLang() {
    this.state.lang = this.state.lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem(LANG_STORAGE_KEY, this.state.lang);
    this.applyI18n();
  },

  async loadIdentity() {
    try {
      const [me, modules] = await Promise.all([ApiClient.me(), ApiClient.modules()]);
      this.state.user = me;
      this.state.modules = modules.modules || [];
    } catch (err) {
      console.error(err);
      alert(I18N[this.state.lang].load_error);
    }
  },

  buildQuickTasks(moduleKey) {
    const wrapper = qs('#tasks');
    if (!wrapper) return;
    const module = this.state.modules.find((m) => m.key === moduleKey);
    Render.pillGroup(wrapper, module?.tasks || []);
    const runBtn = qs('#run');
    const status = qs('#status');
    const output = qs('#output');
    if (runBtn && status && output) {
      runBtn.onclick = async () => {
        const selected = qsa('input[type=checkbox]', wrapper)
          .filter((i) => i.checked)
          .map((i) => i.value);
        if (!selected.length) {
          status.textContent = I18N[this.state.lang].pick_one;
          return;
        }
        status.textContent = I18N[this.state.lang].running;
        output.textContent = I18N[this.state.lang].awaiting;
        const res = await ApiClient.runTasks(selected);
        status.textContent = I18N[this.state.lang].done;
        output.textContent = JSON.stringify(res.results, null, 2);
      };
    }
  },

  bindLoginForm() {
    const form = qs('#login-form');
    const submit = qs('#login-submit');
    const status = qs('#login-status');
    if (!form || !submit || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      status.textContent = I18N[this.state.lang].signing_in;
      submit.disabled = true;
      try {
        const res = await ApiClient.request('/api/login', { method: 'POST', body: JSON.stringify(data) });
        status.textContent = I18N[this.state.lang].login_success;
        setTimeout(() => (window.location.href = '/dashboard.html'), 500);
      } catch (err) {
        console.error(err);
        status.textContent = I18N[this.state.lang].login_failed;
      } finally {
        submit.disabled = false;
      }
    });
  },

  bindUserCreator() {
    const form = qs('#create-user-form');
    const btn = qs('#create-user');
    const status = qs('#create-status');
    if (!form || !btn || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      status.textContent = I18N[this.state.lang].submitting;
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.modules = (payload.modules || '')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      try {
        const res = await ApiClient.createUser(payload);
        status.textContent = fmt(I18N[this.state.lang].created_user(res.created));
      } finally {
        btn.disabled = false;
      }
    });
  },

  bindDocForm() {
    const form = qs('#doc-form');
    const status = qs('#doc-status');
    const output = qs('#doc-output');
    if (!form || !status || !output) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = I18N[this.state.lang].submitting;
      const payload = {
        title: qs('#doc-title').value,
        content: qs('#doc-content').value,
        collaborators: (qs('#doc-collab').value || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      };
      const res = await ApiClient.officeDocument(payload);
      status.textContent = I18N[this.state.lang].done;
      output.textContent = JSON.stringify(res.document, null, 2);
    });
  },

  bindChatForm() {
    const form = qs('#chat-form');
    const status = qs('#chat-status');
    const output = qs('#chat-output');
    if (!form || !status || !output) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = I18N[this.state.lang].submitting;
      const payload = {
        channel: qs('#chat-channel').value,
        message: qs('#chat-message').value,
      };
      const res = await ApiClient.officeChat(payload);
      status.textContent = I18N[this.state.lang].done;
      output.textContent = JSON.stringify(res.message, null, 2);
    });
  },

  bindApprovalForm() {
    const form = qs('#approval-form');
    const status = qs('#approval-status');
    const output = qs('#approval-output');
    if (!form || !status || !output) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = I18N[this.state.lang].submitting;
      const payload = {
        form: {
          type: qs('#approval-type').value,
          amount: Number(qs('#approval-amount').value || 0),
          reason: qs('#approval-reason').value,
        },
      };
      const res = await ApiClient.oaSubmit(payload);
      status.textContent = I18N[this.state.lang].done;
      output.textContent = JSON.stringify(res.approval, null, 2);
    });
  },

  bindExpenseForm() {
    const form = qs('#expense-form');
    const status = qs('#expense-status');
    const output = qs('#expense-output');
    if (!form || !status || !output) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = I18N[this.state.lang].submitting;
      const payload = {
        expense: {
          type: qs('#expense-type').value,
          amount: Number(qs('#expense-amount').value || 0),
          desc: qs('#expense-desc').value,
        },
      };
      const res = await ApiClient.financeSubmit(payload);
      status.textContent = I18N[this.state.lang].done;
      output.textContent = JSON.stringify(res.expense, null, 2);
    });
  },

  async refreshOfficeFeed() {
    const feed = qs('#office-feed');
    if (!feed) return;
    const data = await ApiClient.officeFeed();
    Render.feed(feed, [...(data.documents || []), ...(data.messages || [])].reverse(), (item) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      const title = document.createElement('strong');
      if (item.content) {
        title.textContent = `${item.title || 'Doc'} v${item.version}`;
        const p = document.createElement('p');
        p.textContent = item.content;
        card.appendChild(title);
        card.appendChild(p);
      } else {
        title.textContent = `${item.channel} · ${item.from}`;
        const p = document.createElement('p');
        p.textContent = item.message;
        card.appendChild(title);
        card.appendChild(p);
      }
      return card;
    });
  },

  async refreshApprovalFeed() {
    const feed = qs('#approval-feed');
    if (!feed) return;
    const data = await ApiClient.oaFeed();
    Render.feed(feed, (data.items || []).slice().reverse(), (item) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      const title = document.createElement('strong');
      title.textContent = `${item.form?.type || 'approval'} · ${item.status}`;
      const p = document.createElement('p');
      p.textContent = `${item.submitted_by || ''} -> ${item.next_step || ''}`;
      card.appendChild(title);
      card.appendChild(p);
      return card;
    });
  },

  async refreshExpenseFeed() {
    const feed = qs('#expense-feed');
    if (!feed) return;
    const data = await ApiClient.financeFeed();
    Render.feed(feed, (data.items || []).slice().reverse(), (item) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      const title = document.createElement('strong');
      title.textContent = `${item.expense?.type || 'expense'} · ${item.status}`;
      const p = document.createElement('p');
      p.textContent = `${item.expense?.amount || 0} · ${item.next_approver || ''}`;
      card.appendChild(title);
      card.appendChild(p);
      return card;
    });
  },

  async logout() {
    await ApiClient.request('/api/logout', { method: 'POST', body: '{}' });
    window.location.href = '/login.html';
  },

  bootstrapModulePage(key) {
    this.applyI18n();
    this.setModuleCopy(key);
  },

  initDashboard() {
    Modules.dashboard.init();
  },
  initOfficeWorkbench() {
    Modules.office.init();
  },
  initOAWorkbench() {
    Modules.oa.init();
  },
  initFinanceWorkbench() {
    Modules.finance.init();
  },
};

window.AppUI = AppUI;
