/* Light / dark theme: remembers the choice, otherwise follows the device setting. */
(function () {
  var KEY = 'abhim-theme';
  var root = document.documentElement;
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function initial() { return stored() || (mq && mq.matches ? 'light' : 'dark'); }
  function apply(t) {
    root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f5f7fc' : '#05060a');
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      b.setAttribute('title', t === 'light' ? 'Dark mode' : 'Light mode');
    });
  }
  apply(initial()); // runs in <head>, before paint, so there is no flash

  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) { if (!stored()) apply(e.matches ? 'light' : 'dark'); });

  function toggle() {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.classList.add('theme-anim');
    apply(next); save(next);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.innerHTML = '<span class="moon" aria-hidden="true">☾</span><span class="sun" aria-hidden="true">☀</span>';
    btn.addEventListener('click', toggle);
    var host = document.querySelector('.bar .acts') || document.querySelector('nav .wrap');
    if (host) host.appendChild(btn); else { btn.classList.add('floating'); document.body.appendChild(btn); }
    apply(root.getAttribute('data-theme'));
  });
})();
