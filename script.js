/* ==========================================================================
   主题初始化
   优先读取用户手动选择，否则跟随系统偏好
   ========================================================================== */

(function () {
  var stored = localStorage.getItem('theme');
  var theme;
  if (stored === 'dark' || stored === 'light') {
    theme = stored;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

/* ==========================================================================
   一言 API —— 限定古诗词分类（c=i）
   ========================================================================== */

(function () {
  var el = document.getElementById('hitokoto');

  fetch('https://v1.hitokoto.cn/?c=i')
    .then(function (res) {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(function (data) {
      var text = data.hitokoto;
      var from = data.from;
      el.textContent = from ? text + ' —— ' + from : text;
    })
    .catch(function () {
      el.textContent = '人生若只如初见，何事秋风悲画扇。 —— 纳兰性德';
    })
    .finally(function () {
      el.classList.add('visible');
    });
})();

/* ==========================================================================
   主题切换按钮 & 系统偏好监听
   ========================================================================== */

(function () {
  var toggle = document.getElementById('themeToggle');

  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
})();
