(function () {
  var body = document.querySelector('[data-essay-body]');
  if (!body) return;

  var nodes = Array.from(body.childNodes).filter(function (n) {
    return n.nodeType === Node.ELEMENT_NODE;
  });

  // Returns all images from a node if it is a standalone image block
  // (a <p> containing only <img> tags, or a bare <img> or <figure>).
  // Returns [] if the node has real text content mixed in.
  function extractRailImgs(node) {
    var tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'img') return [node];
    if (tag === 'figure') {
      var img = node.querySelector('img');
      return img ? [img] : [];
    }
    if (tag === 'p') {
      var imgs = Array.from(node.querySelectorAll('img'));
      if (imgs.length === 0) return [];
      // Only images — no real text content
      if (node.textContent.trim() === '') return imgs;
    }
    return [];
  }

  // Group nodes into reigns: text paragraphs + their trailing rail images.
  // Consecutive standalone image nodes (including multi-image <p> blocks)
  // all collect into the same reign.
  var reigns = [];
  var current = { paras: [], imgs: [] };

  nodes.forEach(function (node) {
    var railImgs = extractRailImgs(node);
    if (railImgs.length > 0) {
      railImgs.forEach(function (img) { current.imgs.push(img); });
    } else {
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
