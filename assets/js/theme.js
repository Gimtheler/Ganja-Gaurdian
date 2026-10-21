/*
 * GanjaGuardian light/dark theme toggle.
 * The stored value is used before paint to avoid a flash; the button is added
 * to the header after the document is ready.
 */
(function () {
  'use strict';

  var GG = (window.GG = window.GG || {});
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var STORAGE_KEY = 'gg-theme';

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function systemTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || systemTheme();
  }

  var initial = storedTheme();
  if (initial) {
    root.setAttribute('data-theme', initial);
  }

  function syncButton() {
    var button = document.getElementById('theme-toggle');
    if (!button) {
      return;
    }
    var theme = currentTheme();
    var icon = button.querySelector('.theme-toggle__icon');
    if (icon && GG.ICONS) {
      icon.innerHTML = GG.ICONS[theme === 'dark' ? 'sun' : 'moon'];
    }
    var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        /* Ignore unavailable storage. */
      }
    }
    syncButton();
  }

  function attach() {
    var nav = document.querySelector('.site-nav');
    if (!nav || document.getElementById('theme-toggle')) {
      syncButton();
      return;
    }

    var right = document.createElement('div');
    right.className = 'site-header__right';
    nav.parentNode.insertBefore(right, nav);
    right.appendChild(nav);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.id = 'theme-toggle';
    button.setAttribute('aria-label', 'Switch to dark mode');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('title', 'Switch to dark mode');

    var icon = document.createElement('span');
    icon.className = 'icon theme-toggle__icon';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);
    right.appendChild(button);

    button.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
    });

    syncButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (!root.getAttribute('data-theme')) {
        syncButton();
      }
    });
  }
})();
