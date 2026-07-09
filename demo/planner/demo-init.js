// ★ Match Planner 体験デモ 専用ファイル ★
// 初回アクセス時にサンプルデータを自動投入する。script.js より先に読み込むこと。
// クラウド通信は一切行わない（mp-config.js の firebaseUrl 空欄により構造的に無効）。
(function () {
  'use strict';
  var PREFIX = 'mp2_demo_';

  // 既にデータがあれば何もしない（ユーザーの操作を上書きしない）
  if (localStorage.getItem(PREFIX + 'players')) return;

  var today = new Date();
  function isoDaysAgo(n) {
    var d = new Date(today); d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }
  function isoDaysAhead(n) {
    var d = new Date(today); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  var players = [
    { id: 'demo-p1', name: '山田 太郎',   nameRoman: 'Taro Yamada',   number: 1,  mainGroup: 'GK', grade: '中3', photo: '' },
    { id: 'demo-p2', name: '佐藤 健',     nameRoman: 'Ken Sato',      number: 4,  mainGroup: 'DF', grade: '中3', photo: '' },
    { id: 'demo-p3', name: '鈴木 蓮',     nameRoman: 'Ren Suzuki',    number: 5,  mainGroup: 'DF', grade: '中2', photo: '' },
    { id: 'demo-p4', name: '高橋 陸',     nameRoman: 'Riku Takahashi',number: 8,  mainGroup: 'MF', grade: '中3', photo: '' },
    { id: 'demo-p5', name: '田中 悠人',   nameRoman: 'Yuto Tanaka',   number: 10, mainGroup: 'MF', grade: '中2', photo: '' },
    { id: 'demo-p6', name: '伊藤 大翔',   nameRoman: 'Hiroto Ito',    number: 9,  mainGroup: 'FW', grade: '中3', photo: '' },
    { id: 'demo-p7', name: '渡辺 蒼',     nameRoman: 'Sora Watanabe', number: 11, mainGroup: 'FW', grade: '中1', photo: '' },
  ];

  var opponents = [
    { id: 'demo-o1', name: 'FCリベルタ',   shortName: 'リベルタ', categories: ['U-15'], emblem: '', url: '', instagram: '', notes: '' },
    { id: 'demo-o2', name: 'ソル野球場SC', shortName: 'ソル',     categories: ['U-15'], emblem: '', url: '', instagram: '', notes: '' },
  ];

  var matches = [
    {
      id: 'demo-m1', opponent: 'FCリベルタ', date: isoDaysAgo(6), type: '公式戦', category: 'U-15',
      competition: 'リーグ戦', venue: '市営陸上競技場', formation: '4-3-3',
      lineup: {}, bench: [], subs: [],
      result: {
        myScore: 3, oppScore: 1, format: '', imageUrl: '', resultStr: '勝利',
        goals: [], concedes: [], publish: true, makeNews: true,
      },
    },
    {
      id: 'demo-m2', opponent: 'ソル野球場SC', date: isoDaysAhead(9), type: '公式戦', category: 'U-15',
      competition: 'カップ戦 準々決勝', venue: 'デモグラウンド', formation: '4-4-2',
      lineup: {}, bench: [], subs: [],
      result: null,
    },
  ];

  var schedules = [
    { id: 'demo-s1', date: isoDaysAhead(2), time: '17:00', endTime: '19:00', type: '練習', category: 'U-15', opponent: '', title: '通常練習', venue: 'デモグラウンド', competition: '', notes: '', posted: false, matchId: null },
    { id: 'demo-s2', date: isoDaysAhead(9), time: '10:00', endTime: '', type: '試合', category: 'U-15', opponent: 'ソル野球場SC', title: '', venue: 'デモグラウンド', competition: 'カップ戦 準々決勝', notes: '', posted: false, matchId: 'demo-m2' },
  ];

  var posts = [
    { id: 'demo-post1', title: 'FCリベルタ戦 3-1で勝利！', body: '本日の試合、3-1で勝利しました。応援ありがとうございました。', category: '試合結果', date: isoDaysAgo(6), published: true },
  ];

  localStorage.setItem(PREFIX + 'players', JSON.stringify(players));
  localStorage.setItem(PREFIX + 'matches', JSON.stringify(matches));
  localStorage.setItem(PREFIX + 'schedules', JSON.stringify(schedules));
  localStorage.setItem(PREFIX + 'posts', JSON.stringify(posts));
  localStorage.setItem(PREFIX + 'opponents', JSON.stringify(opponents));
})();

// デモデータを初期状態にリセットする（設定画面のボタンから呼び出す）
function resetDemoData() {
  ['players', 'matches', 'schedules', 'posts', 'opponents'].forEach(function (k) {
    localStorage.removeItem('mp2_demo_' + k);
  });
  location.reload();
}
