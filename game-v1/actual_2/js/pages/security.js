/**
 * js/pages/security.js
 * Blank shell for the Security page chatbox.
 * FAB opens the chat view; close button dismisses it.
 * Permissions popup is pre-opened in the HTML to showcase security model.
 */
(function () {
  const fab     = document.getElementById('plan-bob-fab');
  const fabWrap = document.getElementById('plan-bob-fab-wrap');
  const landing = document.getElementById('security-landing');
  const chat    = document.getElementById('plan-chat-view');
  const closeBtn = document.getElementById('bcp-close-btn');

  if (!fab || !landing || !chat) return;

  fab.addEventListener('click', openChat);
  fabWrap.addEventListener('click', openChat);

  function openChat() {
    landing.classList.add('plan-landing--out');
    setTimeout(() => {
      landing.style.display = 'none';
      fabWrap.style.display = 'none';
      chat.classList.remove('hidden');
      chat.classList.add('plan-chat-view--in');
    }, 320);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chat.classList.add('hidden');
      landing.style.display = '';
      landing.classList.remove('plan-landing--out');
      fabWrap.style.display = '';
    });
  }
})();
