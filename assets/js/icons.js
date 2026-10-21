/*
 * GanjaGuardian static outline icon set.
 * All icons are trusted, local SVG markup. No external requests.
 */
(function () {
  'use strict';

  var GG = (window.GG = window.GG || {});

  var attrs =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';

  GG.ICONS = {
    leaf:
      '<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false">' +
      '<path d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(-26) scale(.94) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(26) scale(.94) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(-52) scale(.84) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(52) scale(.84) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(-76) scale(.7) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path transform="translate(50 60) rotate(76) scale(.7) translate(-50 -60)" d="M50 58C44 42 43 22 50 4C57 22 56 42 50 58Z"/>' +
      '<path d="M50 54v40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>',

    search:
      '<svg ' + attrs + '>' +
      '<circle cx="11" cy="11" r="6.5"/>' +
      '<path d="m16 16 5 5"/>' +
      '</svg>',

    info:
      '<svg ' + attrs + '>' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 11v5"/>' +
      '<path d="M12 7.6v.2"/>' +
      '</svg>',

    appetite:
      '<svg ' + attrs + '>' +
      '<path d="M12 8.5c-1.2-2.3-3.3-3.1-5.2-2.2C4.2 7.6 4.4 12 7 16c1.4 2.2 3 3.2 5 3.2s3.6-1 5-3.2c2.6-4 2.8-8.4.2-9.7-1.9-.9-4 0-5.2 2.2Z"/>' +
      '<path d="M12 8.5c0-2 1-3.7 3-4.5"/>' +
      '</svg>',

    'balanced-stones':
      '<svg ' + attrs + '>' +
      '<ellipse cx="12" cy="6.3" rx="3.1" ry="2"/>' +
      '<ellipse cx="12" cy="12.4" rx="5" ry="2.6"/>' +
      '<ellipse cx="12" cy="19" rx="7" ry="3"/>' +
      '</svg>',

    sleep:
      '<svg ' + attrs + '>' +
      '<path d="M20 14.7A8 8 0 1 1 9.3 4a6.3 6.3 0 0 0 10.7 10.7Z"/>' +
      '<path d="M14.5 6.5h4l-4 4.5h4"/>' +
      '</svg>',

    smile:
      '<svg ' + attrs + '>' +
      '<circle cx="12" cy="12" r="8.5"/>' +
      '<path d="M8.6 9.6v.2M15.4 9.6v.2"/>' +
      '<path d="M8 14.2c.9 1.5 2.3 2.3 4 2.3s3.1-.8 4-2.3"/>' +
      '</svg>',

    spark:
      '<svg ' + attrs + '>' +
      '<path d="M9.2 18h5.6"/>' +
      '<path d="M10.2 21h3.6"/>' +
      '<path d="M8.6 14.2a6 6 0 1 1 6.8 0c-.6.4-.9 1-.9 1.8h-5c0-.8-.3-1.4-.9-1.8Z"/>' +
      '</svg>',

    bolt:
      '<svg ' + attrs + '>' +
      '<path d="M13.2 2.5 5.5 14h5l-1.2 7.5L17 10h-5l1.2-7.5Z"/>' +
      '</svg>',

    sun:
      '<svg ' + attrs + '>' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/>' +
      '</svg>',

    moon:
      '<svg ' + attrs + '>' +
      '<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/>' +
      '</svg>',

    'dry-mouth':
      '<svg ' + attrs + '>' +
      '<path d="M6.4 8h10.8l-1.3 11.2a2 2 0 0 1-2 1.8H9.7a2 2 0 0 1-2-1.8L6.4 8Z"/>' +
      '<path d="M9.4 8V5.4h5.6"/>' +
      '<path d="m14.6 8 2.8-5"/>' +
      '</svg>',

    eye:
      '<svg ' + attrs + '>' +
      '<path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12Z"/>' +
      '<circle cx="12" cy="12" r="2.7"/>' +
      '</svg>',

    spiral:
      '<svg ' + attrs + '>' +
      '<path d="M12.4 12a.4.4 0 0 1-.4.4.4.4 0 0 1-.4-.4c0-.7.5-1.3 1.2-1.3 1.1 0 1.9.9 1.9 2 0 1.6-1.3 2.8-2.9 2.8-2.1 0-3.8-1.7-3.8-3.9 0-2.6 2.1-4.8 4.9-4.8 3.2 0 5.7 2.6 5.7 5.8 0 3.7-3 6.7-6.8 6.7-4.3 0-7.7-3.4-7.7-7.7"/>' +
      '</svg>',

    wood:
      '<svg ' + attrs + '>' +
      '<rect x="2.5" y="7" width="13" height="10" rx="2"/>' +
      '<ellipse cx="17" cy="12" rx="4.2" ry="5"/>' +
      '<path d="M17 9.4c-1.4 0-2.1 1.1-2.1 2.6s.7 2.6 2.1 2.6"/>' +
      '</svg>',

    pine:
      '<svg ' + attrs + '>' +
      '<path d="M12 2.8 7.4 10.6h2.8l-2.6 4.2h8.8l-2.6-4.2h2.8L12 2.8Z"/>' +
      '<path d="M12 14.8v6.4M9.6 21.2h4.8"/>' +
      '</svg>',

    landscape:
      '<svg ' + attrs + '>' +
      '<path d="M2.8 19.2h18.4"/>' +
      '<path d="m4.6 19.2 4.8-7.7 2.8 3.7 2.1-2.7 5.1 6.7"/>' +
      '<circle cx="16.4" cy="6.2" r="1.9"/>' +
      '</svg>',

    berry:
      '<svg ' + attrs + '>' +
      '<circle cx="9" cy="12.6" r="3.4"/>' +
      '<circle cx="15" cy="12.6" r="3.4"/>' +
      '<circle cx="12" cy="17.8" r="3.2"/>' +
      '<path d="M12 9.2V5.6"/>' +
      '<path d="M12 5.6c1.6-1.2 3.3-1.4 5-.6"/>' +
      '</svg>',

    sweet:
      '<svg ' + attrs + '>' +
      '<rect x="8" y="8" width="8" height="8" rx="3.6"/>' +
      '<path d="M8 10.2 4.2 7.3v9.4L8 13.8M16 10.2l3.8-2.9v9.4L16 13.8"/>' +
      '</svg>',

    herbal:
      '<svg ' + attrs + '>' +
      '<path d="M20 4c-8.2 0-14 4.1-14 10.2 0 3.2 2.3 5.8 5.7 5.8C18 20 20 12 20 4Z"/>' +
      '<path d="M4.2 20.2c1.9-5 4.9-8 9.8-10.2"/>' +
      '</svg>',

    diesel:
      '<svg ' + attrs + '>' +
      '<path d="M12 2.8s6.2 6.6 6.2 11.1a6.2 6.2 0 0 1-12.4 0C5.8 9.4 12 2.8 12 2.8Z"/>' +
      '<path d="M8.8 14.8a3.4 3.4 0 0 0 3.2 2.3"/>' +
      '</svg>',

    citrus:
      '<svg ' + attrs + '>' +
      '<circle cx="12" cy="12" r="8.2"/>' +
      '<path d="M12 3.8v16.4M3.8 12h16.4"/>' +
      '<path d="M6.2 6.2c3.2 3.2 8.4 3.2 11.6 0"/>' +
      '</svg>',

    mint:
      '<svg ' + attrs + '>' +
      '<path d="M12 20.2c-5 0-8.2-3.1-8.2-8.2 5.1 0 8.2 3.1 8.2 8.2Z"/>' +
      '<path d="M12 20.2c5 0 8.2-3.1 8.2-8.2-5.1 0-8.2 3.1-8.2 8.2Z"/>' +
      '<path d="M12 20.2V8"/>' +
      '</svg>',

    vanilla:
      '<svg ' + attrs + '>' +
      '<path d="M5.6 18.4C5.6 11 10.8 5.2 18.4 4.2c1.2 7.4-4.8 13.1-12.8 14.2Z"/>' +
      '<path d="M8.6 15.4c2-3 4.2-5.1 7.1-7.1"/>' +
      '</svg>'
  };
})();
