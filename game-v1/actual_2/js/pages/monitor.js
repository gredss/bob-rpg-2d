/**
 * js/pages/monitor.js
 * Scripted demo for the Monitor page.
 * Requires: css/pages.css, js/chat-helpers.js
 */
(function () {
  BcpChat.init([
    {
      user: "Instana just fired a critical alert: 'P99 latency on /api/orders exceeded 3s for the last 5 minutes'. What's happening?",
      bob:  "Analysing the Instana alert data...\n\n🚨 Alert Summary\n  Service:  order-service  |  Endpoint: GET /api/orders\n  Metric:   P99 latency = 4 230 ms  (threshold: 3 000 ms)\n  Duration: 7 minutes and counting\n\n📊 Correlated signals I can see:\n  • Database query time spiked from 45 ms → 3 900 ms at 14:32 UTC\n  • CPU on db-primary is at 98% (normal: 30%)\n  • 3 slow query log entries for SELECT * FROM orders WHERE user_id = ?\n  • A new deployment of order-service was pushed at 14:29 UTC (3 min before alert)\n\n🔍 Most likely root cause:\nThe deployment at 14:29 UTC introduced a query without an index on user_id. The table has 2.1 M rows — a full table scan is now running on every request.\n\nShall I confirm by looking at the query plan, or do you want the fix right now?"
    },
    {
      user: "Yes, give me the fix and tell me how to verify it worked.",
      bob:  "Here's the fix and verification steps:\n\n🛠️ Immediate fix — add the missing index\n```sql\n-- Run on db-primary (takes < 1s on most engines with CONCURRENTLY)\nCREATE INDEX CONCURRENTLY idx_orders_user_id\n  ON orders (user_id);\n```\n\n✅ Verification — 3 checks within 2 minutes of applying:\n\n1. Query plan should change:\n```sql\nEXPLAIN ANALYSE\n  SELECT * FROM orders WHERE user_id = 12345;\n-- Before: Seq Scan   cost=0 .. 240000\n-- After:  Index Scan cost=0 .. 8\n```\n\n2. Instana P99 latency should drop below 500 ms within 60 s of index creation as the query cache warms.\n\n3. CPU on db-primary should return below 35% within 90 s.\n\n🔄 If the index alone doesn't bring P99 below threshold:\n  • Check for N+1 queries in order-service — the new code may be calling the DB once per order item\n  • Add a Redis cache in front of frequent user order reads (TTL: 30 s)\n\n🚦 Recommend: keep the Instana alert open until P99 stays below 500 ms for 10 consecutive minutes."
    },
    {
      user: "How do I set up a proactive alert in Instana so this latency regression is caught within 1 minute next time?",
      bob:  "Here's how to configure a proactive Instana smart alert for latency regressions:\n\n📋 Alert Configuration\n  Navigate to: Instana → Alerts → New Alert Policy\n\n  Metric:     P99 latency\n  Scope:      Service = order-service, Endpoint = /api/orders\n  Condition:  > 800 ms  (set below your SLA — gives runway before SLA breach)\n  Window:     1-minute rolling average\n  Severity:   Critical\n  Channel:    PagerDuty + Slack #incidents\n\n⚡ Why 800 ms, not 3 000 ms?\n  Alerting at your SLA threshold means you're already in breach when the alert fires.\n  Alert at 25% of SLA so you have time to act before users are impacted.\n\n🤖 Bob Anomaly Baseline (recommended)\n  Instead of a fixed threshold, enable Bob's ML baseline:\n  Instana → Alerts → Smart Alerts → Enable dynamic baseline\n  Bob learns your service's normal latency pattern (including day/night variation)\n  and alerts only when behaviour is genuinely abnormal — fewer false positives.\n\n📊 Complementary signals to add to the same alert:\n  • Error rate > 1% on the same endpoint\n  • Database slow query count > 5/min\n  Grouping these into one incident reduces alert noise significantly."
    }
  ], 'monitor demo');
})();
