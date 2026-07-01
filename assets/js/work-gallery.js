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
})();
