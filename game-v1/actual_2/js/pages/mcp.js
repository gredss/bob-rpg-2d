/**
 * js/pages/mcp.js
 * Scripted demo for the MCP page chatbox.
 * Demonstrates Bob calling the Instana MCP server to check service latency,
 * then querying DataStage for a job status.
 *
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    {
      user: 'Check the latency on order-service in Instana',
      bob: 'On it. I\'ll call the Instana MCP server now.\n\n[MCP]  instana · get_service_metrics\n   service = "order-service"\n   metric  = "latency.p95"\n   window  = "last 30 minutes"\n\nResult from Instana:\n   p95 latency: 342 ms  (+18% vs baseline)\n   p99 latency: 891 ms\n   Error rate:  0.4%\n\nThe order-service p95 latency is elevated — 342 ms vs your 290 ms baseline. The p99 spike to 891 ms suggests occasional slow outliers. Want me to pull the trace breakdown to identify the bottleneck?'
    },
    {
      user: 'Yes — find the slowest span in the last 30 minutes',
      bob: '[MCP]  instana · get_slowest_spans\n   service = "order-service"\n   window  = "last 30 minutes"\n   limit   = 5\n\nTop 5 slowest spans:\n   1. POST /api/orders/submit    — 1,204 ms  (db query)\n   2. GET  /api/inventory/check  —   741 ms  (external call)\n   3. POST /api/payment/validate —   612 ms  (external call)\n   4. GET  /api/orders/:id       —   388 ms  (db query)\n   5. GET  /api/users/profile    —   291 ms  (cache miss)\n\nThe bottleneck is the database query on POST /api/orders/submit at 1,204 ms. This is consistent with slow DB writes. Should I check whether the DataStage pipeline feeding the orders database has any recent failures?'
    },
    {
      user: 'Yes — check the DataStage orders-pipeline job',
      bob: '[MCP]  datastage · get_job_runs\n   job_name = "orders-pipeline"\n   limit    = 5\n\nLast 5 runs of orders-pipeline:\n   RUN-4821  Completed  09:14  Duration: 4m 12s  [OK]\n   RUN-4820  Completed  08:44  Duration: 4m 08s  [OK]\n   RUN-4819  FAILED     08:14  Duration: 1m 03s  [FAIL]\n   RUN-4818  Completed  07:44  Duration: 4m 21s  [OK]\n   RUN-4817  Completed  07:14  Duration: 4m 15s  [OK]\n\nRUN-4819 failed at 08:14. The pipeline recovered on the next run, but that failure window aligns with the latency spike in Instana. Want me to pull the error logs from RUN-4819?'
    },
    {
      user: 'Yes — get the error log',
      bob: '[MCP]  datastage · get_job_run_logs\n   job_id = "orders-pipeline"\n   run_id = "RUN-4819"\n\nError from RUN-4819:\n   [08:14:03] Stage: DB_WRITE_ORDERS\n   [08:14:03] ERROR: Connection pool exhausted — max 20 connections reached\n   [08:14:03] Retrying... attempt 1/3 — timeout after 60s\n   [08:15:06] FATAL: DB_WRITE_ORDERS failed — pipeline aborted\n\nRoot cause identified: the DB connection pool was exhausted at 08:14, causing the DataStage pipeline to abort mid-write. This left partial records in the orders table, forcing the application layer to do expensive compensating reads — which explains the 1,204 ms query spike in Instana.\n\nRecommended fix: increase the connection pool limit from 20 to 50 in the DataStage environment config, and add a circuit-breaker on the DB_WRITE_ORDERS stage.\n\nShall I draft the config change?'
    }
  ];

  /* ── FAB → chatbox transition ── */
  const fab      = document.getElementById('plan-bob-fab');
  const fabWrap  = document.getElementById('plan-bob-fab-wrap');
  const landing  = document.getElementById('mcp-landing');
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
      // Boot the scripted demo
      BcpChat.init(SCRIPT, 'end of MCP demo');
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
