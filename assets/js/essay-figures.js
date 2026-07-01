(function () {
  var body = document.querySelector('[data-essay-body]');
  if (!body) return;

  var nodes = Array.from(body.childNodes).filter(function (n) {
    return n.nodeType === Node.ELEMENT_NODE;
  });

  function extractImg(node) {
    var tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'img') return node;
    if (tag === 'figure') return node.querySelector('img');
    if (tag === 'p') return node.querySelector('img');
    return null;
  }

  function isStandaloneImage(node) {
    var tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'img') return true;
    if (tag === 'figure') return !!node.querySelector('img');
    if (tag === 'p') {
      var imgs = node.querySelectorAll('img');
      if (imgs.length !== 1) return false;
      // Only an image (and optional alt/whitespace) — no real text
      return node.textContent.trim() === '' || node.childNodes.length <= 2;
    }
    return false;
  }

  // Group nodes into reigns: each reign = text paragraphs + trailing images.
  // Consecutive standalone images all belong to the same reign's rail.
  var reigns = [];
  var current = { paras: [], imgs: [] };

  nodes.forEach(function (node) {
    if (isStandaloneImage(node)) {
      var img = extractImg(node);
      if (img) current.imgs.push(img);
    } else {
      // Flush accumulated images into the current reign before starting prose
      if (current.imgs.length > 0) {
        reigns.push(current);
        current = { paras: [], imgs: [] };
      }
      current.paras.push(node);
    }
  });

  if (current.paras.length > 0 || current.imgs.length > 0) {
    reigns.push(current);
  }

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

    reign.imgs.forEach(function (imgNode) {
      figNum++;
      var figure = document.createElement('figure');
      figure.className = 'essay-figure';

      var img = imgNode.cloneNode(true);
      figure.appendChild(img);

      var cap = document.createElement('figcaption');
      var numSpan = document.createElement('span');
      numSpan.className = 'fig-num';
      numSpan.textContent = 'fig. ' + figNum;
      cap.appendChild(numSpan);
      if (imgNode.alt) {
        cap.appendChild(document.createTextNode(' — ' + imgNode.alt));
      }
      figure.appendChild(cap);

      railCol.appendChild(figure);
    });

    row.appendChild(textCol);
    row.appendChild(railCol);
    body.appendChild(row);
  });
})();
