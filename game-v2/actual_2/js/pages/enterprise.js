/**
 * js/pages/enterprise.js
 * Scripted demo for the Enterprise Economics page chatbox.
 * Demonstrates Bob's token pooling, per-team budget visibility,
 * and the shared-pool model — using the budget counter in the topbar.
 *
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    {
      user: 'How much budget has the backend team used this month?',
      bob: 'Checking token usage for the backend team...\n\nBackend team — October 2026:\n\n   Consumed:    87,420 tokens\n   Allocation:  150,000 tokens\n   Remaining:   62,580 tokens  (41.7%)\n\n   Top spenders this month:\n   1. arfan.rusdi@ibm.com     — 24,100 tokens\n   2. siti.rahayu@ibm.com     — 18,760 tokens\n   3. budi.santoso@ibm.com    — 16,340 tokens\n\n   Most-used tools:\n   - Code generation (44%)\n   - Security scanning (28%)\n   - MCP tool calls (18%)\n   - Other (10%)\n\nThe backend team is on track — no risk of hitting the cap before month-end at the current burn rate.'
    },
    {
      user: 'Compare that to the frontend team and flag any risks',
      bob: 'Token usage comparison — October 2026 (24 days elapsed, 7 remaining):\n\n   Backend team\n      Used:       87,420 / 150,000  (58%)\n      Projected:  109,000 by month-end  — safe\n\n   Frontend team\n      Used:      138,900 / 150,000  (93%)\n      Projected: 175,000 by month-end  — OVER LIMIT by ~25,000 tokens\n\nRisk flagged: the frontend team is on pace to exceed their allocation by 17% before the reset on November 1st.\n\nOptions:\n   1. Reallocate 30,000 tokens from the backend team\'s surplus (no cost impact — same shared pool)\n   2. Set a soft cap alert at 145,000 to notify the frontend lead\n   3. Both\n\nWhich would you like me to action?'
    },
    {
      user: 'Do both — reallocate and set the alert',
      bob: 'Reallocation applied:\n   30,000 tokens moved from Backend pool to Frontend pool.\n\n   Backend  → 120,000 allocation  (72,580 remaining)\n   Frontend → 180,000 allocation  (41,100 remaining)\n\n   No cost impact — both teams draw from the same shared org pool.\n\nAlert configured:\n   Frontend team soft cap set at 145,000 tokens.\n   Notification: slack · #frontend-eng, email · frontend-lead@ibm.com\n\nAudit log:\n   [14:45:02]  Admin · Reallocate 30k tokens Backend → Frontend\n   [14:45:03]  Admin · Set soft cap alert — Frontend team at 145,000\n\nBoth changes are live. The frontend team lead has been notified, and the reallocation shows immediately in the budget counter.'
    },
    {
      user: 'Generate the October end-of-month productivity report',
      bob: 'Generating October 2026 productivity report...\n\n   === IBM Bob — October Usage Report ===\n\n   Total org spend:    226,320 / 500,000 tokens  (45.3%)\n   Total teams:        6\n   Active users:       48\n\n   Output metrics:\n   - Pull requests assisted:    312\n   - Bugs auto-remediated:       87\n   - Security issues resolved:   41\n   - Tests generated:           204\n   - CI/CD pipeline runs saved: 118\n\n   Cost per PR:     ~728 tokens  (~$0.04)\n   Cost per bug fix: ~2,600 tokens  (~$0.14)\n\n   ROI estimate:\n   Developer time saved:  ~340 hours\n   Token spend value:      $12.40\n   Equivalent dev cost:   ~$34,000\n   Effective multiplier:  2,742x\n\nReport exported to IBM Cloud Object Storage.\nShare link: ibm.co/bob-oct-report-2026 (internal only)'
    }
  ];

  /* ── Budget counter animation on chatbox open ── */
  function animateCounter(targetPct, durationMs) {
    const valEl = document.getElementById('bcp-counter-val');
    const tipPct = document.querySelector('.bcp-counter-tip-pct');
    const tipRow = document.querySelector('.bcp-counter-tip-row span');
    if (!valEl) return;

    const start = 24;
    const end   = targetPct;
    const steps = 30;
    const stepMs = durationMs / steps;
    let i = 0;

    const iv = setInterval(() => {
      i++;
      const pct = Math.round(start + (end - start) * (i / steps));
      valEl.textContent = pct + '%';
      if (tipPct) tipPct.textContent = (100 - pct) + '% Budget remaining';
      if (tipRow) {
        const used = (500 * pct / 100).toFixed(2);
        tipRow.textContent = used + ' / 500.00 tokens';
      }
      if (i >= steps) clearInterval(iv);
    }, stepMs);
  }

  /* ── FAB → chatbox transition ── */
  const fab      = document.getElementById('plan-bob-fab');
  const fabWrap  = document.getElementById('plan-bob-fab-wrap');
  const landing  = document.getElementById('enterprise-landing');
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
      // Animate the budget counter up to show pool activity
      animateCounter(58, 1800);
      BcpChat.init(SCRIPT, 'end of Enterprise demo');
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
