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

const sampleData = {
  L: { name: 'ライトプラン', price: '10万円〜' },
  S: { name: 'スタンダードプラン', price: '20万円〜' },
  P: { name: 'プレミアムプラン', price: '30万円〜' },
};
const sampleTabs = document.querySelectorAll('[data-sample-tab]');
const sampleNameEl = document.querySelector('[data-sample-name]');
const samplePriceEl = document.querySelector('[data-sample-price]');
const samplePcLabelEl = document.querySelector('[data-sample-pc-label]');

function setSampleTab(key) {
  sampleTabs.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.sampleTab === key);
  });
  sampleNameEl.textContent = sampleData[key].name;
  samplePriceEl.textContent = sampleData[key].price;
  samplePcLabelEl.textContent = `［ ${sampleData[key].name} / PC ］`;
}

sampleTabs.forEach((btn) => {
  btn.addEventListener('click', () => setSampleTab(btn.dataset.sampleTab));
});
setSampleTab('S');

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-item__q');
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((el) => el.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});
