/* La millor Tiana — interaccions */
(function () {
  'use strict';
  window.__lmt = true;
  var root = document.documentElement;

  /* ---------- Aparicions i comptadors ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var dur = 1700;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var blocks = document.querySelectorAll('[data-key]');
  if (root.classList.contains('anim') && 'IntersectionObserver' in window) {
    document.querySelectorAll('[data-key] [data-count], [data-key][data-count]').forEach(function (el) {
      el.textContent = '0';
    });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var block = entry.target;
        block.classList.add('in');
        block.querySelectorAll('[data-count]').forEach(countUp);
        revealer.unobserve(block);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    blocks.forEach(function (block) { revealer.observe(block); });
  } else {
    root.classList.remove('anim');
  }

  /* ---------- Menú actiu segons la secció ---------- */
  var navLinks = document.querySelectorAll('.hdr__nav a');
  var byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Menú mòbil ---------- */
  var menu = document.getElementById('menu');
  var burger = document.querySelector('.hdr__burger');
  var closeBtn = menu ? menu.querySelector('.menu__close') : null;

  function openMenu() {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(function () { menu.classList.add('open'); });
    closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    menu.classList.remove('open');
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) burger.focus();
  }
  if (menu && burger && closeBtn) {
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(true); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu(true);
      if (e.key === 'Tab' && !menu.hidden) {
        var focusables = menu.querySelectorAll('a[href], button');
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
      if (mq.matches && !menu.hidden) closeMenu(false);
    });
  }
})();
