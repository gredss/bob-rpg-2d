/**
 * router.js
 * Lightweight SPA router — requires an HTTP server (not file://).
 * Page HTML is fetched on demand from pages/{name}.html and cached
 * after the first load.
 *
 * Shell behaviour:
 *   home  → #top-nav hidden (full-viewport landing)
 *   stage → #top-nav visible (slides in from top)
 */

const Router = (() => {
  // ── State ────────────────────────────────────────────────────
  const STAGES = ['home', 'mcp', 'modes', 'cli', 'security', 'enterprise'];
  const _pages  = {};
  let currentIndex = 0;
  let _firstLoad = true;

  // ── Core: navigate to a page ─────────────────────────────────
  async function navigate(pageName) {
    const view = document.getElementById('page-view');
    if (!view) return;

    if (_pages[pageName]) {
      _inject(view, _pages[pageName], pageName);
      return;
    }

    // Fallback: fetch (works when served over http://)
    try {
      const res = await fetch(`pages/${pageName}.html`);
      if (!res.ok) throw new Error(`404: pages/${pageName}.html`);
      const html = await res.text();
      _pages[pageName] = html;
      _inject(view, html, pageName);
    } catch (err) {
      console.error('[Router]', err.message);
    }
  }

  // ── Inject HTML into the view ────────────────────────────────
  function _inject(view, html, pageName) {
    const isHome = pageName === 'home';
    const nav    = document.getElementById('top-nav');
    const spacer = document.getElementById('nav-spacer');

    if (_firstLoad) {
      // First load — nav already hidden via HTML class, just render
      _firstLoad = false;
      view.innerHTML = html;
      currentIndex = STAGES.indexOf(pageName);
      _syncUI(pageName);
      _runPageScripts(view);
      window.parent.postMessage({ type: 'bob:page-change', page: pageName }, '*');
      return;
    }

    // ── Fade out old content ──────────────────────────────────
    view.style.transition = 'opacity 160ms linear';
    view.style.opacity = '0';

    setTimeout(() => {
      view.innerHTML = html;
      currentIndex = STAGES.indexOf(pageName);
      _syncUI(pageName);
      _runPageScripts(view);

      // Force reflow
      view.getBoundingClientRect();

      // Fade new content in
      view.style.transition = 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)';
      view.style.opacity = '1';

      if (isHome) {
        // Going home — slide nav up smoothly, collapse spacer instantly
        nav.classList.remove('nav-gone');
        nav.classList.add('nav-hidden');
        spacer.style.transition = 'none';
        spacer.classList.remove('visible', 'hiding');
        setTimeout(() => nav.classList.add('nav-gone'), 350);
      } else if (nav.classList.contains('nav-hidden')) {
        // Coming from home — drop nav in
        nav.classList.remove('nav-gone');
        nav.style.transition = 'none';
        spacer.style.transition = 'none';
        spacer.classList.remove('visible', 'hiding');

        // Force reflow — paints hidden state
        nav.getBoundingClientRect();

        // Nav drops in, spacer grows
        nav.style.transition = '';
        spacer.style.transition = '';
        nav.classList.remove('nav-hidden');
        spacer.classList.add('visible');
      } else {
        // Already on a stage page — nav stays visible, no animation
        spacer.classList.add('visible');
      }

      window.parent.postMessage({ type: 'bob:page-change', page: pageName }, '*');
    }, 160);
  }

  // ── Sync active stage button states ──────────────────────────
  function _syncUI(pageName) {
    document.querySelectorAll('.stage-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });
  }

  // ── Re-execute <script data-page-script> tags ────────────────
  // Supports both inline scripts (textContent) and external src scripts.
  //
  // Note on shared IDs (bcp-body, bcp-messages, bcp-scripted-input, etc.):
  // Each page partial uses the same set of IDs because only ONE partial is
  // ever injected into #page-view at a time, keeping them unique at runtime.
  function _runPageScripts(container) {
    container.querySelectorAll('script[data-page-script]').forEach(old => {
      const s = document.createElement('script');
      if (old.src) {
        s.src = old.src;
      } else {
        s.textContent = old.textContent;
      }
      old.replaceWith(s);
    });
  }

  return { navigate, get current() { return STAGES[currentIndex]; } };
})();
