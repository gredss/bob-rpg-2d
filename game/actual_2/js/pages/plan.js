/**
 * js/pages/plan.js
 * Scripted demo for the Plan page.
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    /* ── Step 0 ── */
    {
      user: "bob, i have an upcoming project to create a custom MCP server for IBM DataStage. help me plan how this project would go",
      skill: "Used skill create-plan",
      bob: "I'll follow the structured planning workflow. Let me start by gathering requirements with some targeted questions.\n\nWhat is the primary goal of this custom MCP server for IBM DataStage? Which capabilities do you want it to expose?",
      choices: [
        "Full lifecycle management — list/create/edit/delete DataStage flows and jobs, compile, run, and monitor job status",
        "Read-only operations only — list projects, flows, jobs, and fetch run logs for AI-assisted observability and troubleshooting",
        "Migration-focused — export flows from one environment, convert to Python SDK code, and import into another environment",
        "Custom scope — I'll describe what I need"
      ],
      hintChoice: 1
    },
    /* ── Step 1 ── */
    {
      user: null,
      bob: "What transport mechanism should the MCP server use?",
      choices: [
        "stdio — local process, called by an AI assistant like Bob directly",
        "HTTP/SSE — remote server, accessible over a network endpoint",
        "Both — support stdio for local dev and HTTP for production deployment"
      ],
      hintChoice: 0
    },
    /* ── Step 2 ── */
    {
      user: null,
      bob: "What language/runtime should the MCP server be built in?",
      choices: [
        "Python (using the MCP Python SDK)",
        "Node.js / TypeScript (using the MCP TypeScript SDK)",
        "No preference — recommend the best fit"
      ],
      hintChoice: 0
    },
    /* ── Step 3 ── */
    {
      user: null,
      bob: "How should the MCP server authenticate with IBM DataStage (IBM Cloud Pak for Data)?",
      choices: [
        "IBM Cloud IAM API Key (passed via environment variable)",
        "CPD username + password (passed via environment variables)",
        "CPD Bearer Token (pre-generated, passed via environment variable)",
        "Both IAM API Key and CPD username/password options supported, selectable at config time"
      ],
      hintChoice: 1
    },
    /* ── Step 4 ── */
    {
      user: null,
      bob: "Good. Let me ask a few more targeted questions to nail down the remaining scope.\n\nWhich IBM DataStage deployment target should the server connect to?",
      choices: [
        "IBM Cloud Pak for Data (self-hosted / on-prem CPD instance)",
        "IBM DataStage as a Service on IBM Cloud (watsonx / SaaS)",
        "Both — the server should support either via config"
      ],
      hintChoice: 1
    },
    /* ── Step 5 ── */
    {
      user: null,
      bob: "Should the server expose raw API responses, or return clean, human-readable summaries optimised for LLM consumption?",
      choices: [
        "Return clean, summarised, LLM-friendly text (recommended for AI observability use case)",
        "Return raw JSON from the DataStage API as-is",
        "Both — structured JSON plus a human-readable summary field"
      ],
      hintChoice: 1
    },
    /* ── Step 6 ── */
    {
      user: null,
      bob: "Should the MCP server be registered and wired up into Bob's MCP configuration as part of this project?",
      choices: [
        "Yes — scaffold the server AND register it in Bob's MCP config so it's immediately usable",
        "No — just build the server code; registration is out of scope"
      ],
      hintChoice: 0
    },
    /* ── Step 7 — rich render, no plain bob string ── */
    {
      user: null,
      richBob: true
    }
  ];

  /* ── Autoplay video on page load ── */
  const videoEl = document.getElementById('plan-video-el');
  if (videoEl) {
    videoEl.play().catch(() => {/* autoplay blocked — user can press play manually */});
  }

  /* ── FAB → chatbox transition ── */
  const landingEl  = document.getElementById('plan-landing');
  const chatViewEl = document.getElementById('plan-chat-view');
  const fabWrap    = document.getElementById('plan-bob-fab-wrap');

  function openChat() {
    landingEl.classList.add('plan-landing--out');
    fabWrap.style.opacity = '0';
    fabWrap.style.pointerEvents = 'none';
    setTimeout(() => {
      landingEl.style.display = 'none';
      fabWrap.style.display = 'none';
      chatViewEl.classList.remove('hidden');
      chatViewEl.classList.add('plan-chat-view--in');
    }, 320);
  }

  fabWrap.addEventListener('click', openChat);

  /* ── DOM refs ── */
  const body          = document.getElementById('bcp-body');
  const welcome       = document.getElementById('bcp-welcome');
  const msgs          = document.getElementById('bcp-messages');
  const inputEl       = document.getElementById('bcp-scripted-input');
  const inputBox      = document.getElementById('bcp-input-box');
  const sendBtn       = document.getElementById('bcp-send');
  const sendHintEl    = document.getElementById('bcp-send-hint');
  const hintEl        = document.getElementById('bcp-hint');
  const hintBtn       = document.getElementById('bcp-hint-btn');
  const counterVal    = document.getElementById('bcp-counter-val');
  const counterTipPct = document.getElementById('bcp-counter-tip-pct');
  const counterTipVal = document.getElementById('bcp-counter-tip-val');

  let step = 0, busy = false, choiceMade = false;

  /* ── Budget counter ── */
  const BUDGET_TOTAL = 500;
  const STEP_COST    = [0.102, 0.318, 0.541, 0.823, 1.204, 1.687, 2.391, 4.218];
  let currentSpend   = 0;
  let coinMode       = false;

  function updateCounter(spend) {
    currentSpend = spend;
    const pctUsed = (spend / BUDGET_TOTAL) * 100;
    const pctLeft = Math.max(0, 100 - pctUsed);
    counterVal.textContent    = coinMode ? spend.toFixed(3) : pctUsed.toFixed(0) + '%';
    counterTipPct.textContent = pctLeft.toFixed(0) + '% Budget remaining';
    counterTipVal.textContent = spend.toFixed(3) + ' / ' + BUDGET_TOTAL.toFixed(2);
  }

  function animateCounter(toSpend) {
    const from = currentSpend, duration = 600, start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      updateCounter(from + (toSpend - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── Helpers ── */
  function scrollToBottom() { body.scrollTop = body.scrollHeight; }

  function activateChat() {
    if (!msgs.classList.contains('active')) {
      welcome.classList.add('hidden');
      msgs.classList.add('active');
      coinMode = true;
      const iconEl = document.getElementById('bcp-counter-icon');
      iconEl.outerHTML =
        '<svg id="bcp-counter-icon" class="bcp-counter-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="8" cy="8" r="6" stroke="white" stroke-width="1.8"/>' +
        '<circle cx="8" cy="8" r="3" fill="white"/></svg>';
    }
  }

  function addUserMsg(text) {
    const row    = document.createElement('div'); row.className = 'bcp-msg-user';
    const bubble = document.createElement('div'); bubble.className = 'bcp-user-bubble';
    const span   = document.createElement('span'); span.className = 'bcp-user-bubble-text'; span.textContent = text;
    bubble.appendChild(span); row.appendChild(bubble); msgs.appendChild(row); scrollToBottom();
  }

  function createBobBlock() {
    const row     = document.createElement('div'); row.className = 'bcp-msg-bob';
    const content = document.createElement('div'); content.className = 'bcp-bob-content';
    row.appendChild(content); msgs.appendChild(row); scrollToBottom();
    return content;
  }

  function showTyping() {
    if (document.getElementById('bcp-working-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'bcp-working-bar';
    bar.className = 'bcp-working-bar';
    bar.innerHTML =
      '<svg class="bcp-hammer-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="10" y="2" width="7" height="4" rx="1" fill="#858585"/>' +
        '<rect x="8" y="4" width="3" height="10" rx="1" fill="#6e6e6e" transform="rotate(-20 8 4)"/>' +
      '</svg>' +
      '<span class="bcp-working-text">I\'m working on it...</span>';
    body.appendChild(bar);
  }

  function hideTyping() { document.getElementById('bcp-working-bar')?.remove(); }

  function typewrite(el, text) {
    return new Promise(resolve => {
      let i = 0;
      function tick() {
        if (i >= text.length) { resolve(); return; }
        el.textContent += text[i++]; scrollToBottom(); setTimeout(tick, 10);
      }
      tick();
    });
  }

  function renderChoices(content, choices, hintIdx) {
    return new Promise(resolve => {
      const wrapOuter = document.createElement('div'); wrapOuter.className = 'bcp-choices-wrap';
      const wrap      = document.createElement('div'); wrap.className = 'bcp-choices';
      const btns      = [];

      choices.forEach((label, idx) => {
        const btn = document.createElement('button'); btn.className = 'bcp-choice';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          if (choiceMade) return;
          choiceMade = true;
          wrapOuter.querySelector('.bcp-choice-hint-btn')?.remove();
          wrap.querySelectorAll('.bcp-choice').forEach((b, i) => {
            b.classList.add(i === idx ? 'chosen' : 'dimmed');
          });
          resolve({ idx, label });
        });
        btns.push(btn);
        wrap.appendChild(btn);
      });

      wrapOuter.appendChild(wrap);

      if (hintIdx != null) {
        const targetBtn  = btns[hintIdx];
        const hintButton = document.createElement('button'); hintButton.className = 'bcp-choice-hint-btn';
        hintButton.innerHTML =
          '<span class="bcp-hint-ring"></span>' +
          '<span class="bcp-hint-ring"></span>' +
          '<span class="bcp-hint-ring"></span>' +
          '<span class="bcp-hint-dot"></span>';
        hintButton.addEventListener('click', () => { if (!choiceMade) targetBtn.click(); });
        const rowHeight = 41;
        hintButton.style.top = (hintIdx * rowHeight + rowHeight / 2 - 16) + 'px';
        wrapOuter.appendChild(hintButton);
      }

      content.appendChild(wrapOuter); scrollToBottom();
    });
  }

  async function renderFinalPlan(content) {
    function p(html) {
      const el = document.createElement('p');
      el.className = 'bcp-bob-text'; el.style.margin = '0 0 6px';
      el.innerHTML = html; content.appendChild(el); scrollToBottom();
    }
    function chip(t) { return '<span class="bcp-inline-code">' + t + '</span>'; }
    function bold(t) { return '<span class="bcp-bold">' + t + '</span>'; }

    p('The workspace is empty — this is a greenfield project. Let me load the ' +
      chip('build-mcp-server') + ' skill to get the exact scaffolding conventions, ' +
      'and also check the ' + chip('configure-mcp') + ' skill for Bob registration patterns.');

    await new Promise(r => setTimeout(r, 700));
    const loaded = document.createElement('div'); loaded.className = 'bcp-skill-loaded';
    loaded.innerHTML = bold('Loaded') + '&nbsp;2 skills : 2ms&nbsp;<span class="bcp-skill-loaded-arrow">›</span>';
    content.appendChild(loaded); scrollToBottom();

    await new Promise(r => setTimeout(r, 600));
    p('I now have everything needed. Note that the ' + chip('build-mcp-server') +
      ' skill defaults to Node.js/TypeScript, but the user chose ' + bold('Python') +
      ' — so I\'ll adapt the scaffolding conventions to Python\'s MCP SDK. Let me write the plan now.');

    await new Promise(r => setTimeout(r, 800));
    const wrote = document.createElement('div'); wrote.className = 'bcp-wrote-file';
    wrote.innerHTML =
      '<span class="bcp-wrote-file-icon">✏</span>' +
      chip('datastage-mcp-server-plan.md') +
      '<span class="bcp-wrote-file-arrow">›</span>';
    content.appendChild(wrote); scrollToBottom();

    await new Promise(r => setTimeout(r, 500));
    p('The plan is written to ' + chip('datastage-mcp-server-plan.md') + '. Here\'s a summary for your review:');

    const table = document.createElement('table'); table.className = 'bcp-plan-table';
    table.innerHTML =
      '<thead><tr><th>#</th><th>Sub-Task</th><th>Key Output</th></tr></thead>' +
      '<tbody>' +
      '<tr><td>1</td><td>Project Scaffold</td><td><code>pyproject.toml</code>, package structure, <code>.gitignore</code></td></tr>' +
      '<tr><td>2</td><td>Auth Module</td><td><code>auth.py</code> — CPD token manager, env-var-only credentials</td></tr>' +
      '<tr><td>3</td><td>DataStage API Client</td><td><code>client.py</code> — httpx wrapper around DataStage SaaS REST endpoints</td></tr>' +
      '<tr><td>4</td><td>MCP Server &amp; Tools</td><td><code>server.py</code> — FastMCP server with 4 registered tools over stdio</td></tr>' +
      '<tr><td>5</td><td>Bob MCP Registration</td><td><code>.bob/mcp.json</code> — workspace-scoped registration</td></tr>' +
      '</tbody>';
    content.appendChild(table); scrollToBottom();

    await new Promise(r => setTimeout(r, 400));
    const tree   = document.querySelector('.bcp-exp-tree');
    const fileEl = document.createElement('div'); fileEl.className = 'bcp-exp-file';
    fileEl.innerHTML =
      '<span class="bcp-exp-file-icon">◇</span>' +
      '<span class="bcp-exp-file-name">datastage-mcp-server-plan.md</span>';
    tree.appendChild(fileEl);
  }

  async function typeInput(text) {
    inputEl.textContent = '';
    inputEl.classList.remove('ready');
    sendBtn.disabled = true;
    sendBtn.classList.remove('pulse');
    await new Promise(r => setTimeout(r, 420));
    for (let i = 0; i < text.length; i++) {
      inputEl.textContent += text[i];
      await new Promise(r => setTimeout(r, 28));
    }
    inputEl.classList.add('ready');
    await new Promise(r => setTimeout(r, 320));
    sendBtn.disabled = false;
    sendBtn.classList.add('pulse');
    sendHintEl.classList.remove('hidden');
  }

  async function advance() {
    if (busy || step >= SCRIPT.length) return;
    busy = true; choiceMade = false;
    sendBtn.disabled = true;
    sendBtn.classList.remove('pulse');
    sendBtn.style.background = '';
    sendHintEl.classList.add('hidden');

    activateChat();
    const cur = SCRIPT[step];

    if (cur.user) addUserMsg(cur.user);
    inputEl.textContent = '';
    inputEl.classList.remove('ready');

    showTyping();
    await new Promise(r => setTimeout(r, 950));
    hideTyping();

    const content = createBobBlock();

    if (cur.skill) {
      const badge = document.createElement('div'); badge.className = 'bcp-skill-badge';
      badge.innerHTML =
        '<span class="bcp-skill-badge-icon">⚡</span>' +
        '<span class="bcp-skill-badge-text">' + cur.skill + '</span>';
      content.appendChild(badge);
    }

    if (cur.richBob) {
      await renderFinalPlan(content);
    } else {
      const textEl = document.createElement('div'); textEl.className = 'bcp-bob-text';
      content.appendChild(textEl);
      await typewrite(textEl, cur.bob);
    }

    if (cur.choices) {
      const chosen = await renderChoices(content, cur.choices, cur.hintChoice);
      addUserMsg(chosen.label);
    }

    animateCounter(STEP_COST[Math.min(step, STEP_COST.length - 1)]);
    step++;
    busy = false;

    if (step < SCRIPT.length) {
      const next = SCRIPT[step];
      if (next.user) { typeInput(next.user); } else { advance(); }
    } else {
      inputEl.textContent = 'Planning in progress…';
      inputEl.classList.remove('ready');
      sendBtn.disabled = true;
    }
  }

  /* ── MD panel ── */
  const MD_CONTENT = `<h1>DataStage MCP Server — Project Plan</h1>
<h2>Overview</h2>
<p>Build a <strong>read-only, Python-based MCP server</strong> that exposes IBM DataStage on IBM Cloud (SaaS) to AI assistants such as Bob. The server uses the <strong>stdio transport</strong> and authenticates against IBM Cloud IAM using credentials read from environment variables. It exposes four tools: list projects, list flows, list jobs, and fetch job run logs.</p>
<p><strong>Scope:</strong> Greenfield project. No existing code to extend.</p>
<p><strong>Non-goals:</strong></p><ul>
<li>Write, create, update, or delete any DataStage resource</li>
<li>LLM-optimised summarisation — raw API JSON is returned as-is</li>
<li>Multi-user or remote HTTP transport</li>
</ul><hr>
<h2>Architecture</h2>
<pre><code>Bob (Plan / Agent mode)
       │  stdio
       ▼
datastage-mcp-server (Python process)
       │  HTTPS + IAM Bearer Token
       ▼
IBM DataStage SaaS API (api.dataplatform.cloud.ibm.com)</code></pre>
<h2>Sub-Tasks</h2>
<h3>Sub-Task 1 — Project Scaffold</h3>
<p>Lay down the directory structure, dependency file, and Python packaging config.</p>
<table><thead><tr><th>File</th><th>Purpose</th></tr></thead><tbody>
<tr><td><code>pyproject.toml</code></td><td>Package metadata, deps, entrypoint</td></tr>
<tr><td><code>src/datastage_mcp/__init__.py</code></td><td>Package init</td></tr>
<tr><td><code>.gitignore</code></td><td>Excludes .env, __pycache__, dist/, .venv/</td></tr>
</tbody></table>
<h3>Sub-Task 2 — IAM Authentication Module</h3>
<p><code>auth.py</code> — <code>IamTokenManager</code> class. Reads <code>CPD_USERNAME</code> and <code>CPD_PASSWORD</code> from <code>os.environ</code> only. Credentials are never logged. Token cached in memory, refreshed 60s before expiry.</p>
<h3>Sub-Task 3 — DataStage API Client</h3>
<p><code>client.py</code> — <code>DataStageClient</code> class. Four methods returning raw JSON: <code>list_projects</code>, <code>list_flows</code>, <code>list_jobs</code>, <code>get_job_run_logs</code>. All requests use HTTPS with 30s timeout.</p>
<h3>Sub-Task 4 — MCP Server and Tool Registration</h3>
<p><code>server.py</code> — <code>FastMCP</code> server named <code>"datastage"</code>. Four registered tools over stdio. All logging to stderr.</p>
<h3>Sub-Task 5 — Bob MCP Registration</h3>
<p><code>.bob/mcp.json</code> — workspace-scoped entry with <code>CPD_USERNAME</code> and <code>CPD_PASSWORD</code> env placeholders.</p>
<hr>
<h2>File Tree (Final State)</h2>
<pre><code>datastage-mcp-server/
├── pyproject.toml
├── .gitignore
└── src/
    └── datastage_mcp/
        ├── __init__.py
        ├── auth.py
        ├── client.py
        └── server.py

.bob/
└── mcp.json</code></pre>`;

  const mdPanel  = document.getElementById('bcp-md-panel');
  const mdBody   = document.getElementById('bcp-md-body');
  const mdClose  = document.getElementById('bcp-md-close');
  let   mdRendered = false;

  function openMdPanel() {
    if (!mdRendered) { mdBody.innerHTML = MD_CONTENT; mdRendered = true; }
    mdPanel.classList.remove('hidden');
    document.querySelectorAll('.bcp-exp-file').forEach(f => f.classList.add('active'));
  }

  function closeMdPanel() {
    mdPanel.classList.add('hidden');
    document.querySelectorAll('.bcp-exp-file').forEach(f => f.classList.remove('active'));
  }

  mdClose.addEventListener('click', closeMdPanel);
  document.querySelector('.bcp-exp-tree').addEventListener('click', e => {
    if (e.target.closest('.bcp-exp-file')) openMdPanel();
  });

  /* ── Resize handle ── */
  const resizeHandle = document.getElementById('bcp-resize-handle');
  let isDragging = false, dragStartX = 0, dragStartW = 0;

  resizeHandle.addEventListener('mousedown', e => {
    isDragging = true; dragStartX = e.clientX; dragStartW = mdPanel.offsetWidth;
    resizeHandle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const newW = Math.max(200, Math.min(700, dragStartW + (e.clientX - dragStartX)));
    mdPanel.style.width = newW + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    resizeHandle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  /* ── Mode / Permissions popups ── */
  const modeBtn      = document.getElementById('bcp-mode-btn');
  const permBtn      = document.getElementById('bcp-perm-btn');
  const modePopup    = document.getElementById('bcp-mode-popup');
  const permPopup    = document.getElementById('bcp-perm-popup');

  function closeAllPopups() {
    modePopup.classList.remove('open');
    permPopup.classList.remove('open');
  }

  modeBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = modePopup.classList.contains('open');
    closeAllPopups();
    if (!isOpen) modePopup.classList.add('open');
  });

  permBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = permPopup.classList.contains('open');
    closeAllPopups();
    if (!isOpen) permPopup.classList.add('open');
  });

  document.addEventListener('click', closeAllPopups);
  modePopup.addEventListener('click', e => e.stopPropagation());
  permPopup.addEventListener('click', e => e.stopPropagation());

  /* ── Boot ── */
  sendBtn.addEventListener('click', advance);
  hintBtn.addEventListener('click', () => {
    hintEl.classList.add('hidden');
    typeInput(SCRIPT[0].user);
  });
})();
