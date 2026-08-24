/**
 * js/pages/home.js
 * Scripts for the Home (landing) page template.
 *
 * Contains two self-contained IIFEs:
 *   1. Preview card — shows a USP summary card on button hover.
 *   2. Kicker cycler — glitch-typewriter animation in the headline kicker.
 */

/* ── 1. Preview card ──────────────────────────────────────────────────── */
(function () {
  const STAGES = {
    mcp: {
      num: '1', tag: 'Agent mode · Workspace scope',
      desc: 'Bob doesn\'t just answer questions — it takes action inside your real tools through the Model Context Protocol. One agent, every system.',
      bullets: ['Connects to Instana, DataStage, IBM BAW & more', 'Bob calls tools, interprets results, responds in context', 'Full audit trail on every tool call'],
      gif: 'asset/instana-gif.gif'
    },
    modes: {
      num: '2', tag: 'All scopes · Switchable',
      desc: 'Switch Bob\'s persona, permissions, and skill set in one click — from planning architect to security auditor to deployment engineer.',
      bullets: ['Agent, Plan, Ask — built-in modes for every workflow', 'Specialist modes: Java Modernization, Instana Installer', 'Build your own custom mode with tailored guardrails'],
      gif: ''
    },
    cli: {
      num: '3', tag: 'Terminal scope · All platforms',
      desc: 'Not confined to your IDE. Bob Shell brings the full AI agent experience to your command line — interactive sessions, script automation, and CI/CD pipeline integration.',
      bullets: ['Interactive and non-interactive session modes', 'Pipe Bob Shell into CI/CD as a pipeline step', 'Same MCP tools, modes, and skills as the IDE'],
      gif: ''
    },
    security: {
      num: '4', tag: 'Enterprise grade · Continuous',
      desc: 'As AI accelerates development, security must evolve from a checkpoint to an embedded capability. IBM Bob shifts security left — enforcing policies at every stage.',
      bullets: ['Policy enforcement at every commit and deploy', 'Audit trail on every action Bob takes', 'Real-world: 160+ hours saved, 100% architecture compliance'],
      gif: ''
    },
    enterprise: {
      num: '5', tag: 'Enterprise plan · Admin controls',
      desc: 'Centralized Bobcoin pools, Bobalytics impact tracking, and dedicated support — IBM Bob Enterprise scales AI-assisted development across your whole org.',
      bullets: ['Shared Bobcoin pool distributed from a central budget', 'Bobalytics: measure codebase contribution & spend', 'Dedicated IBM Bob specialist support'],
      gif: ''
    }
  };

  const panel   = document.getElementById('home-preview');
  const page    = document.querySelector('.home-page');
  const numEl   = document.getElementById('hp-num');
  const stageEl = document.getElementById('hp-stage');
  const tagEl   = document.getElementById('hp-tag');
  const descEl  = document.getElementById('hp-desc');
  const bullEl  = document.getElementById('hp-bullets');
  const gifEl   = document.getElementById('hp-gif');
  const phEl    = document.getElementById('hp-placeholder');
  const phLabel = document.getElementById('hp-placeholder-label');
  const ctaEl   = document.getElementById('hp-cta');

  const LABELS = { mcp: 'MCP', modes: 'Modes', cli: 'Bob Shell', security: 'Security', enterprise: 'Enterprise' };

  let hoverTimer  = null;
  let activeStage = null;

  function showPreview(stageName) {
    const data = STAGES[stageName];
    if (!data) return;
    activeStage = stageName;
    numEl.textContent   = data.num;
    stageEl.textContent = LABELS[stageName] || stageName;
    tagEl.textContent   = data.tag;
    descEl.textContent  = data.desc;
    bullEl.innerHTML    = data.bullets.map(b => `<li>${b}</li>`).join('');
    if (data.gif) {
      gifEl.src = data.gif;
      gifEl.alt = stageName + ' demo';
      gifEl.classList.add('hp-gif-loaded');
      phEl.style.display = 'none';
    } else {
      gifEl.classList.remove('hp-gif-loaded');
      phEl.style.display = '';
      phLabel.textContent = (LABELS[stageName] || stageName) + ' demo preview';
    }
    panel.classList.add('hp-visible');
    page.classList.add('hp-active');
  }

  function hidePreview() {
    activeStage = null;
    panel.classList.remove('hp-visible');
    page.classList.remove('hp-active');
  }

  document.querySelectorAll('.home-stage-btn').forEach(btn => {
    const stage = btn.dataset.page;
    btn.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => showPreview(stage), 100);
    });
    btn.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!panel.matches(':hover')) hidePreview();
      }, 180);
    });
    btn.addEventListener('click', () => Router.navigate(stage));
  });

  panel.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
  panel.addEventListener('mouseleave', () => {
    hoverTimer = setTimeout(hidePreview, 180);
  });

  ctaEl.addEventListener('click', () => {
    if (activeStage) Router.navigate(activeStage);
  });
})();

/* ── 2. Kicker typewriter / glitch cycler ─────────────────────────────── */
(function () {
  const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε';

  function randomChar() {
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }

  function makeGlitchCycler(el, words, holdMs, offsetMs) {
    if (!el) return;
    let idx = 0;

    function animateTo(target, onDone) {
      const totalFrames = Math.max(18, target.length * 1.4 | 0);
      let frame = 0;
      function tick() {
        frame++;
        const progress = frame / totalFrames;
        const revealed = Math.floor(progress * target.length);
        let display = '';
        for (let i = 0; i < target.length; i++) {
          display += (i < revealed) ? target[i] : ((Math.random() < 0.6) ? randomChar() : target[i]);
        }
        el.textContent = display;
        if (frame < totalFrames) { requestAnimationFrame(tick); }
        else { el.textContent = target; if (onDone) setTimeout(onDone, holdMs); }
      }
      requestAnimationFrame(tick);
    }

    function cycle() {
      idx = (idx + 1) % words.length;
      animateTo(words[idx], cycle);
    }

    setTimeout(() => animateTo(words[0], cycle), offsetMs);
  }

  makeGlitchCycler(
    document.getElementById('kicker-typewriter'),
    ['Tool Integration via MCP', 'Adapt with Modes', 'AI in Your Terminal', 'Enterprise-Safe by Design', 'Token Pooling at Scale', 'One Bob. Every Workflow.'],
    2600, 800
  );
})();
