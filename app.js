/* ═══════════════════════════════════════════════════════════
   FUNDMASTER AI — Application Logic
   拆分自原始单文件，新增主题切换 + 动态里程碑生成
   ═══════════════════════════════════════════════════════════ */

/* ─── 团队数据 ─── */
const TEAM = [
  { name: "Liu Zhaoxuan",  role: "Team Member", initials: "M1", color: "linear-gradient(135deg,#7c5cfc,#5a3fe0)" },
  { name: "Wen Yuxuan",    role: "Team Member", initials: "M2", color: "linear-gradient(135deg,#38bdf8,#0ea5e9)" },
  { name: "Sun Yitao",     role: "Team Member", initials: "M3", color: "linear-gradient(135deg,#10b981,#059669)" },
  { name: "Guo Fengyuan",  role: "Team Member", initials: "M4", color: "linear-gradient(135deg,#f59e0b,#d97706)" },
  { name: "Lim Shunyao",   role: "Team Member", initials: "M5", color: "linear-gradient(135deg,#ef4444,#dc2626)" },
];

/* ─── 里程碑数据（revisedDate 为延期前的原始日期） ─── */
const MILESTONES = [
  { title: "Detailed Project Proposal",   date: "March 27, 2026",      revisedDate: "Mar 10",  status: "done",     tag: "Milestone 01" },
  { title: "Project Progress Update 1",   date: "April 14, 2026",      revisedDate: "Apr 7",   status: "active",   tag: "Milestone 02" },
  { title: "Project Progress Update 2",   date: "May 5, 2026",         revisedDate: null,      status: "upcoming", tag: "Milestone 03" },
  { title: "Interim Report & Presentation", date: "June 1, 2026",      revisedDate: null,      status: "upcoming", tag: "Milestone 04" },
  { title: "Project Progress Update 3",   date: "June 16, 2026",       revisedDate: null,      status: "upcoming", tag: "Milestone 05" },
  { title: "Project Progress Update 4",   date: "July 6, 2026",        revisedDate: null,      status: "upcoming", tag: "Milestone 06" },
  { title: "Project Webpage",             date: "July 13, 2026",       revisedDate: null,      status: "upcoming", tag: "Milestone 07" },
  { title: "Project Report",              date: "July 17, 2026",       revisedDate: null,      status: "upcoming", tag: "Milestone 08" },
  { title: "Oral Examination",            date: "End of July 2026",    revisedDate: null,      status: "upcoming", tag: "Milestone 09" },
];

/* ─── 默认日志记录 ─── */
const DEFAULT_LOGS = [
  { author: "Supervisor", tag: "supervisor", time: "Mar 28, 2026 · 09:14",
    text: "Proposal received. Good structure overall — please refine the AI model selection section before the next update.",
    color: "#f59e0b" },
  { author: "Member 1", tag: "student", time: "Mar 28, 2026 · 11:32",
    text: "Understood! We'll revise the model comparison table and add justification for our chosen architecture.",
    color: "#7c5cfc" },
];

/* ═══════════════════════════════════════════════
   全局状态
   ═══════════════════════════════════════════════ */
let isSupervisor = false;
let currentMilestoneIdx = 0;

/* ─── LocalStorage 工具 ─── */
function loadData() {
  try { return JSON.parse(localStorage.getItem('fundmaster_data') || '{}'); }
  catch { return {}; }
}
function saveData(data)  { localStorage.setItem('fundmaster_data', JSON.stringify(data)); }
function loadLogs()      { try { const s = localStorage.getItem('fundmaster_logs'); return s ? JSON.parse(s) : [...DEFAULT_LOGS]; } catch { return [...DEFAULT_LOGS]; } }
function saveLogs(logs)  { localStorage.setItem('fundmaster_logs', JSON.stringify(logs)); }

/* ═══════════════════════════════════════════════
   主题切换（亮色 / 暗色）
   ═══════════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('fundmaster_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // 默认无 data-theme 属性 = 暗色主题
}

function toggleTheme() {
  const html = document.documentElement;

  // 添加过渡类，实现平滑换色
  html.classList.add('theme-transition');

  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';

  if (next === 'dark') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', 'light');
  }

  localStorage.setItem('fundmaster_theme', next);

  // 过渡完毕后移除类，避免影响其他动画
  setTimeout(() => html.classList.remove('theme-transition'), 500);
}

/* ═══════════════════════════════════════════════
   角色切换
   ═══════════════════════════════════════════════ */
function toggleRole() {
  isSupervisor = !isSupervisor;
  document.getElementById('roleBadge').textContent = isSupervisor ? 'Supervisor View' : 'Student View';
  document.querySelector('.btn-role').textContent   = isSupervisor ? 'Switch to Student' : 'Switch to Supervisor';

  const page = document.getElementById('page-detail');
  if (page.classList.contains('active')) {
    renderDetailPage(currentMilestoneIdx);
  }
}

/* ═══════════════════════════════════════════════
   页面导航
   ═══════════════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  renderHome();
  showPage('page-home');
}

/* ═══════════════════════════════════════════════
   倒计时计算
   ═══════════════════════════════════════════════ */
function calcDays() {
  const target = new Date('2026-04-14');
  const now    = new Date();
  const diff   = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  document.getElementById('statDays').textContent = diff > 0 ? diff : '0';
}

/* ═══════════════════════════════════════════════
   首页渲染
   ═══════════════════════════════════════════════ */
function renderHome() {
  generateMilestoneCards();
  renderTeamGrid();
  renderPreviews();
  renderLogs();
  renderAuthorSelect();
  calcDays();
}

/* ─── 动态生成里程碑卡片（替代原来 9 段重复 HTML） ─── */
function generateMilestoneCards() {
  const STATUS_LABELS = { done: 'Completed', active: 'In Progress', upcoming: 'Upcoming', overdue: 'Overdue' };
  const container = document.getElementById('milestoneList');

  container.innerHTML = MILESTONES.map((ms, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const revisedHtml = ms.revisedDate
      ? `<span class="revised">${ms.revisedDate}</span>`
      : '';

    return `
      <div class="milestone-card status-${ms.status}" data-ms-idx="${idx}">
        <div class="milestone-dot"><div class="dot-num">${num}</div></div>
        <div class="milestone-body">
          <div class="milestone-top">
            <div class="milestone-title">${ms.title}</div>
            <span class="ms-status ${ms.status}">${STATUS_LABELS[ms.status]}</span>
          </div>
          <div class="milestone-date">${ms.date} ${revisedHtml}</div>
          <div class="members-preview">
            <span class="members-preview-label">Team:</span>
            <div class="member-dots" id="preview-${idx}"></div>
            <span class="submitted-count" id="count-${idx}"></span>
          </div>
          <div class="click-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            View contributions
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ─── 团队成员网格 ─── */
function renderTeamGrid() {
  document.getElementById('teamGrid').innerHTML = TEAM.map(m => `
    <div class="team-card">
      <div class="team-avatar" style="background:${m.color}">${m.initials}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
      <div class="online-dot">Active</div>
    </div>
  `).join('');
}

/* ─── 里程碑卡片上的提交预览 ─── */
function renderPreviews() {
  const data = loadData();
  MILESTONES.forEach((_, idx) => {
    const dots  = document.getElementById(`preview-${idx}`);
    const count = document.getElementById(`count-${idx}`);
    if (!dots || !count) return;

    const msKey = `ms_${idx}`;
    const submitted = TEAM.filter((_, ti) => (data[msKey]?.[`member_${ti}`] || '').trim().length > 0).length;

    dots.innerHTML = TEAM.map(m =>
      `<div class="member-dot-avatar" style="background:${m.color}">${m.initials}</div>`
    ).join('');

    count.textContent = submitted > 0 ? `${submitted}/5 submitted` : '';
  });
}

/* ─── 日志列表 ─── */
function renderLogs() {
  const logs = loadLogs();
  document.getElementById('logContainer').innerHTML = logs.map(log => `
    <div class="log-entry">
      <div class="log-avatar" style="background:${log.color || '#7c5cfc'}20;color:${log.color || '#7c5cfc'};border:1px solid ${log.color || '#7c5cfc'}40;">
        ${log.author[0]}
      </div>
      <div class="log-content">
        <div class="log-meta">
          <span class="log-author">${log.author}</span>
          <span class="log-time">${log.time}</span>
          <span class="log-tag ${log.tag}">${log.tag}</span>
        </div>
        <div class="log-text">${log.text}</div>
      </div>
    </div>
  `).join('');
}

/* ─── 日志作者下拉 ─── */
function renderAuthorSelect() {
  const sel  = document.getElementById('logAuthorSelect');
  const opts = ['Supervisor', ...TEAM.map(m => m.name)];
  sel.innerHTML = opts.map(o => `<option value="${o}">${o}</option>`).join('');
}

/* ─── 添加日志 ─── */
function addLog() {
  const text   = document.getElementById('logInput').value.trim();
  const author = document.getElementById('logAuthorSelect').value;
  if (!text) return;

  const logs = loadLogs();
  const now  = new Date();
  const time = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isSup     = author === 'Supervisor';
  const memberIdx = TEAM.findIndex(m => m.name === author);
  const color     = isSup ? '#f59e0b'
    : (memberIdx >= 0 ? (TEAM[memberIdx].color.match(/#[0-9a-f]+/i)?.[0] || '#7c5cfc') : '#7c5cfc');

  logs.push({ author, tag: isSup ? 'supervisor' : 'student', time, text, color });
  saveLogs(logs);
  document.getElementById('logInput').value = '';
  renderLogs();
}

/* ═══════════════════════════════════════════════
   里程碑详情页
   ═══════════════════════════════════════════════ */
function openMilestone(idx) {
  currentMilestoneIdx = idx;
  renderDetailPage(idx);
  showPage('page-detail');
}

function renderDetailPage(idx) {
  const ms = MILESTONES[idx];
  document.getElementById('detailTag').textContent   = ms.tag;
  document.getElementById('detailTitle').textContent  = ms.title;
  document.getElementById('detailDate').textContent   = ms.date;

  const STATUS_MAP = {
    done:     ['done',     'Completed'],
    active:   ['active',   'In Progress'],
    upcoming: ['upcoming', 'Upcoming'],
    overdue:  ['overdue',  'Overdue'],
  };
  const [cls, label] = STATUS_MAP[ms.status] || ['upcoming', 'Upcoming'];
  document.getElementById('detailStatusBadge').innerHTML = `<span class="ms-status ${cls}">${label}</span>`;

  if (isSupervisor) {
    document.getElementById('studentEditView').style.display     = 'none';
    document.getElementById('supervisorReadView').style.display  = 'block';
    renderSupervisorView(idx);
  } else {
    document.getElementById('studentEditView').style.display     = 'block';
    document.getElementById('supervisorReadView').style.display  = 'none';
    renderMemberWorkGrid(idx);
  }
}

/* ─── 成员编辑卡片 ─── */
function renderMemberWorkGrid(msIdx) {
  const grid = document.getElementById('memberWorkGrid');
  const data = loadData();
  const msKey = `ms_${msIdx}`;

  grid.innerHTML = TEAM.map((m, ti) => {
    const savedVal  = data[msKey]?.[`member_${ti}`] || '';
    const savedTime = data[msKey]?.[`member_${ti}_time`] || '';
    return `
      <div class="member-work-card ${ti === TEAM.length - 1 && TEAM.length % 2 === 1 ? 'full-width' : ''}">
        <div class="mwc-header">
          <div class="mwc-avatar" style="background:${m.color}">${m.initials}</div>
          <div class="mwc-info">
            <div class="mwc-name">${m.name}</div>
            <div class="mwc-role">${m.role}</div>
          </div>
          <div class="mwc-saved-badge ${savedVal ? 'show' : ''}" id="badge-${msIdx}-${ti}">✓ Saved</div>
        </div>
        <textarea
          class="mwc-textarea"
          id="ta-${msIdx}-${ti}"
          placeholder="Describe what you worked on during this milestone period…&#10;e.g. Implemented data preprocessing pipeline, conducted literature review on transformer models, designed UI wireframes..."
        >${savedVal}</textarea>
        <div class="mwc-footer">
          <div class="mwc-last-edit" id="edit-time-${msIdx}-${ti}">
            ${savedTime ? '↩ Last saved: ' + savedTime : 'Not yet submitted'}
          </div>
          <button class="btn-save" data-ms="${msIdx}" data-member="${ti}">Save</button>
        </div>
      </div>`;
  }).join('');
}

/* ─── 保存单个成员的工作内容 ─── */
function saveWork(msIdx, memberIdx) {
  const ta  = document.getElementById(`ta-${msIdx}-${memberIdx}`);
  const val = ta.value.trim();
  const data  = loadData();
  const msKey = `ms_${msIdx}`;
  if (!data[msKey]) data[msKey] = {};

  const now     = new Date();
  const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    + ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  data[msKey][`member_${memberIdx}`]      = val;
  data[msKey][`member_${memberIdx}_time`] = timeStr;
  saveData(data);

  document.getElementById(`badge-${msIdx}-${memberIdx}`).classList.add('show');
  document.getElementById(`edit-time-${msIdx}-${memberIdx}`).textContent = '↩ Last saved: ' + timeStr;

  renderPreviews();
}

/* ─── 导师只读视图 ─── */
function renderSupervisorView(msIdx) {
  const data = loadData();
  const msKey = `ms_${msIdx}`;
  const list = document.getElementById('supervisorMemberList');

  list.innerHTML = TEAM.map((m, ti) => {
    const content   = data[msKey]?.[`member_${ti}`] || '';
    const savedTime = data[msKey]?.[`member_${ti}_time`] || '';
    return `
      <div class="sv-member-row">
        <div>
          <div class="sv-avatar" style="background:${m.color}">${m.initials}</div>
        </div>
        <div style="flex:1">
          <div class="sv-name">${m.name}</div>
          <div class="sv-role">${m.role}${savedTime ? ' · Submitted ' + savedTime : ''}</div>
          <div class="sv-content ${!content ? 'sv-empty' : ''}">
            ${content || 'No submission yet for this milestone.'}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════
   事件委托（替代 inline onclick）
   ═══════════════════════════════════════════════ */
function initEventListeners() {
  /* 导航栏 Logo → 回首页 */
  document.querySelector('.nav-logo').addEventListener('click', goHome);

  /* 角色切换按钮 */
  document.querySelector('.btn-role').addEventListener('click', toggleRole);

  /* 主题切换按钮 */
  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

  /* 里程碑卡片点击（事件委托） */
  document.getElementById('milestoneList').addEventListener('click', (e) => {
    const card = e.target.closest('.milestone-card');
    if (!card) return;
    const idx = parseInt(card.dataset.msIdx, 10);
    if (!isNaN(idx)) openMilestone(idx);
  });

  /* 返回按钮 */
  document.querySelector('.back-btn').addEventListener('click', goHome);

  /* 发布日志按钮 */
  document.querySelector('.btn-primary').addEventListener('click', addLog);

  /* 保存按钮（事件委托，因为卡片是动态生成的） */
  document.getElementById('memberWorkGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-save');
    if (!btn) return;
    const msIdx     = parseInt(btn.dataset.ms, 10);
    const memberIdx = parseInt(btn.dataset.member, 10);
    if (!isNaN(msIdx) && !isNaN(memberIdx)) saveWork(msIdx, memberIdx);
  });
}

/* ═══════════════════════════════════════════════
   应用启动
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHome();
  initEventListeners();
});
