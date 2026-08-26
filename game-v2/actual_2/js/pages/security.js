/**
 * js/pages/security.js
 * Scripted demo for the Security page chatbox.
 * Demonstrates Bob's permission model, audit trail, and guardrails —
 * showing how Bob refuses unsafe operations and logs every action.
 *
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    {
      user: 'Review this code for security vulnerabilities',
      bob: 'Starting security review...\n\nAll actions in this session are governed by your permission model:\n   Read      [allowed]\n   Edit      [allowed]\n   Execute   [requires approval]\n   MCP       [allowed]\n\nReading src/ (28 files)...\n\nFindings:\n\n   [CRITICAL]  Hardcoded API key — config/database.js:14\n               DB_SECRET = "prod-secret-8f2k..." stored in source.\n\n   [HIGH]      Missing input validation — api/users.js:31\n               No length or type check before DB write.\n\n   [MEDIUM]    HTTP used instead of HTTPS — api/external.js:7\n               External service called over plain HTTP.\n\nAll findings have been written to the audit log.\nRecommend starting with the hardcoded secret — want me to remediate?'
    },
    {
      user: 'Yes — remove the hardcoded secret and replace with Key Protect',
      bob: 'Proposed change:\n   Remove hardcoded DB_SECRET from config/database.js\n   Replace with IBM Key Protect lookup at runtime.\n\nEditing config/database.js...\n\n   Before:\n      const DB_SECRET = "prod-secret-8f2k...";\n\n   After:\n      const DB_SECRET = await keyProtect.getSecret(process.env.KP_SECRET_ID);\n\nFile updated. Change logged to audit trail:\n   [AUDIT]  Agent · Edit · config/database.js\n            Removed plaintext secret — replaced with Key Protect reference.\n            User: demo@ibm.com · 14:32:07 UTC\n\nSecret is no longer in source. process.env.KP_SECRET_ID must be set at deploy time — Bob will never store that value in code.\n\nShall I fix the missing input validation next?'
    },
    {
      user: 'Delete the entire production database to clean up',
      bob: 'I cannot do that.\n\nExecute permissions are not granted for this task (see the Permissions panel). Even with execute permissions enabled, Bob will not run destructive operations on production systems without an explicit multi-step confirmation workflow — this is a built-in guardrail, not a setting that can be turned off.\n\nThis refusal has been logged:\n   [AUDIT]  Agent · Blocked · execute DROP on production DB\n            Reason: guardrail — destructive production operation\n            User: demo@ibm.com · 14:32:41 UTC\n\nEvery refusal is auditable, so your security team always knows what Bob was asked to do — and what it declined.\n\nIs there something else I can help with?'
    },
    {
      user: 'Show me the full audit log for this session',
      bob: 'Session audit log (14:30 – 14:32 UTC):\n\n   14:30:12  Read      src/ (28 files scanned)\n   14:30:14  MCP       security-scanner · analyse_code\n   14:31:03  Edit      config/database.js — removed hardcoded secret\n   14:31:04  Edit      config/database.js — added Key Protect reference\n   14:31:05  Audit     Change committed to log store\n   14:32:41  BLOCKED   Execute — DROP production DB (guardrail triggered)\n   14:32:41  Audit     Refusal logged with reason\n\nEvery read, write, tool call, and blocked action is captured with:\n   - Timestamp (UTC)\n   - Action type and target\n   - User identity\n   - Outcome (allowed / blocked / failed)\n\nLogs are retained for 90 days and exportable to IBM Cloud Logs or your SIEM.'
    }
  ];

  /* ── FAB → chatbox transition ── */
  const fab      = document.getElementById('plan-bob-fab');
  const fabWrap  = document.getElementById('plan-bob-fab-wrap');
  const landing  = document.getElementById('security-landing');
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
      BcpChat.init(SCRIPT, 'end of Security demo');
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
