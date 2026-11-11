/* ===== 主题切换（浅色 ⇄ 深色，未选择时跟随系统） ===== */
(() => {
  const KEY = 'home-theme';
  const btn = document.getElementById('themeToggle');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const stored = () => {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) { return null; }
  };
  const isDark = () => {
    const v = stored();
    return v ? v === 'dark' : mq.matches;
  };
  const apply = () => {
    const dark = isDark();
    const root = document.documentElement;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    // 主题色取自 CSS 变量，保证单一来源
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
    btn.setAttribute('aria-label', '切换主题，当前：' + (dark ? '深色' : '浅色'));
  };
  btn.addEventListener('click', () => {
    try { localStorage.setItem(KEY, isDark() ? 'light' : 'dark'); } catch (e) {}
    apply();
  });
  mq.addEventListener('change', apply);
  apply();

  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* ===== 移动端：主题按钮并入名片头行右侧（桌面端还原到 body 原位） ===== */
(() => {
  const btn = document.getElementById('themeToggle');
  const head = document.querySelector('.card .head');
  const mq = matchMedia('(max-width: 480px)');
  const place = () => {
    const inHead = btn.parentElement === head;
    if (mq.matches && !inHead) head.appendChild(btn);
    else if (!mq.matches && inHead) document.body.prepend(btn); // 原位：body 第一个子元素
  };
  mq.addEventListener('change', place);
  addEventListener('resize', place); // 兜底：个别环境视口变化不触发 mq change
  place();
})();

/* ===== 计时器：状态栏时钟（东八区）+ 页脚运行时间 ===== */
(() => {
  const clockEl = document.getElementById('clock');
  const uptimeEl = document.getElementById('uptime');
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const START = new Date('2020-08-06'); // 建站日期，可按需修改
  const pad = (n) => String(n).padStart(2, '0');
  const uptime = () => {
    let ms = Date.now() - START.getTime();
    const d = Math.floor(ms / 86400000);
    ms -= d * 86400000;
    const h = Math.floor(ms / 3600000);
    ms -= h * 3600000;
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms - m * 60000) / 1000);
    return d + ' 天 ' + pad(h) + ':' + pad(m) + ':' + pad(s);
  };
  const tick = () => {
    clockEl.textContent = fmt.format(new Date());
    uptimeEl.textContent = uptime();
  };
  tick();
  setInterval(tick, 1000);
})();

/* ===== 一言：仅文学(d) + 诗词(i) ===== */
(() => {
  const API = 'https://v1.hitokoto.cn/?c=d&c=i';
  const block = document.getElementById('hitokoto');
  const textEl = document.getElementById('hitokotoText');
  const fromEl = document.getElementById('hitokotoFrom');
  const refreshBtn = document.getElementById('hitokotoRefresh');

  const load = async () => {
    block.classList.remove('show');
    refreshBtn.classList.add('loading');
    try {
      const r = await fetch(API, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      textEl.textContent = d.hitokoto;
      fromEl.textContent = d.from ? '# source: ' + d.from : '';
    } catch (e) {
      textEl.textContent = '生活明朗，万物可爱。';
      fromEl.textContent = '# source: 佚名';
    } finally {
      refreshBtn.classList.remove('loading');
      void block.offsetWidth; // 强制 reflow，重播入场过渡
      block.classList.add('show');
    }
  };

  refreshBtn.addEventListener('click', load);
  load();
})();
