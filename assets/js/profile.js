/*
 * GanjaGuardian data-driven strain profile page.
 * The page reads ?strain=<slug> and renders every section from data.js.
 */
(function () {
  'use strict';

  var GG = window.GG;
  var el = GG.el;

  function icon(name) {
    return GG.icon(name);
  }

  function marker(key) {
    var span = el('span', 'marker marker--' + key);
    span.setAttribute('aria-hidden', 'true');
    return span;
  }

  function infoDetails(label, text) {
    var details = el('details', 'info');
    var summary = el('summary', 'info__button');
    summary.appendChild(icon('info'));
    summary.appendChild(el('span', 'sr-only', label));
    details.appendChild(summary);
    details.appendChild(el('p', 'info__panel', text));
    return details;
  }

  function noteWithIcon(text) {
    var note = el('p', 'section-note');
    var infoIcon = icon('info');
    infoIcon.classList.add('icon--inline');
    note.appendChild(infoIcon);
    note.appendChild(document.createTextNode(' ' + text));
    return note;
  }

  function identityTile(strain, variant) {
    var tile = el('div', 'identity-tile' + (variant ? ' identity-tile--' + variant : ''));
    tile.setAttribute('role', 'img');
    tile.setAttribute(
      'aria-label',
      strain.name + ' identity tile. ' + strain.classification + '. Element symbol ' + strain.abbreviation + '.'
    );

    var type = el('span', 'identity-tile__type', strain.classification);
    type.setAttribute('aria-hidden', 'true');
    var symbol = el('span', 'identity-tile__symbol', strain.abbreviation);
    symbol.setAttribute('aria-hidden', 'true');
    var name = el('span', 'identity-tile__name', strain.name);
    name.setAttribute('aria-hidden', 'true');

    tile.appendChild(type);
    tile.appendChild(symbol);
    tile.appendChild(name);
    return tile;
  }

  function overviewList(title, keys, kind) {
    var block = el('div', 'overview__list');
    block.appendChild(el('h3', 'mini-heading', title));

    var list = el('ul', 'icon-list');
    if (!keys.length) {
      list.appendChild(el('li', 'icon-row icon-row--muted', 'Not available'));
    } else {
      keys.forEach(function (key) {
        var entry = kind === 'flavour' ? GG.flavour(key) : GG.effect(key);
        var row = el('li', 'icon-row');
        var rowIcon = icon(entry.icon);
        rowIcon.classList.add('icon--row');
        row.appendChild(rowIcon);
        row.appendChild(el('span', null, entry.label));
        list.appendChild(row);
      });
    }
    block.appendChild(list);
    return block;
  }

  function terpeneLegend(terpenes) {
    var legend = el('div', 'terpene-legend');
    legend.appendChild(el('span', 'terpene-legend__label', 'Terpenes'));

    if (!terpenes.length) {
      legend.appendChild(el('span', 'muted', 'Not available'));
      return legend;
    }

    terpenes.forEach(function (entry) {
      var terpene = GG.terpene(entry.key);
      var item = el('span', 'terpene-legend__item');
      item.appendChild(marker(entry.key));
      item.appendChild(el('span', null, terpene.label));
      legend.appendChild(item);
    });
    return legend;
  }

  function indicator(left, right, value) {
    var percent = Math.max(0, Math.min(100, Number(value)));
    if (!isFinite(percent)) {
      percent = 0;
    }

    var wrap = el('div', 'indicator');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute(
      'aria-label',
      left + ' to ' + right + ' reference indicator positioned about ' + Math.round(percent) +
        ' percent from ' + left + '. Illustrative only, not a measurement.'
    );

    var track = el('span', 'indicator__track');
    track.setAttribute('aria-hidden', 'true');
    var fill = el('span', 'indicator__fill');
    fill.style.width = percent + '%';
    track.appendChild(fill);

    wrap.appendChild(el('span', 'indicator__label', left));
    wrap.appendChild(track);
    wrap.appendChild(el('span', 'indicator__label', right));
    return wrap;
  }

  function iconCard(entry) {
    var card = el('li', 'icon-card');
    var cardIcon = icon(entry.icon);
    cardIcon.classList.add('icon-card__icon');
    card.appendChild(cardIcon);
    card.appendChild(el('span', 'icon-card__label', entry.label));
    return card;
  }

  function cardGrid(keys, kind) {
    if (!keys.length) {
      return el('p', 'muted', 'Not available.');
    }
    var list = el('ul', 'icon-card-grid');
    keys.forEach(function (key) {
      list.appendChild(iconCard(kind === 'flavour' ? GG.flavour(key) : GG.effect(key)));
    });
    return list;
  }

  function positiveArray(strain) {
    return strain.effects && strain.effects.positive ? strain.effects.positive : [];
  }

  function negativeArray(strain) {
    return strain.effects && strain.effects.negative ? strain.effects.negative : [];
  }

  function terpeneSentence(strain) {
    var terpenes = (strain.terpenes || []).map(function (entry) {
      return GG.terpene(entry.key);
    });

    if (!terpenes.length) {
      return 'No terpene reference profile is available for this strain.';
    }
    if (terpenes.length === 1) {
      return 'The dominant aroma here is ' + terpenes[0].label.toLowerCase() + '.';
    }
    if (terpenes.length === 2) {
      return (
        terpenes[0].label + ' leads the aroma, with ' + terpenes[1].label.toLowerCase() +
        ' close behind.'
      );
    }
    var sentence =
      terpenes[0].label + ' is the headliner, with ' + terpenes[1].label.toLowerCase() +
      ' and ' + terpenes[2].label.toLowerCase() + ' in the mix';
    if (terpenes.length > 3) {
      sentence += ', among others';
    }
    return sentence + '.';
  }

  function terpeneList(strain) {
    var list = el('ul', 'terpene-list');
    var entries = strain.terpenes || [];

    if (!entries.length) {
      list.appendChild(el('li', 'muted', 'Not available'));
      return list;
    }

    entries.forEach(function (entry) {
      var terpene = GG.terpene(entry.key);
      var item = el('li', 'terpene' + (entry.prominent ? ' terpene--featured' : ''));
      item.appendChild(marker(entry.key));

      var body = el('div', 'terpene__body');
      var heading = el('p', 'terpene__heading');
      heading.appendChild(el('span', 'terpene__name', terpene.label));
      heading.appendChild(document.createTextNode(' '));
      heading.appendChild(el('span', 'terpene__aroma', '(' + terpene.aroma + ')'));
      body.appendChild(heading);

      if (entry.description) {
        body.appendChild(el('p', 'terpene__desc', entry.description));
      }

      item.appendChild(body);
      list.appendChild(item);
    });
    return list;
  }

  function treeNode(node, relation, strain, isRoot) {
    var colors = ['magenta', 'yellow', 'blue'];
    var color = colors.indexOf(node.color) !== -1 ? node.color : 'magenta';

    var item = el('li', 'tree-node' + (isRoot ? ' tree-node--root' : ''));
    var diamond = el('span', 'tree-node__diamond tree-node__diamond--' + color, node.abbr);
    diamond.setAttribute('aria-hidden', 'true');
    item.appendChild(diamond);

    var target = node.slug ? GG.findStrain(node.slug) : null;
    if (target && target.slug !== strain.slug) {
      var link = el('a', 'tree-node__name', target.name);
      link.href = 'strain.html?strain=' + encodeURIComponent(target.slug);
      item.appendChild(link);
    } else {
      item.appendChild(el('span', 'tree-node__name', node.name));
    }

    item.appendChild(el('span', 'tree-node__relation', relation));
    return item;
  }

  function treeRow(nodes, relation, strain) {
    var row = el('ul', 'tree-row');
    nodes.forEach(function (node) {
      row.appendChild(treeNode(node, relation, strain, false));
    });
    return row;
  }

  function treeConnector(kind) {
    var connector = el('div', 'tree-connector tree-connector--' + kind);
    connector.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 3; i += 1) {
      connector.appendChild(el('span'));
    }
    return connector;
  }

  function geneticsDescription(strain) {
    var genetics = strain.genetics || {};
    var parents = genetics.parents || [];
    var children = genetics.children || [];
    var parts = ['Family tree.'];

    if (parents.length) {
      parts.push(
        parents.map(function (node) { return node.name; }).join(' and ') +
        (parents.length === 1 ? ' is shown as a parent strain of ' : ' are shown as parent strains of ') +
        strain.name + '.'
      );
    }
    if (children.length) {
      parts.push(
        children.map(function (node) { return node.name; }).join(' and ') +
        (children.length === 1 ? ' is shown as a descendant of ' : ' are shown as descendants of ') +
        strain.name + '.'
      );
    }
    if (!parents.length && !children.length) {
      parts.push('No lineage reference is available for this strain.');
    }
    parts.push('Lineage is reported and not genetically verified.');
    return parts.join(' ');
  }

  function buildGeneticsSection(strain) {
    var section = el('section', 'profile-section profile-section--genetics');
    section.setAttribute('aria-labelledby', 'genetics-heading');

    var head = el('div', 'section-head');
    var heading = el('h2', null, strain.name + ' family tree');
    heading.id = 'genetics-heading';
    head.appendChild(heading);
    section.appendChild(head);

    var genetics = strain.genetics;
    var parents = genetics && genetics.parents ? genetics.parents : [];
    var children = genetics && genetics.children ? genetics.children : [];

    if (!parents.length && !children.length) {
      section.appendChild(el('p', 'muted', 'Not available.'));
      return section;
    }

    var figure = el('figure', 'tree-figure');
    figure.setAttribute('aria-describedby', 'genetics-description');

    var tree = el('div', 'tree');

    if (parents.length) {
      tree.appendChild(treeRow(parents, 'parent', strain));
      tree.appendChild(treeConnector(parents.length === 2 ? 'merge' : 'drop'));
    }

    var root = { name: strain.name, abbr: strain.abbreviation, color: 'blue' };
    var rootWrap = el('div', 'tree-root');
    var rootRow = el('ul', 'tree-row tree-row--root');
    rootRow.appendChild(treeNode(root, strain.classification, strain, true));
    rootWrap.appendChild(rootRow);
    tree.appendChild(rootWrap);

    if (children.length) {
      tree.appendChild(treeConnector(children.length === 2 ? 'split' : 'drop'));
      tree.appendChild(treeRow(children, 'child', strain));
    }

    figure.appendChild(tree);

    var caption = el('figcaption', 'tree-caption');
    if (genetics.note) {
      caption.appendChild(el('p', 'source-note', genetics.note));
    }
    var description = el('p', 'sr-only', geneticsDescription(strain));
    description.id = 'genetics-description';
    caption.appendChild(description);
    figure.appendChild(caption);

    section.appendChild(figure);
    return section;
  }

  function buildGrowSection(strain) {
    var section = el('section', 'profile-section profile-section--grow');
    section.setAttribute('aria-labelledby', 'grow-heading');

    var heading = el('h2', 'grow-heading', 'Growing ' + strain.name);
    heading.id = 'grow-heading';
    section.appendChild(heading);

    var grow = strain.grow;
    if (!grow || !grow.attributes || !grow.attributes.length) {
      section.appendChild(el('p', 'muted', 'Not available.'));
      return section;
    }

    var attributes = el('ul', 'grow-attributes');
    grow.attributes.forEach(function (attribute) {
      var item = el('li', 'grow-attribute');
      item.appendChild(el('h3', 'grow-attribute__label', attribute.label));

      var options = el('div', 'grow-options');
      options.setAttribute('role', 'group');
      options.setAttribute('aria-label', attribute.label + ' reference value: ' + attribute.selected);
      (attribute.options || []).forEach(function (option) {
        var selected = option === attribute.selected;
        var value = el('span', 'grow-option' + (selected ? ' is-selected' : ''), option);
        if (selected) {
          value.appendChild(el('span', 'sr-only', ', reference value'));
        }
        options.appendChild(value);
      });
      item.appendChild(options);
      attributes.appendChild(item);
    });
    section.appendChild(attributes);

    if (grow.notes && grow.notes.length) {
      var notes = el('div', 'grow-notes');
      notes.appendChild(el('h3', 'grow-notes__title', 'Grow notes'));
      var list = el('ul', 'note-list');
      grow.notes.forEach(function (note) {
        list.appendChild(el('li', null, note));
      });
      notes.appendChild(list);
      section.appendChild(notes);
    }

    if (grow.note) {
      section.appendChild(el('p', 'source-note', grow.note));
    }
    return section;
  }

  function buildHero(strain) {
    var hero = el('header', 'profile-hero');

    var heading = el('h1', 'profile-title', strain.name + ' strain');
    heading.id = 'profile-title';
    hero.appendChild(heading);

    if (strain.tagline) {
      hero.appendChild(el('p', 'profile-tagline', strain.tagline));
    }

    if (strain.aliases && strain.aliases.length) {
      hero.appendChild(el('p', 'profile-alias', 'Also known as ' + strain.aliases.join(', ')));
    }

    var meta = el('div', 'profile-meta');
    meta.appendChild(GG.badgeFor(strain));
    meta.appendChild(el('span', 'meta-value', 'THC ' + GG.formatPct(strain.thc)));
    meta.appendChild(el('span', 'meta-value', 'CBD ' + GG.formatPct(strain.cbd)));
    meta.appendChild(
      infoDetails(
        'About potency values',
        'THC and CBD figures on this page are rounded reference examples. They are not laboratory ' +
          'results, certifications or batch measurements; potency varies by grower and product.'
      )
    );
    hero.appendChild(meta);

    var compareJump = el('a', 'profile-compare-jump', 'Compare this strain ↓');
    compareJump.href = '#compare';
    hero.appendChild(compareJump);
    return hero;
  }

  function buildStory(strain) {
    if (!strain.description || !strain.description.length) {
      return el('div');
    }

    var section = el('section', 'profile-story');
    section.setAttribute('aria-labelledby', 'story-heading');
    var heading = el('h2', null, 'What is ' + strain.name + '?');
    heading.id = 'story-heading';
    section.appendChild(heading);

    strain.description.forEach(function (paragraph) {
      section.appendChild(el('p', 'profile-story__text', paragraph));
    });
    return section;
  }

  function buildPhotoCarousel(items) {
    var wrap = el('div', 'photo-carousel');
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Strain photo gallery');

    var frame = el('div', 'photo-carousel__frame');
    var img = document.createElement('img');
    img.decoding = 'async';
    frame.appendChild(img);

    var prev = el('button', 'photo-carousel__nav photo-carousel__nav--prev', '<');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous photo');
    frame.appendChild(prev);
    var next = el('button', 'photo-carousel__nav photo-carousel__nav--next', '>');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next photo');
    frame.appendChild(next);

    var count = el('span', 'photo-carousel__count');
    count.setAttribute('aria-live', 'polite');
    frame.appendChild(count);

    var meta = el('div', 'photo-carousel__meta');
    var label = el('span', 'photo-carousel__label');
    var badge = el('span', 'photo-carousel__badge', 'Representative photo');
    var credit = el('p', 'photo-credit');
    meta.appendChild(label);
    meta.appendChild(badge);
    meta.appendChild(credit);
    wrap.appendChild(frame);
    wrap.appendChild(meta);

    var index = 0;

    function render() {
      var item = items[index];
      img.src = item.photo.src;
      img.alt = item.photo.alt || '';
      count.textContent = (index + 1) + ' / ' + items.length;
      label.textContent = item.label;
      credit.textContent = GG.photoCreditText(item.photo, false);
      badge.hidden = !item.photo.representative;
    }

    function move(offset) {
      index = (index + offset + items.length) % items.length;
      render();
    }

    prev.addEventListener('click', function () {
      move(-1);
    });
    next.addEventListener('click', function () {
      move(1);
    });
    wrap.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
    });

    if (items.length < 2) {
      prev.hidden = true;
      next.hidden = true;
    }
    render();
    return wrap;
  }

  function buildPhotoSection(strain) {
    var section = el('section', 'profile-section profile-section--photos');
    section.setAttribute('aria-labelledby', 'photos-heading');

    var galleryItems = GG.strainPhotos(strain);
    var totalPhotos = galleryItems.length;

    var head = el('div', 'section-head');
    var heading = el('h2', null, strain.name + ' photos');
    heading.id = 'photos-heading';
    head.appendChild(heading);
    head.appendChild(el('span', 'provenance', totalPhotos + ' photos'));
    section.appendChild(head);

    section.appendChild(
      noteWithIcon(
        'Use the < and > buttons, or the left and right arrow keys, to browse the plant, cut flower, close-up details and every growth stage.'
      )
    );

    if (galleryItems.length) {
      section.appendChild(buildPhotoCarousel(galleryItems));
    }

    var credits = el('p', 'source-note');
    credits.appendChild(document.createTextNode('Openly licensed photos: '));
    var link = el('a', null, 'photo credits');
    link.href = 'credits.html';
    credits.appendChild(link);
    credits.appendChild(document.createTextNode('.'));
    section.appendChild(credits);

    return section;
  }

  function buildFacts(strain) {
    var facts = strain.facts || [];
    if (!facts.length) {
      return el('div');
    }

    var section = el('section', 'profile-section profile-section--facts');
    section.setAttribute('aria-labelledby', 'facts-heading');

    var head = el('div', 'section-head');
    var heading = el('h2', null, 'Fun facts about ' + strain.name);
    heading.id = 'facts-heading';
    head.appendChild(heading);
    head.appendChild(el('span', 'provenance', 'Good to know'));
    section.appendChild(head);

    var list = el('ul', 'facts-grid');
    facts.forEach(function (fact, index) {
      var item = el('li', 'fact-card');
      item.appendChild(el('span', 'fact-card__index', (index + 1 < 10 ? '0' : '') + (index + 1)));
      item.appendChild(el('p', 'fact-card__text', fact));
      list.appendChild(item);
    });
    section.appendChild(list);
    return section;
  }

  function buildOverview(strain) {
    var section = el('section', 'overview');
    section.setAttribute('aria-labelledby', 'overview-heading');

    var heading = el('h2', 'sr-only', 'Strain overview');
    heading.id = 'overview-heading';
    section.appendChild(heading);

    var grid = el('div', 'overview__grid');
    grid.appendChild(identityTile(strain, 'large'));

    var lists = el('div', 'overview__lists');
    lists.appendChild(overviewList('Top effects', positiveArray(strain).slice(0, 3), 'effect'));
    lists.appendChild(overviewList('Top flavours', (strain.flavours || []).slice(0, 3), 'flavour'));
    grid.appendChild(lists);
    section.appendChild(grid);

    section.appendChild(terpeneLegend(strain.terpenes || []));

    if (strain.indicators) {
      var indicators = el('div', 'indicators');
      indicators.appendChild(indicator('Calming', 'Energising', strain.indicators.calming));
      indicators.appendChild(indicator('Low THC', 'High THC', strain.indicators.thc));
      section.appendChild(indicators);
      section.appendChild(el('p', 'indicator-note', 'Illustrative reference only, not a measurement or score.'));
    }

    return section;
  }

  function buildEffects(strain) {
    var section = el('section', 'profile-section');
    section.setAttribute('aria-labelledby', 'effects-heading');

    var head = el('div', 'section-head');
    var heading = el('h2', null, strain.name + ' effects');
    heading.id = 'effects-heading';
    head.appendChild(heading);
    head.appendChild(
      infoDetails(
        'About reported effects',
        'Effects are reported experiences compiled from public strain references. They are not ' +
          'guaranteed outcomes.'
      )
    );
    section.appendChild(head);

    var reportLine = GG.reportLine(strain);
    section.appendChild(
      noteWithIcon(
        'How people usually describe the high.' + (reportLine ? ' ' + reportLine : '')
      )
    );

    section.appendChild(el('h3', 'group-heading', 'What people report'));
    section.appendChild(cardGrid(positiveArray(strain).slice(0, 3), 'effect'));

    section.appendChild(el('h3', 'group-heading group-heading--spaced', 'Possible side effects'));
    section.appendChild(cardGrid(negativeArray(strain).slice(0, 3), 'effect'));

    section.appendChild(el('h3', 'group-heading group-heading--spaced', 'Tastes like'));
    section.appendChild(cardGrid((strain.flavours || []).slice(0, 3), 'flavour'));

    return section;
  }

  function buildScience(strain) {
    var section = el('section', 'profile-section profile-section--science');
    section.setAttribute('aria-labelledby', 'science-heading');

    var head = el('div', 'section-head');
    var heading = el('h2', null, 'Terpenes in ' + strain.name);
    heading.id = 'science-heading';
    head.appendChild(heading);
    head.appendChild(el('span', 'provenance', 'Aroma guide'));
    head.appendChild(
      infoDetails(
        'About terpenes',
        'Terpenes are the aromatic compounds behind each strain smell. This aroma guide is based on ' +
          'common reports; exact terpene levels vary by batch.'
      )
    );
    section.appendChild(head);

    var grid = el('div', 'science-grid');

    var summary = el('div', 'science-summary');
    summary.appendChild(identityTile(strain, 'small'));

    var facts = el('dl', 'fact-list');
    var phenotype = el('div', 'fact');
    phenotype.appendChild(el('dt', null, 'Type'));
    var phenotypeValue = el('dd');
    var swatch = el('span', 'phenotype-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    phenotypeValue.appendChild(swatch);
    phenotypeValue.appendChild(document.createTextNode(strain.classification));
    phenotype.appendChild(phenotypeValue);
    facts.appendChild(phenotype);

    var dominant = el('div', 'fact');
    dominant.appendChild(el('dt', null, 'Dominant terpene'));
    var dominantValue = el('dd');
    if (strain.terpenes && strain.terpenes.length) {
      var first = GG.terpene(strain.terpenes[0].key);
      dominantValue.appendChild(marker(strain.terpenes[0].key));
      dominantValue.appendChild(document.createTextNode(first.label + ' '));
      dominantValue.appendChild(el('span', 'muted', '(' + first.aroma + ')'));
    } else {
      dominantValue.textContent = 'Not available';
    }
    dominant.appendChild(dominantValue);
    facts.appendChild(dominant);

    summary.appendChild(facts);
    grid.appendChild(summary);

    var profile = el('div', 'terpene-profile');
    var terpeneHeading = el('h3', null, strain.name + ' terpenes');
    profile.appendChild(terpeneHeading);
    profile.appendChild(el('p', 'section-note', terpeneSentence(strain)));
    profile.appendChild(terpeneList(strain));
    grid.appendChild(profile);

    section.appendChild(grid);
    return section;
  }

  function buildAbout(strain) {
    var section = el('section', 'profile-section profile-notes');
    section.id = 'about-profile';

    var heading = el('h2', null, 'A quick note');
    heading.id = 'about-profile-title';
    section.setAttribute('aria-labelledby', 'about-profile-title');
    section.appendChild(heading);

    section.appendChild(
      el(
        'p',
        'profile-notes__text',
        'This is a friendly strain guide, not a lab report. Potency, flavour and effects can change ' +
          'from batch to batch and from person to person.'
      )
    );
    section.appendChild(
      el(
        'p',
        'source-note',
        'No accounts, cookies, analytics or third-party requests are used on this site.'
      )
    );
    return section;
  }

  function renderProfile(root, strain) {
    var breadcrumb = el('nav', 'breadcrumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    var crumbs = el('ol', 'breadcrumb__list');
    var libraryCrumb = el('li');
    var libraryLink = el('a', null, 'Strains');
    libraryLink.href = 'strains.html';
    libraryCrumb.appendChild(libraryLink);
    crumbs.appendChild(libraryCrumb);
    var currentCrumb = el('li', null, strain.name + ' strain');
    currentCrumb.setAttribute('aria-current', 'page');
    crumbs.appendChild(currentCrumb);
    breadcrumb.appendChild(crumbs);
    root.appendChild(breadcrumb);

    root.appendChild(buildHero(strain));
    root.appendChild(buildStory(strain));
    root.appendChild(buildPhotoSection(strain));
    root.appendChild(buildOverview(strain));
    root.appendChild(buildFacts(strain));
    root.appendChild(buildEffects(strain));
    root.appendChild(buildScience(strain));

    var split = el('div', 'split-grid');
    split.appendChild(buildGeneticsSection(strain));
    split.appendChild(buildGrowSection(strain));
    root.appendChild(split);

    root.appendChild(buildAbout(strain));
    if (GG.buildCompareSection) {
      root.appendChild(GG.buildCompareSection(strain));
    }
  }

  function renderNotFound(root, slug) {
    document.title = 'Strain not found | GanjaGuardian';
    var aboutLink = document.querySelector('.site-nav__link[href="#about-profile"]');
    if (aboutLink) {
      aboutLink.href = 'index.html#about-data';
    }
    var section = el('section', 'not-found');
    var heading = el('h1', null, 'Strain not found');
    section.appendChild(heading);
    section.appendChild(
      el('p', 'lede', 'There is no reference profile for “' + slug + '” in this local dataset.')
    );
    var link = el('a', 'button', 'Browse all strains');
    link.href = 'strains.html';
    section.appendChild(link);
    root.appendChild(section);
  }

  function init() {
    var root = document.getElementById('profile-root');
    if (!root) {
      return;
    }

    GG.hydrateIcons();

    var params = new URLSearchParams(window.location.search);
    var slug = (params.get('strain') || 'og-kush').trim();
    var strain = GG.findStrain(slug);

    root.textContent = '';

    if (!strain) {
      renderNotFound(root, slug.slice(0, 80));
      root.removeAttribute('aria-busy');
      return;
    }

    document.title = strain.name + ' strain | GanjaGuardian';
    var description = document.getElementById('page-description');
    if (description) {
      description.setAttribute(
        'content',
        strain.name + ' strain guide: photos, effects, flavours, terpenes, genetics and grow notes. ' +
          'THC and CBD figures are a rough reference that varies by batch.'
      );
    }

    renderProfile(root, strain);
    root.removeAttribute('aria-busy');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
