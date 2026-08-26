/**
 * dev-story/js/demo.js
 * Click-driven IBM Bob chat demo — real session replay.
 *
 * Turn 1 — Bob reads before.html, audits issues, then initialises a todo
 *           list panel (pinned at top of chat column) and announces the plan.
 * Turn 2 — Bob builds nuvora/index.html, checks off todo items as it goes,
 *           shows the "What changed" table, wrote-file pill (clickable).
 * Turn 3 — Mobile + contrast review, final sign-off, all todos green.
 *
 * Pattern: advance() → renderSegments() → updateUI(), gated by Send click.
 */

(function () {
  'use strict';

  /* ── Bob avatar ──────────────────────────────────────────────────────────── */
  const BOB_AVATAR = '../actual_2/asset/IBM_Bob_hero_illustration_head_color.svg';

  /* ── The page Bob builds ─────────────────────────────────────────────────── */
  const NEW_PAGE = 'nuvora/index.html';

  /* ── Todo items (shared state, mutated during Turn 2) ────────────────────── */
  const TODOS = [
    { id: 't1', label: 'Research and plan the visual overhaul design system' },
    { id: 't2', label: 'Create index.html with the modern premium layout' },
    { id: 't3', label: 'Ensure all bad practices from before.html are fixed' },
    { id: 't4', label: 'Use premium custom inline SVGs for all icons' },
    { id: 't5', label: 'Verify that index.html opens and displays properly' },
    { id: 't6', label: 'Present the final solution and details to the team' },
  ];

  /* ── DOM refs ────────────────────────────────────────────────────────────── */
  let body, welcome, msgs, inputEl, inputBox, sendBtn, expTree, chatCol;
  let todoPanel = null;   // injected once
  let step = 0;
  let busy = false;

  /* ── Script ──────────────────────────────────────────────────────────────── */
  const SCRIPT = [

    /* ═══════════════════════════════════════════════════════════════════════════
       Turn 1 — Bob reads the file, audits bad practices, plans the approach,
       initialises the todo list, and announces the design system.
       ═══════════════════════════════════════════════════════════════════════════ */
    {
      user: "The CEO wants a full visual overhaul of our website by Monday. It looks outdated — flat colours, system fonts, no depth. Modern and premium is the brief. Where do I start without breaking everything?",
      bob: [
        { type: 'text', text: "I will begin by exploring the workspace to see what files exist and particularly examine the before.html file, which is currently active. Let's list the files in our workspace." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">list_files</span><span class="bcpr-mcp-meta">1 tool · 1s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "I will now read the content of before.html to understand what the existing website looks like. This will give us a baseline for our visual overhaul." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">before.html · lines 1–480 · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "I see the outline of before.html. Let's read the full file so we can see the exact styles, structures, and classes used. It is about 732 lines. Let's read the whole file." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">before.html · lines 481–732 · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "Let's create a new file called index.html — a new modern page that contains the complete modernized, responsive version of the website, while keeping before.html as the raw historical version.\n\nLet me analyze the bad practices in before.html:" },
        { type: 'rich', html:
          `<div class="ds-table-wrap">
            <div class="ds-table-label">Bad practices found in before.html</div>
            <table class="ds-table">
              <thead><tr><th>Issue</th><th>Why it's bad</th><th>Fix</th></tr></thead>
              <tbody>
                <tr><td><code>initial-scale=1</code> only — missing <code>width=device-width</code></td><td>Mobile layout breaks completely</td><td>Correct viewport meta tag</td></tr>
                <tr><td>Duplicate &lt;meta name="description"&gt;</td><td>Bad SEO — search engines ignore both</td><td>Single, specific description</td></tr>
                <tr><td><code>overflow-x: hidden</code> on body</td><td>Masking broken mobile layout, not fixing it</td><td>Fix the layout properly</td></tr>
                <tr><td>Hardcoded grid columns, no @media queries</td><td>Breaks at ~900px — features, pricing, footer all collapse wrong</td><td><code>repeat(auto-fit, minmax(280px, 1fr))</code></td></tr>
                <tr><td>Copy-pasted button styles, no shared base</td><td>Unmaintainable — padding/font changes need 4 edits</td><td>Shared <code>.btn-base</code> + modifier classes</td></tr>
                <tr><td>Plain text company logos</td><td>Fake, untrustworthy social proof</td><td>Custom geometric inline SVGs</td></tr>
                <tr><td>#bbbbbb / #cccccc on white</td><td>WCAG AA fail — 2.3:1 contrast ratio</td><td>Dark bg + high-contrast palette → 10:1+</td></tr>
                <tr><td>Raw #0055ff blue</td><td>Unbranded Bootstrap feel</td><td>Premium indigo/violet gradient palette</td></tr>
              </tbody>
            </table>
          </div>` },
        { type: 'text', text: "We should provide a highly premium design in a new index.html — all the content from before.html, designed like a world-class SaaS website (Linear, Vercel, Stripe register).\n\nDesign decisions:\n• Font: Plus Jakarta Sans — modern, polished, popular among top SaaS\n• Palette: #030712 deep dark bg · #818cf8 violet accent · #9ca3af body text\n• Cards: glassmorphism, subtle borders, backdrop-filter blur\n• Layout: CSS Grid auto-fit, mathematically responsive — no overflow hacks\n• Hero: radial glow orbs, gradient text clip, trust badge\n• Partner logos: custom geometric inline SVGs\n• Feature icons: hand-crafted SVG paths, gradient tile backgrounds\n• Pricing: glow border on featured card, gradient POPULAR badge\n• Interactive cursor spotlight on feature cards (vanilla JS, ~10 lines)" },
        // ← todo panel appears right before this line
        { type: 'todo-init' },
        { type: 'text', text: "Let's initialize a todo list to track our progress using update_todo_list. I will start by adding the tasks. Let's make sure our plan covers everything perfectly." },
        { type: 'todo-active', id: 't1' },
        { type: 'text', text: "Let's lay out the visual overhaul design details:\n\nTypography: 'Plus Jakarta Sans', system-ui, sans-serif — imported from Google Fonts.\n\nColor palette:\n  background-primary: #030712\n  background-secondary: #0b0f19\n  text-primary: #f9fafb\n  text-secondary: #9ca3af  (WCAG 4.5:1 on dark bg)\n  accent-purple: #818cf8\n  accent-blue: #60a5fa\n  border-subtle: rgba(255,255,255,0.08)\n\nSVG visuals: Nuvora logo emblem, 6 partner logo SVGs, feature icons with gradient backgrounds, pricing checkmarks.\n\nI will now update the todo list to mark research & planning as in progress." },
        { type: 'todo-done', id: 't1' },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════════════
       Turn 2 — Bob builds the full page, checks off todos live.
       ═══════════════════════════════════════════════════════════════════════════ */
    {
      user: "Yes — build it. Full premium page.",
      bob: [
        { type: 'todo-active', id: 't2' },
        { type: 'text', text: "Now, I will write the complete index.html with a modern, ultra-premium design — fully responsive, high-contrast, accessible, and clean. It will contain all the sections and copy from before.html but with professional design standards: glassmorphic elements, glowing backgrounds, smooth transitions, beautiful spacing, custom SVG illustrations, typography gradients, and custom SVGs for partner logos." },
        { type: 'writing' },
        { type: 'wrote', filename: 'nuvora/index.html' },
        { type: 'text', text: "I have successfully written the index.html file with a highly polished design. Let's now verify that we have resolved all bad practices from before.html." },
        { type: 'todo-done', id: 't2' },
        { type: 'todo-active', id: 't3' },
        { type: 'rich', html:
          `<div class="ds-table-wrap">
            <div class="ds-table-label">Bad practice verification — before.html → index.html</div>
            <table class="ds-table">
              <thead><tr><th>Legacy practice</th><th>Premium resolution</th><th>Technical advantage</th></tr></thead>
              <tbody>
                <tr><td>Missing responsive viewport (<code>initial-scale=1</code> only)</td><td>Correct viewport meta-tag (<code>width=device-width, initial-scale=1.0</code>)</td><td>Naturally configures layouts across all modern device viewports</td></tr>
                <tr><td>Duplicate meta descriptions</td><td>Single, rich SEO meta description</td><td>Prevents search engine penalties and boosts indexing score</td></tr>
                <tr><td>Masked mobile breakages (<code>overflow-x: hidden</code> on body)</td><td>Fluid columns, elastic flexboxes, and responsive grids</td><td>Eliminates accidental horizontal scrolling mathematically</td></tr>
                <tr><td>Hardcoded tables/grids (rigid columns, no @media rules)</td><td>CSS Grid <code>repeat(auto-fit, minmax(280px, 1fr))</code></td><td>Seamlessly cascades cards from 3–4 columns down to 1 on mobile</td></tr>
                <tr><td>Low contrast elements (grey on white, failing WCAG AA)</td><td>Dark #030712 backdrop with white text &amp; glow highlights</td><td>Passes WCAG AAA standards — 10:1+ contrast ratio</td></tr>
                <tr><td>Plain bold text company logos</td><td>Custom-crafted minimalist geometric inline SVGs</td><td>Elevates social proof to a premium, trustworthy standard</td></tr>
                <tr><td>Repeated button duplication</td><td>Reusable <code>.btn-base</code> class with gradient &amp; outline modifiers</td><td>Unifies button paddings, font sizing, and transition curves</td></tr>
                <tr><td>Raw inline style overrides for badges</td><td>Structured class definitions, <code>.popular-badge</code> gradient</td><td>Maintainable, themeable, consistent</td></tr>
              </tbody>
            </table>
          </div>` },
        { type: 'todo-done', id: 't3' },
        { type: 'todo-active', id: 't4' },
        { type: 'text', text: "Custom SVG visuals shipped:\n• Nuvora logo — sleek geometric node-flow emblem with linear gradient\n• 6 partner logos — Meridian, Celstio, Loftvault, Quantra, Brixly, Fenwick Co. — each a distinct minimal geometric SVG, grayscale default, color on hover\n• Feature icons — 6 hand-crafted paths, gradient icon tile backgrounds\n• Pricing checkmarks — clean circular check SVGs\n\nAll inline, zero network requests, perfectly consistent across every OS and browser." },
        { type: 'todo-done', id: 't4' },
        { type: 'footer', count: '1 file written · nuvora/index.html · all sections present' },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════════════
       Turn 3 — Bob verifies, creates the report artifact, marks all done.
       ═══════════════════════════════════════════════════════════════════════════ */
    {
      user: "Looks incredible. Can you do a final review and give me a summary report I can share with the CEO?",
      bob: [
        { type: 'todo-active', id: 't5' },
        { type: 'text', text: "Let's review the code to ensure there are no syntax errors, missing closing tags, or broken structures." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">nuvora/index.html · full verification · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'rich', html:
          `<div class="ds-plan">
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">Structure</span><span class="ds-plan-desc"><code>&lt;!DOCTYPE html&gt;</code> · <code>&lt;html lang="en"&gt;</code> · head/body/html all closed correctly. 673 lines. All sections semantic.</span></div></div>
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">Content parity</span><span class="ds-plan-desc">Hero h1, subheadline, 6 logos, 6 features, 4 steps, 3 testimonials, 3 pricing tiers, CTA banner, footer — all match before.html exactly.</span></div></div>
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">SVG integrity</span><span class="ds-plan-desc">All linearGradient IDs unique (logo_grad_1–6), correct viewBox, paths closed.</span></div></div>
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">Interactive spotlight</span><span class="ds-plan-desc">Vanilla JS tracks <code>mousemove</code> on <code>.feature-card</code> → updates <code>--x</code> / <code>--y</code> CSS variables. Clean, no dependencies.</span></div></div>
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">Mobile nav toggle</span><span class="ds-plan-desc">Hamburger toggles <code>.navbar-links</code> and <code>.navbar-actions</code> display safely. No layout flash.</span></div></div>
            <div class="ds-plan-item"><span class="ds-plan-num" style="color:#4ade80">✓</span><div class="ds-plan-body"><span class="ds-plan-title">WCAG contrast</span><span class="ds-plan-desc">#f9fafb on #030712 = 19.5:1 AAA · #9ca3af on #030712 = 7.2:1 AAA · all elements pass.</span></div></div>
          </div>` },
        { type: 'todo-done', id: 't5' },
        { type: 'todo-active', id: 't6' },
        { type: 'text', text: "Creating the overhaul summary report — design system, before/after comparisons, compliance benchmarks, and next steps for the engineering team." },
        { type: 'rich', html:
          `<div class="ds-artifact-pill">
            <span class="ds-artifact-icon">&#128196;</span>
            <div class="ds-artifact-body">
              <span class="ds-artifact-title">Nuvora Visual Overhaul Report</span>
              <span class="ds-artifact-sub">Comprehensive architectural report on the premium visual overhaul and code optimization.</span>
            </div>
            <a href="nuvora/report.html" target="_blank" class="ds-artifact-open">Open ↗</a>
          </div>` },
        { type: 'text', text: "Nuvora website overhaul is complete.\n\nnuvora/index.html is production-ready. Every word of copy and every section from before.html is preserved — only the styling was rebuilt from the ground up using a unified design system.\n\n3 premium additions beyond the fix list:\n• Ambient backlight glows — CSS radial-gradient orbs behind content, zero images\n• Interactive cursor spotlight — vanilla JS mousemove updates --x / --y CSS variables per feature card\n• Gradient text masks — background-clip: text on headings\n\nShare nuvora/index.html with the CEO." },
        { type: 'todo-done', id: 't6' },
        { type: 'footer', count: '1 file written · report generated · all 6 tasks complete' },
      ],
    },
  ];

  /* ════════════════════════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════════════════════ */
  function initChat() {
    body     = document.getElementById('bcp-body');
    welcome  = document.getElementById('bcp-welcome');
    msgs     = document.getElementById('bcp-messages');
    inputEl  = document.getElementById('bcp-scripted-input');
    inputBox = document.getElementById('bcp-input-box');
    sendBtn  = document.getElementById('bcp-send');
    expTree  = document.querySelector('.bcp-exp-tree');
    chatCol  = document.querySelector('.bcp-chat-col');

    // Pre-seed explorer with the old site
    addExplorerFile('before.html');

    sendBtn.addEventListener('click', advance);

    // Click anywhere in the chat body while Bob is typing → skip current typewrite
    body.addEventListener('click', e => {
      // don't interfere with buttons/links
      if (e.target.closest('button,a,[role="button"]')) return;
      if (!busy) return;
      skipCurrentTypewrite();
    });

    updateUI();
  }

  /* ════════════════════════════════════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════════════════════════════════ */
  function scrollToBottom() {
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
  }

  function activateChat() {
    if (!msgs.classList.contains('active')) {
      welcome.classList.add('hidden');
      msgs.classList.add('active');
    }
  }

  /* ════════════════════════════════════════════════════════════════════════════
     MESSAGE BUILDERS
     ══════════════════════════════════════════════════════════════════════════ */
  function addUserMsg(text) {
    const row = document.createElement('div');
    row.className = 'bcp-msg-user';
    const b = document.createElement('div');
    b.className = 'bcp-user-bubble';
    b.textContent = text;
    row.appendChild(b);
    msgs.appendChild(row);
    scrollToBottom();
  }

  function addBobRow() {
    const row = document.createElement('div');
    row.className = 'bcp-msg-bob';
    const av = document.createElement('img');
    av.src = BOB_AVATAR; av.alt = 'Bob'; av.className = 'bcp-bob-avatar';
    row.appendChild(av);
    const c = document.createElement('div');
    c.className = 'bcp-bob-content';
    const n = document.createElement('div');
    n.className = 'bcp-bob-name'; n.textContent = 'IBM Bob';
    c.appendChild(n);
    row.appendChild(c);
    msgs.appendChild(row);
    return c;
  }

  /* ── active typewrite handle (for skip) ───────────────────── */
  let _twResolve = null;
  let _twEl      = null;
  let _twFull    = null;
  let _twTimer   = null;

  function typewrite(el, text, speed = 9) {
    // cancel any previous in-flight write
    if (_twTimer) { clearTimeout(_twTimer); _twTimer = null; }
    _twEl   = el;
    _twFull = text;
    return new Promise(resolve => {
      _twResolve = resolve;
      let i = el.textContent.length; // resume from current position
      // reset
      el.textContent = '';
      i = 0;
      function tick() {
        if (i >= text.length) {
          _twResolve = null; _twEl = null; _twFull = null; _twTimer = null;
          resolve();
          return;
        }
        el.textContent += text[i++];
        scrollToBottom();
        _twTimer = setTimeout(tick, speed);
      }
      tick();
    });
  }

  function skipCurrentTypewrite() {
    if (!_twResolve) return false;
    clearTimeout(_twTimer); _twTimer = null;
    if (_twEl && _twFull !== null) _twEl.textContent = _twFull;
    scrollToBottom();
    const res = _twResolve;
    _twResolve = null; _twEl = null; _twFull = null;
    res();
    return true;
  }

  function appendWritingBar(contentDiv) {
    const el = document.createElement('div');
    el.className = 'bcp-working-bar';
    el.innerHTML =
      `<svg class="bcp-hammer-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">` +
      `<path d="M9 2L14 7L7 14L2 9L9 2Z" stroke="#858585" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M12 1L15 4" stroke="#858585" stroke-width="1.4" stroke-linecap="round"/>` +
      `</svg><span class="bcp-working-text">Writing file</span>`;
    contentDiv.appendChild(el);
    scrollToBottom();
    return el;
  }

  function appendWroteFile(contentDiv, filename) {
    const el = document.createElement('div');
    el.className = 'bcp-wrote-file';
    el.style.cursor = 'pointer';
    el.title = 'Open ' + filename;
    el.innerHTML =
      `<span class="bcp-wrote-file-icon">&#9998;</span>` +
      `<span class="bcp-wrote-file-name">${filename}</span>` +
      `<span class="bcp-wrote-file-arrow">›</span>`;
    if (OPENABLE[filename]) {
      el.addEventListener('click', () => window.open(OPENABLE[filename], '_blank'));
    }
    contentDiv.appendChild(el);
    addExplorerFile(filename);
    scrollToBottom();
  }

  function appendRich(contentDiv, html) {
    const el = document.createElement('div');
    el.className = 'bcpr-rich';
    el.innerHTML = html;
    contentDiv.appendChild(el);
    scrollToBottom();
  }

  function appendFooter(contentDiv, count) {
    const el = document.createElement('div');
    el.className = 'bcpr-file-footer';
    el.innerHTML =
      `<span class="bcpr-file-footer-icon">&#128194;</span>` +
      `<span class="bcpr-file-footer-count">${count}</span>` +
      `<span class="bcpr-file-footer-sep"></span>` +
      `<button class="bcpr-file-footer-btn">Show all</button>` +
      `<span class="bcpr-file-footer-chevron">&#8964;</span>`;
    contentDiv.appendChild(el);
    scrollToBottom();
  }

  const OPENABLE = {
    'before.html':        'before.html',
    'nuvora/index.html':  'nuvora/index.html',
    'nuvora/report.html': 'nuvora/report.html',
  };

  function addExplorerFile(filename) {
    if (!expTree) return;
    if (expTree.querySelector(`[data-expfile="${CSS.escape(filename)}"]`)) return;
    const file = document.createElement('div');
    file.className = 'bcp-exp-file active';
    file.setAttribute('data-expfile', filename);
    file.innerHTML =
      `<span class="bcp-exp-file-icon">&#128196;</span>` +
      `<span class="bcp-exp-file-name">${filename}</span>`;
    if (OPENABLE[filename]) {
      file.style.cursor = 'pointer';
      file.title = 'Open ' + filename;
      file.addEventListener('click', () => window.open(OPENABLE[filename], '_blank'));
    }
    expTree.appendChild(file);
    setTimeout(() => file.classList.remove('active'), 3000);
  }

  /* ════════════════════════════════════════════════════════════════════════════
     TODO PANEL
     ══════════════════════════════════════════════════════════════════════════ */
  function createTodoPanel() {
    const panel = document.createElement('div');
    panel.className = 'ds-todo-panel';
    panel.id = 'ds-todo-panel';

    // header (click to collapse/expand)
    const header = document.createElement('div');
    header.className = 'ds-todo-header';
    header.innerHTML =
      `<span class="ds-todo-header-icon">&#9744;</span>` +
      `<span class="ds-todo-header-title">Todo List</span>` +
      `<span class="ds-todo-header-count" id="ds-todo-count">0 / ${TODOS.length}</span>` +
      `<span class="ds-todo-header-chevron">›</span>`;
    header.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    // body
    const bodyEl = document.createElement('div');
    bodyEl.className = 'ds-todo-body';
    const list = document.createElement('div');
    list.className = 'ds-todo-list';
    list.id = 'ds-todo-list';

    TODOS.forEach(t => {
      const item = document.createElement('div');
      item.className = 'ds-todo-item';
      item.id = 'ds-todo-' + t.id;
      item.innerHTML = `<span class="ds-todo-dot"></span><span class="ds-todo-label">${t.label}</span>`;
      list.appendChild(item);
    });

    bodyEl.appendChild(list);
    panel.appendChild(header);
    panel.appendChild(bodyEl);

    // Insert before bcp-body (top of chat column)
    if (chatCol) {
      const bodyNode = document.getElementById('bcp-body');
      chatCol.insertBefore(panel, bodyNode);
    }

    todoPanel = panel;
    // open immediately
    setTimeout(() => panel.classList.add('open'), 50);
  }

  function todoSetActive(id) {
    const el = document.getElementById('ds-todo-' + id);
    if (el) el.className = 'ds-todo-item active';
    refreshTodoCount();
  }

  function todoSetDone(id) {
    const el = document.getElementById('ds-todo-' + id);
    if (el) el.className = 'ds-todo-item done';
    refreshTodoCount();
    // if all done — update header icon
    const all = document.querySelectorAll('#ds-todo-list .ds-todo-item');
    const done = document.querySelectorAll('#ds-todo-list .ds-todo-item.done');
    if (all.length && all.length === done.length) {
      const icon = document.querySelector('#ds-todo-panel .ds-todo-header-icon');
      if (icon) { icon.textContent = '✓'; icon.style.color = '#4ade80'; }
      const title = document.querySelector('#ds-todo-panel .ds-todo-header-title');
      if (title) { title.textContent = 'All tasks completed!'; title.style.color = '#4ade80'; }
    }
  }

  function refreshTodoCount() {
    const done = document.querySelectorAll('#ds-todo-list .ds-todo-item.done').length;
    const el = document.getElementById('ds-todo-count');
    if (el) el.textContent = `${done} / ${TODOS.length}`;
  }

  /* ════════════════════════════════════════════════════════════════════════════
     SEGMENT RENDERER
     ══════════════════════════════════════════════════════════════════════════ */
  async function renderSegments(segments) {
    let contentDiv = null;

    for (const seg of segments) {

      if (seg.type === 'text') {
        contentDiv = addBobRow();
        const textEl = document.createElement('div');
        textEl.className = 'bcp-bob-text';
        contentDiv.appendChild(textEl);
        await typewrite(textEl, seg.text);
        await delay(300);
      }
      else if (seg.type === 'rich') {
        if (!contentDiv) contentDiv = addBobRow();
        appendRich(contentDiv, seg.html);
        await delay(200);
      }
      else if (seg.type === 'writing') {
        if (!contentDiv) contentDiv = addBobRow();
        const bar = appendWritingBar(contentDiv);
        await delay(1600);
        bar.remove();
      }
      else if (seg.type === 'wrote') {
        if (!contentDiv) contentDiv = addBobRow();
        appendWroteFile(contentDiv, seg.filename);
        await delay(300);
      }
      else if (seg.type === 'footer') {
        if (!contentDiv) contentDiv = addBobRow();
        appendFooter(contentDiv, seg.count);
      }
      // ── todo controls ──────────────────────────────────────────
      else if (seg.type === 'todo-init') {
        createTodoPanel();
        await delay(500);
      }
      else if (seg.type === 'todo-active') {
        todoSetActive(seg.id);
        await delay(300);
      }
      else if (seg.type === 'todo-done') {
        todoSetDone(seg.id);
        await delay(400);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════════════════════
     MAIN LOOP
     ══════════════════════════════════════════════════════════════════════════ */
  function updateUI() {
    if (step < SCRIPT.length) {
      inputEl.textContent = SCRIPT[step].user;
      inputEl.classList.add('ready');
      inputBox.classList.add('active');
      sendBtn.disabled = false;
      sendBtn.classList.add('pulse');
    } else {
      inputEl.textContent = 'End of demo';
      inputEl.classList.remove('ready');
      inputBox.classList.remove('active');
      sendBtn.disabled = true;
      sendBtn.classList.remove('pulse');

      const wrap = document.createElement('div');
      wrap.className = 'bcp-done-wrap';
      wrap.innerHTML =
        `<p>Follow up or start new task <kbd>Ctrl N</kbd></p>` +
        `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">` +
        `<button class="bcp-restart-btn">↺ Restart</button>` +
        `<button class="bcp-continue-btn">Continue →</button>` +
        `</div>`;
      msgs.appendChild(wrap);
      scrollToBottom();

      wrap.querySelector('.bcp-continue-btn').addEventListener('click', () => {
        location.href = '../scene-developer.html';
      });

      wrap.querySelector('.bcp-restart-btn').addEventListener('click', () => {
        step = 0;
        msgs.innerHTML = '';
        // remove todo panel
        const existing = document.getElementById('ds-todo-panel');
        if (existing) existing.remove();
        todoPanel = null;
        // remove injected explorer files
        if (expTree) expTree.querySelectorAll('.bcp-exp-file').forEach(f => f.remove());
        addExplorerFile('before.html');
        activateChat();
        updateUI();
      });
    }
  }

  async function advance() {
    if (busy || step >= SCRIPT.length) return;
    busy = true;
    sendBtn.disabled = true;
    sendBtn.classList.remove('pulse');
    inputBox.classList.remove('active');

    activateChat();
    body.classList.add('bob-typing');

    const cur = SCRIPT[step];
    addUserMsg(cur.user);
    inputEl.textContent = '';
    inputEl.classList.remove('ready');

    await delay(600);
    await renderSegments(cur.bob);

    body.classList.remove('bob-typing');
    step++;
    busy = false;
    updateUI();
  }

  /* ── util ─────────────────────────────────────────────────────────────────── */
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

})();
