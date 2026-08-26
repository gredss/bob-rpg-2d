/**
 * js/pages/modes.js
 * Scripted demo for the Modes page.
 * Shows Bob switching from Agent → Plan, producing a plan,
 * then switching back to Agent to implement.
 *
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  const SCRIPT = [
    {
      user: 'Switch to Plan mode and help me architect a new payments service',
      bob: 'Switching to Plan mode.\n\n[ Mode: Plan ]\n\nI\'ll load the create-plan skill and gather requirements before proposing anything.\n\nuse_skill: create-plan — loaded.\n\nLet\'s start. What is the primary responsibility of this payments service — processing transactions, managing payment methods, reconciliation, or all three?'
    },
    {
      user: 'Processing transactions and reconciliation. It needs to integrate with Stripe and our internal ledger.',
      bob: 'Got it. A few more questions to complete the scope:\n\n1. Synchronous or async transaction processing? (e.g. HTTP response vs event-driven)\n2. What is the expected transaction volume — hundreds or thousands per minute?\n3. Should the service own the ledger, or write to an existing one?\n4. Any compliance requirements — PCI DSS, SOC 2?'
    },
    {
      user: 'Async via events, ~500 TPS peak, writes to existing ledger service, PCI DSS required.',
      bob: 'Plan ready for review.\n\n--- PAYMENTS SERVICE PLAN ---\n\nArchitecture: Event-driven microservice\nRuntime:      Node.js + Kafka consumer\nExternal:     Stripe Webhooks API\nInternal:     gRPC calls to ledger-service\nCompliance:   PCI DSS scope — card data never stored\n\nPhases:\n  1. Stripe webhook receiver + signature verification\n  2. Event normalisation + idempotency layer\n  3. Ledger write via gRPC (at-least-once with dedup)\n  4. Reconciliation job — nightly diff vs Stripe payouts\n  5. Audit log + PCI DSS controls\n\nApprove this plan to switch into Agent mode and begin implementation.'
    },
    {
      user: 'Looks good — approved. Switch to Agent and scaffold the service.',
      bob: 'Switching to Agent mode.\n\n[ Mode: Agent ]\n\nScaffolding payments-service...\n\n  write_file  payments-service/package.json\n  write_file  payments-service/src/index.js\n  write_file  payments-service/src/webhook-receiver.js\n  write_file  payments-service/src/idempotency.js\n  write_file  payments-service/src/ledger-client.js\n  write_file  payments-service/src/reconciliation.js\n  write_file  payments-service/src/audit-log.js\n  write_file  payments-service/.env.example\n\nDone. 8 files created. PCI DSS note: card data is never written to disk — only Stripe payment intent IDs are stored. Ready to implement the webhook receiver next?'
    }
  ];

  /* ── FAB → chatbox transition ── */
  const fab      = document.getElementById('plan-bob-fab');
  const fabWrap  = document.getElementById('plan-bob-fab-wrap');
  const landing  = document.getElementById('modes-landing');
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
      BcpChat.init(SCRIPT, 'end of modes demo');
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
