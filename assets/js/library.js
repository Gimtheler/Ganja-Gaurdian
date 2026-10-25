/*
 * GanjaGuardian library page: search, classification filter and sorting.
 * All strain content comes from data.js and is inserted with text nodes.
 */
(function () {
  'use strict';

  var GG = window.GG;
  var state = { query: '', type: 'all', sort: 'thc-desc', page: 1 };
  var PAGE_SIZE = 48;
  var searchTimer = null;

  var els = {};

  function numberOrNull(value) {
    var number = Number(value);
    return isFinite(number) ? number : null;
  }

  function byName(a, b) {
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  }

  function byNumber(field, direction) {
    return function (a, b) {
      var av = numberOrNull(a[field]);
      var bv = numberOrNull(b[field]);
      if (av === null && bv === null) {
        return byName(a, b);
      }
      if (av === null) {
        return 1;
      }
      if (bv === null) {
        return -1;
      }
      if (av !== bv) {
        return direction * (av - bv);
      }
      return byName(a, b);
    };
  }

  var sorters = {
    'thc-desc': byNumber('thc', -1),
    'thc-asc': byNumber('thc', 1),
    'cbd-desc': byNumber('cbd', -1),
    'cbd-asc': byNumber('cbd', 1),
    'name-asc': byName,
    'name-desc': function (a, b) {
      return byName(b, a);
    }
  };

  function searchText(strain) {
    var parts = [strain.name, strain.abbreviation, strain.classification];
    parts = parts.concat(strain.aliases || []);
    (strain.effects && strain.effects.positive ? strain.effects.positive : []).forEach(function (key) {
      parts.push(GG.effect(key).label);
    });
    (strain.effects && strain.effects.negative ? strain.effects.negative : []).forEach(function (key) {
      parts.push(GG.effect(key).label);
    });
    (strain.flavours || []).forEach(function (key) {
      parts.push(GG.flavour(key).label);
    });
    (strain.terpenes || []).forEach(function (entry) {
      var terpene = GG.terpene(entry.key);
      parts.push(terpene.label, terpene.aroma);
    });
    return parts.join(' ').toLowerCase();
  }

  function matchesQuery(strain, tokens) {
    if (!tokens.length) {
      return true;
    }
    var haystack = searchText(strain);
    if (tokens.every(function (token) {
      return haystack.indexOf(token) !== -1;
    })) {
      return true;
    }
    var compactHaystack = haystack.replace(/[^a-z0-9]+/g, '');
    var compactTokens = tokens.map(function (token) {
      return token.replace(/[^a-z0-9]+/g, '');
    }).filter(Boolean);
    return compactTokens.length > 0 && compactTokens.every(function (token) {
      return compactHaystack.indexOf(token) !== -1;
    });
  }

  function stat(label, value) {
    var group = GG.el('div', 'stat');
    var dt = GG.el('dt', null, label);
    var dd = GG.el('dd', null, value);
    group.appendChild(dt);
    group.appendChild(dd);
    return group;
  }

  function renderCard(strain) {
    var item = GG.el('li', 'card-grid__item');
    var card = GG.el('article', 'strain-card');

    var primary = GG.strainPhoto(strain);
    if (primary) {
      var figure = GG.el('figure', 'strain-card__media');
      var gallery = GG.el('div', 'strain-card__gallery');
      var photos = GG.strainPhotos(strain).map(function (item) {
        return item.photo;
      }).slice(0, 3);
      photos.forEach(function (photo) {
        var img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.width = 800;
        img.height = 600;
        img.loading = 'lazy';
        img.decoding = 'async';
        gallery.appendChild(img);
      });
      figure.appendChild(gallery);
      var totalPhotos = photos.length;
      figure.appendChild(
        GG.el(
          'figcaption',
          'photo-credit photo-credit--overlay',
          GG.photoCreditText(primary, false) + ' · +' + (totalPhotos - 1) + ' more'
        )
      );
      figure.appendChild(GG.el('span', 'photo-count', totalPhotos + ' photos'));
      card.appendChild(figure);
    } else {
      var artFigure = GG.el('figure', 'strain-card__media strain-card__media--art');
      artFigure.appendChild(GG.strainArt(strain, 'card'));
      card.appendChild(artFigure);
    }

    var head = GG.el('div', 'strain-card__head');

    var heading = GG.el('div', 'strain-card__heading');
    heading.appendChild(GG.badgeFor(strain));

    var title = GG.el('h3', 'strain-card__title');
    var link = GG.el('a', 'strain-card__link');
    link.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);
    link.textContent = strain.name;
    title.appendChild(link);
    heading.appendChild(title);

    if (strain.aliases && strain.aliases.length) {
      heading.appendChild(GG.el('p', 'strain-card__alias muted', strain.aliases.join(', ')));
    }
    head.appendChild(heading);
    card.appendChild(head);

    var stats = GG.el('dl', 'stat-row');
    stats.appendChild(stat('THC', GG.formatPct(strain.thc)));
    stats.appendChild(stat('CBD', GG.formatPct(strain.cbd)));
    var topTerpene = strain.terpenes && strain.terpenes.length ? GG.terpene(strain.terpenes[0].key).label : 'Not available';
    stats.appendChild(stat('Top terpene', topTerpene));
    card.appendChild(stats);

    var effects = strain.effects && strain.effects.positive ? strain.effects.positive.slice(0, 3) : [];
    var tags = GG.el('ul', 'tag-list');
    tags.setAttribute('aria-label', 'Top reported effects');
    if (effects.length) {
      effects.forEach(function (key) {
        tags.appendChild(GG.el('li', 'tag', GG.effect(key).label));
      });
    } else {
      tags.appendChild(GG.el('li', 'tag tag--muted', 'Effects not available'));
    }
    card.appendChild(tags);

    var tagline = strain.tagline;
    if (tagline) {
      var taglineLine = GG.el('p', 'card-tagline', tagline);
      card.appendChild(taglineLine);
    }

    var cta = GG.el('span', 'card-cta');
    cta.setAttribute('aria-hidden', 'true');
    cta.appendChild(document.createTextNode('View profile '));
    cta.appendChild(GG.el('span', 'card-cta__arrow', '→'));
    card.appendChild(cta);

    item.appendChild(card);
    return item;
  }

  function updateChips() {
    Array.prototype.forEach.call(els.chips, function (chip) {
      var selected = chip.getAttribute('data-type') === state.type;
      chip.classList.toggle('is-selected', selected);
      chip.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function syncUrl() {
    if (window.location.protocol === 'file:') {
      return;
    }
    try {
      var params = new URLSearchParams();
      if (state.query) {
        params.set('q', state.query);
      }
      if (state.type !== 'all') {
        params.set('type', state.type);
      }
      if (state.sort !== 'thc-desc') {
        params.set('sort', state.sort);
      }
      var query = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''));
    } catch (error) {
      /* Ignore history restrictions in unusual embedding contexts. */
    }
  }

  function applyFilters(resetPage) {
    if (resetPage !== false) {
      state.page = 1;
    }
    var query = state.query.trim().toLowerCase();
    var tokens = query ? query.split(/\s+/).filter(Boolean) : [];

    var matches = GG.STRAINS.filter(function (strain) {
      if (state.type !== 'all' && strain.classification !== state.type) {
        return false;
      }
      return matchesQuery(strain, tokens);
    });

    matches.sort(sorters[state.sort] || sorters['thc-desc']);

    var visible = matches.slice(0, state.page * PAGE_SIZE);
    els.grid.textContent = '';
    visible.forEach(function (strain) {
      els.grid.appendChild(renderCard(strain));
    });

    els.grid.hidden = matches.length === 0;
    els.empty.hidden = matches.length !== 0;
    els.loadMore.hidden = visible.length >= matches.length;
    els.loadMore.textContent = 'Load ' + Math.min(PAGE_SIZE, matches.length - visible.length) + ' more strains';

    if (!matches.length) {
      els.results.textContent = 'No strains match the current search and filter.';
    } else if (visible.length >= matches.length) {
      els.results.textContent = 'Showing all ' + matches.length.toLocaleString() + ' strain profiles.';
    } else {
      els.results.textContent =
        'Showing ' + visible.length.toLocaleString() + ' of ' + matches.length.toLocaleString() + ' strain profiles.';
    }

    syncUrl();
  }

  function resetFilters() {
    state.query = '';
    state.type = 'all';
    state.sort = 'thc-desc';
    state.page = 1;
    els.search.value = '';
    els.sort.value = state.sort;
    updateChips();
    applyFilters(true);
    els.search.focus();
  }

  function init() {
    els.grid = document.getElementById('strain-grid');
    els.empty = document.getElementById('empty-state');
    els.results = document.getElementById('results-line');
    els.search = document.getElementById('strain-search');
    els.sort = document.getElementById('strain-sort');
    els.form = document.getElementById('strain-search-form');
    els.reset = document.getElementById('reset-filters');
    els.loadMore = document.getElementById('load-more');
    els.chips = document.querySelectorAll('.chip[data-type]');

    if (!els.grid || !els.search || !els.sort || !els.loadMore) {
      return;
    }

    GG.hydrateIcons();

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (initialQuery) {
      state.query = initialQuery.slice(0, 120);
      els.search.value = state.query;
    }
    var initialType = params.get('type');
    if (initialType === 'Indica' || initialType === 'Sativa' || initialType === 'Hybrid') {
      state.type = initialType;
    }
    var initialSort = params.get('sort');
    if (initialSort && Object.prototype.hasOwnProperty.call(sorters, initialSort)) {
      state.sort = initialSort;
      els.sort.value = initialSort;
    }

    els.search.addEventListener('input', function () {
      state.query = els.search.value;
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        applyFilters(true);
      }, 120);
    });

    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters(true);
    });

    els.sort.addEventListener('change', function () {
      state.sort = els.sort.value;
      applyFilters(true);
    });

    Array.prototype.forEach.call(els.chips, function (chip) {
      chip.addEventListener('click', function () {
        state.type = chip.getAttribute('data-type');
        updateChips();
        applyFilters(true);
      });
    });

    els.reset.addEventListener('click', resetFilters);
    els.loadMore.addEventListener('click', function () {
      state.page += 1;
      applyFilters(false);
    });

    updateChips();
    applyFilters(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
