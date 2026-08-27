/**
 * engine.js — Visual novel scene runner
 * Two-character stage: speaker (left, bright) ↔ listener (right, dimmed + flipped)
 * Head avatar appears next to speaker name in the dialogue box.
 */

// ── Constants ─────────────────────────────────────────────────────────────────
const TYPEWRITER_SPEED = 22; // ms per character
const CHAPTER_DISPLAY  = 2400; // ms to show chapter card

// ── Language helper ───────────────────────────────────────────────────────────
// Returns the Indonesian version of a scene field if lang=id and it exists,
// otherwise falls back to the English (root-level) field.
function lang() { return sessionStorage.getItem('byteforce_lang') || 'en'; }
function t(obj, field) {
  if (lang() === 'id' && obj.id && obj.id[field] !== undefined) return obj.id[field];
  return obj[field];
}
// t() for an option inside scene.options
function tOpt(opt, field) {
  if (lang() === 'id' && opt.id_text && opt.id_text[field] !== undefined) return opt.id_text[field];
  return opt[field];
}

// ── Background map — which environment image to show per character key ────────
// Two characters can share the same bg (e.g. backend + devops both in server room)
const BG_MAP = {
  // ── Team scenario ────────────────────────────────────────────────────────
  frontend: 'assets/background/DEV-DESK.jpg',
  backend:  'assets/background/SERVER-ROOM.jpg',
  devops:   'assets/background/SERVER-ROOM.jpg',
  pm:       'assets/background/MEETING-ROOM.jpg',
  ux:       'assets/background/MEETING-ROOM.jpg',
  security: 'assets/background/CYBERSECURITY-SOC.jpg',
  data:     'assets/background/DATA-LAB.jpg',
  bob:      'assets/background/DATA-LAB.jpg',
  qa:       'assets/background/QA-TESTING-LAB.jpg',
  // ── Script-mode characters ───────────────────────────────────────────────
  priya:    'assets/background/DATA-LAB.jpg',
  sam:      'assets/background/DEV-DESK.jpg',
  taylor:   'assets/background/SERVER-ROOM.jpg',
  alex:     'assets/background/MEETING-ROOM.jpg',
};

let currentBg = null;   // track the active background path to avoid redundant swaps

function updateBackground(charKey) {
  const bg  = BG_MAP[charKey] || null;
  const el  = document.querySelector('.game-viewport .stage-bg');
  if (!el || bg === currentBg) return;
  currentBg = bg;

  // Swap + trigger the fade-in animation
  el.classList.remove('bg-fade-in');
  void el.offsetWidth;  // reflow to restart animation

  if (bg) {
    el.style.backgroundImage = `url('${bg}')`;
  } else {
    el.style.backgroundImage = 'none';
  }
  el.classList.add('bg-fade-in');
}

// ── Asset map — folder name per character key ─────────────────────────────────
const CHAR_ASSETS = {
  // ── Team scenario ────────────────────────────────────────────────────────
  pm:       { folder: 'product-manager',  head: 'head-only.png' },
  ux:       { folder: 'ux-designer',      head: 'head.png'      },
  frontend: { folder: 'frontend-dev',     head: 'head.png'      },
  backend:  { folder: 'backend-dev',      head: 'head.png'      },
  data:     { folder: 'data-scientist',   head: 'head.png'      },
  qa:       { folder: 'qa-engineer',      head: 'head.png'      },
  devops:   { folder: 'devops-engineer',  head: 'head.png'      },
  security: { folder: 'cybersec-engineer',head: 'head.png'      },
  // ── Script-mode characters ───────────────────────────────────────────────
  priya:    { folder: 'data-scientist',   head: 'head.png'      },
  sam:      { folder: 'backend-dev',      head: 'head.png'      },
  taylor:   { folder: 'devops-engineer',  head: 'head.png'      },
  alex:     { folder: 'product-manager',  head: 'head-only.png' },
  // ── Shared ───────────────────────────────────────────────────────────────
  bob:      { folder: 'bob',              head: 'head.png'      },
  narrator: { folder: null,               head: null            },
};

function bodyPath(charKey, expr) {
  const a = CHAR_ASSETS[charKey];
  if (!a || !a.folder) return '';
  // expr overrides the body sprite (e.g. 'confused', 'relief').
  // Falls back to full-body.png if the named file doesn't exist (handled gracefully by the browser).
  if (expr) return `assets/${a.folder}/${expr}.png`;
  return `assets/${a.folder}/full-body.png`;
}
function headPath(charKey) {
  const a = CHAR_ASSETS[charKey];
  if (!a || !a.folder) return '';
  return `assets/${a.folder}/${a.head}`;
}

// ── State ─────────────────────────────────────────────────────────────────────
let scenes            = [];
let sceneIndex        = 0;
let isTyping          = false;
let isOutcome         = false;  // true while outcome toast is on screen
let typewriterTimer   = null;
let realTimerInterval = null;
let currentSpeaker    = null;   // charKey currently on left
let currentListener   = null;   // charKey currently on right
// Pending callback set by typewritePaged after the last page finishes typing.
// onDialogueClick fires it when the player clicks to advance — this avoids
// stacking { once } listeners that fire on unrelated clicks (e.g. choice btns).
let pendingAdvance    = null;

// ── Video playback state ──────────────────────────────────────────────────────
// Set to a handler object while a video is playing so onKeyDown routes to it.
let videoKeyHandler   = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
let dom = {};

// ── Entry point ───────────────────────────────────────────────────────────────
function init() {
  dom = {
    charLeft:           document.getElementById('char-left'),
    charLeftImg:        document.getElementById('char-left-img'),
    charRight:          document.getElementById('char-right'),
    charRightImg:       document.getElementById('char-right-img'),
    speakerHead:        document.getElementById('speaker-head'),
    speakerName:        document.getElementById('speaker-name'),
    speakerRole:        document.getElementById('speaker-role'),
    dialogueText:       document.getElementById('dialogue-text'),
    dialogueTextWrap:   document.getElementById('dialogue-text')?.parentElement,
    cursor:             document.getElementById('cursor'),
    continueHint:       document.getElementById('continue-hint'),
    choices:            document.getElementById('choices'),
    choicesOverlay:     document.getElementById('choices-overlay'),
    bobBox:             document.getElementById('bob-box'),
    bobBoxText:         document.getElementById('bob-box-text'),
    chapterCard:        document.getElementById('chapter-card'),
    chapterLabel:       document.getElementById('chapter-label'),
    chapterTitle:       document.getElementById('chapter-title'),
    chapterSub:         document.getElementById('chapter-sub'),
    outcomeToast:       document.getElementById('outcome-toast'),
    starsContainer:     document.getElementById('stars'),
    stage:              document.getElementById('stage'),
    dialogueBox:        document.getElementById('dialogue-box'),
    dialogueOverlay:    document.getElementById('dialogue-overlay'),
    workstationLabel:   document.getElementById('workstation-label'),
    workstationScreen:  document.getElementById('workstation-screen'),
    videoOverlay:       document.getElementById('video-overlay'),
    videoPlayer:        document.getElementById('video-overlay-player'),
    videoSkip:          document.getElementById('video-overlay-skip'),
  };

  buildStars();

  const s = State.get();

  // ── Determine scene source: role mode (JSON) or team scenario mode ────────
  if (s.roleId) {
    fetch(`data/${s.roleId}.json`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(role => { _startWithRole(role, s); })
      .catch(() => { location.href = 'index.html'; });
  } else if (s.scenarioId && window.SCENARIOS && SCENARIOS[s.scenarioId]) {
    scenes = SCENARIOS[s.scenarioId].scenes;
    _startEngine(s);
  } else {
    location.href = 'index.html';
  }
}

function _startWithRole(role, s) {
  scenes = role.scenes;
  // Set workstation panel header (use translated label if available)
  const wsLabel = (lang() === 'id' && role.workstation.label_id)
    ? role.workstation.label_id
    : role.workstation.label;
  if (dom.workstationLabel) dom.workstationLabel.textContent = wsLabel;
  _startEngine(s);
}

function _startEngine(s) {
  sceneIndex = s.sceneIndex || 0;

  updateHUD();
  startRealTimer();
  showWorkstationIdle();

  // dialogueBox is inside stage — use stopPropagation so a single click
  // on the dialogue panel doesn't also fire the stage listener, which
  // would invoke onDialogueClick twice and stomp the open-chat redirect.
  dom.dialogueBox.addEventListener('click', (e) => { e.stopPropagation(); onDialogueClick(); });
  dom.stage.addEventListener('click', onDialogueClick);
  document.addEventListener('keydown', onKeyDown);

  runScene(sceneIndex);
}

// ── Workstation panel content ─────────────────────────────────────────────────
// The right-side panel shows contextual in-game content.
// During idle/dialogue it shows an empty state.
// During a task it shows the problem context.
// After a Bob response it mirrors the full analysis to the workstation.

function showWorkstationIdle(scene) {
  if (!dom.workstationScreen) return;

  // If the scene carries a media asset, show it instead of the empty state
  if (scene && scene.media) {
    dom.workstationScreen.innerHTML =
      `<img class="ws-media" src="${escapeHtml(scene.media)}" alt="">`;
    return;
  }

  const s = State.get();
  const roleId = s.roleId;
  const roleLabel = (roleId && window.ROLE_SCENARIOS && ROLE_SCENARIOS[roleId])
    ? ROLE_SCENARIOS[roleId].workstation.label
    : (s.scenarioId ? 'Team Project' : 'Workstation');

  dom.workstationScreen.innerHTML = `
    <div class="ws-empty-state">
      <div class="ws-empty-label">${roleLabel}</div>
      <div class="ws-empty-sub">Awaiting task…</div>
    </div>
  `;
}

function showWorkstationTask(scene) {
  if (!dom.workstationScreen) return;

  // If the scene carries a media asset, show it over the task text
  if (scene && scene.media) {
    dom.workstationScreen.innerHTML =
      `<img class="ws-media" src="${escapeHtml(scene.media)}" alt="">`;
    return;
  }

  const problemText = t(scene, 'problem') || '';
  dom.workstationScreen.innerHTML = `
    <div class="ws-content">
      <div class="ws-cell">
        <div class="ws-cell-label">Active Task</div>
        <div class="ws-cell-value">${escapeHtml(problemText)}</div>
      </div>
      <div class="ws-body"></div>
    </div>
  `;
}

function showWorkstationBobOutput(text) {
  if (!dom.workstationScreen) return;
  dom.workstationScreen.innerHTML = `
    <div class="ws-content">
      <div class="ws-bob-output ws-body">
        <div class="ws-bob-header">
          <img class="ws-bob-header-avatar" src="assets/bob/head.png" alt="Bob">
          Bob Analysis
        </div>
        <div class="ws-bob-text">${escapeHtml(text)}</div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function buildStars() {
  if (!dom.starsContainer) return;
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*5}s;--op:${0.3+Math.random()*0.5};`;
    dom.starsContainer.appendChild(s);
  }
}

// ── Scene runner ──────────────────────────────────────────────────────────────
function runScene(index) {
  if (index >= scenes.length) { goToResults(); return; }

  sceneIndex = index;
  State.set({ sceneIndex: index });

  const scene = scenes[index];

  pendingAdvance = null;   // discard any stale advance callback from the previous scene
  hideChoices();
  hideBobBox();
  dom.continueHint.classList.add('hidden');

  if      (scene.type === 'chapter')    showChapterCard(scene);
  else if (scene.type === 'end')        goToResults();
  else if (scene.type === 'narration')  showNarration(scene);
  else if (scene.type === 'dialogue')   showDialogue(scene);
  else if (scene.type === 'task')       showTask(scene);
  else if (scene.type === 'video-task') showVideoTask(scene);
  else if (scene.type === 'open-chat')  showOpenChat(scene);
}

// ── Chapter card ──────────────────────────────────────────────────────────────
function showChapterCard(scene) {

  dom.chapterLabel.textContent = t(scene, 'title');
  dom.chapterTitle.textContent = t(scene, 'subtitle');
  dom.chapterSub.textContent   = '';
  dom.chapterCard.classList.remove('hidden', 'out');

  // Clear the stage during chapter transitions
  setStage(null, null);

  setTimeout(() => {
    dom.chapterCard.classList.add('out');
    setTimeout(() => {
      dom.chapterCard.classList.add('hidden');
      dom.chapterCard.classList.remove('out');
      runScene(sceneIndex + 1);
    }, 400);
  }, CHAPTER_DISPLAY);
}

// ── Pagination helpers ────────────────────────────────────────────────────────
// Splits text into pages that fit inside the fixed dialogue-text-wrap height.
// Falls back gracefully — if we can't measure (wrap not in DOM yet) we just
// use the whole text as one page.
const APPROX_CHARS_PER_PAGE = 220;   // safe default; actual split is measured

function paginateText(text) {
  const wrap = dom.dialogueTextWrap;
  if (!wrap) return [text];

  // Quick exit for short text — no pagination needed
  if (text.length <= APPROX_CHARS_PER_PAGE) return [text];

  // Use a temporary hidden element to measure how many chars fit
  const probe = document.createElement('div');
  probe.className   = 'dialogue-text';
  probe.style.cssText = 'visibility:hidden;position:absolute;top:0;left:0;width:100%;pointer-events:none;';
  probe.style.whiteSpace = 'pre-wrap';
  wrap.appendChild(probe);

  const maxH = wrap.clientHeight || 120;
  const words = text.split(' ');
  const pages = [];
  let current = '';

  for (let wi = 0; wi < words.length; wi++) {
    const candidate = current ? current + ' ' + words[wi] : words[wi];
    probe.textContent = candidate;
    if (probe.scrollHeight > maxH && current !== '') {
      pages.push(current.trimEnd());
      current = words[wi];
    } else {
      current = candidate;
    }
  }
  if (current.trim()) pages.push(current.trimEnd());

  wrap.removeChild(probe);
  return pages.length ? pages : [text];
}

// Show text with automatic pagination.
// onAllDone fires after the final page is confirmed by the player.
// Uses pendingAdvance flag rather than stacking { once } listeners — avoids
// the bug where a choice-button click fires the stage listener unexpectedly.
function typewritePaged(text, onAllDone, useHighlight) {
  const pages = paginateText(text);
  let pageIdx = 0;

  // Clear any leftover advance callback from a previous scene
  pendingAdvance = null;

  function showPage(idx) {
    const isLast = idx === pages.length - 1;
    const hint   = isLast
      ? (dom.continueHint.dataset[lang() === 'id' ? 'id' : 'en'] || '▼ click to continue')
      : (lang() === 'id' ? '▼ halaman berikutnya' : '▼ next page');

    typewrite(pages[idx], () => {
      dom.continueHint.textContent = hint;
      dom.continueHint.classList.remove('hidden');

      if (!isLast) {
        // Next click advances to next page
        pendingAdvance = () => {
          dom.continueHint.classList.add('hidden');
          pageIdx++;
          showPage(pageIdx);
        };
      } else {
        // Next click fires onAllDone (e.g. show choices, advance scene)
        pendingAdvance = onAllDone
          ? () => {
              dom.continueHint.classList.add('hidden');
              onAllDone();
            }
          : null;
      }
    }, useHighlight);
  }

  showPage(0);
}

// ── Narration ─────────────────────────────────────────────────────────────────
function showNarration(scene) {
  setStage('narrator', null);
  setNameplate('narrator');
  showWorkstationIdle(scene);
  // null onAllDone -> onDialogueClick falls through to runScene(sceneIndex + 1)
  typewritePaged(t(scene, 'text'), null);
}

// ── Open-chat — show narration text then redirect to a chatbox mockup ────────
// Scenes can specify a `url` field to override the default dev-story target.
// Saves sceneIndex+1 before redirecting so returning from the chatbox lands on
// the next scene rather than re-triggering the open-chat redirect.
function showOpenChat(scene) {
  setStage('narrator', null);
  setNameplate('narrator');
  showWorkstationIdle(scene);
  typewritePaged(t(scene, 'text'), () => {
    State.set({ sceneIndex: sceneIndex + 1 });
    location.href = scene.url || 'dev-story/index.html';
  });
}

// ── Dialogue ──────────────────────────────────────────────────────────────────
function showDialogue(scene) {
  const newSpeaker   = scene.char;
  const newListener  = (currentSpeaker && currentSpeaker !== newSpeaker) ? currentSpeaker : currentListener;

  setStage(newSpeaker, newListener !== newSpeaker ? newListener : null, scene.expr);
  setNameplate(newSpeaker);
  showWorkstationIdle(scene);
  // null onAllDone -> onDialogueClick falls through to runScene(sceneIndex + 1)
  typewritePaged(t(scene, 'text'), null);
}

// ── Task ──────────────────────────────────────────────────────────────────────
function showTask(scene) {

  const newSpeaker  = scene.char;
  const newListener = (currentSpeaker && currentSpeaker !== newSpeaker) ? currentSpeaker : currentListener;

  setStage(newSpeaker, newListener !== newSpeaker ? newListener : null, scene.expr);
  setNameplate(newSpeaker);
  showWorkstationTask(scene);
  // Highlight on; after all pages done, show choices
  typewritePaged(t(scene, 'problem'), () => showChoices(scene), true);
}

// ── Stage management ──────────────────────────────────────────────────────────
// speaker -> left slot (bright, normal)
// listener -> right slot (dimmed, flipped)
// expr (optional) — filename stem inside the speaker's asset folder (e.g. 'confused', 'relief')
function setStage(speakerKey, listenerKey, expr) {
  const speakerChanged  = speakerKey  !== currentSpeaker;
  const listenerChanged = listenerKey !== currentListener;

  currentSpeaker  = speakerKey;
  currentListener = listenerKey;

  // ── Background — update whenever speaker changes ───────────────────────────
  // Bob speaking keeps the previous character's environment (DATA-LAB unless
  // the prior speaker was already bob or null). Fall back to the listener's bg
  // so Bob responses don't wipe the context.
  if (speakerChanged) {
    const bgKey = (speakerKey && speakerKey !== 'narrator')
      ? speakerKey
      : (listenerKey && listenerKey !== 'narrator' ? listenerKey : null);
    if (bgKey) updateBackground(bgKey);
  }

  // ── Left (speaker) ────────────────────────────────────────────────────────
  const leftEl  = dom.charLeft;
  const leftImg = dom.charLeftImg;

  if (speakerKey && speakerKey !== 'narrator') {
    const src = bodyPath(speakerKey, expr);
    if (leftImg.src !== src) {
      leftImg.src = src;
      leftImg.alt = CHARACTERS[speakerKey]?.name || '';
    }
    leftEl.className = 'char-slot char-left is-speaker';
    if (speakerChanged) {
      // restart slide-in animation
      leftEl.classList.remove('enter');
      void leftEl.offsetWidth;
      leftEl.classList.add('enter');
    }
  } else {
    leftEl.className = 'char-slot char-left is-hidden';
    leftImg.src = '';
  }

  // ── Right (listener) ──────────────────────────────────────────────────────
  const rightEl  = dom.charRight;
  const rightImg = dom.charRightImg;

  if (listenerKey && listenerKey !== 'narrator') {
    const src = bodyPath(listenerKey);
    if (rightImg.src !== src) {
      rightImg.src = src;
      rightImg.alt = CHARACTERS[listenerKey]?.name || '';
    }
    rightEl.className = 'char-slot char-right is-listener';
    if (listenerChanged) {
      rightEl.classList.remove('enter');
      void rightEl.offsetWidth;
      rightEl.classList.add('enter');
    }
  } else {
    rightEl.className = 'char-slot char-right is-hidden';
    rightImg.src = '';
  }
}

// ── Nameplate (head + name + role) ────────────────────────────────────────────
function setNameplate(charKey) {
  const char  = CHARACTERS[charKey] || CHARACTERS.narrator;
  const isBob = charKey === 'bob';

  // Head avatar
  const hSrc = headPath(charKey);
  dom.speakerHead.src = hSrc;
  dom.speakerHead.style.display = hSrc ? 'block' : 'none';
  dom.speakerHead.classList.toggle('bob-active', isBob);

  // Name & role
  dom.speakerName.textContent = char.name;
  dom.speakerRole.textContent = char.role;

  // Show role for non-Bob speakers; hide for Bob (his role is shown in the box header)
  dom.speakerRole.style.display = isBob ? 'none' : 'block';
}

// ── Keyword highlighter ───────────────────────────────────────────────────────
// Converts plain text into an HTML string with coloured <span> wrappers.
// Applied only to task `problem` text so dialogue stays plain.
function highlightKeywords(text) {
  // Escape HTML entities first so we never break the DOM
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    // backtick code: `foo` -> .kw-code  (run first, before number pass)
    .replace(/`([^`]+)`/g, '<span class="kw-code">$1</span>')
    // percentages and raw numbers with units: 23%, 4,000, ~400ms, $45,000, 51%
    .replace(/(\b~?[\d,]+(?:\.\d+)?(?:%|ms|px|s\b|k\b)?|\$[\d,]+(?:,\d{3})*)/g,
             '<span class="kw-number">$1</span>')
    // danger keywords
    .replace(/\b(fail(?:s|ed|ure)?|crash(?:ed|es)?|error|breach|leak(?:s|ed)?|missing|broken|wrong|invalid|expired|cracked|exposed|violat(?:es|ion)|corrupt)\b/gi,
             '<span class="kw-danger">$1</span>')
    // success / positive keywords
    .replace(/\b(fix(?:ed)?|clean(?:ed)?|resolv(?:ed)?|pass(?:es|ed)?|succeed(?:s|ed)?|compli(?:ant|es))\b/gi,
             '<span class="kw-success">$1</span>');
}

// ── Typewriter ────────────────────────────────────────────────────────────────
// The cursor span lives INSIDE #dialogue-text as its last child.
// We reattach it after every DOM mutation so it always trails the text.
function typewrite(text, onDone, useHighlight) {
  clearInterval(typewriterTimer);
  isTyping = true;

  // Clear the text content but keep the cursor span as the only child
  dom.dialogueText.textContent = '';
  dom.dialogueText.appendChild(dom.cursor);
  dom.cursor.classList.remove('hidden');

  if (useHighlight) {
    const fullHtml = highlightKeywords(text);
    let i = 0;
    typewriterTimer = setInterval(() => {
      if (i < text.length) {
        i++;
        // innerHTML replaces all children including cursor — reattach cursor after
        dom.dialogueText.innerHTML = highlightKeywords(text.slice(0, i));
        dom.dialogueText.appendChild(dom.cursor);
      } else {
        clearInterval(typewriterTimer);
        isTyping = false;
        dom.dialogueText.innerHTML = fullHtml;
        dom.cursor.classList.add('hidden');
        if (onDone) onDone();
      }
    }, TYPEWRITER_SPEED);

    typewrite._onDone    = onDone;
    typewrite._fullText  = text;
    typewrite._fullHtml  = fullHtml;
    typewrite._target    = dom.dialogueText;
    typewrite._highlight = true;
    return;
  }

  // ── Plain-text path (dialogue lines, narration) ───────────────────────────
  // Use a text node so cursor stays as a sibling element inside the container
  const textNode = document.createTextNode('');
  dom.dialogueText.insertBefore(textNode, dom.cursor);
  let i = 0;
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

  typewrite._onDone    = onDone;
  typewrite._fullText  = text;
  typewrite._fullHtml  = null;
  typewrite._target    = dom.dialogueText;
  typewrite._highlight = false;
}

function skipTypewriter() {
  if (!isTyping) return false;
  clearInterval(typewriterTimer);
  isTyping = false;

  const target = typewrite._target || dom.dialogueText;
  if (typewrite._highlight && typewrite._fullHtml) {
    target.innerHTML = typewrite._fullHtml;
  } else {
    // For plain-text: set full text, then reattach cursor (hidden) at end
    target.textContent = typewrite._fullText || '';
    if (target === dom.dialogueText) {
      dom.dialogueText.appendChild(dom.cursor);
    }
  }
  dom.cursor.classList.add('hidden');
  if (typewrite._onDone) typewrite._onDone();
  typewrite._onDone  = null;
  typewrite._target  = null;
  return true;
}

// ── Click / Key to advance ────────────────────────────────────────────────────
function onDialogueClick() {
  if (isTyping)   { skipTypewriter(); return; }
  if (isOutcome)  return;
  if (!dom.choices.classList.contains('hidden')) return;
  if (!dom.bobBox.classList.contains('hidden'))  return;

  // If a page-turn or explicit onAllDone is pending, fire it
  if (pendingAdvance) {
    const cb = pendingAdvance;
    pendingAdvance = null;
    cb();
    return;
  }

  // Default: plain dialogue/narration — just advance to the next scene
  dom.continueHint.classList.add('hidden');
  runScene(sceneIndex + 1);
}

function onKeyDown(e) {
  // While a video is playing, route Space / Enter there exclusively.
  if (videoKeyHandler) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      videoKeyHandler(e.key);
    }
    return;
  }

  // Space or Enter — advance dialogue (same as click)
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    onDialogueClick();
    return;
  }

  // Number keys 1–4 — click the nth choice button
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 4) {
    const btns = dom.choices.querySelectorAll('.choice-btn');
    if (btns[num - 1]) btns[num - 1].click();
  }
}

// ── Choices ───────────────────────────────────────────────────────────────────
function showChoices(scene) {
  dom.choices.innerHTML = '';
  dom.choices.classList.remove('hidden');

  scene.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (opt.type === 'bob')                          btn.classList.add('bob-choice');
    if (opt.type === 'ignore' || opt.type === 'poor') btn.classList.add('danger-choice');
    btn.style.animationDelay = `${i * 0.06}s`;

    const metaClass = (opt.type === 'ignore' || opt.type === 'poor') ? 'red' : '';
    btn.innerHTML = `
      <div class="choice-left">
        <span class="choice-key">${i + 1}</span>
        <span class="choice-icon">${opt.icon}</span>
        <span class="choice-label">${tOpt(opt, 'label')}</span>
      </div>
      <span class="choice-meta ${metaClass}">${tOpt(opt, 'meta')}</span>
    `;
    btn.addEventListener('click', () => handleChoice(scene, opt));
    dom.choices.appendChild(btn);
  });
}

function hideChoices() {
  dom.choices.classList.add('hidden');
  dom.choices.innerHTML = '';
}

// ── Choice handler ────────────────────────────────────────────────────────────
function handleChoice(scene, opt) {
  hideChoices();

  const isBob     = opt.type === 'bob';
  const timeSaved = isBob ? Math.max(0, (opt.manualCost || 45) - (opt.timeCost || 10)) : 0;

  State.applyDeltas({
    ...(opt.deltas || {}),
    timeCost:  opt.timeCost || 0,
    bobUsed:   isBob,
    timeSaved: timeSaved,
  });
  updateHUD();

  if (isBob && opt.bobResponse) {
    showBobResponse(scene, opt);
  } else {
    showOutcome(tOpt(opt, 'outcome') || '✓', opt.deltas, () => runScene(sceneIndex + 1));
  }
}

// ── Bob response ──────────────────────────────────────────────────────────────
function showBobResponse(scene, opt) {
  // Bob moves to left (speaker), original speaker dims to right
  const prevSpeaker = currentSpeaker;
  setStage('bob', prevSpeaker);

  // Hide the dialogue overlay — Bob speaks through his own absolute overlay
  if (dom.dialogueOverlay) dom.dialogueOverlay.classList.add('hidden');
  // Keep choicesOverlay visible so the follow-up button can show inside it
  if (dom.choicesOverlay)  dom.choicesOverlay.classList.remove('hidden');

  dom.bobBox.classList.remove('hidden');
  dom.bobBoxText.textContent = '';
  // Hide choices while Bob is typing
  dom.choices.classList.add('hidden');
  dom.choices.innerHTML = '';

  const text = tOpt(opt, 'bobResponse');

  // Mirror full Bob analysis to the workstation panel immediately
  showWorkstationBobOutput(text);

  let i = 0;
  isTyping = true;

  // Store skip info on the bob-box typewriter
  typewrite._fullText = text;
  typewrite._onDone   = () => showFollowUp(scene, opt, prevSpeaker);
  typewrite._target   = dom.bobBoxText;  // skip writes here

  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      dom.bobBoxText.textContent += text[i];
      i++;
    } else {
      clearInterval(typewriterTimer);
      isTyping = false;
      typewrite._onDone();
      typewrite._onDone = null;
    }
  }, TYPEWRITER_SPEED * 0.8);
}

function showFollowUp(scene, opt, prevSpeaker) {
  dom.choices.innerHTML = '';
  dom.choices.classList.remove('hidden');
  // Ensure the overlay that wraps the choices is also visible
  if (dom.choicesOverlay) dom.choicesOverlay.classList.remove('hidden');

  const btn = document.createElement('button');
  btn.className = 'choice-btn bob-choice';
  const applyLabel = lang() === 'id'
    ? (opt.id_text?.bobFollowUp || opt.bobFollowUp || 'Terapkan rekomendasi Bob')
    : (opt.bobFollowUp || 'Apply Bob\'s recommendation');
  const applyMeta  = lang() === 'id' ? '-> terapkan' : '-> apply';
  btn.innerHTML = `
    <div class="choice-left">
      <span class="choice-icon">[OK]</span>
      <span class="choice-label">${applyLabel}</span>
    </div>
    <span class="choice-meta">${applyMeta}</span>
  `;
  btn.addEventListener('click', () => {
    hideChoices();
    hideBobBox();

    if (opt.followUpDeltas) {
      State.applyDeltas({ ...opt.followUpDeltas, timeCost: 0 });
      updateHUD();
    }

    // Restore original speaker after Bob finishes
    setStage(prevSpeaker, null);
    setNameplate(prevSpeaker);

    const allDeltas = mergeDeltas(opt.deltas, opt.followUpDeltas);
    showOutcome(tOpt(opt, 'outcome') || '✓', allDeltas, () => runScene(sceneIndex + 1));
  });

  dom.choices.appendChild(btn);
}

function hideBobBox() {
  dom.bobBox.classList.add('hidden');
  dom.bobBoxText.textContent = '';
  // Restore the dialogue overlay that was hidden during Bob's response
  if (dom.dialogueOverlay) dom.dialogueOverlay.classList.remove('hidden');
}

function mergeDeltas(a, b) {
  const result = { ...(a || {}) };
  Object.entries(b || {}).forEach(([k, v]) => { result[k] = (result[k] || 0) + v; });
  return result;
}

// ── Outcome toast ─────────────────────────────────────────────────────────────
function showOutcome(message, deltas, onDone) {
  isOutcome = true;
  const toast = dom.outcomeToast;
  toast.innerHTML = '';

  const title = document.createElement('div');
  title.className   = 'outcome-title';
  title.textContent = message;
  toast.appendChild(title);

  if (deltas) {
    const wrap = document.createElement('div');
    wrap.className = 'outcome-deltas';
    [['Quality', deltas.quality], ['Security', deltas.security], ['Satisfaction', deltas.satisfaction]]
      .forEach(([label, val]) => {
        if (!val) return;
        const d = document.createElement('div');
        d.className   = `outcome-delta ${val > 0 ? 'pos' : val < 0 ? 'neg' : 'neu'}`;
        d.textContent = `${val > 0 ? '+' : ''}${val} ${label}`;
        wrap.appendChild(d);
      });
    toast.appendChild(wrap);
  }

  toast.classList.remove('hidden', 'fade-out');
  void toast.offsetWidth;

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('fade-out');
      isOutcome = false;
      if (onDone) onDone();
    }, 400);
  }, 1800);
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function updateHUD() { /* metrics/timer removed */ }

// ── Real-time timer (no-op — timer display removed) ───────────────────────────
function startRealTimer() {}

// ── Navigation ────────────────────────────────────────────────────────────────
// ── Video-task scene ──────────────────────────────────────────────────────────
// Shows choices normally; when the bob option is picked, plays the video fullscreen.
// After the video ends (or is skipped), shows the outcome and advances.
function showVideoTask(scene) {
  const newSpeaker  = scene.char;
  const newListener = (currentSpeaker && currentSpeaker !== newSpeaker) ? currentSpeaker : currentListener;

  setStage(newSpeaker, newListener !== newSpeaker ? newListener : null, scene.expr);
  setNameplate(newSpeaker);
  showWorkstationTask(scene);
  typewritePaged(t(scene, 'problem'), () => showVideoChoices(scene), true);
}

function showVideoChoices(scene) {
  dom.choices.innerHTML = '';
  dom.choices.classList.remove('hidden');

  scene.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (opt.type === 'bob') btn.classList.add('bob-choice');
    btn.style.animationDelay = `${i * 0.06}s`;

    btn.innerHTML = `
      <div class="choice-left">
        <span class="choice-key">${i + 1}</span>
        <span class="choice-icon">${opt.icon}</span>
        <span class="choice-label">${tOpt(opt, 'label')}</span>
      </div>
      <span class="choice-meta">${tOpt(opt, 'meta')}</span>
    `;
    btn.addEventListener('click', () => handleVideoChoice(scene, opt));
    dom.choices.appendChild(btn);
  });
}

function handleVideoChoice(scene, opt) {
  hideChoices();

  const timeSaved = opt.type === 'bob' ? Math.max(0, (opt.manualCost || 45) - (opt.timeCost || 10)) : 0;
  State.applyDeltas({ ...(opt.deltas || {}), timeCost: opt.timeCost || 0, bobUsed: opt.type === 'bob', timeSaved });
  updateHUD();

  if (opt.type === 'bob' && opt.videoSrc && dom.videoOverlay) {
    const afterVideos = () => {
      showOutcome(tOpt(opt, 'outcome') || '✓', opt.deltas, () => runScene(sceneIndex + 1));
    };
    const filename = opt.videoSrc.split('/').pop();
    if (filename === 'bob-ocp-healthcheck.mp4') {
      playVideoScene(opt.videoSrc, () => {
        playVideoScene('assets/media/HW-final.mp4', afterVideos);
      });
    } else {
      playVideoScene(opt.videoSrc, afterVideos);
    }
  } else {
    showOutcome(tOpt(opt, 'outcome') || '✓', opt.deltas, () => runScene(sceneIndex + 1));
  }
}

// ── Auto-pause checkpoints per video (keyed by filename) ─────────────────────
const VIDEO_PAUSE_POINTS = {
  'bob-ocp-healthcheck.mp4': [8.5, 14, 19, 24],
  'wxdi.mp4':                [4, 5, 8, 11],
};

function playVideoScene(src, onDone) {
  const overlay       = dom.videoOverlay;
  const player        = dom.videoPlayer;
  const skipBtn       = dom.videoSkip;
  const playPauseBtn  = document.getElementById('video-playpause');
  const playPauseIcon = document.getElementById('video-playpause-icon');
  const progressWrap  = document.getElementById('video-progress-wrap');
  const progressBar   = document.getElementById('video-progress-bar');
  const timeLabel     = document.getElementById('video-time');
  const pauseOverlay  = document.getElementById('video-pause-overlay');
  const startHint     = document.getElementById('video-start-hint');

  if (!overlay || !player) { onDone(); return; }

  // Resolve pause points for this video by matching the filename
  const filename   = src.split('/').pop();
  const rawPoints  = VIDEO_PAUSE_POINTS[filename] || [];
  // Keep a mutable copy — we'll shift/discard points as we pass them
  const pauseQueue = rawPoints.slice().sort((a, b) => a - b);

  // Track whether the player is waiting at an auto-pause point
  let waitingAtPause = false;

  // Hide the game stage while video plays
  if (dom.stage)           dom.stage.style.visibility = 'hidden';
  if (dom.dialogueOverlay) dom.dialogueOverlay.classList.add('hidden');

  player.src = src;
  overlay.classList.remove('hidden');
  overlay.classList.remove('controls-visible');
  // Do NOT auto-play — player must press Space to start
  setPlayPauseIcon();

  // ── Helpers ──────────────────────────────────────────────────────────────
  function fmtTime(s) {
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function syncControls() {
    if (!player.duration) return;
    const pct = (player.currentTime / player.duration) * 100;
    progressBar.style.width = pct + '%';
    timeLabel.textContent   = fmtTime(player.currentTime);

    // Check whether we've reached the next auto-pause point
    if (pauseQueue.length && !waitingAtPause) {
      const next = pauseQueue[0];
      if (player.currentTime >= next) {
        pauseQueue.shift();
        triggerAutoPause();
      }
    }
  }

  function setPlayPauseIcon() {
    if (!playPauseIcon) return;
    playPauseIcon.innerHTML = player.paused ? '&#9654;' : '&#10074;&#10074;';
    playPauseBtn.setAttribute('aria-label', player.paused ? 'Play' : 'Pause');
  }

  // ── Auto-pause + Enter-to-continue overlay ────────────────────────────────
  function triggerAutoPause() {
    player.pause();
    waitingAtPause = true;
    if (pauseOverlay) pauseOverlay.classList.remove('hidden');
  }

  function dismissAutoPause() {
    if (!waitingAtPause) return;
    waitingAtPause = false;
    if (pauseOverlay) pauseOverlay.classList.add('hidden');
    player.play().catch(() => {});
  }

  // ── Controls wiring ───────────────────────────────────────────────────────
  function onFirstPlay() {
    // Hide the "Press SPACE to play" hint once playback actually starts
    if (startHint) startHint.style.display = 'none';
    player.removeEventListener('play', onFirstPlay);
  }

  player.addEventListener('timeupdate', syncControls);
  player.addEventListener('play',  setPlayPauseIcon);
  player.addEventListener('play',  onFirstPlay);
  player.addEventListener('pause', setPlayPauseIcon);

  function onPlayPause() {
    if (waitingAtPause) { dismissAutoPause(); return; }
    if (player.paused) player.play().catch(() => {}); else player.pause();
  }
  playPauseBtn.addEventListener('click', onPlayPause);

  function onProgressClick(e) {
    if (!player.duration) return;
    const rect  = progressWrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.currentTime = ratio * player.duration;
    // If user scrubs forward past a pause point, remove it from the queue
    while (pauseQueue.length && pauseQueue[0] <= player.currentTime) pauseQueue.shift();
    // Show controls briefly after scrubbing
    overlay.classList.add('controls-visible');
    clearTimeout(overlay._hideCtrlTimer);
    overlay._hideCtrlTimer = setTimeout(() => overlay.classList.remove('controls-visible'), 1800);
  }
  progressWrap.addEventListener('click', onProgressClick);

  // ── Keyboard handler (active only while this video is open) ──────────────
  videoKeyHandler = function (key) {
    if (key === 'Enter') {
      if (waitingAtPause) { dismissAutoPause(); return; }
      // Enter with no auto-pause: finish (same as skip)
      finish();
      return;
    }
    if (key === ' ') {
      // Space always toggles play/pause (even at auto-pause point)
      onPlayPause();
    }
  };

  // ── Cleanup ───────────────────────────────────────────────────────────────
  function cleanup() {
    videoKeyHandler = null;
    player.removeEventListener('timeupdate', syncControls);
    player.removeEventListener('play',  setPlayPauseIcon);
    player.removeEventListener('play',  onFirstPlay);
    player.removeEventListener('pause', setPlayPauseIcon);
    playPauseBtn.removeEventListener('click', onPlayPause);
    progressWrap.removeEventListener('click', onProgressClick);
    clearTimeout(overlay._hideCtrlTimer);
    if (pauseOverlay) pauseOverlay.classList.add('hidden');
    // Restore start hint for next use
    if (startHint) startHint.style.display = '';
    progressBar.style.width = '0%';
    timeLabel.textContent   = '0:00';
    waitingAtPause = false;
  }

  function finish() {
    cleanup();
    player.pause();
    player.src = '';
    overlay.classList.add('hidden');
    if (dom.stage) dom.stage.style.visibility = '';
    if (dom.dialogueOverlay) dom.dialogueOverlay.classList.remove('hidden');
    onDone();
  }

  player.onended = finish;

  // Skip button — one-time listener
  function onSkip() {
    skipBtn.removeEventListener('click', onSkip);
    player.onended = null;
    finish();
  }
  skipBtn.addEventListener('click', onSkip);
}

function goToResults() {
  clearInterval(realTimerInterval);
  location.href = 'results.html';
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
