// chat.js
(function () {
  'use strict';

  var chatWidget = document.getElementById('chatWidget');
  var chatToggle = document.getElementById('chatToggle');
  var chatPanel = document.getElementById('chatPanel');
  var chatClose = document.getElementById('chatClose');
  var chatInput = document.getElementById('chatInput');
  var chatSend = document.getElementById('chatSend');
  var chatMessages = document.getElementById('chatMessages');

  if (!chatToggle || !chatPanel) return;

  chatToggle.addEventListener('click', function () {
    var isActive = chatPanel.classList.toggle('active');
    chatPanel.setAttribute('aria-hidden', !isActive);
    chatWidget.classList.toggle('chat-open', isActive);
    if (isActive) chatInput.focus();
  });

  chatClose.addEventListener('click', function () {
    chatPanel.classList.remove('active');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatWidget.classList.remove('chat-open');
  });

  var botResponses = {
    'hiring': "Thanks for your interest in hiring! Please reach out via email at kingsuraj6387@gmail.com or connect on LinkedIn. I'd love to discuss opportunities.",
    'collab': "I'm always open to project collaborations! Send me details at kingsuraj6387@gmail.com and let's build something great together.",
    'general': "Thanks for reaching out! You can email me at kingsuraj6387@gmail.com or connect via LinkedIn. I typically respond within 24 hours."
  };

  function addMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    if (type === 'bot') {
      var content = document.createElement('div');
      content.className = 'chat-msg-content';
      content.textContent = text;
      msg.appendChild(content);
    } else {
      msg.textContent = text;
    }
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserMessage(text) {
    addMessage(text, 'user');
    setTimeout(function () {
      var response = "Thanks for your message! I'll get back to you soon. You can also reach me at kingsuraj6387@gmail.com.";
      addMessage(response, 'bot');
    }, 800);
  }

  document.querySelectorAll('.chat-quick-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var msgKey = btn.getAttribute('data-msg');
      var userText = btn.textContent.trim();
      addMessage(userText, 'user');
      setTimeout(function () {
        var response = botResponses[msgKey] || "Thanks for reaching out!";
        addMessage(response, 'bot');
      }, 800);
    });
  });

  function sendMessage() {
    var text = chatInput.value.trim();
    if (!text) return;
    handleUserMessage(text);
    chatInput.value = '';
  }

  chatSend.addEventListener('click', sendMessage);

  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
})();
