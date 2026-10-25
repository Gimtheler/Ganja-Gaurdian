/*
 * GanjaGuardian live strain predictions for the homepage and library search.
 * Suggestions are keyboard-accessible and jump straight to a strain profile.
 */
(function () {
  'use strict';

  var GG = window.GG;

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function compact(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, '');
  }

  GG.suggestStrains = function (query, limit) {
    var needle = normalize(query);
    var compactNeedle = compact(query);
    if (!needle) {
      return [];
    }

    var results = [];
    GG.STRAINS.forEach(function (strain) {
      var name = normalize(strain.name);
      var compactName = compact(strain.name);
      var index = name.indexOf(needle);
      if (index === -1 && compactNeedle) {
        index = compactName.indexOf(compactNeedle);
      }
      var aliasIndex = -1;
      (strain.aliases || []).forEach(function (alias) {
        var aliasText = normalize(alias);
        var position = aliasText.indexOf(needle);
        if (position === -1 && compactNeedle) {
          position = compact(alias).indexOf(compactNeedle);
        }
        if (position !== -1 && (aliasIndex === -1 || position < aliasIndex)) {
          aliasIndex = position;
        }
      });

      var rank;
      var isCustom = GG.HOME_STRAINS.indexOf(strain.slug) !== -1;
      if (name === needle || (compactNeedle && compactName === compactNeedle)) {
        rank = 0;
      } else if (index === 0) {
        rank = isCustom ? 0 : 1;
      } else if (aliasIndex === 0) {
        rank = 2;
      } else if (index > 0) {
        rank = 3;
      } else if (aliasIndex > 0) {
        rank = 4;
      } else {
        return;
      }

      results.push({
        strain: strain,
        rank: rank,
        custom: isCustom ? 0 : 1,
        distance: index === -1 ? aliasIndex : index
      });
    });

    results.sort(function (a, b) {
      return (
        a.rank - b.rank ||
        a.custom - b.custom ||
        a.strain.name.length - b.strain.name.length ||
        a.distance - b.distance ||
        a.strain.name.localeCompare(b.strain.name)
      );
    });

    return results.slice(0, limit || 8).map(function (entry) {
      return entry.strain;
    });
  };

  function highlightName(name, query) {
    var lower = name.toLowerCase();
    var index = lower.indexOf(query.toLowerCase());
    if (index === -1) {
      return document.createTextNode(name);
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(name.slice(0, index)));
    var strong = document.createElement('strong');
    strong.textContent = name.slice(index, index + query.length);
    fragment.appendChild(strong);
    fragment.appendChild(document.createTextNode(name.slice(index + query.length)));
    return fragment;
  }

  function attach(input) {
    if (!input || input.getAttribute('data-suggestions-ready') === 'true') {
      return;
    }
    var field = input.closest('.search-field');
    if (!field) {
      return;
    }

    var list = document.createElement('div');
    list.className = 'search-suggestions';
    list.id = input.id + '-suggestions';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    field.appendChild(list);

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('data-suggestions-ready', 'true');

    var items = [];
    var activeIndex = -1;
    var timer = null;

    function close() {
      list.hidden = true;
      list.textContent = '';
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      activeIndex = -1;
      items = [];
    }

    function select(strain) {
      if (!strain) {
        return;
      }
      close();
      window.location.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);
    }

    function setActive(index) {
      if (!items.length) {
        return;
      }
      activeIndex = (index + items.length) % items.length;
      Array.prototype.forEach.call(list.children, function (child, childIndex) {
        var selected = childIndex === activeIndex;
        child.classList.toggle('is-active', selected);
        child.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      input.setAttribute('aria-activedescendant', items[activeIndex].id);
    }

    function render() {
      var query = input.value.trim();
      close();
      if (!query) {
        return;
      }
      var matches = GG.suggestStrains(query, 8);
      if (!matches.length) {
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        var empty = document.createElement('p');
        empty.className = 'suggestion-empty';
        empty.textContent = 'No matching strains';
        list.appendChild(empty);
        return;
      }

      matches.forEach(function (strain, index) {
        var option = document.createElement('button');
        option.type = 'button';
        option.className = 'suggestion';
        option.id = input.id + '-suggestion-' + index;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');

        var body = document.createElement('span');
        body.className = 'suggestion__body';
        var name = document.createElement('span');
        name.className = 'suggestion__name';
        name.appendChild(highlightName(strain.name, query));
        body.appendChild(name);
        var meta = document.createElement('span');
        meta.className = 'suggestion__meta';
        meta.textContent = strain.classification + ' · THC ' + GG.formatPct(strain.thc);
        body.appendChild(meta);
        option.appendChild(body);

        var arrow = document.createElement('span');
        arrow.className = 'suggestion__arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '→';
        option.appendChild(arrow);

        option.addEventListener('mousedown', function (event) {
          event.preventDefault();
        });
        option.addEventListener('click', function () {
          select(strain);
        });
        list.appendChild(option);
        items.push(option);
      });

      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function scheduleRender() {
      window.clearTimeout(timer);
      timer = window.setTimeout(render, 80);
    }

    input.addEventListener('input', scheduleRender);
    input.addEventListener('focus', scheduleRender);
    input.addEventListener('keydown', function (event) {
      if (list.hidden) {
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive(activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive(activeIndex - 1);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        var strain = GG.suggestStrains(input.value.trim(), 8)[activeIndex];
        select(strain);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'Tab') {
        close();
      }
    });

    input.addEventListener('blur', function () {
      window.setTimeout(close, 140);
    });

    document.addEventListener('click', function (event) {
      if (!field.contains(event.target)) {
        close();
      }
    });
  }

  function init() {
    attach(document.getElementById('home-search'));
    attach(document.getElementById('strain-search'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
