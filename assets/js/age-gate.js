/*
 * GanjaGuardian 18+ entry gate.
 * The gate is visible by default, so it still works if the script is slow.
 * The head snippet adds `age-ok` before paint when the answer is already stored.
 */
(function () {
  'use strict';

  var KEY = 'gg-age-ok';
  var root = document.documentElement;
  var gate = document.getElementById('age-gate');
  if (!gate) {
    return;
  }

  function hasAccepted() {
    try {
      return window.localStorage.getItem(KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  function closeGate() {
    gate.hidden = true;
    root.classList.remove('age-lock');
  }

  if (hasAccepted()) {
    root.classList.add('age-ok');
    closeGate();
    return;
  }

  root.classList.add('age-lock');
  var yes = document.getElementById('age-gate-yes');
  if (yes) {
    yes.addEventListener('click', function () {
      try {
        window.localStorage.setItem(KEY, 'true');
      } catch (error) {
        /* Storage can be unavailable; entering still works for this page. */
      }
      root.classList.add('age-ok');
      closeGate();
    });
    window.requestAnimationFrame(function () {
      yes.focus();
    });
  }
})();
