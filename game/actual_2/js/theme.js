/**
 * theme.js
 * Light / dark mode toggle.
 * Persists preference in localStorage under key 'bob-theme'.
 * Applies data-theme="light" on <html> for light mode; removes it for dark.
 */
(function () {
  const KEY    = 'bob-theme';
  const btn    = document.getElementById('theme-toggle');
  const root   = document.documentElement;

  // Apply saved preference immediately (before paint)
  const saved = localStorage.getItem(KEY);
  if (saved === 'light') root.setAttribute('data-theme', 'light');

  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem(KEY, 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(KEY, 'light');
    }
  });
})();
