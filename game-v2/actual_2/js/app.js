/**
 * app.js
 * Entry point — wires up navigation and boots the home page.
 *
 * Page HTML is fetched on demand from pages/{name}.html by Router.
 *
 * Load order (index.html):
 *   router.js → chat.js → chat-helpers.js → app.js
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {

    // ── Boot: show home page ──────────────────────────────────────
    Router.navigate('home');

    // ── Stage nav buttons ─────────────────────────────────────────
    document.querySelectorAll('.stage-btn').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate(btn.dataset.page));
    });

    // ── Brand logo → home ─────────────────────────────────────────
    document.querySelector('.nav-brand')?.addEventListener('click', () => {
      Router.navigate('home');
    });

  });
})();
