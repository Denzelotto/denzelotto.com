(function () {
  var mainImg = document.getElementById('work-main-image');
  var thumbs = document.querySelectorAll('.work-thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      mainImg.src = thumb.dataset.src;
      thumbs.forEach(function (t) { t.classList.remove('work-thumb--active'); });
      thumb.classList.add('work-thumb--active');
    });
  });

  // Clicking the main image opens the lightbox with the current src
  mainImg.addEventListener('click', function () {
    if (window.Lightbox) window.Lightbox.open(mainImg.src, mainImg.alt);
  });
})();
