(function () {
  // Transforms the essay body: pulls each <img> out of the prose flow
  // and places it in a right-rail figure column, top-aligned with the
  // paragraph it followed. Figures are auto-numbered.

  var body = document.querySelector('[data-essay-body]');
  if (!body) return;

  // Collect all top-level children (paragraphs + images)
  var nodes = Array.from(body.childNodes).filter(function (n) {
    return n.nodeType === Node.ELEMENT_NODE;
  });

  // Walk nodes and group into "reigns":
  // A reign = one image (or null) + the paragraphs that precede/follow it
  // before the next image. Images must directly follow a <p>.
  var reigns = [];
  var current = { paras: [], img: null };

  nodes.forEach(function (node) {
    var tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'p') {
      // Check if the only child (or only meaningful child) is an <img>
      var imgs = node.querySelectorAll('img');
      var textContent = node.textContent.trim();
      if (imgs.length === 1 && textContent === '') {
        // Standalone image paragraph — close current reign, attach image
        current.img = imgs[0];
        reigns.push(current);
        current = { paras: [], img: null };
      } else if (imgs.length === 1 && node.childNodes.length <= 2) {
        // Image with alt text only — treat same as standalone
        current.img = imgs[0];
        reigns.push(current);
        current = { paras: [], img: null };
      } else {
        current.paras.push(node);
      }
    } else if (tag === 'figure' || tag === 'img') {
      var img = tag === 'img' ? node : node.querySelector('img');
      if (img) {
        current.img = img;
        reigns.push(current);
        current = { paras: [], img: null };
      }
    } else {
      current.paras.push(node);
    }
  });

  // Flush trailing reign (may have no image)
  if (current.paras.length > 0 || current.img) {
    reigns.push(current);
  }

  // Clear the body and rebuild with reign grid rows
  body.innerHTML = '';

  var figNum = 0;

  reigns.forEach(function (reign) {
    var row = document.createElement('div');
    row.className = 'essay-reign';

    var textCol = document.createElement('div');
    textCol.className = 'essay-reign-text';
    reign.paras.forEach(function (p) { textCol.appendChild(p); });

    var railCol = document.createElement('div');
    railCol.className = 'essay-reign-rail';

    if (reign.img) {
      figNum++;
      var figure = document.createElement('figure');
      figure.className = 'essay-figure';

      var img = reign.img.cloneNode(true);
      figure.appendChild(img);

      var cap = document.createElement('figcaption');
      var numSpan = document.createElement('span');
      numSpan.className = 'fig-num';
      numSpan.textContent = 'fig. ' + figNum;
      cap.appendChild(numSpan);
      if (reign.img.alt) {
        cap.appendChild(document.createTextNode(' — ' + reign.img.alt));
      }
      figure.appendChild(cap);

      railCol.appendChild(figure);
    }

    row.appendChild(textCol);
    row.appendChild(railCol);
    body.appendChild(row);
  });
})();
