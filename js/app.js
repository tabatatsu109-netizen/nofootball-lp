const modal = document.getElementById('modal');
const modalDone = modal.querySelector('.modal__done');
const modalFormWrap = modal.querySelector('.modal__form-wrap');
const leadForm = document.getElementById('lead-form');
const demoPreview = modal.querySelector('.modal__demo-preview');
const demoText = modal.querySelector('.modal__demo-text');
const submitBtn = leadForm.querySelector('button[type="submit"]');
const messageField = leadForm.querySelector('textarea[name="message"]');

const tabConfig = {
  consult: { label: 'この内容で相談する', placeholder: 'ご相談内容（任意）' },
  demo: { label: 'デモを申し込む', placeholder: 'ご希望の日程・見たい機能など（任意）' },
};

function setTab(tab) {
  modal.querySelectorAll('.modal__tab').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.tab === tab);
  });
  const isDemo = tab === 'demo';
  demoPreview.hidden = !isDemo;
  demoText.hidden = !isDemo;
  submitBtn.textContent = tabConfig[tab].label;
  messageField.placeholder = tabConfig[tab].placeholder;
  modal.dataset.activeTab = tab;
}

function openModal(tab) {
  modalDone.hidden = true;
  modalFormWrap.hidden = false;
  leadForm.reset();
  setTab(tab);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.openModal));
});
document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', closeModal);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});
modal.querySelector('.modal__panel').addEventListener('click', (e) => e.stopPropagation());

modal.querySelectorAll('.modal__tab').forEach((btn) => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

// フォーム送信先（Googleフォーム/外部API等）は未接続。承認後に本実装へ差し替える。
leadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }
  modalFormWrap.hidden = true;
  modalDone.hidden = false;
});

const heroSections = document.querySelectorAll('[data-hero]');
const heroButtons = document.querySelectorAll('[data-hero-btn]');

function setHero(variant) {
  heroSections.forEach((el) => { el.hidden = el.dataset.hero !== variant; });
  heroButtons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.heroBtn === variant);
  });
}

heroButtons.forEach((btn) => {
  btn.addEventListener('click', () => setHero(btn.dataset.heroBtn));
});
setHero('A');

const planCards = document.querySelectorAll('[data-plan-toggle]');
const planDetail = document.getElementById('plan-detail');
const planPanels = document.querySelectorAll('[data-plan-panel]');

function togglePlanDetail(key) {
  if (!planDetail) return; // このセクションが無いページでは何もしない
  const isOpen = !planDetail.hidden && planDetail.dataset.openPlan === key;

  if (isOpen) {
    planDetail.hidden = true;
    planDetail.dataset.openPlan = '';
    planCards.forEach((c) => {
      c.classList.remove('is-active');
      c.setAttribute('aria-expanded', 'false');
    });
    return;
  }

  planPanels.forEach((p) => { p.hidden = p.dataset.planPanel !== key; });
  planDetail.hidden = false;
  planDetail.dataset.openPlan = key;
  planCards.forEach((c) => {
    const active = c.dataset.planToggle === key;
    c.classList.toggle('is-active', active);
    c.setAttribute('aria-expanded', String(active));
  });
  planDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

planCards.forEach((card) => {
  card.addEventListener('click', () => togglePlanDetail(card.dataset.planToggle));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlanDetail(card.dataset.planToggle);
    }
  });
});

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-item__q');
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((el) => el.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});
