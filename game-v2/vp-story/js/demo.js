/**
 * vp-story/js/demo.js
 * Click-driven IBM Bob chat demo — VP / Director board meeting scenario.
 *
 * Turn 1 — VP shares 3 vendor proposals. Bob reads each one (read_file ×3).
 * Turn 2 — Bob extracts financials, risks, scores — shows tables, plan cards.
 * Turn 3 — Bob synthesises the board recommendation, writes board-insights.md
 *           (clickable → opens MD viewer panel with resize handle), and surfaces
 *           the insights-report.html artifact pill.
 *
 * Files in explorer:
 *   proposal-cloud.md     (clickable → opens MD panel)
 *   proposal-ai.csv       (non-MD, plain link)
 *   proposal-security.docx (non-MD, plain download)
 *   board-insights.md     (clickable → opens MD panel)
 */

(function () {
  'use strict';

  /* ── Bob avatar ─────────────────────────────────────────────────────────── */
  const BOB_AVATAR = '../actual_2/asset/IBM_Bob_hero_illustration_head_color.svg';

  /* ── File registry — which files open in the MD panel vs direct link ─────── */
  const MD_CONTENT = {};   // populated at init after fetch (or inline below)
  const FILE_LINKS = {
    'proposal-cloud.md':      null,  // opens MD panel (content fetched)
    'proposal-ai.csv':        'board/proposal-ai.csv',
    'proposal-security.docx': 'board/proposal-security.docx',
    'board-insights.md':      null,  // opens MD panel (content fetched)
    'board/insights-report.html': 'board/insights-report.html',
  };

  /* ── Todo items ─────────────────────────────────────────────────────────── */
  const TODOS = [
    { id: 't1', label: 'Read and parse all 3 vendor proposals' },
    { id: 't2', label: 'Extract key metrics, costs and timelines' },
    { id: 't3', label: 'Identify risks and strategic fit for each' },
    { id: 't4', label: 'Cross-compare proposals on unified criteria' },
    { id: 't5', label: 'Synthesise singular board-ready recommendation' },
    { id: 't6', label: 'Write board-insights.md and generate report' },
  ];

  /* ── DOM refs ───────────────────────────────────────────────────────────── */
  let body, welcome, msgs, inputEl, inputBox, sendBtn, expTree, chatCol;
  let mdPanel, mdClose, mdBody, mdTabName, mdBcName, mdResizeHnd;
  let todoPanel = null;
  let step = 0;
  let busy = false;

  /* ════════════════════════════════════════════════════════════════════════
     SCRIPT
     ══════════════════════════════════════════════════════════════════════ */
  const SCRIPT = [

    /* ═══════════════════════════════════════════════════════════════════════
       Turn 1 — VP hands Bob the three proposals; Bob reads each one.
       ═══════════════════════════════════════════════════════════════════════ */
    {
      user: "Bob, I need you to review all three vendor proposals for our Q3 initiative and give me one comprehensive board-ready analysis. The board meets in 90 minutes. The files are: proposal-cloud.md, proposal-ai.csv, proposal-security.docx.",
      bob: [
        { type: 'text', text: "Understood. I'll read all three in full before forming any view — this avoids anchoring on the first document. Starting with proposal-cloud.md." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">proposal-cloud.md · 70 lines · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "Cloud migration proposal ingested — Apex Cloud Solutions, 18-month programme, $4.2M total. Moving on to the AI platform proposal." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">proposal-ai.csv · 58 rows · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "AI platform proposal ingested — Nexus AI Technologies, 12-month MVP, $2.8M + $600K annual licensing. Reading the final proposal now." },
        { type: 'rich', html: `<div class="bcpr-mcp-call"><span class="bcpr-mcp-icon">✦</span><span class="bcpr-mcp-label">read_file</span><span class="bcpr-mcp-meta">proposal-security.docx · 8 sections · 1 tool · 2s</span><span class="bcpr-mcp-arrow">›</span></div>` },
        { type: 'text', text: "Security uplift proposal ingested — ShieldTech Cybersecurity, 9-month fixed-price programme, $1.4M. All three documents fully parsed.\n\nBuilding the structured analysis now: financials, KPIs, risk scoring, strategic fit, and cross-comparison on a unified framework." },
        { type: 'todo-init' },
        { type: 'todo-active', id: 't1' },
        { type: 'todo-done',   id: 't1' },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════════
       Turn 2 — Deep-dive: financials table, risk breakdown, scorecard.
       ═══════════════════════════════════════════════════════════════════════ */
    {
      user: "Go ahead — deep-dive all three and compare them.",
      bob: [
        { type: 'todo-active', id: 't2' },
        { type: 'text', text: "Extracting key metrics, financials, and delivery timelines from each proposal." },
        { type: 'rich', html:
          `<div class="ds-table-wrap">
            <div class="ds-table-label">Proposal Financials &amp; Timeline — at a glance</div>
            <table class="ds-table">
              <thead><tr><th>Proposal</th><th>Vendor</th><th>Total Cost</th><th>Timeline</th><th>Annual Ongoing</th><th>Payment</th></tr></thead>
              <tbody>
                <tr><td>☁ Cloud Migration</td><td>Apex Cloud</td><td>$4.2M</td><td>18 months</td><td>$380K infra</td><td>Milestone</td></tr>
                <tr><td>🤖 AI Platform</td><td>Nexus AI</td><td>$2.8M + $600K/yr</td><td>12 months MVP</td><td>$600K licence</td><td>Up-front + sub.</td></tr>
                <tr><td>🔐 Security Uplift</td><td>ShieldTech</td><td>$1.4M</td><td>9 months</td><td>$210K support</td><td>Fixed-price</td></tr>
              </tbody>
            </table>
          </div>` },
        { type: 'todo-done', id: 't2' },
        { type: 'todo-active', id: 't3' },
        { type: 'text', text: "Identifying strategic fit and risks for each proposal against your current technology roadmap and risk register." },
        { type: 'rich', html:
          `<div class="ds-plan">
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#60a5fa">☁</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title">Cloud Migration — Strategic Fit: High · Risk: Medium-High</span>
                <span class="ds-plan-desc">Strong alignment with 3-year infrastructure modernisation goal. 18-month runway overlaps two product release cycles — resource contention risk. Vendor has no local data-residency attestation — potential compliance blocker. Single-hyperscaler dependency (AWS) loses negotiating leverage post-migration.</span>
              </div>
            </div>
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#a78bfa">🤖</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title">AI Platform — Strategic Fit: Medium · Risk: High</span>
                <span class="ds-plan-desc">Compelling ROI narrative ($4.1M savings by Year 3) but relies on data quality assumptions your current data estate does not yet meet. $600K/yr perpetual licence is a lock-in cliff — switching costs after Year 2 estimated at $1.8M. Reference customers are retail only; financial-services context unproven.</span>
              </div>
            </div>
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#4ade80">🔐</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title">Security Uplift — Strategic Fit: Very High · Risk: Low</span>
                <span class="ds-plan-desc">Directly addresses the two Critical findings from Q2 penetration test. Fastest time-to-value at 9 months. Fixed-price contract eliminates overrun exposure. ISO 27001 + SOC 2 Type II — required for your regulatory obligations. This is a prerequisite: both Cloud Migration and AI Platform depend on the security baseline it establishes.</span>
              </div>
            </div>
          </div>` },
        { type: 'todo-done', id: 't3' },
        { type: 'todo-active', id: 't4' },
        { type: 'text', text: "Running unified scoring across all three — weighted by strategic value, financial risk, delivery confidence, and regulatory compliance." },
        { type: 'rich', html:
          `<div class="ds-table-wrap">
            <div class="ds-table-label">Cross-Proposal Scorecard — weighted out of 100</div>
            <table class="ds-table">
              <thead><tr><th>Criterion (weight)</th><th>☁ Cloud Mig.</th><th>🤖 AI Platform</th><th>🔐 Security</th></tr></thead>
              <tbody>
                <tr><td>Strategic alignment (25%)</td><td>22 / 25</td><td>16 / 25</td><td>24 / 25</td></tr>
                <tr><td>Financial risk (20%)</td><td>11 / 20</td><td>9 / 20</td><td>19 / 20</td></tr>
                <tr><td>Delivery confidence (20%)</td><td>12 / 20</td><td>11 / 20</td><td>18 / 20</td></tr>
                <tr><td>Regulatory compliance (20%)</td><td>13 / 20</td><td>14 / 20</td><td>20 / 20</td></tr>
                <tr><td>Scalability &amp; longevity (15%)</td><td>13 / 15</td><td>10 / 15</td><td>12 / 15</td></tr>
                <tr style="font-weight:600"><td>TOTAL SCORE</td><td>71 / 100</td><td>60 / 100</td><td><span style="color:#4ade80">93 / 100</span></td></tr>
              </tbody>
            </table>
          </div>` },
        { type: 'todo-done', id: 't4' },
        { type: 'footer', count: '3 proposals analysed · 6 risk vectors scored · unified framework complete' },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════════
       Turn 3 — VP asks for a visual. Bob renders four accurate inline SVG charts.
       ═══════════════════════════════════════════════════════════════════════ */
    {
      user: "Can you visualise the data? I need something I can glance at in the boardroom.",
      bob: [
        { type: 'text', text: "Running create_chart four times — one chart per insight." },

        /* ── Chart 1: Bar — Program Budget ──
           viewBox 300×150: plot area y=20→120 (h=100), x=46→284 (w=238)
           Scale: max $5.5M → 100px  →  1px=$55K
           Cloud  $4.2M → h=76  y=44
           AI impl $2.8M→ h=51  y=69   AI 3yr $5.2M→ h=95  y=25
           Security $1.4M→ h=25  y=95
           x-axis labels y=133, value labels 8px above bar top
        ── */
        { type: 'rich', html: `
<div class="ds-interactive-chart-container">
  <div class="bcpr-mcp-call" style="margin-bottom:8px">
    <span class="bcpr-mcp-icon">✦</span>
    <span class="bcpr-mcp-label">create_chart</span>
    <span class="bcpr-mcp-meta">BarChart · Program Budget Comparison · 1s</span>
    <span class="bcpr-mcp-arrow">›</span>
  </div>
  <div class="ds-echarts-tile">
    <div class="ds-echarts-tile-header">
      <div class="ds-echarts-tile-title"><span class="ds-echarts-tile-icon">📊</span><span>Program Budget Comparison (USD)</span></div>
      <span class="ds-echarts-tile-badge">BarChart</span>
    </div>
    <div class="ds-chart-card">
      <svg viewBox="0 0 300 150" class="ds-chart-svg">
        <!-- axes -->
        <line x1="46" y1="14" x2="46"  y2="120" stroke="#2a2a38" stroke-width="1"/>
        <line x1="46" y1="120" x2="290" y2="120" stroke="#2a2a38" stroke-width="1"/>
        <!-- grid lines at $1M=$55K×18.18≈18px steps: 120,102,84,66,48 -->
        <line x1="46" y1="102" x2="290" y2="102" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="84"  x2="290" y2="84"  stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="66"  x2="290" y2="66"  stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="48"  x2="290" y2="48"  stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="30"  x2="290" y2="30"  stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <!-- y labels -->
        <text x="42" y="123" text-anchor="end" fill="#556" font-size="7">$0</text>
        <text x="42" y="105" text-anchor="end" fill="#556" font-size="7">$1M</text>
        <text x="42" y="87"  text-anchor="end" fill="#556" font-size="7">$2M</text>
        <text x="42" y="69"  text-anchor="end" fill="#556" font-size="7">$3M</text>
        <text x="42" y="51"  text-anchor="end" fill="#556" font-size="7">$4M</text>
        <text x="42" y="33"  text-anchor="end" fill="#556" font-size="7">$5M</text>
        <!-- Cloud $4.2M → h=76, y=44 -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'☁ Cloud Migration<br/><b>$4.2M</b> · 18 months · Milestone-based<br/>Annual infra: $380K')" onmouseout="hideChartTooltip()">
          <rect x="58"  y="44" width="34" height="76" rx="3" fill="#60a5fa" opacity="0.88"/>
          <text x="75"  y="40" text-anchor="middle" fill="#60a5fa" font-size="7.5" font-weight="600">$4.2M</text>
          <text x="75"  y="133" text-anchor="middle" fill="#667" font-size="7">Cloud</text>
        </g>
        <!-- AI impl $2.8M → h=51, y=69 -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🤖 AI Platform — impl fee only<br/><b>$2.8M</b> + $600K/yr licence<br/>Year 1 total: $3.4M')" onmouseout="hideChartTooltip()">
          <rect x="120" y="69" width="34" height="51" rx="3" fill="#a78bfa" opacity="0.6"/>
          <text x="137" y="65" text-anchor="middle" fill="#a78bfa" font-size="7" opacity="0.85">$2.8M</text>
          <text x="137" y="133" text-anchor="middle" fill="#667" font-size="7">AI impl</text>
        </g>
        <!-- AI 3yr $5.2M → h=95, y=25 -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🤖 AI Platform — 3-year total<br/><b>$5.2M</b> incl. 3×$600K licences<br/>Break-even Month 28 · Net benefit: $900K only')" onmouseout="hideChartTooltip()">
          <rect x="162" y="25" width="34" height="95" rx="3" fill="#a78bfa" opacity="0.9"/>
          <text x="179" y="21" text-anchor="middle" fill="#a78bfa" font-size="7.5" font-weight="600">$5.2M</text>
          <text x="179" y="133" text-anchor="middle" fill="#667" font-size="7">AI 3yr</text>
        </g>
        <!-- Security $1.4M → h=25, y=95 -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🔐 Security Uplift<br/><b>$1.4M</b> fixed-price · 9 months<br/>30/40/30% payment gates · Zero overrun risk')" onmouseout="hideChartTooltip()">
          <rect x="240" y="95" width="34" height="25" rx="3" fill="#4ade80" opacity="0.92"/>
          <text x="257" y="91" text-anchor="middle" fill="#4ade80" font-size="7.5" font-weight="600">$1.4M</text>
          <text x="257" y="133" text-anchor="middle" fill="#667" font-size="7">Security</text>
        </g>
      </svg>
    </div>
  </div>
</div>` },

        /* ── Chart 2: Line — 3-Year Trajectory ──
           viewBox 300×150: plot area y=20→118, x=46→272
           Scale: 0–5.5M → 98px  →  1px=$56.1K
           Cloud:    $4.2M→y=43  $4.58M→y=36  $4.96M→y=29
           AI:       $3.4M→y=57  $4.0M→y=47   $4.6M→y=36
           Security: $1.4M→y=93  $1.52M→y=91  $1.64M→y=89
           x pts: Yr1=88 Yr2=168 Yr3=248  x-labels y=132
        ── */
        { type: 'rich', html: `
<div class="ds-interactive-chart-container">
  <div class="bcpr-mcp-call" style="margin-bottom:8px">
    <span class="bcpr-mcp-icon">✦</span>
    <span class="bcpr-mcp-label">create_chart</span>
    <span class="bcpr-mcp-meta">LineChart · 3-Year Cumulative Trajectory · 1s</span>
    <span class="bcpr-mcp-arrow">›</span>
  </div>
  <div class="ds-echarts-tile">
    <div class="ds-echarts-tile-header">
      <div class="ds-echarts-tile-title"><span class="ds-echarts-tile-icon">📈</span><span>3-Year Cumulative Cost Trajectory (USD)</span></div>
      <span class="ds-echarts-tile-badge">LineChart</span>
    </div>
    <div class="ds-chart-card">
      <svg viewBox="0 0 300 150" class="ds-chart-svg">
        <!-- axes -->
        <line x1="46" y1="14"  x2="46"  y2="118" stroke="#2a2a38" stroke-width="1"/>
        <line x1="46" y1="118" x2="272" y2="118" stroke="#2a2a38" stroke-width="1"/>
        <!-- grid ($1M steps) -->
        <line x1="46" y1="98" x2="272" y2="98" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="78" x2="272" y2="78" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="58" x2="272" y2="58" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="38" x2="272" y2="38" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="46" y1="18" x2="272" y2="18" stroke="#1e1e2a" stroke-width="1" stroke-dasharray="3,3"/>
        <!-- y labels: $0→118 $1M→98 $2M→78 $3M→58 $4M→38 $5M→18 -->
        <text x="42" y="121" text-anchor="end" fill="#556" font-size="7">$0</text>
        <text x="42" y="101" text-anchor="end" fill="#556" font-size="7">$1M</text>
        <text x="42" y="81"  text-anchor="end" fill="#556" font-size="7">$2M</text>
        <text x="42" y="61"  text-anchor="end" fill="#556" font-size="7">$3M</text>
        <text x="42" y="41"  text-anchor="end" fill="#556" font-size="7">$4M</text>
        <text x="42" y="21"  text-anchor="end" fill="#556" font-size="7">$5M</text>
        <!-- x labels -->
        <text x="88"  y="130" text-anchor="middle" fill="#667" font-size="7">Year 1</text>
        <text x="168" y="130" text-anchor="middle" fill="#667" font-size="7">Year 2</text>
        <text x="248" y="130" text-anchor="middle" fill="#667" font-size="7">Year 3</text>
        <!-- area fills -->
        <polygon points="46,118 88,43 168,36 248,29 248,118" fill="#60a5fa" opacity="0.05"/>
        <polygon points="46,118 88,57 168,47 248,36 248,118" fill="#a78bfa" opacity="0.05"/>
        <polygon points="46,118 88,93 168,91 248,89 248,118" fill="#4ade80" opacity="0.07"/>
        <!-- Cloud line + dots -->
        <polyline points="88,43 168,36 248,29" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="88"  cy="43" r="4" fill="#60a5fa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'☁ Cloud Yr1 · <b>$4.2M</b>')" onmouseout="hideChartTooltip()"/>
        <circle cx="168" cy="36" r="4" fill="#60a5fa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'☁ Cloud Yr2 · <b>$4.58M</b><br/>+$380K infra ops')" onmouseout="hideChartTooltip()"/>
        <circle cx="248" cy="29" r="4" fill="#60a5fa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'☁ Cloud Yr3 · <b>$4.96M</b><br/>+$760K total infra ops')" onmouseout="hideChartTooltip()"/>
        <!-- AI line + dots -->
        <polyline points="88,57 168,47 248,36" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="88"  cy="57" r="4" fill="#a78bfa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🤖 AI Yr1 · <b>$3.4M</b><br/>Savings: $0 (ramp-up year)')" onmouseout="hideChartTooltip()"/>
        <circle cx="168" cy="47" r="4" fill="#a78bfa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🤖 AI Yr2 · <b>$4.0M</b><br/>Projected savings: $1.8M')" onmouseout="hideChartTooltip()"/>
        <circle cx="248" cy="36" r="4" fill="#a78bfa" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🤖 AI Yr3 · <b>$4.6M</b><br/>Break-even Month 28 · Net: $900K only')" onmouseout="hideChartTooltip()"/>
        <!-- break-even callout — positioned clear of lines -->
        <line x1="168" y1="47" x2="200" y2="62" stroke="#a78bfa" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.5"/>
        <text x="202" y="65" fill="#a78bfa" font-size="6.5" opacity="0.8">B/E Month 28</text>
        <!-- Security line + dots -->
        <polyline points="88,93 168,91 248,89" fill="none" stroke="#4ade80" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="88"  cy="93" r="4" fill="#4ade80" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🔐 Security Yr1 · <b>$1.4M</b><br/>Programme complete · 18% insurance saving')" onmouseout="hideChartTooltip()"/>
        <circle cx="168" cy="91" r="4" fill="#4ade80" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🔐 Security Yr2 · <b>$1.52M</b><br/>+$120K annual support')" onmouseout="hideChartTooltip()"/>
        <circle cx="248" cy="89" r="4" fill="#4ade80" class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'🔐 Security Yr3 · <b>$1.64M</b><br/>Lowest 3-yr cost of all proposals')" onmouseout="hideChartTooltip()"/>
        <!-- gap bracket at Yr3 — right of plot area -->
        <line x1="256" y1="36" x2="256" y2="89" stroke="#f59e0b" stroke-width="0.9" stroke-dasharray="2,2" opacity="0.7"/>
        <text x="262" y="57" fill="#f59e0b" font-size="6.5" opacity="0.85">$2.96M</text>
        <text x="262" y="65" fill="#f59e0b" font-size="6"   opacity="0.65">gap Yr3</text>
        <!-- line labels at Yr3 right edge -->
        <text x="253" y="27" fill="#60a5fa" font-size="6" text-anchor="start">Cloud</text>
        <text x="253" y="84" fill="#4ade80" font-size="6" text-anchor="start">Sec</text>
      </svg>
    </div>
  </div>
</div>` },

        /* ── Chart 3 (was 4): Donut — Security Phase Breakdown ──
           viewBox 300×150: donut cx=82 cy=72 r=52 sw=20  circ=2π×52≈326.7
           P1 30%→98.0  P2 40%→130.7  P3 30%→98.0
           Legend starts x=158 y=30, rows spaced 36px
        ── */
        { type: 'rich', html: `
<div class="ds-interactive-chart-container">
  <div class="bcpr-mcp-call" style="margin-bottom:8px">
    <span class="bcpr-mcp-icon">✦</span>
    <span class="bcpr-mcp-label">create_chart</span>
    <span class="bcpr-mcp-meta">PieChart · Security Budget by Phase · 1s</span>
    <span class="bcpr-mcp-arrow">›</span>
  </div>
  <div class="ds-echarts-tile">
    <div class="ds-echarts-tile-header">
      <div class="ds-echarts-tile-title"><span class="ds-echarts-tile-icon">🔐</span><span>Security Uplift — $1.4M by Delivery Phase</span></div>
      <span class="ds-echarts-tile-badge">PieChart</span>
    </div>
    <div class="ds-chart-card">
      <svg viewBox="0 0 300 150" class="ds-chart-svg">
        <!-- Phase 1: Remediation 30% — blue -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'Phase 1 — Remediation<br/><b>$420K · 30%</b><br/>Months 1–3 · MFA · Access control · Pentest fixes')" onmouseout="hideChartTooltip()">
          <circle cx="82" cy="74" r="52" fill="none" stroke="#3b82d4" stroke-width="20"
            stroke-dasharray="98.0 228.7" stroke-dashoffset="0"
            transform="rotate(-90 82 74)" opacity="0.9"/>
        </g>
        <!-- Phase 2: Hardening 40% — green -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'Phase 2 — Hardening<br/><b>$560K · 40%</b><br/>Months 4–6 · Network seg · EDR · SIEM')" onmouseout="hideChartTooltip()">
          <circle cx="82" cy="74" r="52" fill="none" stroke="#4ade80" stroke-width="20"
            stroke-dasharray="130.7 196.0" stroke-dashoffset="-98.0"
            transform="rotate(-90 82 74)" opacity="0.9"/>
        </g>
        <!-- Phase 3: Governance 30% — purple -->
        <g class="ds-chart-interactive-element" onmouseover="showChartTooltip(event,'Phase 3 — Governance &amp; Cert.<br/><b>$420K · 30%</b><br/>Months 7–9 · ISO 27001 · SOC 2 Type II · Training')" onmouseout="hideChartTooltip()">
          <circle cx="82" cy="74" r="52" fill="none" stroke="#a78bfa" stroke-width="20"
            stroke-dasharray="98.0 228.7" stroke-dashoffset="-228.7"
            transform="rotate(-90 82 74)" opacity="0.9"/>
        </g>
        <!-- centre labels -->
        <text x="82" y="70" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="700">$1.4M</text>
        <text x="82" y="83" text-anchor="middle" fill="#778"    font-size="7">fixed-price</text>
        <!-- legend — rows at y=38, 74, 110; clear of donut right edge (x=134+20=154) -->
        <rect x="158" y="28"  width="10" height="10" rx="2" fill="#3b82d4"/>
        <text x="172" y="36" fill="#c8d0dc" font-size="8">Phase 1 — Remediation</text>
        <text x="172" y="47" fill="#667"    font-size="7">$420K · 30% · Months 1–3</text>

        <rect x="158" y="64"  width="10" height="10" rx="2" fill="#4ade80"/>
        <text x="172" y="72" fill="#c8d0dc" font-size="8">Phase 2 — Hardening</text>
        <text x="172" y="83" fill="#667"    font-size="7">$560K · 40% · Months 4–6</text>

        <rect x="158" y="100" width="10" height="10" rx="2" fill="#a78bfa"/>
        <text x="172" y="108" fill="#c8d0dc" font-size="8">Phase 3 — Gov. &amp; Cert.</text>
        <text x="172" y="119" fill="#667"    font-size="7">$420K · 30% · Months 7–9</text>
      </svg>
    </div>
  </div>
</div>` },

        { type: 'text', text: "Key reads:\n• Security is the only proposal in the ideal quadrant — 93/100, lowest cost, lowest risk.\n• Cloud is high-value but $4.2M and sits in medium-high risk territory.\n• AI Platform's 3-yr line ($4.6M) nearly matches Cloud despite a smaller upfront fee — $600K/yr licence adds up fast, break-even isn't until Month 28.\n• Security phase breakdown: 30/40/30 fixed-price gates — zero overrun exposure." },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════════
       Turn 4 — Synthesis, write board-insights.md, surface report artifact.
       ═══════════════════════════════════════════════════════════════════════ */
    {
      user: "Good — give me the board-ready recommendation. One clear call, with the rationale.",
      bob: [
        { type: 'todo-active', id: 't5' },
        { type: 'text', text: "Synthesising all findings into a single, defensible recommendation with sequencing logic the board can act on immediately." },
        { type: 'rich', html:
          `<div class="ds-plan">
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#4ade80;font-size:16px">★</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title" style="color:#4ade80">Approve Security Uplift now. Sequence Cloud Migration and AI Platform after.</span>
                <span class="ds-plan-desc">This is not a trade-off between equals — it is a prerequisite decision. Without the security baseline Proposal C delivers, both Proposals A and B carry compliance risk that would likely surface as a material finding in the next external audit.</span>
              </div>
            </div>
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#60a5fa">1</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title">Why not AI Platform first?</span>
                <span class="ds-plan-desc">The $600K/yr perpetual licence is a structural commitment you should only enter after the data quality programme is confirmed. ROI assumptions are not yet verifiable against your data estate. Recommend a 6-week assessment before any approval.</span>
              </div>
            </div>
            <div class="ds-plan-item">
              <span class="ds-plan-num" style="color:#60a5fa">2</span>
              <div class="ds-plan-body">
                <span class="ds-plan-title">Why not Cloud Migration first?</span>
                <span class="ds-plan-desc">At $4.2M and 18 months, approving it before the security baseline is established means migrating a non-compliant estate into a hyperscaler — compounding audit exposure. Approve in Q1 2027 once ShieldTech delivers the Month 3 milestone report.</span>
              </div>
            </div>
          </div>` },
        { type: 'todo-done', id: 't5' },
        { type: 'todo-active', id: 't6' },
        { type: 'text', text: "Writing board-insights.md — full executive synthesis with financial comparison, risk matrix, sequencing roadmap, and decision motions." },
        { type: 'writing' },
        { type: 'wrote', filename: 'board-insights.md', mdKey: 'board-insights.md' },
        { type: 'rich', html:
          `<div class="ds-artifact-pill">
            <span class="ds-artifact-icon">&#128196;</span>
            <div class="ds-artifact-body">
              <span class="ds-artifact-title">Q3 Board Meeting Insights Report</span>
              <span class="ds-artifact-sub">Comprehensive executive synthesis: financial comparison, risk scoring, sequencing recommendation, and 3 board motions.</span>
            </div>
            <a href="board/insights-report.html" target="_blank" class="ds-artifact-open">Open ↗</a>
          </div>` },
        { type: 'text', text: `📋 Board Meeting Insights — Ready to table

Singular recommendation: Approve Security Uplift now. Sequence the rest.

What the board can decide today:
  M1 — Approve ShieldTech Security Uplift ($1.4M fixed-price, 9 months). No further committee required.
  M2 — Note Cloud Migration and AI Platform. Instruct CTO to present sequencing plan in Q4.
  M3 — Commission 6-week data quality assessment to validate AI Platform ROI before any licence commitment.

The decision is yours. I made sure you had the right information to make it.` },
        { type: 'todo-done', id: 't6' },
        { type: 'footer', count: '1 report written · 3 motions drafted · board-ready in < 90 min' },
      ],
    },
  ];

  /* ════════════════════════════════════════════════════════════════════════
     MD PANEL — open / close / resize / render
     ══════════════════════════════════════════════════════════════════════ */
  function openMdPanel(filename, markdown) {
    if (!mdPanel) return;
    if (mdTabName) mdTabName.textContent = filename;
    if (mdBcName)  mdBcName.textContent  = filename;
    if (mdBody)    mdBody.innerHTML = renderMarkdown(markdown);
    mdPanel.classList.remove('hidden');
  }

  function initMdPanelResize() {
    if (!mdResizeHnd || !mdPanel) return;
    let dragging = false, startX = 0, startW = 0;

    mdResizeHnd.addEventListener('mousedown', e => {
      if (mdPanel.classList.contains('hidden')) return;
      dragging = true;
      startX = e.clientX;
      startW = mdPanel.getBoundingClientRect().width;
      mdResizeHnd.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const newW = Math.min(Math.max(startW + (e.clientX - startX), 260), 720);
      mdPanel.style.width = newW + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      mdResizeHnd.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    });
  }

  /* ── Minimal Markdown → HTML ─────────────────────────────────────────── */
  function renderMarkdown(md) {
    const lines = md.split('\n');
    const out   = [];
    let i = 0;

    function esc(s)    { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function inline(s) {
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      return s;
    }

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        let code = '';
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) { code += esc(lines[i]) + '\n'; i++; }
        out.push(`<pre><code${lang ? ` class="lang-${lang}"` : ''}>${code}</code></pre>`);
        i++; continue;
      }

      // Headings
      const hm = line.match(/^(#{1,4})\s+(.*)/);
      if (hm) { out.push(`<h${hm[1].length}>${inline(esc(hm[2]))}</h${hm[1].length}>`); i++; continue; }

      // HR
      if (/^---+$/.test(line.trim())) { out.push('<hr>'); i++; continue; }

      // Blockquote
      if (line.startsWith('> ')) { out.push(`<blockquote>${inline(esc(line.slice(2)))}</blockquote>`); i++; continue; }

      // Table
      if (line.startsWith('|')) {
        const tl = [];
        while (i < lines.length && lines[i].startsWith('|')) { tl.push(lines[i]); i++; }
        const [head, , ...body] = tl;
        const th = head.split('|').slice(1,-1).map(c => `<th>${inline(esc(c.trim()))}</th>`).join('');
        const rows = body.map(r => '<tr>' + r.split('|').slice(1,-1).map(c => `<td>${inline(esc(c.trim()))}</td>`).join('') + '</tr>').join('');
        out.push(`<table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`);
        continue;
      }

      // Unordered list
      if (/^[-*]\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(`<li>${inline(esc(lines[i].slice(2)))}</li>`); i++; }
        out.push(`<ul>${items.join('')}</ul>`);
        continue;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(`<li>${inline(esc(lines[i].replace(/^\d+\.\s/, '')))}</li>`);
          i++;
        }
        out.push(`<ol>${items.join('')}</ol>`);
        continue;
      }

      if (line.trim() === '') { i++; continue; }
      out.push(`<p>${inline(esc(line))}</p>`);
      i++;
    }
    return out.join('\n');
  }

  /* ════════════════════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════════════════ */
  function initChat() {
    body        = document.getElementById('bcp-body');
    welcome     = document.getElementById('bcp-welcome');
    msgs        = document.getElementById('bcp-messages');
    inputEl     = document.getElementById('bcp-scripted-input');
    inputBox    = document.getElementById('bcp-input-box');
    sendBtn     = document.getElementById('bcp-send');
    expTree     = document.querySelector('.bcp-exp-tree');
    chatCol     = document.querySelector('.bcp-chat-col');
    mdPanel     = document.getElementById('bcp-md-panel');
    mdClose     = document.getElementById('bcp-md-close');
    mdBody      = document.getElementById('bcp-md-body');
    mdTabName   = document.getElementById('bcp-md-tab-name');
    mdBcName    = document.getElementById('bcp-md-bc-name');
    mdResizeHnd = document.getElementById('bcp-md-resize-handle');

    // Close button
    if (mdClose) mdClose.addEventListener('click', () => mdPanel.classList.add('hidden'));

    // Resize
    initMdPanelResize();

    // Pre-fetch the two MD files so clicking them is instant
    fetch('board/proposal-cloud.md').then(r => r.text()).then(t => { MD_CONTENT['proposal-cloud.md'] = t; }).catch(() => {});
    fetch('board/board-insights.md').then(r => r.text()).then(t => { MD_CONTENT['board-insights.md'] = t; }).catch(() => {});

    // Seed explorer with the three proposal files
    addExplorerFile('proposal-cloud.md', 'proposal-cloud.md');
    addExplorerFile('proposal-ai.csv');
    addExplorerFile('proposal-security.docx');

    // Interactive Chart Delegation
    if (msgs) {
      msgs.addEventListener('click', e => {
        // Tab click handling
        const tab = e.target.closest('.ds-chart-tab');
        if (tab) {
          const container = tab.closest('.ds-interactive-chart-container');
          if (container) {
            container.querySelectorAll('.ds-chart-tab').forEach(t => t.classList.remove('active'));
            container.querySelectorAll('.ds-chart-view-panel').forEach(v => v.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetView = container.querySelector('#' + targetId);
            if (targetView) targetView.classList.add('active');
          }
        }
        
        // Legend item click handling (toggle series visibility)
        const legItem = e.target.closest('.ds-chart-legend-item');
        if (legItem) {
          const container = legItem.closest('.ds-interactive-chart-container');
          if (container) {
            const seriesId = legItem.getAttribute('data-series');
            legItem.classList.toggle('disabled');
            const isDisabled = legItem.classList.contains('disabled');
            
            container.querySelectorAll(`[data-chart-series="${seriesId}"]`).forEach(el => {
              if (isDisabled) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
              } else {
                el.style.opacity = el.getAttribute('data-original-opacity') || '1';
                el.style.pointerEvents = 'auto';
              }
            });
          }
        }
      });
    }

    // Set up global dynamic tooltips for Bob's real chart representation
    window.showChartTooltip = function (event, text) {
      let tooltip = document.getElementById('ds-chart-global-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'ds-chart-global-tooltip';
        tooltip.className = 'ds-chart-tooltip-el';
        document.body.appendChild(tooltip);
      }
      tooltip.innerHTML = text;
      tooltip.classList.add('visible');
      
      const updatePosition = (e) => {
        tooltip.style.left = (e.clientX + 14) + 'px';
        tooltip.style.top = (e.clientY + 14) + 'px';
      };
      updatePosition(event);
      event.target.onmousemove = updatePosition;
    };

    window.hideChartTooltip = function () {
      const tooltip = document.getElementById('ds-chart-global-tooltip');
      if (tooltip) tooltip.classList.remove('visible');
    };

    sendBtn.addEventListener('click', advance);
    updateUI();
  }

  /* ════════════════════════════════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════════════════════════════ */
  function scrollToBottom() { body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); }

  function activateChat() {
    if (!msgs.classList.contains('active')) {
      welcome.classList.add('hidden');
      msgs.classList.add('active');
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     MESSAGE BUILDERS
     ══════════════════════════════════════════════════════════════════════ */
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

  function typewrite(el, text, speed = 9) {
    return new Promise(resolve => {
      let i = 0;
      function tick() {
        if (i >= text.length) { resolve(); return; }
        el.textContent += text[i++];
        scrollToBottom();
        setTimeout(tick, speed);
      }
      tick();
    });
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

  function appendWroteFile(contentDiv, filename, mdKey) {
    const el = document.createElement('div');
    el.className = 'bcp-wrote-file';
    el.title = mdKey ? 'Open ' + filename : filename;
    el.style.cursor = mdKey ? 'pointer' : 'default';
    el.innerHTML =
      `<span class="bcp-wrote-file-icon">&#9998;</span>` +
      `<span class="bcp-wrote-file-name">${filename}</span>` +
      `<span class="bcp-wrote-file-arrow">›</span>`;
    if (mdKey) {
      el.addEventListener('click', () => {
        const content = MD_CONTENT[mdKey] || '*Loading…*';
        openMdPanel(filename, content);
      });
    }
    contentDiv.appendChild(el);
    addExplorerFile(filename, mdKey);
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

  /* Icon per file type */
  function fileIcon(filename) {
    if (filename.endsWith('.md'))   return '📄';
    if (filename.endsWith('.csv'))  return '📊';
    if (filename.endsWith('.docx')) return '📋';
    if (filename.endsWith('.html')) return '🌐';
    return '📄';
  }

  function addExplorerFile(filename, mdKey) {
    if (!expTree) return;
    if (expTree.querySelector(`[data-expfile="${CSS.escape(filename)}"]`)) return;
    const file = document.createElement('div');
    file.className = 'bcp-exp-file active';
    file.setAttribute('data-expfile', filename);
    const isLink = FILE_LINKS[filename] && !mdKey;
    file.style.cursor = (mdKey || isLink) ? 'pointer' : 'default';
    file.innerHTML =
      `<span class="bcp-exp-file-icon">${fileIcon(filename)}</span>` +
      `<span class="bcp-exp-file-name">${filename}</span>`;
    if (mdKey) {
      file.title = 'Open ' + filename;
      file.addEventListener('click', () => {
        const content = MD_CONTENT[mdKey] || '*Loading…*';
        openMdPanel(filename, content);
      });
    } else if (FILE_LINKS[filename]) {
      file.title = 'Open ' + filename;
      file.addEventListener('click', () => window.open(FILE_LINKS[filename], '_blank'));
    }
    expTree.appendChild(file);
    setTimeout(() => file.classList.remove('active'), 3000);
  }

  /* ════════════════════════════════════════════════════════════════════════
     TODO PANEL
     ══════════════════════════════════════════════════════════════════════ */
  function createTodoPanel() {
    const panel = document.createElement('div');
    panel.className = 'ds-todo-panel';
    panel.id = 'ds-todo-panel';

    const header = document.createElement('div');
    header.className = 'ds-todo-header';
    header.innerHTML =
      `<span class="ds-todo-header-icon">&#9744;</span>` +
      `<span class="ds-todo-header-title">Analysis plan</span>` +
      `<span class="ds-todo-header-count" id="ds-todo-count">0 / ${TODOS.length}</span>` +
      `<span class="ds-todo-header-chevron">›</span>`;
    header.addEventListener('click', () => panel.classList.toggle('open'));

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

    if (chatCol) chatCol.insertBefore(panel, document.getElementById('bcp-body'));
    todoPanel = panel;
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
    const all  = document.querySelectorAll('#ds-todo-list .ds-todo-item');
    const done = document.querySelectorAll('#ds-todo-list .ds-todo-item.done');
    if (all.length && all.length === done.length) {
      const icon  = document.querySelector('#ds-todo-panel .ds-todo-header-icon');
      const title = document.querySelector('#ds-todo-panel .ds-todo-header-title');
      if (icon)  { icon.textContent = '✓'; icon.style.color = '#4ade80'; }
      if (title) { title.textContent = 'Analysis complete!'; title.style.color = '#4ade80'; }
    }
  }

  function refreshTodoCount() {
    const done = document.querySelectorAll('#ds-todo-list .ds-todo-item.done').length;
    const el = document.getElementById('ds-todo-count');
    if (el) el.textContent = `${done} / ${TODOS.length}`;
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEGMENT RENDERER
     ══════════════════════════════════════════════════════════════════════ */
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
        await delay(1800);
        bar.remove();
      }
      else if (seg.type === 'wrote') {
        if (!contentDiv) contentDiv = addBobRow();
        appendWroteFile(contentDiv, seg.filename, seg.mdKey || null);
        await delay(300);
      }
      else if (seg.type === 'footer') {
        if (!contentDiv) contentDiv = addBobRow();
        appendFooter(contentDiv, seg.count);
      }
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

  /* ════════════════════════════════════════════════════════════════════════
     MAIN LOOP
     ══════════════════════════════════════════════════════════════════════ */
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
        `<button class="bcp-restart-btn">↺ Restart</button>` +
        `<button class="bcp-restart-btn" id="bcp-back-btn" style="border-color:#4fc3f7;color:#4fc3f7;">Continue →</button>`;
      msgs.appendChild(wrap);
      scrollToBottom();

      wrap.querySelector('.bcp-restart-btn').addEventListener('click', () => {
        step = 0;
        msgs.innerHTML = '';
        const existing = document.getElementById('ds-todo-panel');
        if (existing) existing.remove();
        todoPanel = null;
        if (mdPanel) mdPanel.classList.add('hidden');
        if (expTree) expTree.querySelectorAll('.bcp-exp-file').forEach(f => f.remove());
        addExplorerFile('proposal-cloud.md', 'proposal-cloud.md');
        addExplorerFile('proposal-ai.csv');
        addExplorerFile('proposal-security.docx');
        activateChat();
        updateUI();
      });

      // Continue → returns to scene-vp.html where the epilogue scenes play
      document.getElementById('bcp-back-btn').addEventListener('click', () => {
        location.href = '../scene-vp.html';
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

    const cur = SCRIPT[step];
    addUserMsg(cur.user);
    inputEl.textContent = '';
    inputEl.classList.remove('ready');

    await delay(600);
    await renderSegments(cur.bob);

    step++;
    busy = false;
    updateUI();
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

}());
