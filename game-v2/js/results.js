/**
 * results.js — personalized results screen per role
 *
 * Loads data/results-{roleId}.json for the character-specific copy,
 * then renders headline, time-saved hero stat, Bob's moment cards,
 * and the takeaway quote.
 */

document.addEventListener('DOMContentLoaded', () => {
  const s = State.get();
  if (!s.roleId) { location.href = 'index.html'; return; }

  const currentLang = sessionStorage.getItem('byteforce_lang') || 'en';
  const isId = currentLang === 'id';

  // ── Load role result JSON ───────────────────────────────────────────────────
  fetch(`data/results-${s.roleId}.json`)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => render(data, s, isId))
    .catch(() => { location.href = 'index.html'; });
});

function render(data, state, isId) {
  // ── Character hero ──────────────────────────────────────────────────────────
  const avatar = document.getElementById('res-avatar');
  avatar.src = data.character.avatar;
  avatar.alt = data.character.name;

  document.getElementById('res-role').textContent     = data.character.role;
  document.getElementById('res-name').textContent     = data.character.name;
  document.getElementById('res-headline').textContent = isId ? data.headline_id : data.headline;
  document.getElementById('res-subline').textContent  = isId ? data.subline_id  : data.subline;

  // ── Time saved hero stat ────────────────────────────────────────────────────
  // Use the narrative label from the JSON (e.g. "~6 hours saved").
  // The JSON label is the story truth; session timeSaved is a simulation integer.
  const timeSavedLabel = isId ? data.timeSavedLabel_id : data.timeSavedLabel;
  document.getElementById('res-time-val').textContent = timeSavedLabel;

  // ── Moment cards ────────────────────────────────────────────────────────────
  const momentsEl = document.getElementById('res-moments');
  momentsEl.innerHTML = '';

  (data.moments || []).forEach((m, i) => {
    const label  = isId ? (m.label_id  || m.label)  : m.label;
    const detail = isId ? (m.detail_id || m.detail) : m.detail;

    const card = document.createElement('div');
    card.className = 'res-moment';
    card.style.animationDelay = `${0.18 + i * 0.07}s`;
    card.innerHTML = `
      <div class="res-moment-icon">${m.icon}</div>
      <div class="res-moment-body">
        <div class="res-moment-label">${label}</div>
        <div class="res-moment-detail">${detail}</div>
      </div>
    `;
    momentsEl.appendChild(card);
  });

  // ── Takeaway quote ──────────────────────────────────────────────────────────
  const takeawayEl = document.getElementById('res-takeaway');
  takeawayEl.textContent = isId ? data.takeaway_id : data.takeaway;

  // ── Play again ──────────────────────────────────────────────────────────────
  document.getElementById('btn-play-again').addEventListener('click', () => {
    State.reset();
    location.href = 'index.html';
  });

  // ── Stars ────────────────────────────────────────────────────────────────────
  buildStars();
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
