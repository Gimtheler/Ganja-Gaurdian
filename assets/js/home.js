/*
 * GanjaGuardian homepage featured cards and classification counts.
 * All strain content comes from data.js.
 */
(function () {
  'use strict';

  var GG = window.GG;

  function imageFor(strain) {
    var photo = GG.strainPhoto(strain);
    if (!photo) {
      return null;
    }
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = 800;
    img.height = 600;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  function featuredCard(strain) {
    var item = GG.el('li', 'featured-card');

    var figure = GG.el('figure', 'featured-card__media');
    var img = imageFor(strain);
    if (img) {
      figure.appendChild(img);
      var credit = GG.el('figcaption', 'photo-credit photo-credit--overlay', GG.photoCreditText(GG.strainPhoto(strain), true));
      figure.appendChild(credit);
    } else {
      figure.appendChild(GG.strainArt(strain, 'card'));
    }
    item.appendChild(figure);

    var body = GG.el('div', 'featured-card__body');
    body.appendChild(GG.badgeFor(strain));

    var title = GG.el('h3', 'featured-card__title');
    var link = GG.el('a', 'featured-card__link', strain.name);
    link.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);
    title.appendChild(link);
    body.appendChild(title);

    body.appendChild(
      GG.el(
        'p',
        'featured-card__meta muted',
        'THC ' + GG.formatPct(strain.thc) + ' · CBD ' + GG.formatPct(strain.cbd)
      )
    );

    var effects = strain.effects && strain.effects.positive ? strain.effects.positive.slice(0, 3) : [];
    if (effects.length) {
      body.appendChild(
        GG.el('p', 'featured-card__effects', effects.map(function (key) {
          return GG.effect(key).label;
        }).join(' · '))
      );
    }

    var tagline = strain.tagline;
    if (tagline) {
      body.appendChild(GG.el('p', 'featured-card__fact', tagline));
    }

    var cta = GG.el('span', 'card-cta', 'View profile →');
    cta.setAttribute('aria-hidden', 'true');
    body.appendChild(cta);
    item.appendChild(body);
    return item;
  }

  function allStrainCard(strain) {
    var item = GG.el('li', 'all-strain');
    var link = GG.el('a', 'all-strain__link');
    link.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);

    var primary = GG.strainPhoto(strain);
    if (primary) {
      var img = document.createElement('img');
      img.src = primary.src;
      img.alt = '';
      img.width = 800;
      img.height = 800;
      img.loading = 'lazy';
      img.decoding = 'async';
      link.appendChild(img);
    } else {
      link.appendChild(GG.strainArt(strain, 'card'));
    }

    var body = GG.el('span', 'all-strain__body');
    body.appendChild(GG.el('strong', 'all-strain__name', strain.name));
    body.appendChild(GG.el('span', 'all-strain__meta', strain.classification + ' · THC ' + GG.formatPct(strain.thc)));
    link.appendChild(body);
    var arrow = GG.el('span', 'all-strain__arrow', '→');
    arrow.setAttribute('aria-hidden', 'true');
    link.appendChild(arrow);
    item.appendChild(link);
    return item;
  }

  function ownerPickCard(strain, index) {
    var item = GG.el('li', 'owner-pick');
    var link = GG.el('a', 'owner-pick__link');
    link.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);

    link.appendChild(GG.el('span', 'owner-pick__rank', String(index + 1).padStart(2, '0')));

    var body = GG.el('div', 'owner-pick__body');
    body.appendChild(GG.badgeFor(strain));
    body.appendChild(GG.el('h3', 'owner-pick__title', strain.name));
    var pickNote = GG.OWNER_PICK_NOTES && GG.OWNER_PICK_NOTES[strain.slug];
    var tagline = pickNote || strain.tagline;
    if (tagline) {
      body.appendChild(GG.el('p', 'owner-pick__tagline', tagline));
    }
    body.appendChild(
      GG.el(
        'p',
        'owner-pick__meta',
        'THC ' + GG.formatPct(strain.thc) + ' · CBD ' + GG.formatPct(strain.cbd)
      )
    );
    link.appendChild(body);
    link.appendChild(GG.el('span', 'owner-pick__arrow', '→'));
    item.appendChild(link);
    return item;
  }

  function fillTotals() {
    var nodes = document.querySelectorAll('[data-total-strains]');
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = GG.STRAINS.length.toLocaleString();
    });
  }

  function fillCounts() {
    var nodes = document.querySelectorAll('[data-count]');
    Array.prototype.forEach.call(nodes, function (node) {
      var type = node.getAttribute('data-count');
      var count = GG.STRAINS.filter(function (strain) {
        return strain.classification === type;
      }).length;
      node.textContent = count + (count === 1 ? ' strain' : ' strains');
    });
  }

  function init() {
    GG.hydrateIcons();

    var grid = document.getElementById('featured-grid');
    if (grid) {
      ['og-kush', 'blue-dream', 'purple-haze'].forEach(function (slug) {
        var strain = GG.findStrain(slug);
        if (strain) {
          grid.appendChild(featuredCard(strain));
        }
      });
    }

    var allGrid = document.getElementById('all-strains-grid');
    if (allGrid) {
      GG.HOME_STRAINS.forEach(function (slug) {
        var strain = GG.findStrain(slug);
        if (strain) {
          allGrid.appendChild(allStrainCard(strain));
        }
      });
    }

    var ownerGrid = document.getElementById('owner-picks-grid');
    if (ownerGrid && GG.OWNER_PICKS) {
      GG.OWNER_PICKS.forEach(function (slug, index) {
        var strain = GG.findStrain(slug);
        if (strain) {
          ownerGrid.appendChild(ownerPickCard(strain, index));
        }
      });
    }

    var stageHost = document.getElementById('home-growth-stages');
    if (stageHost) {
      stageHost.appendChild(GG.stageList(GG.GROWTH_STAGES, 'home-stage-grid'));
    }

    fillTotals();
    fillCounts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
