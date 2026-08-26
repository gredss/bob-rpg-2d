/**
 * chat.js
 * Shared chat widget logic — powers the Bob chat mockup
 * used across all SDLC stage pages.
 *
 * Usage: call Chat.init(containerEl, scriptLines)
 *   containerEl  — the .chat-messages DOM node
 *   scriptLines  — array of { role: 'user'|'bob', text: string, delay?: ms }
 */

const Chat = (() => {
  // ── Typewriter effect ────────────────────────────────────────
  function _typewrite(el, text, speed = 18) {
    return new Promise(resolve => {
      let i = 0;
      const tick = () => {
        if (i >= text.length) { resolve(); return; }
        el.textContent += text[i++];
        // Auto-scroll to bottom
        el.closest('.chat-messages')?.scrollTo({ top: 99999, behavior: 'smooth' });
        setTimeout(tick, speed);
      };
      tick();
    });
  }

  // ── Build a message bubble ────────────────────────────────────
  function _bubble(role, text, typing = false) {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg chat-msg--${role}`;

    if (role === 'bob') {
      const avatar = document.createElement('img');
      avatar.src = 'asset/bob.png';
      avatar.alt = 'Bob';
      avatar.className = 'chat-avatar';
      wrap.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (role === 'bob') {
      const name = document.createElement('span');
      name.className = 'chat-sender';
      name.textContent = 'IBM Bob';
      bubble.appendChild(name);
    }

    const body = document.createElement('div');
    body.className = 'chat-text';
    if (!typing) body.textContent = text;
    bubble.appendChild(body);
    wrap.appendChild(bubble);

    return { wrap, body };
  }

  // ── Typing indicator ─────────────────────────────────────────
  function _typingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg--bob';

    const avatar = document.createElement('img');
    avatar.src = 'asset/bob.png';
    avatar.alt = 'Bob';
    avatar.className = 'chat-avatar';
    wrap.appendChild(avatar);

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    const name = document.createElement('span');
    name.className = 'chat-sender';
    name.textContent = 'IBM Bob';
    bubble.appendChild(name);

    const dots = document.createElement('div');
    dots.className = 'chat-typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    bubble.appendChild(dots);

    wrap.appendChild(bubble);
    return wrap;
  }

  // ── Play a script of messages ─────────────────────────────────
  async function play(containerEl, scriptLines) {
    containerEl.innerHTML = '';

    for (const line of scriptLines) {
      const delay = line.delay ?? (line.role === 'user' ? 600 : 900);

      await new Promise(r => setTimeout(r, delay));

      if (line.role === 'bob') {
        // Show typing indicator first
        const indicator = _typingIndicator();
        containerEl.appendChild(indicator);
        containerEl.scrollTo({ top: 99999, behavior: 'smooth' });

        const thinkTime = Math.max(400, line.text.length * 12);
        await new Promise(r => setTimeout(r, thinkTime));
        indicator.remove();

        const { wrap, body } = _bubble('bob', '', true);
        containerEl.appendChild(wrap);
        await _typewrite(body, line.text);
      } else {
        const { wrap } = _bubble('user', line.text);
        containerEl.appendChild(wrap);
        containerEl.scrollTo({ top: 99999, behavior: 'smooth' });
      }
    }
  }

  // ── Re-play on demand (used by replay button) ─────────────────
  function init(containerEl, scriptLines) {
    play(containerEl, scriptLines);
  }

  return { init, play };
})();
