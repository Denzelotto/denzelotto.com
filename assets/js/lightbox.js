(function () {
  var overlay = document.createElement('div');
  overlay.className = 'lb';
  overlay.innerHTML = '<img class="lb-img" src="" alt=""><button class="lb-close" aria-label="Close">✕</button>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('.lb-img');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('lb--open');
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lb--open');
    document.documentElement.style.overflow = '';
  }

  // Click the backdrop (not the image) to close
  overlay.addEventListener('click', function (e) {
    if (e.target !== img) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  // Wire any element with class js-lb: use src (for <img>) or data-lb-src
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.js-lb');
    if (!el) return;
    var src = el.dataset.lbSrc || el.src;
    var alt = el.dataset.lbAlt || el.alt || '';
    if (src) open(src, alt);
  });

  window.Lightbox = { open: open, close: close };
})();
