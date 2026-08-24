/**
 * state.js — sessionStorage-backed game state
 * Single source of truth for the running session.
 */

const STATE_KEY = 'byteforce_state';

const DEFAULT_STATE = {
  scenarioId: null,       // 'scenario-a' | 'scenario-b' (team mode)
  roleId:     null,       // 'data' | 'frontend' | 'backend' | etc. (role mode)
  sceneIndex: 0,          // which scene in the flat scene list we're on
  metrics: {
    quality:      100,
    security:     100,
    satisfaction: 100,
    cost:         0,
  },
  bobCount:   0,          // how many times Bob was used
  totalTasks: 0,          // tasks presented
  timeSaved:  0,          // simulated seconds saved by using Bob
  startedAt:  null,       // Date.now()
  timerLeft:  600,        // simulated seconds (10:00)
};

function load() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : { ...DEFAULT_STATE };
  } catch { return { ...DEFAULT_STATE }; }
}

function save(state) {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function reset() {
  sessionStorage.removeItem(STATE_KEY);
}

function get() { return load(); }

function set(partial) {
  const current = load();
  const next = { ...current, ...partial };
  save(next);
  return next;
}

function applyDeltas(deltas) {
  // deltas: { quality, security, satisfaction, cost, timeSaved, bobUsed, timeCost }
  const s = load();
  const m = s.metrics;

  s.metrics = {
    quality:      Math.min(100, Math.max(0, m.quality      + (deltas.quality      || 0))),
    security:     Math.min(100, Math.max(0, m.security     + (deltas.security     || 0))),
    satisfaction: Math.min(100, Math.max(0, m.satisfaction + (deltas.satisfaction || 0))),
    cost:         m.cost + Math.round((deltas.timeCost || 0) * (2000 / 3600)),
  };

  s.timerLeft   = Math.max(0, s.timerLeft - (deltas.timeCost || 0));
  s.totalTasks  = (s.totalTasks || 0) + 1;

  if (deltas.bobUsed) {
    s.bobCount  = (s.bobCount  || 0) + 1;
    s.timeSaved = (s.timeSaved || 0) + (deltas.timeSaved || 0);
  }

  save(s);
  return s;
}

window.State = { get, set, save, reset, applyDeltas, DEFAULT_STATE };
