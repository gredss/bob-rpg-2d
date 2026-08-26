/**
 * sfx.js — shared sound effect player
 *
 * Usage:
 *   SFX.play('pageLoad')      — one-shot, no overlap
 *   SFX.play('cardHover')     — debounced (won't re-trigger within 80ms)
 *
 * Browsers block audio until the first user gesture on the page.
 * SFX.unlock() is called automatically on the first click/keydown so that
 * page-load sounds queued before interaction will fire correctly.
 */

const SFX = (() => {
  const BASE = 'assets/sfx/';

  // ── Sound registry ──────────────────────────────────────────────────────────
  const FILES = {
    pageLoad:    'page-load.wav',
    btnClick:    'btn-click.wav',
    cardHover:   'card-hover-tick.wav',
    roleSelect:  'role-select-chime.wav',
    homeBtn:     'click-home-btn.wav',
  };

  // ── Pre-load all sounds ─────────────────────────────────────────────────────
  const cache = {};
  for (const [key, file] of Object.entries(FILES)) {
    const audio = new Audio(BASE + file);
    audio.preload = 'auto';
    cache[key] = audio;
  }

  // ── Unlock context on first user gesture ───────────────────────────────────
  // Some browsers suspend audio until a real interaction happens.
  // We resume any pending sounds by playing + immediately pausing a silent clone.
  let unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    for (const audio of Object.values(cache)) {
      const clone = audio.cloneNode();
      clone.volume = 0;
      clone.play().catch(() => {});
    }
  }
  window.addEventListener('click',   unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });

  // ── Debounce map for sounds that fire on hover ──────────────────────────────
  const lastPlayed = {};
  const DEBOUNCE_MS = 80;

  // ── Public play() ───────────────────────────────────────────────────────────
  function play(key, { volume = 1, debounce = false } = {}) {
    const src = cache[key];
    if (!src) return;

    if (debounce) {
      const now = Date.now();
      if (lastPlayed[key] && now - lastPlayed[key] < DEBOUNCE_MS) return;
      lastPlayed[key] = now;
    }

    // Clone so rapid-fire calls never cut each other off
    const instance = src.cloneNode();
    instance.volume = volume;
    instance.play().catch(() => {});   // silently ignore if browser still blocks
  }

  // ── Public playThen(key, callback) ──────────────────────────────────────────
  // Plays a sound and runs `callback` when it ends.
  // A timeout (duration of the clip + 200ms buffer, max 1s) guarantees
  // the callback fires even if the audio fails or the browser blocks it,
  // so navigation is never permanently blocked.
  function playThen(key, callback, { volume = 1 } = {}) {
    const src = cache[key];
    if (!src) { callback(); return; }

    const instance = src.cloneNode();
    instance.volume = volume;

    // Max wait: actual clip duration (if known) + 200ms buffer, capped at 1000ms
    const maxWait = src.duration > 0 ? Math.min(src.duration * 1000 + 200, 1000) : 400;
    const timer = setTimeout(callback, maxWait);

    instance.addEventListener('ended', () => { clearTimeout(timer); callback(); }, { once: true });
    instance.addEventListener('error', () => { clearTimeout(timer); callback(); }, { once: true });
    instance.play().catch(() => { clearTimeout(timer); callback(); });
  }

  return { play, playThen, unlock };
})();
