const PLAN_INFO = {
  light: {
    name: 'ライトプラン',
    desc: '単一ページで必要な情報をコンパクトに。選べるコンテンツで自由に組み立て。',
    amount: '¥100,000',
  },
  standard: {
    name: 'スタンダードプラン',
    desc: 'クラブに必要なページ一式。紹介・選手・試合結果まで。',
    amount: '¥200,000',
  },
  premium: {
    name: 'プレミアムプラン',
    desc: 'オリジナルデザイン＋クラブ専用機能。世界観を、隅々まで。',
    amount: '¥300,000',
  },
};

function initCheckout() {
  const picker = document.getElementById('checkout-picker');
  const summary = document.getElementById('checkout-summary');

  const idRaw = new URLSearchParams(location.search).get('plan');
  const id = (idRaw || '').toLowerCase();
  const plan = PLAN_INFO[id];

  if (!plan) {
    picker.hidden = false;
    summary.hidden = true;
    return;
  }

  picker.hidden = true;
  summary.hidden = false;

  document.querySelector('[data-checkout-heading]').textContent = `${plan.name} のお申し込み内容`;
  document.querySelector('[data-checkout-name]').textContent = plan.name;
  document.querySelector('[data-checkout-desc]').textContent = plan.desc;
  document.querySelector('[data-checkout-amount]').textContent = plan.amount;
  document.querySelector('[data-checkout-total]').textContent = plan.amount;

  const payBtn = document.getElementById('checkout-pay-btn');
  const link = STRIPE_LINKS[id] || '';
  const isReady = link && !link.includes('PLACEHOLDER');

  if (isReady) {
    payBtn.href = link;
    payBtn.textContent = 'Stripeで安全に支払う →';
    payBtn.classList.remove('btn--ghost');
    payBtn.classList.add('btn--primary');
  } else {
    payBtn.href = 'index.html#top';
    payBtn.textContent = 'このプランはオンライン決済準備中：無料相談する →';
    payBtn.classList.remove('btn--primary');
    payBtn.classList.add('btn--ghost');
  }

  document.getElementById('checkout-orderform-btn').href = `order-form.html?plan=${id}`;
}

document.addEventListener('DOMContentLoaded', initCheckout);
