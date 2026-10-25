/*
 * GanjaGuardian safety notes.
 * The info buttons still open on hover and keyboard focus, but a click or tap
 * now pins the note open. It only closes on a second click, Escape, or a click
 * somewhere else. That makes the safety notes usable on touch screens.
 */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.safety-info');
  if (!buttons.length) {
    return;
  }

  var openButton = null;

  function tipFor(button) {
    var id = button.getAttribute('aria-describedby');
    return id ? document.getElementById(id) : null;
  }

  function closeOpen() {
    if (!openButton) {
      return;
    }
    var tip = tipFor(openButton);
    openButton.setAttribute('aria-expanded', 'false');
    openButton.classList.remove('is-open');
    if (tip) {
      tip.classList.remove('is-open');
    }
    openButton = null;
  }

  function open(button) {
    var tip = tipFor(button);
    if (!tip) {
      return;
    }
    closeOpen();
    button.setAttribute('aria-expanded', 'true');
    button.classList.add('is-open');
    tip.classList.add('is-open');
    openButton = button;
  }

  Array.prototype.forEach.call(buttons, function (button) {
    var tip = tipFor(button);
    if (!tip) {
      return;
    }

    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', tip.id);

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (openButton === button) {
        closeOpen();
      } else {
        open(button);
      }
    });

    tip.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });

  document.addEventListener('click', closeOpen);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      closeOpen();
    }
  });
})();
