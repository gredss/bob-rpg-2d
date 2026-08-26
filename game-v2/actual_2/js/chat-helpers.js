/**
 * chat-helpers.js
 * Shared helpers for the scripted bcp-* chat pages
 * (Code, Review, Deploy, Monitor).
 *
 * Exposes a single global: BcpChat
 *   BcpChat.init(script)  — wires up a page using the standard
 *                           bcp-body / bcp-welcome / bcp-messages
 *                           / bcp-scripted-input / bcp-send DOM.
 */

const BcpChat = (() => {
  /**
   * Typewrite text into el one character at a time.
   * @param {HTMLElement} el
   * @param {string} text
   * @param {number} [speed=9] ms per character
   * @returns {Promise<void>}
   */
  function typewrite(el, text, speed = 9) {
    return new Promise(resolve => {
      let i = 0;
      function tick() {
        if (i >= text.length) { resolve(); return; }
        el.textContent += text[i++];
        el.closest('.bcp-body')?.scrollTo({ top: 99999, behavior: 'smooth' });
        setTimeout(tick, speed);
      }
      tick();
    });
  }

  /** Append a user message bubble to msgs container. */
  function addUserMsg(msgs, text) {
    const row = document.createElement('div');
    row.className = 'bcp-msg-user';
    const b = document.createElement('div');
    b.className = 'bcp-user-bubble';
    b.textContent = text;
    row.appendChild(b);
    msgs.appendChild(row);
  }

  /**
   * Append a Bob message row and return the text element to typewrite into.
   * @returns {HTMLElement} text container
   */
  function addBobMsg(msgs) {
    const row = document.createElement('div');
    row.className = 'bcp-msg-bob';

    const av = document.createElement('img');
    av.src = 'asset/bob.png';
    av.alt = 'Bob';
    av.className = 'bcp-bob-avatar';
    row.appendChild(av);

    const c = document.createElement('div');
    c.className = 'bcp-bob-content';

    const n = document.createElement('div');
    n.className = 'bcp-bob-name';
    n.textContent = 'IBM Bob';
    c.appendChild(n);

    const t = document.createElement('div');
    t.className = 'bcp-bob-text';
    c.appendChild(t);

    row.appendChild(c);
    msgs.appendChild(row);
    return t;
  }

  /** Show a typing indicator row (id="bcp-typing-row"). */
  function showTyping(msgs) {
    const row = document.createElement('div');
    row.className = 'bcp-msg-bob';
    row.id = 'bcp-typing-row';

    const av = document.createElement('img');
    av.src = 'asset/bob.png';
    av.alt = 'Bob';
    av.className = 'bcp-bob-avatar';
    row.appendChild(av);

    const c = document.createElement('div');
    c.className = 'bcp-bob-content';

    const n = document.createElement('div');
    n.className = 'bcp-bob-name';
    n.textContent = 'IBM Bob';
    c.appendChild(n);

    const d = document.createElement('div');
    d.className = 'bcp-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    c.appendChild(d);

    row.appendChild(c);
    msgs.appendChild(row);
  }

  /** Remove the typing indicator row. */
  function hideTyping() {
    document.getElementById('bcp-typing-row')?.remove();
  }

  /**
   * Wire up a standard scripted-chat page.
   *
   * @param {Array<{user: string, bob: string}>} script
   * @param {string} [doneLabel='demo complete']  — label shown in done state
   */
  function init(script, doneLabel = 'demo complete') {
    const body     = document.getElementById('bcp-body');
    const welcome  = document.getElementById('bcp-welcome');
    const msgs     = document.getElementById('bcp-messages');
    const inputEl  = document.getElementById('bcp-scripted-input');
    const inputBox = document.getElementById('bcp-input-box');
    const sendBtn  = document.getElementById('bcp-send');

    let step = 0;
    let busy = false;

    function scrollToBottom() {
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
    }

    function activateChat() {
      if (!msgs.classList.contains('active')) {
        welcome.classList.add('hidden');
        msgs.classList.add('active');
      }
    }

    function updateUI() {
      if (step < script.length) {
        inputEl.textContent = script[step].user;
        inputEl.classList.add('ready');
        inputBox.classList.add('active');
        sendBtn.disabled = false;
        sendBtn.classList.add('pulse');
      } else {
        inputEl.textContent = doneLabel;
        inputEl.classList.remove('ready');
        inputBox.classList.remove('active');
        sendBtn.disabled = true;
        sendBtn.classList.remove('pulse');

        const wrap = document.createElement('div');
        wrap.className = 'bcp-done-wrap';
        wrap.innerHTML = `<p>End of ${doneLabel}</p><button class="bcp-restart-btn">↺ Restart</button>`;
        msgs.appendChild(wrap);
        scrollToBottom();

        wrap.querySelector('.bcp-restart-btn').addEventListener('click', () => {
          step = 0;
          msgs.innerHTML = '';
          activateChat();
          updateUI();
        });
      }
    }

    async function advance() {
      if (busy || step >= script.length) return;
      busy = true;

      sendBtn.disabled = true;
      sendBtn.classList.remove('pulse');
      inputBox.classList.remove('active');

      activateChat();

      const cur = script[step];
      addUserMsg(msgs, cur.user);
      inputEl.textContent = '';
      inputEl.classList.remove('ready');
      scrollToBottom();

      showTyping(msgs);
      await new Promise(r => setTimeout(r, 900));
      hideTyping();

      const textEl = addBobMsg(msgs);
      await typewrite(textEl, cur.bob);

      step++;
      busy = false;
      updateUI();
    }

    sendBtn.addEventListener('click', advance);
    updateUI();
  }

  return { init };
})();
