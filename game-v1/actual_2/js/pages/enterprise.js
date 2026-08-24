/**
 * js/pages/enterprise.js
 * Blank shell for the Enterprise Economics page chatbox.
 * FAB opens the chat view; close button dismisses it.
 * Budget counter in the topbar showcases token pooling.
 */
(function () {
  const fab     = document.getElementById('plan-bob-fab');
  const fabWrap = document.getElementById('plan-bob-fab-wrap');
  const landing = document.getElementById('enterprise-landing');
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
