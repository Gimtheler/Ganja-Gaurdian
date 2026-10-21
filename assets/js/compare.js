/*
 * GanjaGuardian profile comparison.
 * Adds a searchable, side-by-side comparison section to every strain profile.
 */
(function () {
  'use strict';

  var GG = window.GG;
  var MAX_COMPARE = 3;

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function byName(a, b) {
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  }

  function findByName(value) {
    var query = String(value || '').trim().toLowerCase();
    if (!query) {
      return null;
    }
    var exact = GG.STRAINS.filter(function (strain) {
      return strain.name.toLowerCase() === query || strain.slug === slugify(query);
    });
    if (exact.length) {
      return exact[0];
    }
    var starts = GG.STRAINS.filter(function (strain) {
      return strain.name.toLowerCase().indexOf(query) === 0;
    });
    if (starts.length === 1) {
      return starts[0];
    }
    return null;
  }

  function compareScore(base, candidate) {
    var score = 0;
    if (GG.HOME_STRAINS.indexOf(candidate.slug) !== -1) {
      score += 5;
    }
    (base.effects && base.effects.positive ? base.effects.positive : []).forEach(function (key) {
      if ((candidate.effects.positive || []).indexOf(key) !== -1) {
        score += 3;
      }
    });
    (base.flavours || []).forEach(function (key) {
      if ((candidate.flavours || []).indexOf(key) !== -1) {
        score += 2;
      }
    });
    if (base.terpenes && base.terpenes.length && candidate.terpenes.length) {
      if (base.terpenes[0].key === candidate.terpenes[0].key) {
        score += 2;
      }
    }
    return score;
  }

  function suggestionsFor(strain) {
    return GG.STRAINS
      .filter(function (candidate) {
        return candidate.slug !== strain.slug && candidate.classification === strain.classification;
      })
      .map(function (candidate) {
        return { strain: candidate, score: compareScore(strain, candidate) };
      })
      .sort(function (a, b) {
        return b.score - a.score || byName(a.strain, b.strain);
      })
      .slice(0, 2)
      .map(function (entry) {
        return entry.strain.slug;
      });
  }

  function growValue(strain, key) {
    var attributes = strain.grow && strain.grow.attributes ? strain.grow.attributes : [];
    for (var i = 0; i < attributes.length; i += 1) {
      if (attributes[i].key === key) {
        return attributes[i].selected;
      }
    }
    return 'Not available';
  }

  function chipList(keys, resolver) {
    var wrap = GG.el('div', 'compare-chips');
    (keys || []).forEach(function (key) {
      var entry = resolver(key);
      if (entry && entry.label) {
        wrap.appendChild(GG.el('span', 'compare-chip', entry.label));
      }
    });
    return wrap;
  }

  function strainHeader(strain, current, remove) {
    var cell = document.createElement('th');
    cell.scope = 'col';
    cell.className = 'compare-table__strain' + (current ? ' is-current' : '');

    var top = GG.el('div', 'compare-table__strain-top');
    var link = GG.el('a', 'compare-table__name', strain.name);
    link.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);
    top.appendChild(link);
    if (remove) {
      var removeButton = GG.el('button', 'compare-remove', '×');
      removeButton.type = 'button';
      removeButton.setAttribute('aria-label', 'Remove ' + strain.name + ' from comparison');
      removeButton.setAttribute('title', 'Remove ' + strain.name);
      removeButton.addEventListener('click', function () {
        remove(strain.slug);
      });
      top.appendChild(removeButton);
    }
    cell.appendChild(top);
    cell.appendChild(GG.badgeFor(strain));
    if (current) {
      cell.appendChild(GG.el('span', 'compare-current-label', 'This strain'));
    }
    return cell;
  }

  function compareTable(strains, currentSlug, remove) {
    var wrap = GG.el('div', 'compare-table-wrap');
    var table = GG.el('table', 'compare-table');
    var caption = GG.el('caption', 'sr-only', 'Side-by-side strain comparison');
    table.appendChild(caption);

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var empty = document.createElement('th');
    empty.scope = 'col';
    empty.className = 'compare-table__corner';
    empty.appendChild(GG.el('span', 'sr-only', 'Strain attributes'));
    headerRow.appendChild(empty);
    strains.forEach(function (strain) {
      headerRow.appendChild(strainHeader(strain, strain.slug === currentSlug, strain.slug !== currentSlug ? remove : null));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var body = document.createElement('tbody');

    var typeRow = document.createElement('tr');
    var typeHead = document.createElement('th');
    typeHead.scope = 'row';
    typeHead.textContent = 'Type';
    typeRow.appendChild(typeHead);
    strains.forEach(function (strain) {
      var cell = document.createElement('td');
      cell.appendChild(GG.badgeFor(strain));
      typeRow.appendChild(cell);
    });
    body.appendChild(typeRow);

    function simpleRow(label, values) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = label;
      tr.appendChild(th);
      values.forEach(function (value) {
        var td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    }

    simpleRow('THC', strains.map(function (strain) { return GG.formatPct(strain.thc); }));
    simpleRow('CBD', strains.map(function (strain) { return GG.formatPct(strain.cbd); }));

    function contentRow(label, render) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = label;
      tr.appendChild(th);
      strains.forEach(function (strain) {
        var td = document.createElement('td');
        td.appendChild(render(strain));
        tr.appendChild(td);
      });
      body.appendChild(tr);
    }

    contentRow('Top effects', function (strain) {
      return chipList(strain.effects && strain.effects.positive ? strain.effects.positive.slice(0, 3) : [], GG.effect);
    });
    contentRow('Top flavours', function (strain) {
      return chipList((strain.flavours || []).slice(0, 3), GG.flavour);
    });
    contentRow('Dominant terpene', function (strain) {
      var wrap = GG.el('span', 'compare-terpene');
      if (!strain.terpenes || !strain.terpenes.length) {
        wrap.textContent = 'Not available';
        return wrap;
      }
      var marker = GG.el('span', 'marker marker--' + strain.terpenes[0].key);
      marker.setAttribute('aria-hidden', 'true');
      wrap.appendChild(marker);
      var terpene = GG.terpene(strain.terpenes[0].key);
      wrap.appendChild(GG.el('span', null, terpene.label + ' (' + terpene.aroma + ')'));
      return wrap;
    });
    simpleRow('Difficulty', strains.map(function (strain) { return growValue(strain, 'difficulty'); }));
    simpleRow('Flowering', strains.map(function (strain) {
      var value = growValue(strain, 'flowering');
      return value === 'Not available' ? value : value + ' weeks';
    }));
    simpleRow('Yield', strains.map(function (strain) { return growValue(strain, 'yield'); }));
    simpleRow('Height', strains.map(function (strain) { return growValue(strain, 'height'); }));
    contentRow('Reported parents', function (strain) {
      var parents = strain.genetics && strain.genetics.parents ? strain.genetics.parents : [];
      if (!parents.length) {
        return GG.el('span', 'muted', 'Not available');
      }
      return GG.el('span', null, parents.map(function (parent) { return parent.name; }).join(' × '));
    });

    table.appendChild(body);
    wrap.appendChild(table);
    return wrap;
  }

  function parseCompareParam(value) {
    return String(value || '')
      .split(',')
      .map(function (slug) { return slug.trim(); })
      .filter(Boolean);
  }

  function updateUrl(currentSlug, comparedSlugs) {
    if (window.location.protocol === 'file:') {
      return;
    }
    try {
      var params = new URLSearchParams(window.location.search);
      params.set('strain', currentSlug);
      if (comparedSlugs.length) {
        params.set('compare', comparedSlugs.join(','));
      } else {
        params.delete('compare');
      }
      window.history.replaceState(null, '', window.location.pathname + '?' + params.toString());
    } catch (error) {
      /* Ignore history restrictions in embedded contexts. */
    }
  }

  GG.buildCompareSection = function (strain) {
    var section = GG.el('section', 'profile-section compare-section');
    section.id = 'compare';
    section.setAttribute('aria-labelledby', 'compare-heading');

    var head = GG.el('div', 'section-head');
    var heading = GG.el('h2', null, 'Compare ' + strain.name);
    heading.id = 'compare-heading';
    head.appendChild(heading);
    head.appendChild(GG.el('span', 'provenance', 'Up to 3 strains'));
    section.appendChild(head);

    section.appendChild(
      GG.el('p', 'section-note', 'Put this strain beside another to compare type, potency, effects and grow notes.')
    );

    var compared = [];
    var params = new URLSearchParams(window.location.search);
    parseCompareParam(params.get('compare')).forEach(function (slug) {
      if (compared.length >= MAX_COMPARE || slug === strain.slug) {
        return;
      }
      var candidate = GG.findStrain(slug);
      if (candidate && compared.indexOf(candidate.slug) === -1) {
        compared.push(candidate.slug);
      }
    });
    if (!compared.length) {
      compared = suggestionsFor(strain);
    }

    var status = GG.el('p', 'compare-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    var picker = GG.el('form', 'compare-picker');
    picker.setAttribute('role', 'search');
    var label = GG.el('label', 'sr-only', 'Search for a strain to compare');
    label.setAttribute('for', 'compare-search');
    picker.appendChild(label);
    var input = document.createElement('input');
    input.id = 'compare-search';
    input.name = 'compare-search';
    input.type = 'search';
    input.placeholder = 'Search another strain…';
    input.autocomplete = 'off';
    input.setAttribute('list', 'compare-options');
    picker.appendChild(input);

    var datalist = document.createElement('datalist');
    datalist.id = 'compare-options';
    GG.STRAINS.slice().sort(byName).forEach(function (candidate) {
      if (candidate.slug === strain.slug) {
        return;
      }
      var option = document.createElement('option');
      option.value = candidate.name;
      option.label = candidate.classification;
      datalist.appendChild(option);
    });
    picker.appendChild(datalist);

    var addButton = GG.el('button', 'button', 'Add to comparison');
    addButton.type = 'submit';
    picker.appendChild(addButton);
    section.appendChild(picker);
    section.appendChild(status);
    section.appendChild(GG.el('p', 'compare-hint', 'Swipe sideways to compare every strain →'));

    var tableHost = GG.el('div', 'compare-table-host');
    section.appendChild(tableHost);

    function render() {
      tableHost.textContent = '';
      var strains = [strain].concat(compared.map(function (slug) { return GG.findStrain(slug); }).filter(Boolean));
      tableHost.appendChild(
        compareTable(strains, strain.slug, function (slug) {
          compared = compared.filter(function (entry) { return entry !== slug; });
          render();
          status.textContent = 'Strain removed from the comparison.';
          updateUrl(strain.slug, compared);
        })
      );
      updateUrl(strain.slug, compared);
    }

    picker.addEventListener('submit', function (event) {
      event.preventDefault();
      var candidate = findByName(input.value);
      if (!candidate) {
        status.textContent = 'Choose a strain from the suggestions to add it.';
        return;
      }
      if (candidate.slug === strain.slug) {
        status.textContent = 'That is the strain you are viewing.';
        return;
      }
      if (compared.indexOf(candidate.slug) !== -1) {
        status.textContent = candidate.name + ' is already in the comparison.';
        return;
      }
      if (compared.length >= MAX_COMPARE) {
        status.textContent = 'You can compare up to three strains at a time.';
        return;
      }
      compared.push(candidate.slug);
      input.value = '';
      render();
      status.textContent = candidate.name + ' added to the comparison.';
    });

    render();
    return section;
  };
})();
