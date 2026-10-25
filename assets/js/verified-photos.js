/*
 * Verified strain photo overrides.
 * ---------------------------------------------------------------------------
 * Add a strain slug here only when the photo is actually that strain and the
 * licence allows redistribution. The photo object needs the same fields as the
 * photos in data.js: src, alt, author, license, licenseUrl, sourceUrl and
 * representative: false.
 *
 * Example:
 *   "gg4": {
 *     src: 'assets/images/Photos2/gg4.jpg',
 *     alt: 'GG4 cannabis flower',
 *     author: 'Photographer name',
 *     license: 'CC BY 4.0',
 *     licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
 *     sourceUrl: 'https://example.com/source',
 *     representative: false
 *   }
 *
 * Leave the object empty while there are no licensed strain-specific photos.
 * The site will use its labelled representative photo instead.
 */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});
  GG.VERIFIED_PHOTOS = {};
})();
