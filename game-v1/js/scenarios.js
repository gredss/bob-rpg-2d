/**
 * scenarios.js — complete game content
 * All 8 characters, 2 scenarios, all dialogue, all tasks, all Bob responses.
 *
 * Scene types:
 *   'narration'  — no portrait, just narrator text, auto-advance or click
 *   'dialogue'   — character speaks, no choices
 *   'task'       — character presents a problem with choices
 *   'chapter'    — full-screen chapter title card
 *   'end'        — triggers results page
 */

const CHARACTERS = {
  // ── Team scenario characters (SCENARIO_A / SCENARIO_B) ──────────────────
  pm:       { name: 'Alex Chen',    role: 'Product Manager'  },
  ux:       { name: 'Maya Osei',    role: 'UX Designer'      },
  frontend: { name: 'Jordan Park',  role: 'Frontend Dev'     },
  backend:  { name: 'Sam Rivera',   role: 'Backend Dev'      },
  data:     { name: 'Priya Nair',   role: 'Data Scientist'   },
  qa:       { name: 'Chris Dubois', role: 'QA Engineer'      },
  devops:   { name: 'Taylor Kim',   role: 'DevOps / MLOps'   },
  security: { name: 'Morgan Blake', role: 'Cybersecurity'    },
  // ── Script-mode characters (role-scenarios) ──────────────────────────────
  priya:    { name: 'Priya Nair',   role: 'Data Analyst'     },
  sam:      { name: 'Sam Rivera',   role: 'Developer'        },
  taylor:   { name: 'Taylor Kim',   role: 'Head IT'          },
  alex:     { name: 'Alex Chen',    role: 'VP / Director'    },
  // ── Shared ───────────────────────────────────────────────────────────────
  bob:      { name: 'Bob',          role: 'AI Teammate'      },
  narrator: { name: 'NARRATOR',     role: ''                 },
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO A — AI Customer Service Platform
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIO_A = {
  id: 'scenario-a',
  title: 'AI Customer Service Platform',
  client: 'CLIENT: Meridian Bank',
  brief: 'Meridian Bank wants an AI-powered customer service platform to classify tickets, route requests, and assist human agents — all before your 10-minute client demo.',
  scenes: [

    // ── CHAPTER 1 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'plan', title: 'CHAPTER 1', subtitle: 'Plan — What Are We Building?' },

    { type: 'dialogue', char: 'narrator',
      text: 'Monday morning. Meridian Bank just sent over their requirements brief.\nYour team has 10 minutes before the live client demo. Let\'s go.' },

    { type: 'dialogue', char: 'pm',
      text: 'I just read Meridian\'s brief. There are three different stakeholders and they all want different things.\n\nOperations wants auto-routing. Customer Success wants manual override on every ticket. Compliance needs a full audit log.' },

    { type: 'task', char: 'pm', phase: 'plan',
      problem: 'Three stakeholders, three conflicting requirements. The UX team is waiting for a spec. What should Alex do?',
      options: [
        {
          id: 'pm-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to analyze the brief and reconcile the conflicts',
          meta: '~10 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 8, satisfaction: 8 },
          bobResponse: 'I found 3 conflicting requirements in the Meridian brief.\n\n1. Operations: auto-route by issue type\n2. Customer Success: manual override on all tickets\n3. Compliance: full audit log of all routing decisions\n\nThese can coexist. I recommend: implement auto-routing with a manual override option, and log every routing decision automatically.\n\nThis satisfies all three stakeholders with a single architecture decision.',
          bobFollowUp: 'Apply Bob\'s recommended approach',
          followUpDeltas: { quality: 5, satisfaction: 5 },
          outcome: 'Requirements reconciled. UX team unblocked. ✓',
        },
        {
          id: 'pm-a-manual', type: 'manual', icon: '',
          label: 'Draft the requirements manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 4, satisfaction: 3 },
          outcome: 'Requirements drafted. Takes longer but gets there.',
        },
        {
          id: 'pm-a-skip', type: 'ignore', icon: '',
          label: 'Proceed without resolving conflicts — figure it out later',
          meta: 'high risk', timeCost: 0,
          deltas: { quality: -5, satisfaction: -15 },
          outcome: 'Conflicts ignored. UX and Dev are confused. Quality dropped.',
        },
      ],
    },

    { type: 'dialogue', char: 'ux',
      text: 'Thanks for the spec, Alex. I\'m designing the customer portal and agent dashboard now.\n\nOne issue — the requirements don\'t mention accessibility. Screen readers, keyboard navigation, color contrast... nothing.' },

    { type: 'task', char: 'ux', phase: 'plan',
      problem: 'Maya needs accessibility guidelines before designing. No spec exists. The dev team is waiting on designs.',
      options: [
        {
          id: 'ux-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate accessibility guidelines from the requirements',
          meta: '~12 sec saved', timeCost: 12, manualCost: 50,
          deltas: { quality: 10, satisfaction: 6 },
          bobResponse: 'Design accessibility review complete.\n\nMissing from current spec:\n1. Keyboard navigation — all interactive elements need tab order\n2. Screen reader labels — ARIA labels required on dashboard widgets\n3. Color contrast — minimum 4.5:1 ratio for text on dark backgrounds\n4. Focus indicators — visible focus ring on every clickable element\n\nI\'ve drafted a one-page accessibility checklist for the design phase.',
          bobFollowUp: 'Apply accessibility checklist to designs',
          followUpDeltas: { quality: 5 },
          outcome: 'Accessible design spec created. Quality improved. ✓',
        },
        {
          id: 'ux-a-manual', type: 'manual', icon: '',
          label: 'Design based on what\'s in the requirements and move on',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { quality: 4, satisfaction: 2 },
          outcome: 'Design started. Accessibility gaps remain.',
        },
      ],
    },

    // ── CHAPTER 2 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'build', title: 'CHAPTER 2', subtitle: 'Build — Make It Real' },

    { type: 'dialogue', char: 'backend',
      text: 'Hey, I\'m building the ticket API. Just hit a wall.\n\nEvery time I test under load — anything above 3 concurrent requests — I get HTTP 500. Can\'t figure out why.' },

    { type: 'task', char: 'backend', phase: 'build',
      problem: 'The ticket API crashes under load with HTTP 500. Jordan\'s frontend integration is blocked. Client demo is approaching.',
      options: [
        {
          id: 'be-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to analyze the error logs',
          meta: '~33 sec saved', timeCost: 9, manualCost: 42,
          deltas: { quality: 12, security: 3 },
          bobResponse: 'I analyzed the server logs. Two issues found:\n\n1. DB_POOL_SIZE is set to 1 — causing connection timeouts when more than one request arrives simultaneously. Recommend increasing to 10.\n\n2. The authentication middleware throws a TypeError on null Bearer tokens — the new client SDK sends an empty Authorization header instead of omitting it.\n\nRoot cause: DB pool. Fix takes ~30 seconds.',
          bobFollowUp: 'Apply both fixes',
          followUpDeltas: { quality: 8, security: 3 },
          outcome: 'API stabilized. Both bugs fixed. Jordan unblocked. ✓',
        },
        {
          id: 'be-a-restart', type: 'poor', icon: '',
          label: 'Restart the service and hope the problem goes away',
          meta: 'risky', timeCost: 5,
          deltas: { quality: -8, satisfaction: -5 },
          outcome: 'Still crashing. Time wasted. Problem got worse.',
        },
        {
          id: 'be-a-manual', type: 'manual', icon: '',
          label: 'Read the logs manually and debug step by step',
          meta: '~42 sec', timeCost: 42, manualCost: 42,
          deltas: { quality: 5 },
          outcome: 'Found the bug eventually. Took a while.',
        },
      ],
    },

    { type: 'dialogue', char: 'frontend',
      text: 'I\'m building the agent dashboard and I just integrated Sam\'s API.\n\nGot 47 validation errors. Some are null checks, some are field name mismatches. I don\'t even know where to start.' },

    { type: 'task', char: 'frontend', phase: 'build',
      problem: '47 validation errors across the dashboard after API integration. QA review is tomorrow.',
      options: [
        {
          id: 'fe-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to group and explain the 47 errors',
          meta: '~44 sec saved', timeCost: 11, manualCost: 55,
          deltas: { quality: 12 },
          bobResponse: 'I grouped all 47 errors into 3 root causes:\n\n1. (31 errors) Null-check failure — ticket.assignee can be undefined but the code assumes it always exists.\n\n2. (14 errors) Field name mismatch — backend returns ticket_id but frontend expects ticketId (camelCase vs snake_case).\n\n3. (2 errors) StatusBadge component is missing a required "status" prop in two places.\n\nFix the null-check first — it covers 66% of the errors.',
          bobFollowUp: 'Fix all three root causes',
          followUpDeltas: { quality: 8 },
          outcome: 'All 47 errors resolved. Dashboard clean. ✓',
        },
        {
          id: 'fe-a-manual', type: 'manual', icon: '',
          label: 'Fix each error one by one manually',
          meta: '~55 sec', timeCost: 55, manualCost: 55,
          deltas: { quality: 5 },
          outcome: 'Errors fixed but it took ages.',
        },
        {
          id: 'fe-a-ignore', type: 'ignore', icon: '',
          label: 'Mark them as known issues and move forward',
          meta: 'quality risk', timeCost: 0,
          deltas: { quality: -15 },
          outcome: 'QA is going to have a bad day. Quality tanked.',
        },
      ],
    },

    // ── CHAPTER 3 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'data', title: 'CHAPTER 3', subtitle: 'Data / AI — The Brain' },

    { type: 'dialogue', char: 'narrator',
      text: ' Breaking: Meridian just added a new requirement mid-sprint.\n\n"We want sentiment analysis on every incoming ticket. Immediately."' },

    { type: 'dialogue', char: 'data',
      text: 'Great. Sentiment analysis, added in the middle of build phase. Love that.\n\nOkay. I have customer message data but 23% of records are too short for reliable analysis. And the intent model accuracy just dropped from 89% to 61%.' },

    { type: 'task', char: 'data', phase: 'data',
      problem: 'Intent model accuracy dropped from 89% to 61%. Sentiment analysis needed urgently. Short messages polluting the dataset.',
      options: [
        {
          id: 'ds-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to diagnose the model drop and handle sentiment',
          meta: '~47 sec saved', timeCost: 13, manualCost: 60,
          deltas: { quality: 14, satisfaction: 10 },
          bobResponse: 'Two findings:\n\n1. Intent model drop: a distribution shift in the last training batch — 3 days of messages from a beta test group used different vocabulary. The model overfit to it. Fix: remove the beta batch and retrain. Expected accuracy recovery: ~85%.\n\n2. Sentiment analysis: 23% of records have fewer than 10 words — too short for reliable inference. Recommend filtering records under 10 words and using a pre-trained sentiment model on the rest. Estimated accuracy: 81%. Deployable for demo.',
          bobFollowUp: 'Apply both fixes',
          followUpDeltas: { quality: 8, satisfaction: 8 },
          outcome: 'Model retrained. Sentiment integrated. Ready for demo. ✓',
        },
        {
          id: 'ds-a-manual', type: 'manual', icon: '',
          label: 'Investigate the model manually and handle sentiment after',
          meta: '~60 sec', timeCost: 60, manualCost: 60,
          deltas: { quality: 5, satisfaction: 5 },
          outcome: 'Fixed, eventually. Running behind schedule.',
        },
        {
          id: 'ds-a-deploy', type: 'ignore', icon: '',
          label: 'Deploy with current 61% accuracy — it\'s probably fine',
          meta: 'quality risk', timeCost: 0,
          deltas: { quality: -20, satisfaction: -15 },
          outcome: 'Client sees wrong classifications in the demo. Very awkward.',
        },
      ],
    },

    // ── CHAPTER 4 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'test', title: 'CHAPTER 4', subtitle: 'Test — Does It Actually Work?' },

    { type: 'dialogue', char: 'qa',
      text: 'I reviewed the ticket workflow. You have three test cases.\n\nThree.\n\nFor a system that handles banking customer data.\n\nI\'m not angry, I\'m just... okay I\'m a little angry.' },

    { type: 'task', char: 'qa', phase: 'test',
      problem: 'Only 3 test cases exist for a system handling banking customer data. QA needs comprehensive coverage before sign-off.',
      options: [
        {
          id: 'qa-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate a full test suite',
          meta: '~38 sec saved', timeCost: 10, manualCost: 48,
          deltas: { quality: 15 },
          bobResponse: 'Generated 12 additional test cases:\n\n1. Null ticket body\n2. Duplicate ticket submission\n3. Concurrent ticket creation (race condition)\n4. Routing engine timeout fallback\n5. Single-character subject line\n6. Attachment over 10MB\n7. Non-ASCII characters in subject\n8. Ticket assigned to deleted agent\n9. Re-open of already-resolved ticket\n10. Bulk import with mixed statuses\n11. Customer PII in free-text field\n12. Cross-team ticket visibility check',
          bobFollowUp: 'Add all 12 test cases to the suite',
          followUpDeltas: { quality: 10 },
          outcome: '15 total test cases. PII test already caught a bug. ✓',
        },
        {
          id: 'qa-a-manual', type: 'manual', icon: '',
          label: 'Write additional test cases manually',
          meta: '~48 sec', timeCost: 48, manualCost: 48,
          deltas: { quality: 6 },
          outcome: 'More tests added. Decent coverage now.',
        },
        {
          id: 'qa-a-ship', type: 'ignore', icon: '',
          label: 'Ship with 3 tests — it\'s a demo, not production',
          meta: 'quality risk', timeCost: 0,
          deltas: { quality: -15 },
          outcome: 'Three tests for a banking system. Chris is writing a strongly-worded email.',
        },
      ],
    },

    { type: 'dialogue', char: 'qa',
      text: 'One more thing. I found a regression.\n\nThe routing logic is sending ALL "account" category tickets to the billing team. Account management is getting zero tickets. Billing is losing their minds.' },

    { type: 'task', char: 'qa', phase: 'test',
      problem: 'A config change broke ticket routing — all "account" tickets go to billing instead of account management.',
      options: [
        {
          id: 'qa-a2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to trace the regression',
          meta: '~35 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 12 },
          bobResponse: 'Found it.\n\nYesterday\'s backend commit changed the "account" category enum value from ACCOUNT to ACCOUNT_MGMT — but the routing rules still reference the old value ACCOUNT.\n\nIt\'s a one-line config fix in routing.config.js.',
          bobFollowUp: 'Apply the config fix',
          followUpDeltas: { quality: 8 },
          outcome: 'Routing fixed. Billing team relieved. ✓',
        },
        {
          id: 'qa-a2-manual', type: 'manual', icon: '',
          label: 'Trace the routing logic manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 5 },
          outcome: 'Found eventually. Routing fixed.',
        },
      ],
    },

    // ── CHAPTER 5 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'security', title: 'CHAPTER 5', subtitle: 'Security — Is It Safe?' },

    { type: 'dialogue', char: 'security',
      text: 'I\'ve been reviewing the codebase.\n\nTwo things.\n\nFirst — a payment processor API key was committed to the repository 3 days ago. It\'s sitting there in plain text in git history.' },

    { type: 'task', char: 'security', phase: 'security',
      problem: 'A payment API key has been exposed in git history for 3 days. It may already be compromised.',
      options: [
        {
          id: 'sec-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to assess exposure and generate a remediation plan',
          meta: '~46 sec saved', timeCost: 12, manualCost: 58,
          deltas: { security: 20, quality: 5 },
          bobResponse: 'Exposure assessment:\n\nThe key has been in git history for 72 hours. Public repo risk: unknown. Recommended immediate actions:\n\n1. Rotate the key via the payment provider dashboard — now\n2. Remove from git history using git filter-branch or BFG Repo Cleaner\n3. Update the secrets manager entry\n4. Audit payment API logs for unauthorized calls in the past 72 hours\n5. Add a pre-commit hook to block future credential commits',
          bobFollowUp: 'Execute the full remediation plan',
          followUpDeltas: { security: 15, quality: 3 },
          outcome: 'Key rotated. History cleaned. Audit complete. ✓',
        },
        {
          id: 'sec-a-quiet', type: 'poor', icon: '',
          label: 'Quietly rotate the key and hope no one noticed',
          meta: 'security risk', timeCost: 10,
          deltas: { security: -10, satisfaction: -5 },
          outcome: 'Key rotated but git history not cleaned. Still vulnerable.',
        },
        {
          id: 'sec-a-manual', type: 'manual', icon: '',
          label: 'Handle the remediation manually',
          meta: '~58 sec', timeCost: 58, manualCost: 58,
          deltas: { security: 10 },
          outcome: 'Handled. Took a while.',
        },
      ],
    },

    { type: 'dialogue', char: 'security',
      text: 'Second issue. The customer data endpoint — /api/tickets/:id/customer — has zero access control.\n\nAny authenticated user can read any customer\'s data. In a banking app. Serving PII.' },

    { type: 'task', char: 'security', phase: 'security',
      problem: 'Customer PII endpoint has no access control. Any logged-in user can read any customer\'s data.',
      options: [
        {
          id: 'sec-a2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to design the access control pattern',
          meta: '~30 sec saved', timeCost: 10, manualCost: 40,
          deltas: { security: 18 },
          bobResponse: 'Recommended access control pattern:\n\n1. Agents: can only access tickets assigned to them\n2. Supervisors: can access all tickets within their team\n3. Cross-team access: blocked entirely\n\nImplementation: add a middleware guard that validates the requesting user\'s team_id against the ticket\'s assigned_team_id before returning any customer data.',
          bobFollowUp: 'Implement the middleware guard',
          followUpDeltas: { security: 12 },
          outcome: 'PII endpoint secured. Compliance team will be happy. ✓',
        },
        {
          id: 'sec-a2-ignore', type: 'ignore', icon: '',
          label: 'Leave it for post-launch hardening — it\'s just a demo',
          meta: 'critical risk', timeCost: 0,
          deltas: { security: -25, satisfaction: -15 },
          outcome: 'Banking PII exposed with no access control. Compliance is not amused.',
        },
        {
          id: 'sec-a2-manual', type: 'manual', icon: '',
          label: 'Add access control manually',
          meta: '~40 sec', timeCost: 40, manualCost: 40,
          deltas: { security: 10 },
          outcome: 'Access control added.',
        },
      ],
    },

    // ── CHAPTER 6 ──────────────────────────────────────────────────────────
    { type: 'chapter', phase: 'deploy', title: 'CHAPTER 6', subtitle: 'Deploy — Ship It' },

    { type: 'dialogue', char: 'devops',
      text: 'Deployment attempt 1: failed.\n\nExit code 137. Container crashed immediately on startup. The AI model didn\'t even get a chance to load.' },

    { type: 'task', char: 'devops', phase: 'deploy',
      problem: 'Container OOM-killed on startup with exit code 137. The AI model can\'t load.',
      options: [
        {
          id: 'do-a-bob', type: 'bob', icon: '',
          label: 'Ask Bob to diagnose the deployment failure',
          meta: '~41 sec saved', timeCost: 11, manualCost: 52,
          deltas: { quality: 8, satisfaction: 5 },
          bobResponse: 'Exit code 137 is an OOM kill — the container ran out of memory.\n\nThe deployment manifest sets a 256MB memory limit. The intent classification model requires a minimum of 512MB at load time, with peaks up to 680MB during inference.\n\nFix: update the container memory limit to 768MB in the deployment manifest.',
          bobFollowUp: 'Update the manifest and redeploy',
          followUpDeltas: { quality: 5, satisfaction: 5 },
          outcome: 'Container running. Model loaded. Deployment successful. ✓',
        },
        {
          id: 'do-a-retry', type: 'poor', icon: '',
          label: 'Retry the deployment — maybe it was a fluke',
          meta: 'wastes time', timeCost: 5,
          deltas: { quality: -5, satisfaction: -10 },
          outcome: 'Still failing. Wasted 5 minutes. Same exit code 137.',
        },
        {
          id: 'do-a-manual', type: 'manual', icon: '',
          label: 'Read the full logs and investigate manually',
          meta: '~52 sec', timeCost: 52, manualCost: 52,
          deltas: { quality: 3 },
          outcome: 'Found the memory issue. Slow but got there.',
        },
      ],
    },

    { type: 'dialogue', char: 'devops',
      text: 'Nice. Container is up. Now the CI pipeline is blocking the final push.\n\nError: "Cannot find module @meridian/ai-client". The package exists... it just isn\'t resolving in CI.' },

    { type: 'task', char: 'devops', phase: 'deploy',
      problem: 'CI pipeline fails with module not found. The package exists in the repo but CI can\'t resolve it.',
      options: [
        {
          id: 'do-a2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to diagnose the CI failure',
          meta: '~35 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 8 },
          bobResponse: '@meridian/ai-client is listed as a devDependency in package.json.\n\nThe CI pipeline runs npm install --production which skips devDependencies.\n\nTwo solutions:\n1. Move @meridian/ai-client to dependencies (recommended)\n2. Update the CI install script to remove the --production flag',
          bobFollowUp: 'Move to dependencies and fix CI config',
          followUpDeltas: { quality: 5 },
          outcome: 'CI pipeline green. Final build deployed. ✓',
        },
        {
          id: 'do-a2-force', type: 'ignore', icon: '',
          label: 'Skip the failing step and force-push to production',
          meta: 'high risk', timeCost: 0,
          deltas: { quality: -10, satisfaction: -8 },
          outcome: 'Deployment incomplete. Client demo is showing a broken import.',
        },
        {
          id: 'do-a2-manual', type: 'manual', icon: '',
          label: 'Investigate the CI configuration manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 3 },
          outcome: 'Found the devDependency issue. Fixed.',
        },
      ],
    },

    // ── ENDING ────────────────────────────────────────────────────────────
    { type: 'dialogue', char: 'narrator',
      text: 'The Meridian Bank client demo is starting now.\n\nTicket submitted. AI classified it correctly. Agent dashboard loaded cleanly. PII is protected. The system is live.' },

    { type: 'dialogue', char: 'pm',
      text: 'That was... actually smooth.\n\nI don\'t know if it was us or Bob, but everything came together.' },

    { type: 'dialogue', char: 'bob',
      text: 'It was both of us.\n\nYou knew what needed to be done. I just helped you do it faster.' },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO B — Banking Financial Analytics Platform
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIO_B = {
  id: 'scenario-b',
  title: 'Financial Analytics Platform',
  client: 'CLIENT: Novo Capital',
  brief: 'Novo Capital needs a real-time financial analytics dashboard for portfolio managers — P&L trends, risk exposure, and anomaly alerts. Client demo in 10 minutes.',
  scenes: [

    { type: 'chapter', phase: 'plan', title: 'CHAPTER 1', subtitle: 'Plan — What Are We Building?' },

    { type: 'dialogue', char: 'narrator',
      text: 'Three stakeholders at Novo Capital each sent a different requirements document.\n\nThey contradict each other on 5 major points. Your team is waiting for a decision.' },

    { type: 'task', char: 'pm', phase: 'plan',
      problem: 'Three conflicting requirements documents from Novo stakeholders. Operations wants real-time. Risk wants historical trends. Compliance wants audit exports. The UX team cannot start without a unified spec.',
      options: [
        {
          id: 'pm-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to reconcile all three documents into one spec',
          meta: '~39 sec saved', timeCost: 11, manualCost: 50,
          deltas: { quality: 12, satisfaction: 10 },
          bobResponse: 'I analyzed all three requirements documents. Found 5 direct conflicts.\n\nCore tension: real-time vs. historical data.\n\nResolution: both are achievable with a tabbed dashboard — a "Live" tab for real-time metrics and a "History" tab for trend analysis. Compliance export is orthogonal and can be a separate feature triggered on demand.\n\nI\'ve generated a unified requirements spec that satisfies all three stakeholders.',
          bobFollowUp: 'Adopt the unified spec',
          followUpDeltas: { quality: 8, satisfaction: 7 },
          outcome: 'Unified spec accepted. All stakeholders aligned. ✓',
        },
        {
          id: 'pm-b-pick', type: 'ignore', icon: '',
          label: 'Pick one stakeholder\'s version and go with it',
          meta: 'satisfaction risk', timeCost: 0,
          deltas: { quality: -5, satisfaction: -20 },
          outcome: 'Two stakeholders are unhappy. Scope creep incoming.',
        },
        {
          id: 'pm-b-manual', type: 'manual', icon: '',
          label: 'Manually work through the conflicts document by document',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { quality: 5, satisfaction: 4 },
          outcome: 'Requirements reconciled. Long but done.',
        },
      ],
    },

    { type: 'dialogue', char: 'ux',
      text: 'I\'m designing the portfolio dashboard. The challenge is showing real-time positions AND historical trends in one interface without overwhelming portfolio managers.\n\nThese people make million-dollar decisions from this screen.' },

    { type: 'task', char: 'ux', phase: 'plan',
      problem: 'Dual real-time/historical dashboard needs clear information architecture. Portfolio managers need instant readability.',
      options: [
        {
          id: 'ux-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to suggest an information architecture',
          meta: '~33 sec saved', timeCost: 12, manualCost: 45,
          deltas: { quality: 10, satisfaction: 8 },
          bobResponse: 'Recommended IA for dual-mode financial dashboard:\n\nPrimary view: real-time metrics with live updating numbers. A single "Historical Mode" toggle switches context — don\'t try to show both simultaneously.\n\nKey accessibility note: portfolio managers need to read risk levels at a glance under stress. Use color coding with redundant numeric labels (don\'t rely on color alone). High-contrast pairs: red/green with text labels.',
          bobFollowUp: 'Apply the IA and accessibility guidelines',
          followUpDeltas: { quality: 7, satisfaction: 5 },
          outcome: 'Clean, readable dashboard design. Stakeholders approve. ✓',
        },
        {
          id: 'ux-b-manual', type: 'manual', icon: '',
          label: 'Design based on existing financial dashboard patterns',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 5, satisfaction: 3 },
          outcome: 'Decent design. Could be cleaner.',
        },
      ],
    },

    { type: 'chapter', phase: 'build', title: 'CHAPTER 2', subtitle: 'Build — Make It Real' },

    { type: 'dialogue', char: 'frontend',
      text: 'The P&L trend chart is wrong. All values below zero are being clipped to zero.\n\nFor a financial analytics platform. That shows profit and loss.\n\nThis is... bad.' },

    { type: 'task', char: 'frontend', phase: 'build',
      problem: 'P&L chart clips all negative values to zero. Financial data with negative positions is being misrepresented.',
      options: [
        {
          id: 'fe-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob what\'s wrong with the chart',
          meta: '~35 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 12 },
          bobResponse: 'The chart library\'s yAxis minimum is set to 0 by default.\n\nFor financial data containing negative P&L values, you need to set yAxis.min to null (or an explicit negative floor) to allow the axis to scale below zero.\n\nThe clipping behavior is a chart library default — not a bug in your data.',
          bobFollowUp: 'Fix the yAxis configuration',
          followUpDeltas: { quality: 8 },
          outcome: 'Chart rendering negative values correctly. ✓',
        },
        {
          id: 'fe-b-manual', type: 'manual', icon: '',
          label: 'Debug the chart rendering manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 5 },
          outcome: 'Fixed after some digging.',
        },
      ],
    },

    { type: 'dialogue', char: 'backend',
      text: 'The portfolio API currently returns all data to all users.\n\nPortfolio managers should only see their own positions. Executives get everything. Compliance gets full read but can\'t execute trades.\n\nI need to implement RBAC from scratch.' },

    { type: 'task', char: 'backend', phase: 'build',
      problem: 'No role-based access control on the portfolio API. All users see all data.',
      options: [
        {
          id: 'be-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to design the RBAC architecture',
          meta: '~43 sec saved', timeCost: 12, manualCost: 55,
          deltas: { quality: 12, security: 12 },
          bobResponse: 'Recommended 3-layer RBAC pattern:\n\n1. Route layer: COMPLIANCE role — block all write operations at the route level\n2. Middleware layer: decode JWT role claim on every request\n3. Query layer: MANAGER role — apply portfolio_id filter scoped to the user\'s assigned portfolios; EXECUTIVE role — no filter\n\nClient should never supply their own user_id — always derive it server-side from the JWT.',
          bobFollowUp: 'Implement the 3-layer RBAC',
          followUpDeltas: { quality: 8, security: 8 },
          outcome: 'RBAC implemented. Each role sees exactly what they should. ✓',
        },
        {
          id: 'be-b-later', type: 'poor', icon: '',
          label: 'Return all data now, add RBAC after launch',
          meta: 'security risk', timeCost: 0,
          deltas: { security: -20, satisfaction: -10 },
          outcome: 'Portfolio managers can see executive compensation data. Compliance is alarmed.',
        },
        {
          id: 'be-b-manual', type: 'manual', icon: '',
          label: 'Implement RBAC manually based on existing patterns',
          meta: '~55 sec', timeCost: 55, manualCost: 55,
          deltas: { quality: 5, security: 5 },
          outcome: 'RBAC implemented. Took the full time.',
        },
      ],
    },

    { type: 'chapter', phase: 'data', title: 'CHAPTER 3', subtitle: 'Data / AI — The Brain' },

    { type: 'dialogue', char: 'data',
      text: 'The anomaly detection is live. It\'s also firing 47 alerts on a completely normal trading day.\n\nPortfolio managers have started ignoring every alert.\n\nA detector that cries wolf is worse than no detector.' },

    { type: 'task', char: 'data', phase: 'data',
      problem: '47 false positive anomaly alerts on a routine day. Portfolio managers are ignoring all alerts — defeating the purpose.',
      options: [
        {
          id: 'ds-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to analyze the false positive rate',
          meta: '~47 sec saved', timeCost: 13, manualCost: 60,
          deltas: { quality: 14, satisfaction: 12 },
          bobResponse: 'The threshold is set at 1.5σ — too sensitive for this asset class.\n\nAnalysis of the last 30 trading days shows that normal intraday volatility for this portfolio regularly exceeds 1.5σ. The detector is firing on routine market movement.\n\nRecommendation:\n• Equity positions: raise threshold to 2.8σ\n• Fixed income: raise to 2.2σ\n\nThis should reduce false positives by ~85% while retaining detection of genuine anomalies.',
          bobFollowUp: 'Apply asset-class-specific thresholds',
          followUpDeltas: { quality: 10, satisfaction: 8 },
          outcome: 'False positives down 85%. Managers trust the alerts again. ✓',
        },
        {
          id: 'ds-b-manual', type: 'manual', icon: '',
          label: 'Tune the threshold manually through trial and error',
          meta: '~60 sec', timeCost: 60, manualCost: 60,
          deltas: { quality: 5, satisfaction: 5 },
          outcome: 'Threshold tuned. Takes time.',
        },
        {
          id: 'ds-b-ignore', type: 'ignore', icon: '',
          label: 'Leave the threshold — managers will get used to it',
          meta: 'critical risk', timeCost: 0,
          deltas: { quality: -15, satisfaction: -20 },
          outcome: 'Portfolio managers ignore a genuine anomaly during the demo. Bad look.',
        },
      ],
    },

    { type: 'dialogue', char: 'narrator',
      text: ' New requirement from Compliance:\n\n"All data access must be logged with user, timestamp, and data scope. 7-year retention. Audit-ready."' },

    { type: 'task', char: 'backend', phase: 'data',
      problem: 'Compliance mandates a 7-year audit log of all data access. No logging exists yet.',
      options: [
        {
          id: 'be-b2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to design the audit logging architecture',
          meta: '~38 sec saved', timeCost: 12, manualCost: 50,
          deltas: { quality: 10, security: 15, satisfaction: 8 },
          bobResponse: 'Recommended audit log architecture:\n\n1. Dedicated audit_log table — immutable, append-only rows (no UPDATE or DELETE)\n2. Database trigger on all portfolio_data SELECT operations — automatically logs user_id, timestamp, table name, query scope\n3. Separate backup retention policy for audit_log (7 years vs 90 days for regular data)\n\nThis is regulator-friendly and fully queryable for compliance reviews.',
          bobFollowUp: 'Implement the audit log schema and triggers',
          followUpDeltas: { quality: 7, security: 10, satisfaction: 5 },
          outcome: 'Audit logging implemented. Compliance team satisfied. ✓',
        },
        {
          id: 'be-b2-skip', type: 'ignore', icon: '',
          label: 'Skip audit logging — add it after the demo',
          meta: 'compliance risk', timeCost: 0,
          deltas: { security: -15, satisfaction: -20 },
          outcome: 'Compliance discovers no audit trail during the demo review. Meeting canceled.',
        },
        {
          id: 'be-b2-manual', type: 'manual', icon: '',
          label: 'Build the audit log manually',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { quality: 5, security: 8, satisfaction: 5 },
          outcome: 'Audit logging in place.',
        },
      ],
    },

    { type: 'chapter', phase: 'test', title: 'CHAPTER 4', subtitle: 'Test — Does It Actually Work?' },

    { type: 'dialogue', char: 'qa',
      text: 'Financial edge cases. We have none in the test suite.\n\nNo negative balances. No zero-volume trading days. No leap year handling. No FX rate edge cases.\n\nFor a financial platform.\n\nI need a minute.' },

    { type: 'task', char: 'qa', phase: 'test',
      problem: 'No financial edge case tests. Zero coverage for scenarios that regularly occur in real trading.',
      options: [
        {
          id: 'qa-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to generate financial edge case tests',
          meta: '~38 sec saved', timeCost: 10, manualCost: 48,
          deltas: { quality: 14 },
          bobResponse: 'Generated 9 financial edge case tests:\n\n1. Negative portfolio balance display\n2. Zero-volume trading day rendering\n3. Trade value exceeding portfolio size\n4. Currency conversion on non-trading days\n5. Midnight UTC crossover for P&L calculation\n6. Daylight saving time transition\n7. Leap year Feb 29 date handling\n8. Simultaneous buy/sell of same instrument\n9. Maximum decimal precision for FX rates',
          bobFollowUp: 'Add all 9 tests to the suite',
          followUpDeltas: { quality: 9 },
          outcome: '9 financial edge cases covered. Test 5 already found a UTC bug. ✓',
        },
        {
          id: 'qa-b-manual', type: 'manual', icon: '',
          label: 'Write edge case tests based on financial domain knowledge',
          meta: '~48 sec', timeCost: 48, manualCost: 48,
          deltas: { quality: 6 },
          outcome: 'Some edge cases covered.',
        },
        {
          id: 'qa-b-skip', type: 'ignore', icon: '',
          label: 'Ship without financial edge cases — demo uses clean data',
          meta: 'quality risk', timeCost: 0,
          deltas: { quality: -15, satisfaction: -10 },
          outcome: 'Demo uses clean data but the P&L chart breaks on a negative balance Novo deliberately tests. Awkward.',
        },
      ],
    },

    { type: 'dialogue', char: 'qa',
      text: 'Also found a regression. Historical P&L data for EUR/GBP positions is completely wrong.\n\nEvery historical EUR amount is being converted using TODAY\'s rate instead of the rate at trade time.\n\nThat\'s not how FX works.' },

    { type: 'task', char: 'qa', phase: 'test',
      problem: 'Currency conversion regression: historical FX rates are using current rates instead of rates at trade time. P&L history is wrong.',
      options: [
        {
          id: 'qa-b2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to find the regression',
          meta: '~35 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 12 },
          bobResponse: 'Found it.\n\nLast week\'s backend refactor changed FxRateService.getRateAtDate(tradeDate) to FxRateService.getCurrentRate() in the historical P&L calculation function.\n\nOne-line fix: restore the getRateAtDate(tradeDate) call in calculateHistoricalPnl().',
          bobFollowUp: 'Apply the fix',
          followUpDeltas: { quality: 8 },
          outcome: 'Historical FX rates correct again. ✓',
        },
        {
          id: 'qa-b2-manual', type: 'manual', icon: '',
          label: 'Trace the currency logic manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 5 },
          outcome: 'Found and fixed.',
        },
      ],
    },

    { type: 'chapter', phase: 'security', title: 'CHAPTER 5', subtitle: 'Security — Is It Safe?' },

    { type: 'dialogue', char: 'security',
      text: 'The RBAC implementation has a privilege escalation path.\n\nA COMPLIANCE user can hit GET /api/portfolio/export with any user_id as a parameter and get back that user\'s full portfolio.\n\nCompliance users should not see executive compensation.' },

    { type: 'task', char: 'security', phase: 'security',
      problem: 'Privilege escalation: COMPLIANCE users can read any user\'s portfolio by passing an arbitrary user_id parameter.',
      options: [
        {
          id: 'sec-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to identify and fix the escalation path',
          meta: '~43 sec saved', timeCost: 12, manualCost: 55,
          deltas: { security: 22, quality: 5 },
          bobResponse: 'The vulnerability:\n\nGET /api/portfolio/export accepts a user_id query parameter that is not validated against the authenticated user\'s role. A COMPLIANCE user simply passes ?user_id=executive@company.com and receives full portfolio data.\n\nFix: never trust a user_id parameter from the client. Always derive it server-side from the JWT subject claim. Remove the user_id parameter from the endpoint entirely.',
          bobFollowUp: 'Apply the server-side user_id fix',
          followUpDeltas: { security: 15, quality: 3 },
          outcome: 'Privilege escalation closed. RBAC fully enforced. ✓',
        },
        {
          id: 'sec-b-note', type: 'ignore', icon: '',
          label: 'Note it for post-launch security review',
          meta: 'critical risk', timeCost: 0,
          deltas: { security: -30, satisfaction: -15 },
          outcome: 'Novo\'s security team finds the escalation path during their own review. Demo paused.',
        },
        {
          id: 'sec-b-manual', type: 'manual', icon: '',
          label: 'Trace and fix the escalation path manually',
          meta: '~55 sec', timeCost: 55, manualCost: 55,
          deltas: { security: 10 },
          outcome: 'Fixed. Took a while.',
        },
      ],
    },

    { type: 'dialogue', char: 'security',
      text: 'One more. JWT signing is using HS256 with a 16-character hardcoded secret.\n\nFor a financial platform handling portfolio data.\n\nHS256 is brute-forceable in hours on modern hardware.' },

    { type: 'task', char: 'security', phase: 'security',
      problem: 'Weak JWT auth: HS256 with a short hardcoded secret. Vulnerable to brute force on a financial platform.',
      options: [
        {
          id: 'sec-b2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to recommend a secure auth approach',
          meta: '~39 sec saved', timeCost: 11, manualCost: 50,
          deltas: { security: 18 },
          bobResponse: 'HS256 with a short hardcoded secret has two problems: brute-forceable, and you have to share the secret with every service that verifies tokens.\n\nRecommendation for a financial platform:\n1. Switch to RS256 (asymmetric) — private key signs, public key verifies. Secrets never need to be shared.\n2. Minimum 2048-bit RSA key\n3. Store the private key in the secrets manager, never in code\n4. JWT expiry: 15 minutes with refresh tokens',
          bobFollowUp: 'Implement RS256 with the secrets manager',
          followUpDeltas: { security: 13 },
          outcome: 'Auth hardened. Industry-standard security for financial data. ✓',
        },
        {
          id: 'sec-b2-ignore', type: 'ignore', icon: '',
          label: 'Keep HS256 for the demo — fix security after launch',
          meta: 'security risk', timeCost: 0,
          deltas: { security: -15, satisfaction: -8 },
          outcome: 'Novo\'s security team flags weak auth in their pre-launch review.',
        },
        {
          id: 'sec-b2-manual', type: 'manual', icon: '',
          label: 'Research and implement better auth manually',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { security: 8 },
          outcome: 'Better auth implemented.',
        },
      ],
    },

    { type: 'chapter', phase: 'deploy', title: 'CHAPTER 6', subtitle: 'Deploy — Ship It' },

    { type: 'dialogue', char: 'devops',
      text: 'CI is blocked. The migration step is failing with: "PGPASSWORD: variable not found".\n\nDatabase password is defined in the secrets store. CI can\'t find it.' },

    { type: 'task', char: 'devops', phase: 'deploy',
      problem: 'CI pipeline blocked — database migration fails because a secret environment variable can\'t be found.',
      options: [
        {
          id: 'do-b-bob', type: 'bob', icon: '',
          label: 'Ask Bob to diagnose the missing secret',
          meta: '~39 sec saved', timeCost: 11, manualCost: 50,
          deltas: { quality: 8 },
          bobResponse: 'The CI configuration references secrets.DB_PASSWORD.\n\nThe secret in the CI secrets store is named DB_PASS (without "WORD").\n\nThis naming inconsistency was introduced when the secrets were originally created. Update the CI config to reference secrets.DB_PASS and the migration will proceed.',
          bobFollowUp: 'Fix the secret reference in CI config',
          followUpDeltas: { quality: 5, satisfaction: 3 },
          outcome: 'CI pipeline green. Migrations ran successfully. ✓',
        },
        {
          id: 'do-b-skip', type: 'ignore', icon: '',
          label: 'Skip the migration and deploy anyway',
          meta: 'critical risk', timeCost: 0,
          deltas: { quality: -10, security: -10, satisfaction: -10 },
          outcome: 'App deployed without the audit log table. Compliance is furious.',
        },
        {
          id: 'do-b-manual', type: 'manual', icon: '',
          label: 'Check all CI environment variable names manually',
          meta: '~50 sec', timeCost: 50, manualCost: 50,
          deltas: { quality: 3 },
          outcome: 'Found the typo. Fixed.',
        },
      ],
    },

    { type: 'dialogue', char: 'devops',
      text: 'Deployed. But the load balancer is marking the app as unhealthy.\n\nThe health endpoint returns 200. The load balancer says it\'s down. Nothing makes sense.' },

    { type: 'task', char: 'devops', phase: 'deploy',
      problem: 'App returns 200 on /health but the load balancer reports unhealthy. Deployment appears broken.',
      options: [
        {
          id: 'do-b2-bob', type: 'bob', icon: '',
          label: 'Ask Bob to explain the health check failure',
          meta: '~35 sec saved', timeCost: 10, manualCost: 45,
          deltas: { quality: 8, satisfaction: 3 },
          bobResponse: 'The load balancer is configured to check /health with an expected response body of "OK".\n\nYour app returns {"status":"healthy"} — a JSON object.\n\nThe load balancer treats any body that doesn\'t match the exact expected string as unhealthy, even with a 200 status code.\n\nFix: add a second /health/simple endpoint that returns plain text "OK", and point the load balancer at that.',
          bobFollowUp: 'Add the plain-text health endpoint',
          followUpDeltas: { quality: 5, satisfaction: 3 },
          outcome: 'Load balancer reports healthy. Deployment confirmed live. ✓',
        },
        {
          id: 'do-b2-manual', type: 'manual', icon: '',
          label: 'Check the load balancer config and health check settings manually',
          meta: '~45 sec', timeCost: 45, manualCost: 45,
          deltas: { quality: 3 },
          outcome: 'Found the response body mismatch. Fixed.',
        },
      ],
    },

    { type: 'dialogue', char: 'narrator',
      text: 'The Novo Capital demo is live.\n\nPortfolio managers see real-time risk alerts with no false positives. Historical P&L shows correct FX rates. RBAC is enforced. Audit logs are running.\n\nThe platform is ready.' },

    { type: 'dialogue', char: 'data',
      text: 'The anomaly detector just caught a genuine spike in one of their test portfolios.\n\nNot a false positive. A real one.' },

    { type: 'dialogue', char: 'bob',
      text: 'That\'s the point.\n\nYour team built something that actually works. I just helped you build it faster.' },

    { type: 'end' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIOS = {
  'scenario-a': SCENARIO_A,
  'scenario-b': SCENARIO_B,
};

window.SCENARIOS  = SCENARIOS;
window.CHARACTERS = CHARACTERS;
