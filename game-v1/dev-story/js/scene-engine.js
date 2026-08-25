/**
 * dev-story/js/scene-engine.js
 * Lightweight scene runner for the Sam Rivera opening sequence.
 * Uses the same HTML shell as the main game (scene-developer.html)
 * but runs entirely inside dev-story/index.html's dialogue overlay.
 *
 * DOM expected (mirrored from the main game's scene-developer.html):
 *   #stage              — full viewport game stage
 *   #char-left-img      — left character sprite
 *   #char-right-img     — right character sprite
 *   #char-left          — left slot wrapper
 *   #char-right         — right slot wrapper
 *   #speaker-head       — avatar img in nameplate
 *   #speaker-name       — character name text
 *   #speaker-role       — character role text
 *   #dialogue-text      — typewriter text node
 *   #cursor             — blinking cursor span
 *   #continue-hint      — "▼ click to continue"
 *   #dialogue-overlay   — the whole dialogue panel
 *   #chat-view          — the Bob chat section (hidden until handoff)
 *   .stage-bg           — background image element
 *   .stars              — stars container
 */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────────────────────── */
  const TYPEWRITER_SPEED = 20; // ms per character
  const ASSETS_BASE      = '../assets'; // relative to dev-story/

  /* ── Character definitions ───────────────────────────────────────────────── */
  const CHARACTERS = {
    sam:      { name: 'Sam Rivera',  role: 'Developer',  folder: 'backend-dev',      head: 'head.png'      },
    taylor:   { name: 'Taylor Kim',  role: 'Head IT',    folder: 'devops-engineer',   head: 'head.png'      },
    narrator: { name: 'NARRATOR',    role: '',           folder: null,               head: null            },
  };

  /* ── Background map ──────────────────────────────────────────────────────── */
  const BG_MAP = {
    sam:    `${ASSETS_BASE}/background/DEV-DESK.jpg`,
    taylor: `${ASSETS_BASE}/background/SERVER-ROOM.jpg`,
  };

  /* ── State ───────────────────────────────────────────────────────────────── */
  let sceneIndex      = 0;
  let isTyping        = false;
  let typewriterTimer = null;
  let pendingAdvance  = null;
  let currentSpeaker  = null;
  let currentListener = null;
  let currentBg       = null;

  /* ── DOM refs ────────────────────────────────────────────────────────────── */
  let dom = {};

  /* ── Entry point ─────────────────────────────────────────────────────────── */
  function init() {
    dom = {
      stage:          document.getElementById('stage'),
      charLeft:       document.getElementById('char-left'),
      charLeftImg:    document.getElementById('char-left-img'),
      charRight:      document.getElementById('char-right'),
      charRightImg:   document.getElementById('char-right-img'),
      stageBg:        document.querySelector('.stage-bg'),
      stars:          document.getElementById('stars'),
      speakerHead:    document.getElementById('speaker-head'),
      speakerName:    document.getElementById('speaker-name'),
      speakerRole:    document.getElementById('speaker-role'),
      dialogueText:   document.getElementById('dialogue-text'),
      cursor:         document.getElementById('cursor'),
      continueHint:   document.getElementById('continue-hint'),
      dialogueOverlay:document.getElementById('dialogue-overlay'),
      chatView:       document.getElementById('chat-view'),
    };

    buildStars();

    // Click / tap / space / enter to advance
    dom.stage.addEventListener('click', onAdvance);
    document.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onAdvance(); }
    });

    runScene(0);
  }

  /* ── Star field ──────────────────────────────────────────────────────────── */
  function buildStars() {
    if (!dom.stars) return;
    for (let i = 0; i < 55; i++) {
      const s = document.createElement('span');
      s.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--d:${2 + Math.random() * 4}s`,
        `--delay:${Math.random() * 5}s`,
        `--op:${0.3 + Math.random() * 0.5}`,
      ].join(';');
      dom.stars.appendChild(s);
    }
  }

  /* ── Scene runner ────────────────────────────────────────────────────────── */
  function runScene(index) {
    sceneIndex   = index;
    pendingAdvance = null;
    dom.continueHint.classList.add('hidden');

    if (index >= DEV_STORY_SCENES.length) { handOffToBob(); return; }

    const scene = DEV_STORY_SCENES[index];

    if (scene.type === 'narration')  { showNarration(scene); return; }
    if (scene.type === 'dialogue')   { showDialogue(scene);  return; }
    if (scene.type === 'open-bob')   { handOffToBob();       return; }
  }

  /* ── Narration ───────────────────────────────────────────────────────────── */
  function showNarration(scene) {
    setStage(null, null);
    setNameplate('narrator');
    typewritePaged(scene.text, null);
  }

  /* ── Dialogue ────────────────────────────────────────────────────────────── */
  function showDialogue(scene) {
    const newSpeaker  = scene.char;
    const newListener = (currentSpeaker && currentSpeaker !== newSpeaker)
      ? currentSpeaker : currentListener;

    setStage(newSpeaker, newListener !== newSpeaker ? newListener : null, scene.expr);
    setNameplate(newSpeaker);
    typewritePaged(scene.text, null);
  }

  /* ── Stage: characters + background ─────────────────────────────────────── */
  function setStage(speakerKey, listenerKey, expr) {
    const speakerChanged  = speakerKey  !== currentSpeaker;
    const listenerChanged = listenerKey !== currentListener;
    currentSpeaker  = speakerKey;
    currentListener = listenerKey;

    // Background
    if (speakerChanged) {
      const bgKey = (speakerKey && speakerKey !== 'narrator')
        ? speakerKey
        : (listenerKey && listenerKey !== 'narrator' ? listenerKey : null);
      if (bgKey) updateBackground(bgKey);
    }

    // Left (speaker)
    if (speakerKey && speakerKey !== 'narrator') {
      const src = bodyPath(speakerKey, expr);
      if (dom.charLeftImg.src !== src) {
        dom.charLeftImg.src = src;
        dom.charLeftImg.alt = CHARACTERS[speakerKey]?.name || '';
      }
      dom.charLeft.className = 'char-slot char-left is-speaker';
      if (speakerChanged) {
        dom.charLeft.classList.remove('enter');
        void dom.charLeft.offsetWidth;
        dom.charLeft.classList.add('enter');
      }
    } else {
      dom.charLeft.className = 'char-slot char-left is-hidden';
      dom.charLeftImg.src = '';
    }

    // Right (listener)
    if (listenerKey && listenerKey !== 'narrator') {
      const src = bodyPath(listenerKey);
      if (dom.charRightImg.src !== src) {
        dom.charRightImg.src = src;
        dom.charRightImg.alt = CHARACTERS[listenerKey]?.name || '';
      }
      dom.charRight.className = 'char-slot char-right is-listener';
      if (listenerChanged) {
        dom.charRight.classList.remove('enter');
        void dom.charRight.offsetWidth;
        dom.charRight.classList.add('enter');
      }
    } else {
      dom.charRight.className = 'char-slot char-right is-hidden';
      dom.charRightImg.src = '';
    }
  }

  function updateBackground(charKey) {
    const bg = BG_MAP[charKey] || null;
    if (!dom.stageBg || bg === currentBg) return;
    currentBg = bg;
    dom.stageBg.classList.remove('bg-fade-in');
    void dom.stageBg.offsetWidth;
    dom.stageBg.style.backgroundImage = bg ? `url('${bg}')` : 'none';
    dom.stageBg.classList.add('bg-fade-in');
  }

  function bodyPath(charKey, expr) {
    const c = CHARACTERS[charKey];
    if (!c || !c.folder) return '';
    return expr
      ? `${ASSETS_BASE}/${c.folder}/${expr}.png`
      : `${ASSETS_BASE}/${c.folder}/full-body.png`;
  }

  /* ── Nameplate ───────────────────────────────────────────────────────────── */
  function setNameplate(charKey) {
    const char = CHARACTERS[charKey] || CHARACTERS.narrator;
    const hSrc = char.folder
      ? `${ASSETS_BASE}/${char.folder}/${char.head}`
      : '';

    dom.speakerHead.src             = hSrc;
    dom.speakerHead.style.display   = hSrc ? 'block' : 'none';
    dom.speakerName.textContent     = char.name;
    dom.speakerRole.textContent     = char.role;
    dom.speakerRole.style.display   = charKey === 'narrator' ? 'none' : 'block';
  }

  /* ── Typewriter (paginated) ──────────────────────────────────────────────── */
  const APPROX_CHARS_PER_PAGE = 220;

  function paginateText(text) {
    if (text.length <= APPROX_CHARS_PER_PAGE) return [text];
    const wrap = dom.dialogueText?.parentElement;
    if (!wrap) return [text];

    const probe = document.createElement('div');
    probe.className = 'dialogue-text';
    probe.style.cssText = 'visibility:hidden;position:absolute;top:0;left:0;width:100%;pointer-events:none;white-space:pre-wrap;';
    wrap.appendChild(probe);

    const maxH  = wrap.clientHeight || 120;
    const words = text.split(' ');
    const pages = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      probe.textContent = candidate;
      if (probe.scrollHeight > maxH && current !== '') {
        pages.push(current.trimEnd());
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current.trim()) pages.push(current.trimEnd());
    wrap.removeChild(probe);
    return pages.length ? pages : [text];
  }

  function typewritePaged(text, onAllDone) {
    const pages  = paginateText(text);
    let pageIdx  = 0;
    pendingAdvance = null;

    function showPage(idx) {
      const isLast = idx === pages.length - 1;
      const hint   = isLast ? '▼ click to continue' : '▼ next page';

      typewrite(pages[idx], () => {
        dom.continueHint.textContent = hint;
        dom.continueHint.classList.remove('hidden');

        pendingAdvance = isLast
          ? () => {
              dom.continueHint.classList.add('hidden');
              if (onAllDone) onAllDone();
            }
          : () => {
              dom.continueHint.classList.add('hidden');
              pageIdx++;
              showPage(pageIdx);
            };
      });
    }

    showPage(0);
  }

  function typewrite(text, onDone) {
    clearInterval(typewriterTimer);
    isTyping = true;

    dom.dialogueText.textContent = '';
    dom.dialogueText.appendChild(dom.cursor);
    dom.cursor.classList.remove('hidden');

    const textNode = document.createTextNode('');
    dom.dialogueText.insertBefore(textNode, dom.cursor);
    let i = 0;

    // Store for skip
    typewrite._fullText = text;
    typewrite._onDone   = onDone;

    typewriterTimer = setInterval(() => {
      if (i < text.length) {
        textNode.nodeValue += text[i];
        i++;
      } else {
        clearInterval(typewriterTimer);
        isTyping = false;
        dom.cursor.classList.add('hidden');
        if (onDone) onDone();
      }
    }, TYPEWRITER_SPEED);
  }

  function skipTypewriter() {
    if (!isTyping) return false;
    clearInterval(typewriterTimer);
    isTyping = false;
    dom.dialogueText.textContent = typewrite._fullText || '';
    dom.dialogueText.appendChild(dom.cursor);
    dom.cursor.classList.add('hidden');
    if (typewrite._onDone) typewrite._onDone();
    typewrite._onDone = null;
    return true;
  }

  /* ── Advance handler ─────────────────────────────────────────────────────── */
  function onAdvance() {
    if (isTyping) { skipTypewriter(); return; }
    if (pendingAdvance) {
      const cb = pendingAdvance;
      pendingAdvance = null;
      cb();
      return;
    }
    // Default: next scene
    dom.continueHint.classList.add('hidden');
    runScene(sceneIndex + 1);
  }

  /* ── Handoff — redirect to the developer scene ──────────────────────────── */
  function handOffToBob() {
    location.href = 'http://127.0.0.1:5500/scene-developer.html';
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
