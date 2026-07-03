// ホームページ制作 依頼シート — order-form.js
// バニラJS実装。送信内容は Firebase Realtime Database の /intake ノードに保存する。

const FIREBASE_URL = 'https://hp-1-d7bce-default-rtdb.asia-southeast1.firebasedatabase.app';

const PLANS = [
  { id: 'light',    name: 'ライト',      price: '100,000', pageCount: 2,  pages: ['トップページ（1ページ完結）', '選手プロフィール'] },
  { id: 'standard', name: 'スタンダード', price: '200,000', pageCount: 5,  pages: ['トップページ', '選手プロフィール', 'クラブ紹介', '活動スケジュール', 'お問い合わせ'] },
  { id: 'premium',  name: 'プレミアム',   price: '300,000', pageCount: 10, pages: ['トップ / 選手 / クラブ紹介', '活動スケジュール / お問い合わせ', '試合結果 / スタッフ紹介', 'フォトギャラリー / スポンサー', 'よくある質問（FAQ）'] },
];

const MONTHLY_PLANS = [
  { id: 'm-light',    name: 'ライト',      price: '10,000', seats: 1, items: ['Match Planner 利用 1人', '試合結果・選手情報のHP自動反映', 'HP修正対応 月1回', 'メールサポート'] },
  { id: 'm-standard', name: 'スタンダード', price: '20,000', seats: 3, items: ['Match Planner 利用 3人', '試合結果・選手情報のHP自動反映', 'ニュース投稿代行 月3回', 'HP修正対応 月3回・LINEサポート'] },
  { id: 'm-premium',  name: 'プレミアム',   price: '30,000', seats: 5, items: ['Match Planner 利用 5人', 'アイテムショップ標準搭載', 'ニュース投稿代行 実質無制限', 'HP修正 優先対応・LINE優先サポート'] },
];
const STEP_LABELS = ['プラン', '基本情報', '素材', '要望', '確認'];
const THEME_ACCENT = { midnight: '#38bdf8', blaze: '#ff5b2e', turf: '#8ee63f' };

const state = {
  theme: 'midnight',
  step: 1,
  done: false,
  submitting: false,
  plan: null,
  monthly: null,
  logo: null,       // { name, url }
  photos: [],       // [{ id, name, url }]
  schedule: [{ day: '', time: '', activity: '' }],
  refs: ['', ''],
};

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const dash = (v) => (v && String(v).trim()) ? v : '';

function fieldVal(id) { return ($(`#${id}`) || {}).value || ''; }

/* ===== テーマ ===== */
function initTheme() {
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.themeBtn;
      document.body.dataset.theme = state.theme;
      updateThemeButtons();
    });
  });
  updateThemeButtons();
}
function updateThemeButtons() {
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.themeBtn === state.theme);
  });
}

/* ===== ステップ進捗 ===== */
function renderStepsNav() {
  const wrap = $('#of-steps');
  wrap.innerHTML = '';
  STEP_LABELS.forEach((label, i) => {
    const n = i + 1;
    const btn = el('button', 'step-item');
    btn.type = 'button';
    btn.innerHTML = `
      <div class="step-item__track"><div class="step-item__fill"></div></div>
      <div class="step-item__row">
        <span class="step-item__badge"></span>
        <span class="step-item__label">${label}</span>
      </div>`;
    btn.addEventListener('click', () => goTo(n));
    btn.dataset.step = n;
    wrap.appendChild(btn);
  });
  updateStepsNav();
}
function updateStepsNav() {
  document.querySelectorAll('#of-steps .step-item').forEach((btn) => {
    const n = Number(btn.dataset.step);
    const isActive = n === state.step;
    const isDone = n < state.step;
    btn.classList.toggle('is-active', isActive);
    btn.classList.toggle('is-done', isDone);
    btn.querySelector('.step-item__fill').style.width = (n <= state.step) ? '100%' : '0%';
    btn.querySelector('.step-item__badge').textContent = isDone ? '✓' : String(n);
  });
}

/* ===== STEP1: プラン ===== */
function renderPlans() {
  const grid = $('#plan-grid');
  grid.innerHTML = '';
  PLANS.forEach((p) => {
    const card = el('button', 'plan-card');
    card.type = 'button';
    card.dataset.planId = p.id;
    card.innerHTML = `
      <div class="plan-card__head">
        <div class="plan-card__head-row">
          <span class="plan-card__name">${p.name}</span>
          <span class="plan-card__check">✓</span>
        </div>
        <div class="plan-card__price">${p.price}<span class="plan-card__price-unit"> 円</span></div>
        <div class="plan-card__pagecount">${p.pageCount} ページ構成</div>
      </div>
      <div class="plan-card__body">
        ${p.pages.map((pg) => `<div class="plan-card__page-item">${pg}</div>`).join('')}
      </div>`;
    card.addEventListener('click', () => {
      state.plan = p;
      updatePlanSelection();
      updateNextState();
    });
    grid.appendChild(card);
  });
  updatePlanSelection();
}
function updatePlanSelection() {
  document.querySelectorAll('#plan-grid .plan-card').forEach((card) => {
    card.classList.toggle('is-selected', state.plan && card.dataset.planId === state.plan.id);
  });
}

function renderMonthlyPlans() {
  const grid = $('#monthly-grid');
  if (!grid) return;
  grid.innerHTML = '';
  MONTHLY_PLANS.forEach((p) => {
    const card = el('button', 'plan-card');
    card.type = 'button';
    card.dataset.monthlyId = p.id;
    card.innerHTML = `
      <div class="plan-card__head">
        <div class="plan-card__head-row">
          <span class="plan-card__name">${p.name}</span>
          <span class="plan-card__check">✓</span>
        </div>
        <div class="plan-card__price">${p.price}<span class="plan-card__price-unit"> 円/月</span></div>
        <div class="plan-card__pagecount">Match Planner ${p.seats}人まで</div>
      </div>
      <div class="plan-card__body">
        ${p.items.map((it) => `<div class="plan-card__page-item">${it}</div>`).join('')}
      </div>`;
    card.addEventListener('click', () => {
      state.monthly = p;
      updateMonthlySelection();
      updateNextState();
    });
    grid.appendChild(card);
  });
  updateMonthlySelection();
}
function updateMonthlySelection() {
  document.querySelectorAll('#monthly-grid .plan-card').forEach((card) => {
    card.classList.toggle('is-selected', state.monthly && card.dataset.monthlyId === state.monthly.id);
  });
}

/* ===== STEP2: 基本情報 ===== */
function initStep2() {
  ['f-clubName', 'f-email'].forEach((id) => $(`#${id}`).addEventListener('input', updateNextState));
}

/* ===== STEP3: ブランド素材 ===== */
function initStep3() {
  $('#f-logo').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (state.logo && state.logo.url) URL.revokeObjectURL(state.logo.url);
    state.logo = { name: f.name, url: URL.createObjectURL(f) };
    renderLogo();
  });
  $('#f-photos').addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      state.photos.push({ id: Math.random().toString(36).slice(2), name: f.name, url: URL.createObjectURL(f) });
    });
    e.target.value = '';
    renderPhotos();
  });
  ['f-colorMain', 'f-colorSub'].forEach((id) => {
    $(`#${id}`).addEventListener('input', (e) => {
      $(`#${id}-val`).textContent = e.target.value;
    });
  });
}
function renderLogo() {
  const preview = $('#logo-preview');
  const label = $('#logo-label');
  if (state.logo) {
    preview.innerHTML = `<img src="${state.logo.url}" alt="ロゴプレビュー">`;
    label.textContent = state.logo.name;
  } else {
    preview.textContent = '🛡️';
    label.textContent = 'ロゴをアップロード';
  }
}
function renderPhotos() {
  const grid = $('#photo-grid');
  grid.innerHTML = '';
  state.photos.forEach((p) => {
    const item = el('div', 'photo-item');
    item.innerHTML = `<img src="${p.url}" alt="${p.name}"><button type="button" class="photo-item__remove" aria-label="削除">×</button>`;
    item.querySelector('.photo-item__remove').addEventListener('click', () => {
      URL.revokeObjectURL(p.url);
      state.photos = state.photos.filter((x) => x.id !== p.id);
      renderPhotos();
    });
    grid.appendChild(item);
  });
}

/* ===== STEP4: 予定・参考サイト・要望 ===== */
function renderSchedule() {
  const list = $('#sched-list');
  list.innerHTML = '';
  state.schedule.forEach((row, i) => {
    const r = el('div', 'sched-row');
    r.innerHTML = `
      <select class="field-input" data-sched-field="day" data-idx="${i}">
        <option value="">曜日</option>
        ${['月曜','火曜','水曜','木曜','金曜','土曜','日曜'].map((d) => `<option ${row.day === d ? 'selected' : ''}>${d}</option>`).join('')}
      </select>
      <input class="field-input" data-sched-field="time" data-idx="${i}" placeholder="18:00〜20:00" value="${row.time}">
      <input class="field-input" data-sched-field="activity" data-idx="${i}" placeholder="内容（例：全体練習）" value="${row.activity}">
      <button type="button" class="row-remove" data-sched-remove="${i}" aria-label="削除">×</button>`;
    list.appendChild(r);
  });
  list.querySelectorAll('[data-sched-field]').forEach((input) => {
    input.addEventListener('input', (e) => {
      const i = Number(e.target.dataset.idx);
      state.schedule[i][e.target.dataset.schedField] = e.target.value;
    });
  });
  list.querySelectorAll('[data-sched-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.schedRemove);
      if (state.schedule.length > 1) state.schedule.splice(i, 1);
      renderSchedule();
    });
  });
}
function renderRefs() {
  const list = $('#ref-list');
  list.innerHTML = '';
  state.refs.forEach((val, i) => {
    const r = el('div', 'ref-row');
    r.innerHTML = `
      <input class="field-input" data-ref-idx="${i}" placeholder="https://（好きなデザイン・雰囲気のサイト）" value="${val}">
      <button type="button" class="row-remove" data-ref-remove="${i}" aria-label="削除">×</button>`;
    list.appendChild(r);
  });
  list.querySelectorAll('[data-ref-idx]').forEach((input) => {
    input.addEventListener('input', (e) => { state.refs[Number(e.target.dataset.refIdx)] = e.target.value; });
  });
  list.querySelectorAll('[data-ref-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.refRemove);
      if (state.refs.length > 1) state.refs.splice(i, 1);
      renderRefs();
    });
  });
}
function initStep4() {
  $('#add-sched').addEventListener('click', () => { state.schedule.push({ day: '', time: '', activity: '' }); renderSchedule(); });
  $('#add-ref').addEventListener('click', () => { state.refs.push(''); renderRefs(); });
}

/* ===== STEP5: 確認 ===== */
function renderSummary() {
  const plan = state.plan;
  $('#sum-planName').textContent = plan ? plan.name : '—';
  $('#sum-planPrice').textContent = plan ? `${plan.price} 円` : '—';
  $('#sum-planPages').textContent = plan ? `${plan.pageCount} ページ` : '—';

  const schedText = state.schedule.filter((r) => r.day || r.time || r.activity)
    .map((r) => [r.day, r.time, r.activity].filter(Boolean).join(' ')).join(' ／ ');
  const refText = state.refs.filter((r) => r.trim()).join('  /  ');

  const rows = [
    ['月額プラン', state.monthly ? `${state.monthly.name}（${state.monthly.price} 円/月・Match Planner ${state.monthly.seats}人）` : ''],
    ['クラブ名', dash(fieldVal('f-clubName'))],
    ['競技・種目', dash(fieldVal('f-sport'))],
    ['設立年', dash(fieldVal('f-founded'))],
    ['所在地', dash(fieldVal('f-address'))],
    ['ご担当者', dash(fieldVal('f-contact'))],
    ['連絡先', [fieldVal('f-phone'), fieldVal('f-email')].filter(Boolean).join(' / ')],
    ['現サイト', dash(fieldVal('f-existingUrl'))],
    ['スケジュール', schedText],
    ['参考サイト', refText],
    ['ご要望', dash(fieldVal('f-requests'))],
  ];
  const rowsWrap = $('#summary-rows');
  rowsWrap.innerHTML = '';
  rows.forEach(([k, v]) => {
    const row = el('div', 'summary-row');
    row.innerHTML = `<div class="summary-row__k">${k}</div><div class="summary-row__v ${v ? '' : 'summary-row__v--empty'}">${v || '—'}</div>`;
    rowsWrap.appendChild(row);
  });

  $('#sum-attach-text').textContent = `ロゴ ${state.logo ? '1点' : 'なし'}・写真 ${state.photos.length} 枚`;
  $('#sum-logo-preview').innerHTML = state.logo ? `<img src="${state.logo.url}" alt="ロゴ">` : '';

  $('#sw-accent').style.background = THEME_ACCENT[state.theme];
  $('#sw-main').style.background = fieldVal('f-colorMain') || '#1e5bd6';
  $('#sw-sub').style.background = fieldVal('f-colorSub') || '#f2b705';
}

/* ===== ステップ遷移 ===== */
function canProceed() {
  if (state.step === 1) return !!state.plan && !!state.monthly;
  if (state.step === 2) {
    const name = fieldVal('f-clubName').trim();
    const email = fieldVal('f-email');
    return !!name && /\S+@\S+\.\S+/.test(email);
  }
  return true;
}
const HINTS = { 1: '制作プランと月額サポートプランを選択してください', 2: 'クラブ名とメールは必須です' };

function updateNextState() {
  const ok = canProceed();
  const btn = $('#btn-next');
  btn.disabled = !ok || state.submitting;
  const hint = $('#hint-text');
  if (!ok && HINTS[state.step]) {
    hint.hidden = false;
    hint.textContent = HINTS[state.step];
  } else {
    hint.hidden = true;
  }
}

function renderStep() {
  document.querySelectorAll('.step-panel').forEach((p) => {
    p.classList.toggle('is-active', Number(p.dataset.stepPanel) === state.step);
  });
  updateStepsNav();
  $('#btn-prev').hidden = state.step === 1;
  $('#btn-next').textContent = state.step === 5 ? '送信する →' : '次へ →';
  if (state.step === 5) renderSummary();
  updateNextState();
}

function next() {
  if (!canProceed()) { updateNextState(); return; }
  if (state.step >= 5) { submit(); return; }
  state.step += 1;
  renderStep();
}
function prev() {
  if (state.step <= 1) return;
  state.step -= 1;
  renderStep();
}
function goTo(n) {
  if (state.done) return;
  state.step = n;
  renderStep();
}

/* ===== 送信 ===== */
async function submit() {
  if (state.submitting) return;
  state.submitting = true;
  const btn = $('#btn-next');
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = '送信中...';
  const hint = $('#hint-text');
  hint.hidden = true;

  const payload = {
    plan: state.plan ? { id: state.plan.id, name: state.plan.name, price: state.plan.price, pageCount: state.plan.pageCount } : null,
    monthly: state.monthly ? { id: state.monthly.id, name: state.monthly.name, price: state.monthly.price, seats: state.monthly.seats } : null,
    clubName: fieldVal('f-clubName'),
    sport: fieldVal('f-sport'),
    founded: fieldVal('f-founded'),
    address: fieldVal('f-address'),
    contact: fieldVal('f-contact'),
    phone: fieldVal('f-phone'),
    email: fieldVal('f-email'),
    existingUrl: fieldVal('f-existingUrl'),
    colorMain: fieldVal('f-colorMain') || '#1e5bd6',
    colorSub: fieldVal('f-colorSub') || '#f2b705',
    requests: fieldVal('f-requests'),
    schedule: state.schedule.filter((r) => r.day || r.time || r.activity),
    refs: state.refs.filter((r) => r.trim()),
    hasLogo: !!state.logo,
    logoName: state.logo ? state.logo.name : '',
    photoCount: state.photos.length,
    theme: state.theme,
    submittedAt: new Date().toISOString(),
    status: 'new',
  };

  try {
    const res = await fetch(`${FIREBASE_URL}/intake.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    finishSubmit(payload);
  } catch (err) {
    state.submitting = false;
    btn.disabled = false;
    btn.textContent = originalLabel;
    hint.hidden = false;
    hint.textContent = '送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。';
  }
}

function finishSubmit(payload) {
  state.done = true;
  $('#of-form-root').hidden = true;
  $('#done-screen').hidden = false;
  $('#done-clubName').textContent = payload.clubName || 'ご担当者';
  $('#done-email').textContent = payload.email || '—';
}

function restart() {
  state.done = false;
  state.submitting = false;
  state.step = 1;
  state.plan = null;
  state.monthly = null;
  if (state.logo && state.logo.url) URL.revokeObjectURL(state.logo.url);
  state.logo = null;
  state.photos.forEach((p) => URL.revokeObjectURL(p.url));
  state.photos = [];
  state.schedule = [{ day: '', time: '', activity: '' }];
  state.refs = ['', ''];

  ['f-clubName', 'f-sport', 'f-founded', 'f-address', 'f-contact', 'f-phone', 'f-email', 'f-existingUrl', 'f-requests'].forEach((id) => { $(`#${id}`).value = ''; });
  $('#f-colorMain').value = '#1e5bd6'; $('#colorMain-val').textContent = '#1e5bd6';
  $('#f-colorSub').value = '#f2b705'; $('#colorSub-val').textContent = '#f2b705';

  renderPlans();
  renderMonthlyPlans();
  renderLogo();
  renderPhotos();
  renderSchedule();
  renderRefs();
  renderStep();

  $('#done-screen').hidden = true;
  $('#of-form-root').hidden = false;
}

/* ===== 初期化 ===== */
function init() {
  initTheme();
  renderStepsNav();
  renderPlans();
  renderMonthlyPlans();
  initStep2();
  initStep3();
  renderSchedule();
  renderRefs();
  initStep4();

  $('#btn-prev').addEventListener('click', prev);
  $('#btn-next').addEventListener('click', next);
  $('#btn-restart').addEventListener('click', restart);

  renderStep();
}

document.addEventListener('DOMContentLoaded', init);
