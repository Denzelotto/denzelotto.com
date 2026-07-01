(function () {
  var body = document.querySelector('[data-essay-body]');
  if (!body) return;

  var nodes = Array.from(body.childNodes).filter(function (n) {
    return n.nodeType === Node.ELEMENT_NODE;
  });

  // Returns all rail images from a node if it is an image-only block.
  function extractRailImgs(node) {
    var tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'img') return [node];
    if (tag === 'figure') {
      var img = node.querySelector('img');
      return img ? [img] : [];
    }
    if (tag === 'p') {
      var imgs = Array.from(node.querySelectorAll('img'));
      if (imgs.length > 0 && node.textContent.trim() === '') return imgs;
    }
    return [];
  }

  // Group nodes into reigns: text nodes then their trailing images.
  var reigns = [];
  var current = { nodes: [], imgs: [] };

  nodes.forEach(function (node) {
    var railImgs = extractRailImgs(node);
    if (railImgs.length > 0) {
      railImgs.forEach(function (img) { current.imgs.push(img); });
    } else {
      if (current.imgs.length > 0) {
        reigns.push(current);
        current = { nodes: [], imgs: [] };
      }
      current.nodes.push(node);
    }
  });
  if (current.nodes.length > 0 || current.imgs.length > 0) {
    reigns.push(current);
  }

  // Build layout: continuous text flow on the left, rail on the right.
  // The rail uses absolute positioning so it never affects text column height.
  body.innerHTML = '';

  var textFlow = document.createElement('div');
  textFlow.className = 'essay-text-flow';

  var rail = document.createElement('div');
  rail.className = 'essay-rail';

  var figNum = 0;
  var nodeCount = 0;
  var figureGroups = []; // { el, anchorIndex } — anchored to last text node before imgs

  reigns.forEach(function (reign) {
    reign.nodes.forEach(function (n) {
      textFlow.appendChild(n);
      nodeCount++;
    });

    if (reign.imgs.length > 0) {
      var group = document.createElement('div');
      group.className = 'essay-figure-group';

      reign.imgs.forEach(function (imgNode) {
        figNum++;
        var figure = document.createElement('figure');
        figure.className = 'essay-figure';
        figure.appendChild(imgNode.cloneNode(true));

        var cap = document.createElement('figcaption');
        var numSpan = document.createElement('span');
        numSpan.className = 'fig-num';
        numSpan.textContent = 'fig. ' + figNum;
        cap.appendChild(numSpan);
        if (imgNode.alt) {
          cap.appendChild(document.createTextNode(' — ' + imgNode.alt));
        }
        figure.appendChild(cap);
        group.appendChild(figure);
      });

      rail.appendChild(group);
      figureGroups.push({ el: group, anchorIndex: Math.max(0, nodeCount - 1) });
    }
  });

  body.appendChild(textFlow);
  body.appendChild(rail);

  // Position figure groups in the rail, aligned to their anchor text node.
  // Run after the browser has laid out the text flow.
  function positionFigures() {
    var textNodes = Array.from(textFlow.children);
    var prevBottom = 0;

    figureGroups.forEach(function (item) {
      var anchor = textNodes[item.anchorIndex];
      var intended = anchor ? anchor.offsetTop : 0;
      var top = Math.max(intended, prevBottom);
      item.el.style.top = top + 'px';
      prevBottom = top + item.el.offsetHeight + 28;
    });
  }

  // Double rAF ensures layout is complete before measuring.
  requestAnimationFrame(function () {
    requestAnimationFrame(positionFigures);
  });

  window.addEventListener('resize', positionFigures);
})();
