(function () {
  'use strict';

  /* 1. 移动端导航 */
  var toggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 2. 淡入效果 */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* 3. 技能条动画 */
  var fills = document.querySelectorAll('.skill-fill');
  if ('IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = (entry.target.getAttribute('data-w') || 0) + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function (el) { barObserver.observe(el); });
  } else {
    fills.forEach(function (el) {
      el.style.width = (el.getAttribute('data-w') || 0) + '%';
    });
  }

  /* 4. 背景音乐开关（浏览器禁止自动播放，首次交互后播放） */
  var bgm = document.getElementById('bgm');
  var musicBtn = document.getElementById('musicBtn');
  if (bgm && musicBtn) {
    var started = false;
    function playMusic() {
      if (started) return;
      started = true;
      bgm.volume = 0.4;
      var p = bgm.play();
      if (p && p.then) {
        p.then(function () {
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-label', '暂停背景音乐');
        }).catch(function () { started = false; });
      }
    }
    musicBtn.addEventListener('click', function () {
      if (bgm.paused) {
        playMusic();
      } else {
        bgm.pause();
        started = false;
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('aria-label', '播放背景音乐');
      }
    });
    /* 页面任意首次点击/按键后自动开启轻音乐 */
    function autoStart() {
      if (started) return;
      if (bgm.paused) playMusic();
    }
    document.addEventListener('click', autoStart, { once: true });
    document.addEventListener('keydown', autoStart, { once: true });
  }

  /* 5. 联系表单（前端校验） */
  var form = document.getElementById('contactForm');
  if (form) {
    var success = document.getElementById('formSuccess');
    var nameInput = document.getElementById('fName');
    var emailInput = document.getElementById('fEmail');
    var msgInput = document.getElementById('fMsg');

    function showError(input, id, message) {
      var box = document.getElementById(id);
      if (!box) return;
      box.textContent = message;
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var msg = msgInput.value.trim();

      if (!name) { showError(nameInput, 'errName', '请填写你的姓名'); ok = false; }
      else showError(nameInput, 'errName', '');

      if (!email) { showError(emailInput, 'errEmail', '请填写邮箱'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailInput, 'errEmail', '邮箱格式不正确'); ok = false; }
      else showError(emailInput, 'errEmail', '');

      if (!msg) { showError(msgInput, 'errMsg', '请写下你想说的话'); ok = false; }
      else showError(msgInput, 'errMsg', '');

      if (ok) {
        success.style.display = 'block';
        success.textContent = '已收到你的留言「' + (msg.length > 18 ? msg.slice(0, 18) + '…' : msg) + '」，我会尽快回复你。';
        form.reset();
        setTimeout(function () { success.style.display = 'none'; }, 6000);
      }
    });

    [nameInput, emailInput, msgInput].forEach(function (input) {
      input.addEventListener('input', function () {
        var id = input.id === 'fName' ? 'errName' : input.id === 'fEmail' ? 'errEmail' : 'errMsg';
        showError(input, id, '');
      });
    });
  }
})();
