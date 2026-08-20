/**
 * results.js — score calculation and results screen render
 */

document.addEventListener('DOMContentLoaded', () => {
  const s = State.get();
  if (!s.scenarioId && !s.roleId) { location.href = 'index.html'; return; }

  const scenario = s.scenarioId ? SCENARIOS[s.scenarioId]
                 : (window.ROLE_SCENARIOS && ROLE_SCENARIOS[s.roleId]);
  const m = s.metrics || { quality: 100, security: 100, satisfaction: 100, cost: 0 };

  // ── Score formula (from GDD) ──────────────────────────────────────────────
  const elapsed   = s.startedAt ? Math.round((Date.now() - s.startedAt) / 1000) : 300;
  const timeBonus = Math.max(0, 100 - Math.max(0, elapsed - 180) / 3);
  const finalScore = Math.round(
    m.quality * 0.3 +
    m.security * 0.25 +
    m.satisfaction * 0.25 +
    timeBonus * 0.2
  );

  // ── Bob impact ────────────────────────────────────────────────────────────
  const bobCount   = s.bobCount   || 0;
  const totalTasks = s.totalTasks || 1;
  const timeSaved  = s.timeSaved  || 0;
  const utilPct    = Math.round((bobCount / Math.max(1, totalTasks)) * 100);

  // Time saved formatted
  const tsMin = Math.floor(timeSaved / 60);
  const tsSec = timeSaved % 60;
  const timeSavedFmt = `${tsMin}:${tsSec < 10 ? '0' : ''}${tsSec}`;

  // Elapsed formatted
  const eMin = Math.floor(elapsed / 60);
  const eSec = elapsed % 60;
  const elapsedFmt = `${eMin}:${eSec < 10 ? '0' : ''}${eSec}`;

  // Productivity gain
  const totalManual  = totalTasks * 40; // rough average manual cost
  const productGain  = timeSaved > 0 ? Math.round((timeSaved / totalManual) * 100) : 0;

  // Grade
  const grade = utilPct >= 80 ? 'A' :
                utilPct >= 60 ? 'B' :
                utilPct >= 40 ? 'C' :
                utilPct >= 20 ? 'D' : 'F';

  const gradeLabels = {
    A: 'A — AI-Native Team',
    B: 'B — Well Augmented',
    C: 'C — Cautious Adopter',
    D: 'D — Mostly Manual',
    F: 'F — Left Bob in the Box',
  };

  // Cost formatted
  const costFmt = '$' + (m.cost || 0).toLocaleString();

  // ── Determine outcome based on final metrics ──────────────────────────────
  const avgMetric = (m.quality + m.security + m.satisfaction) / 3;
  let outcomeTitle, outcomeSubtitle;
  if (avgMetric >= 75) {
    outcomeTitle    = 'PROJECT COMPLETE';
    outcomeSubtitle = '✅ CLIENT DEMO: SUCCESS';
  } else if (avgMetric >= 50) {
    outcomeTitle    = 'PROJECT DELIVERED';
    outcomeSubtitle = '⚠️ CLIENT DEMO: PARTIAL SUCCESS';
  } else {
    outcomeTitle    = 'PROJECT STRUGGLED';
    outcomeSubtitle = '❌ CLIENT DEMO: FAILED';
  }

  document.querySelector('.results-title').textContent   = outcomeTitle;
  document.querySelector('.results-subtitle').textContent = outcomeSubtitle;

  // ── Render ────────────────────────────────────────────────────────────────

  // Score circle
  document.getElementById('final-score').textContent  = finalScore;
  document.getElementById('scenario-name').textContent = scenario?.title || '';

  // Project stats
  document.getElementById('stat-time').textContent    = elapsedFmt;
  document.getElementById('stat-cost').textContent    = costFmt;
  document.getElementById('stat-quality').textContent = Math.round(m.quality)  + '%';
  document.getElementById('stat-security').textContent= Math.round(m.security) + '%';
  document.getElementById('stat-satisfy').textContent = Math.round(m.satisfaction) + '%';

  // Bob impact
  document.getElementById('bob-count').textContent   = bobCount;
  document.getElementById('time-saved').textContent  = timeSavedFmt;
  document.getElementById('prod-gain').textContent   = '+' + productGain + '%';

  // Grade badge
  const gradeBadge = document.getElementById('grade-badge');
  gradeBadge.textContent = gradeLabels[grade];
  gradeBadge.className   = `grade-badge grade-${grade.toLowerCase()}`;

  // Score bars
  renderBar('bar-quality',   m.quality);
  renderBar('bar-security',  m.security);
  renderBar('bar-satisfy',   m.satisfaction);

  // Play again
  document.getElementById('btn-play-again').addEventListener('click', () => {
    State.reset();
    location.href = 'index.html';
  });

  // Stars
  buildStars();
});

function renderBar(id, value) {
  const fill = document.getElementById(id);
  if (!fill) return;
  const color = value >= 80 ? 'var(--success)' :
                value >= 50 ? 'var(--warning)' : 'var(--danger)';
  setTimeout(() => {
    fill.style.width = Math.round(value) + '%';
    fill.style.background = color;
  }, 200);
}

function buildStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*5}s;--op:${0.2+Math.random()*0.4};`;
    container.appendChild(s);
  }
}
