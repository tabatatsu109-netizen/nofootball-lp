// ★ アイテムショップ 体験デモ用設定ファイル ★
// このデモは localStorage のみで完結し、Firebase などクラウドへは一切通信しません。

var SHOP_CONFIG = {
  clubName:     'DEMO CLUB',
  clubNameFull: 'デモクラブ',
  clubId:       'demo',
  firebaseUrl:  '',

  colors: {
    primary:     '#1a6b2f',
    primaryDark: '#145224',
    deep:        '#0d3b1e',
    accent:      '#c8a94a',
    bg:          '#f2f5f2'
  },

  teams: ['ジュニア（U-12）', 'ジュニアユース（U-15）'],
  payMethods: ['現金払い', '銀行振込', 'PayPay'],
  productCats: ['すべて', 'ユニフォーム', 'トップス', 'ボトムス', 'ソックス', 'バッグ'],

  notice: 'これは<b>体験デモ</b>です。注文はこの端末のみに保存され、公開・共有されません。',

  products: [
    { id: 1, name: 'ユニフォーム（ホーム）', brand: 'DEMO', desc: '公式戦で着用します。', price: 8000, cat: 'ユニフォーム', sizes: ['130','140','150','160','S','M','L','O'], reqJ: true, reqJU: true },
    { id: 2, name: 'ユニフォーム（アウェイ）', brand: 'DEMO', desc: '公式戦で着用します。', price: 8000, cat: 'ユニフォーム', sizes: ['130','140','150','160','S','M','L','O'], reqJ: true, reqJU: true },
    { id: 3, name: 'プラクティスシャツ', brand: 'DEMO', desc: '練習時に着用します。', price: 4000, cat: 'トップス', sizes: ['130','140','150','160','S','M','L','O'], reqJ: false, reqJU: false },
    { id: 4, name: 'ゲームパンツ', brand: 'DEMO', desc: '', price: 4500, cat: 'ボトムス', sizes: ['130','140','150','160','S','M','L','O'], reqJ: true, reqJU: true },
    { id: 5, name: 'ソックス', brand: 'DEMO', desc: '', price: 1500, cat: 'ソックス', sizes: ['19-21','22-24','25-27'], reqJ: true, reqJU: true },
    { id: 6, name: 'バックパック', brand: 'DEMO', desc: 'クラブマーク付き。', price: 9000, cat: 'バッグ', sizes: ['1個'], reqJ: false, reqJU: false }
  ]
};
