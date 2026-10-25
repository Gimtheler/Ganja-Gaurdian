/*
 * GanjaGuardian shared UI helpers.
 * Content is inserted with text nodes (never with untrusted HTML).
 */
(function () {
  'use strict';

  var GG = (window.GG = window.GG || {});

  GG.el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }
    return node;
  };

  GG.icon = function (name) {
    var span = document.createElement('span');
    span.className = 'icon';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = GG.ICONS[name] || GG.ICONS.leaf;
    return span;
  };

  GG.hydrateIcons = function (root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-icon]');
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.getAttribute('data-icon-ready') === 'true') {
        return;
      }
      var name = node.getAttribute('data-icon');
      node.innerHTML = GG.ICONS[name] || GG.ICONS.leaf;
      node.setAttribute('data-icon-ready', 'true');
      node.setAttribute('aria-hidden', 'true');
    });
  };

  GG.formatPct = function (value) {
    var number = Number(value);
    if (value === null || value === undefined || value === '' || !isFinite(number)) {
      return 'Not available';
    }
    return number.toLocaleString(undefined, { maximumFractionDigits: 1 }) + '%';
  };

  GG.terpene = function (key) {
    return GG.TERPENES[key] || { label: key, aroma: '' };
  };

  GG.effect = function (key) {
    return GG.EFFECTS[key] || { label: key, icon: 'leaf' };
  };

  GG.flavour = function (key) {
    return GG.FLAVOURS[key] || { label: key, icon: 'leaf' };
  };

  GG.badgeFor = function (strain) {
    return GG.el('span', 'badge badge--' + strain.classification.toLowerCase(), strain.classification);
  };

  GG.factFor = function (strain) {
    return strain && strain.facts && strain.facts.length ? strain.facts[0] : '';
  };

  GG.reportLine = function (strain) {
    var reports = strain && strain.reports;
    if (!reports || !isFinite(Number(reports.count)) || Number(reports.count) <= 0) {
      return null;
    }
    var line = 'Based on ' + Number(reports.count).toLocaleString() + ' reports';
    if (reports.source) {
      line += ' (' + reports.source + ')';
    }
    return line + '.';
  };

  GG.photoCreditText = function (photo, includeRepresentative) {
    if (!photo) {
      return '';
    }
    var text = '';
    if (includeRepresentative && photo.representative) {
      text += 'Representative photo · ';
    }
    return text + 'Photo: ' + photo.author + ' · ' + photo.license;
  };

  GG.detailPhotosFor = function (strain) {
    if (!strain) {
      return [];
    }
    var primary = strain.photo || null;
    var stage = strain.photoStage === 'plant' ? 'plant' : 'cut';
    var plant = stage === 'plant' ? primary : strain.plantPhoto || GG.REFERENCE_PHOTOS.plant;
    var cut = stage === 'cut' ? primary : strain.cutPhoto || GG.REFERENCE_PHOTOS.cut;
    var used = {};
    [plant, cut].forEach(function (photo) {
      if (photo) {
        used[photo.src] = true;
      }
    });

    var picks = (strain.detailPhotos || []).filter(function (photo) {
      if (!photo || used[photo.src]) {
        return false;
      }
      used[photo.src] = true;
      return true;
    }).slice(0, 4);

    var available = (GG.PHOTO_DETAILS || []).filter(function (photo) {
      return photo && !used[photo.src];
    });
    var index = GG.STRAINS.indexOf(strain);
    if (index < 0) {
      index = 0;
    }
    var cursor = 0;
    while (picks.length < 4 && available.length && cursor < available.length * 2) {
      var candidate = available[(index + cursor) % available.length];
      if (!picks.some(function (photo) { return photo.src === candidate.src; })) {
        picks.push(candidate);
      }
      cursor += 1;
    }
    return picks;
  };

  GG.strainPhoto = function (strain) {
    if (!strain || !strain.photo || strain.photo.representative) {
      return null;
    }
    return strain.photo;
  };

  GG.strainPhotos = function (strain) {
    var primary = GG.strainPhoto(strain);
    if (!primary) {
      return [];
    }
    var items = [];
    var seen = {};

    function add(photo, label) {
      if (!photo || photo.representative || seen[photo.src]) {
        return;
      }
      seen[photo.src] = true;
      items.push({ photo: photo, label: label });
    }

    add(primary, primary.stageLabel || 'Strain photo');
    add(strain.plantPhoto, 'On the plant');
    add(strain.cutPhoto, 'Cut & dried');
    GG.detailPhotosFor(strain).forEach(function (photo) {
      add(photo, photo.stageLabel || 'Close-up detail');
    });
    return items;
  };

  GG.hashString = function (value) {
    var hash = 0;
    var text = String(value || '');
    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };

  GG.strainArt = function (strain, variant) {
    var hash = GG.hashString(strain.slug || strain.name);
    var type = strain.classification || 'Hybrid';
    var baseHue = type === 'Indica' ? 278 : type === 'Sativa' ? 145 : 205;
    var hue = (baseHue + (hash % 28) - 14 + 360) % 360;
    var tile = GG.el('div', 'strain-art' + (variant ? ' strain-art--' + variant : ''));
    tile.setAttribute('role', 'img');
    tile.setAttribute('aria-label', 'No verified image for ' + strain.name + '.');
    tile.style.setProperty('--art-hue', hue);
    tile.style.setProperty('--art-hue-2', (hue + 38) % 360);
    tile.style.setProperty('--art-x', ((hash % 70) + 15) + '%');
    tile.style.setProperty('--art-y', (((hash >> 3) % 60) + 20) + '%');

    var glow = GG.el('span', 'strain-art__glow');
    glow.setAttribute('aria-hidden', 'true');
    tile.appendChild(glow);

    tile.appendChild(GG.el('span', 'strain-art__type', type));
    tile.appendChild(GG.el('span', 'strain-art__name', strain.name));
    tile.appendChild(GG.el('span', 'strain-art__badge', 'No verified image'));
    return tile;
  };

  GG.stageList = function (stages, extraClass) {
    var list = document.createElement('ol');
    list.className = 'stage-grid' + (extraClass ? ' ' + extraClass : '');

    (stages || []).forEach(function (stage, index) {
      var item = document.createElement('li');
      item.className = 'stage-card';

      var figure = document.createElement('figure');
      figure.className = 'stage-card__figure';

      var img = document.createElement('img');
      img.src = stage.photo.src;
      img.alt = stage.photo.alt;
      img.width = 800;
      img.height = 800;
      img.loading = 'eager';
      img.decoding = 'async';
      figure.appendChild(img);

      var caption = document.createElement('figcaption');
      caption.className = 'stage-card__caption';
      caption.appendChild(
        GG.el('span', 'stage-card__index', (index + 1 < 10 ? '0' : '') + (index + 1))
      );
      caption.appendChild(GG.el('span', 'stage-card__label', stage.label));
      caption.appendChild(GG.el('span', 'stage-card__note', stage.note));
      caption.appendChild(
        GG.el('span', 'photo-credit', GG.photoCreditText(stage.photo, false))
      );
      figure.appendChild(caption);
      item.appendChild(figure);
      list.appendChild(item);
    });

    return list;
  };

  GG.labelsFor = function (keys, resolver) {
    return (keys || []).map(function (key) {
      return resolver(key).label;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      GG.hydrateIcons();
    });
  } else {
    GG.hydrateIcons();
  }
})();
