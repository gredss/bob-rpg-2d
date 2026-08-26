/**
 * js/pages/cli.js
 * Scripted demo for the CLI page.
 * Demonstrates Bob running from the terminal to audit a codebase, fix a
 * vulnerability, and wire itself into a CI/CD pipeline.
 *
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    {
      user: 'bob "Scan src/api/ for security vulnerabilities"',
      bob: 'Reading workspace...\n   Found 14 files in src/api/\n\nRunning security scan...\n\n   [CRITICAL]  SQL injection — src/api/users.js:42\n               Raw user input passed directly into query string.\n\n   [HIGH]      Missing rate limiting — POST /api/login\n               No throttle on login endpoint; brute-force risk.\n\n   [MEDIUM]    Unvalidated redirect — src/api/auth.js:18\n               open() called with user-supplied URL.\n\n   [LOW]       Exposed stack trace — src/api/error.js:9\n               Full exception detail returned in HTTP 500 response.\n\nSummary: 1 critical, 1 high, 1 medium, 1 low.\nRun   bob fix --file src/api/users.js   to auto-remediate the SQL injection.'
    },
    {
      user: 'bob fix --file src/api/users.js',
      bob: 'Reading src/api/users.js...\n\nIdentified vulnerable pattern on line 42:\n   const query = "SELECT * FROM users WHERE id = " + req.params.id;\n\nApplying fix — replacing with parameterised query:\n   const query = "SELECT * FROM users WHERE id = ?";\n   db.execute(query, [req.params.id]);\n\nWriting src/api/users.js... done.\n\nVerifying fix...\n   Re-scanning src/api/users.js — no SQL injection found.\n\n1 file updated. The CRITICAL vulnerability is resolved.\nShall I commit this fix and update the CI/CD pipeline to block future unsafe patterns?'
    },
    {
      user: 'Yes — commit the fix and add a bob security gate to CI/CD',
      bob: 'Committing fix...\n   git add src/api/users.js\n   git commit -m "fix: replace raw SQL with parameterised query (users.js:42)"\n   [main 3f9a2c1] fix: replace raw SQL with parameterised query\n\nAdding Bob security gate to .github/workflows/ci.yml...\n\n   Added step after lint:\n   ─────────────────────────────────────\n   - name: Bob Security Scan\n     run: bob scan --fail-on critical,high\n   ─────────────────────────────────────\n\nWriting .github/workflows/ci.yml... done.\n\nFrom now on, every pull request will be blocked if Bob finds a CRITICAL or HIGH vulnerability — before it can merge.\n\nYour pipeline now has a zero-tolerance security gate, fully automated.'
    },
    {
      user: 'Can I run Bob in a Docker container too?',
      bob: 'Yes — Bob CLI runs anywhere you can run Node.js or pull a container.\n\nQuickstart in Docker:\n\n   docker run --rm \\\n     -v $(pwd):/workspace \\\n     -e IBM_BOB_TOKEN=$IBM_BOB_TOKEN \\\n     ibm/bob:latest \\\n     bob "Scan /workspace/src for security issues"\n\nThe container:\n   - Mounts your codebase read/write\n   - Reads your IBM_BOB_TOKEN from the environment (never hardcoded)\n   - Has full access to all modes, MCP tools, and skills\n   - Works on Kubernetes, remote SSH, or any CI runner\n\nSame Bob. Every environment.'
    }
  ];

  /* ── FAB → chatbox transition ── */
  const fab      = document.getElementById('plan-bob-fab');
  const fabWrap  = document.getElementById('plan-bob-fab-wrap');
  const landing  = document.getElementById('cli-landing');
  const chat     = document.getElementById('plan-chat-view');
  const closeBtn = document.getElementById('bcp-close-btn');

  if (!fab || !landing || !chat) return;

  fab.addEventListener('click', openChat);
  fabWrap.addEventListener('click', openChat);

  function openChat() {
    landing.classList.add('plan-landing--out');
    setTimeout(() => {
      landing.style.display = 'none';
      fabWrap.style.display = 'none';
      chat.classList.remove('hidden');
      chat.classList.add('plan-chat-view--in');
      BcpChat.init(SCRIPT, 'end of CLI demo');
    }, 320);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chat.classList.add('hidden');
      landing.style.display = '';
      landing.classList.remove('plan-landing--out');
      fabWrap.style.display = '';
    });
  }
})();
