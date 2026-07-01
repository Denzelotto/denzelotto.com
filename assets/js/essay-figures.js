(function () {
  var STICKY_TOP = 80; // px from viewport top when sticking
  var FIGURE_GAP = 28; // gap between images — matches CSS .essay-figure + .essay-figure margin

  var body = document.querySelector('[data-essay-body]');
  if (!body) return;

  var nodes = Array.from(body.childNodes).filter(function (n) {
    return n.nodeType === Node.ELEMENT_NODE;
  });

  // Returns all images from a node if it is an image-only block.
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

  body.innerHTML = '';

  var textFlow = document.createElement('div');
  textFlow.className = 'essay-text-flow';

  var rail = document.createElement('div');
  rail.className = 'essay-rail';

  var figNum = 0;
  var nodeCount = 0;
  var figureGroups = [];

  reigns.forEach(function (reign) {
    reign.nodes.forEach(function (n) {
      textFlow.appendChild(n);
      nodeCount++;
    });

    if (reign.imgs.length > 0) {
      // Each figure group gets its own section — an absolutely-positioned
      // container that acts as the sticky boundary.
      var section = document.createElement('div');
      section.className = 'essay-rail-section';

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

      section.appendChild(group);
      rail.appendChild(section);
      figureGroups.push({
        section: section,
        group: group,
        anchorIndex: Math.max(0, nodeCount - 1)
      });
    }
  });

  body.appendChild(textFlow);
  body.appendChild(rail);

  function positionFigures() {
    var textNodes = Array.from(textFlow.children);
    var totalHeight = textFlow.offsetHeight;
    var prevBottom = 0;

    figureGroups.forEach(function (item, i) {
      var anchor = textNodes[item.anchorIndex];
      var anchorTop = anchor ? anchor.offsetTop : 0;

      var nextItem = figureGroups[i + 1];
      var nextAnchor = nextItem ? textNodes[nextItem.anchorIndex] : null;
      var nextTop = nextAnchor ? nextAnchor.offsetTop : totalHeight;

      var groupHeight = item.group.offsetHeight;

      // Each section starts FIGURE_GAP px after the previous ends, so the gap
      // between the last image of one group and the first of the next stays
      // consistent with the within-group gap set in CSS.
      var gap = i === 0 ? 0 : FIGURE_GAP;
      var sectionTop = Math.max(anchorTop, prevBottom + gap);
      var sectionHeight = Math.max(nextTop - anchorTop, groupHeight + STICKY_TOP + 20);

      item.section.style.top = sectionTop + 'px';
      item.section.style.height = sectionHeight + 'px';

      prevBottom = sectionTop + sectionHeight;
    });

    // Keep the rail from stretching the grid row beyond the text column.
    rail.style.height = totalHeight + 'px';
  }

  // Double rAF for layout; load event catches Firefox image-height timing.
  requestAnimationFrame(function () {
    requestAnimationFrame(positionFigures);
  });
  window.addEventListener('load', positionFigures);
  window.addEventListener('resize', positionFigures);
})();
