/* ===== 主题切换（自动 → 浅色 → 深色） ===== */
(function () {
  var KEY = 'home-theme';
  var ORDER = ['auto', 'light', 'dark'];
  var LABEL = { auto: '自动（跟随系统）', light: '浅色', dark: '深色' };
  var btn = document.getElementById('themeToggle');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function pref() {
    try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; }
  }
  function apply() {
    var p = pref();
    var dark = p === 'dark' || (p === 'auto' && mq.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.setAttribute('data-mode', p);
    btn.title = '主题：' + LABEL[p] + '，点击切换';
    btn.setAttribute('aria-label', '切换主题，当前：' + LABEL[p]);
  }
  btn.addEventListener('click', function () {
    var p = pref();
    var next = ORDER[(ORDER.indexOf(p) + 1) % ORDER.length];
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply();
  });
  if (mq.addEventListener) { mq.addEventListener('change', apply); } else if (mq.addListener) { mq.addListener(apply); }
  apply();

  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* ===== 状态栏时钟 ===== */
(function () {
  var el = document.getElementById('clock');
  function tick() {
    var d = new Date();
    function p(n) { return n < 10 ? '0' + n : n; }
    el.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  tick();
  setInterval(tick, 1000);
})();

/* ===== 一言：仅文学(d) + 诗词(i) ===== */
(function () {
  var API = 'https://v1.hitokoto.cn/?c=d&c=i';
  var block = document.getElementById('hitokoto');
  var textEl = document.getElementById('hitokotoText');
  var fromEl = document.getElementById('hitokotoFrom');
  var refreshBtn = document.getElementById('hitokotoRefresh');

  function load() {
    block.classList.remove('show');
    refreshBtn.classList.add('loading');
    fetch(API)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        textEl.textContent = d.hitokoto;
        fromEl.textContent = d.from ? '# source: ' + d.from : '';
      })
      .catch(function () {
        textEl.textContent = '生活明朗，万物可爱。';
        fromEl.textContent = '# source: 佚名';
      })
      .then(function () {
        refreshBtn.classList.remove('loading');
        void block.offsetWidth;
        block.classList.add('show');
      });
  }

  refreshBtn.addEventListener('click', load);
  load();
})();
