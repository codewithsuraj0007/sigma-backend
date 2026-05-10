// ai-chat.js - Sigma AI Assistant v4.0
// Dynamic: OpenRouter LLM via server proxy + Smart fallback engine

(function () {
  'use strict';

  // ==========================================
  // SURAJ'S KNOWLEDGE BASE (for fallback only)
  // ==========================================

  const SURAJ = {
    name: 'Suraj Prajapati',
    brand: 'The Sigma Developers',
    title: 'MERN Full Stack Developer & AI Integration Engineer',
    location: 'Lucknow, UP, India',
    education: 'Diploma in IT with AI/ML — Government Polytechnic, Lucknow',
    role: 'Web Developer at Seek Unique Productions (Sep 2025 – Present)',
    skills: {
      frontend: ['React.js', 'JavaScript ES6+', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap 5'],
      backend: ['Node.js', 'Express.js', 'ASP.NET Core', 'C#', 'REST APIs'],
      databases: ['MongoDB', 'SQL Server', 'Firestore'],
      cloud: ['Google Cloud', 'AWS', 'Firebase', 'Supabase'],
      ai: ['Vertex AI', 'Generative AI', 'Amazon Q', 'Gemini API'],
      tools: ['Git', 'GitHub', 'Docker', 'Postman', 'Stripe']
    },
    projects: [
      { name: 'AI Image Generator', desc: 'Text-to-image platform using AI APIs with real-time preview and download', tech: 'React.js, AI API, CSS3' },
      { name: 'Developer Portfolio', desc: 'Premium animated portfolio with glassmorphism, dual-theme, 95+ Lighthouse score', tech: 'HTML5, CSS3, JS, Firebase' },
      { name: 'MERN Full Stack App', desc: 'Enterprise-grade app with JWT auth, RESTful APIs, role-based access', tech: 'React, Node.js, MongoDB, Express' },
      { name: 'Real-time Chat Platform', desc: 'Firebase-powered real-time messaging with cloud functions', tech: 'React, Firebase, Firestore' }
    ],
    certs: [
      'AWS Solutions Architecture — Amazon Web Services',
      'Generative AI Studio — Google Cloud',
      'Software Engineering — JPMorgan Chase',
      'Data Analytics — Deloitte',
      'Data Visualisation — TATA',
      '.NET Full Stack — Hindtech IT Solutions'
    ],
    strengths: [
      'End-to-end systems thinking — from database to deployment',
      'Performance-first — optimizes for speed, accessibility, UX',
      'Real production experience — deploys to real users',
      'AI integration expertise — uses AI where it adds genuine value',
      'Clear communicator — explains tech decisions in plain language'
    ],
    contact: {
      whatsapp: 'https://wa.me/916387441629',
      email: 'kingsuraj6387@gmail.com',
      linkedin: 'https://www.linkedin.com/in/suraj-prajapati-0904b92b9',
      portfolio: 'https://thesigmadevelopers.web.app/'
    }
  };

  // ==========================================
  // INTELLIGENT RESPONSE ENGINE (Offline Fallback)
  // ==========================================

  const ResponseEngine = {
    context: { lastTopic: null, askedTopics: new Set(), turnCount: 0 },

    generate: function (input) {
      const msg = input.toLowerCase().trim();
      this.context.turnCount++;

      if (/^(hi|hello|hey|yo|sup|greetings|good\s*(morning|afternoon|evening))/.test(msg)) {
        return this._pick([
          'Hey there! 👋 I\'m Suraj\'s AI assistant. I can tell you about his skills, projects, experience, or help you connect with him. What would you like to know?',
          'Hello! Welcome to Suraj\'s portfolio. I know everything about his work — from React and Node.js projects to his cloud certifications. Ask me anything!',
          'Hi! Great to have you here. Suraj is a MERN full stack developer with real production experience. What would you like to explore — his projects, skills, or something else?'
        ]);
      }

      if (/who\s*(is|are)|about\s*(suraj|him)|tell\s*me\s*about|introduce|background/.test(msg)) {
        this.context.lastTopic = 'about';
        this.context.askedTopics.add('about');
        return 'Suraj Prajapati is a **' + SURAJ.title + '** based in ' + SURAJ.location + '. He\'s currently working as a ' + SURAJ.role + ', building real-world applications. He specializes in React, Node.js, MongoDB, and cloud platforms like AWS and Firebase. Want to hear about his projects or certifications?';
      }

      if (/skill|tech\s*stack|technologies|what\s*(can|does)\s*he\s*(do|know|use)|stack|expertise/.test(msg)) {
        this.context.lastTopic = 'skills';
        this.context.askedTopics.add('skills');
        var allSkills = Object.entries(SURAJ.skills).map(function (entry) {
          return '**' + entry[0].charAt(0).toUpperCase() + entry[0].slice(1) + '**: ' + entry[1].join(', ');
        }).join('\n');
        return 'Here\'s Suraj\'s full tech stack:\n' + allSkills;
      }

      if (/project|portfolio|work|built|build|created|app|application/.test(msg)) {
        this.context.lastTopic = 'projects';
        this.context.askedTopics.add('projects');
        var projectList = SURAJ.projects.map(function (p) {
          return '• **' + p.name + '**: ' + p.desc + ' (' + p.tech + ')';
        }).join('\n');
        return 'Here are Suraj\'s key projects:\n' + projectList;
      }

      if (/cert|certification|course|training|credential/.test(msg)) {
        this.context.lastTopic = 'certifications';
        this.context.askedTopics.add('certifications');
        var certList = SURAJ.certs.map(function (c) { return '• ' + c; }).join('\n');
        return 'Suraj\'s certifications:\n' + certList;
      }

      if (/hire|hiring|job|position|recruit|opportunity|role/.test(msg)) {
        this.context.lastTopic = 'hiring';
        return 'Great to hear you\'re interested! Suraj is open to opportunities as a **MERN Full Stack Developer**.\n\n📱 WhatsApp (fastest): ' + SURAJ.contact.whatsapp + '\n📧 Email: ' + SURAJ.contact.email;
      }

      if (/contact|email|phone|whatsapp|reach|connect/.test(msg)) {
        this.context.lastTopic = 'contact';
        return 'Here\'s how to reach Suraj:\n\n📱 **WhatsApp** (fastest): ' + SURAJ.contact.whatsapp + '\n📧 **Email**: ' + SURAJ.contact.email + '\n💼 **LinkedIn**: ' + SURAJ.contact.linkedin;
      }

      if (/experience|work\s*history|career|job|employ|company/.test(msg)) {
        this.context.lastTopic = 'experience';
        return 'Suraj is currently a **Web Developer at Seek Unique Productions** (Sep 2025 – Present), building responsive websites for real clients in production.';
      }

      if (/thank|thanks|thx|appreciate/.test(msg)) {
        return 'You\'re welcome! 😊 If you need anything else about Suraj — his skills, projects, or want to connect — just ask!';
      }

      if (/bye|goodbye|see\s*you|later/.test(msg)) {
        return 'Thanks for visiting! Reach out to Suraj anytime at ' + SURAJ.contact.whatsapp + '. Have a great day! 👋';
      }

      return 'I can tell you about Suraj\'s skills, projects, certifications, experience, or help you connect with him. What would you like to know?';
    },

    _pick: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };

  // ==========================================
  // DOM ELEMENTS
  // ==========================================

  const elements = {
    widget: document.getElementById('chatWidget'),
    toggle: document.getElementById('chatToggle'),
    panel: document.getElementById('chatPanel'),
    close: document.getElementById('chatClose'),
    input: document.getElementById('chatInput'),
    send: document.getElementById('chatSend'),
    messages: document.getElementById('chatMessages')
  };

  if (!elements.toggle || !elements.panel || !elements.input || !elements.send || !elements.messages) return;

  // ==========================================
  // STATE
  // ==========================================

  let isProcessing = false;
  const chatHistory = []; // OpenAI-format: { role: 'user'|'assistant', content: '...' }

  // ==========================================
  // PANEL CONTROLS
  // ==========================================

  function setPanelState(open) {
    elements.panel.classList.toggle('active', open);
    elements.panel.setAttribute('aria-hidden', String(!open));
    if (elements.widget) elements.widget.classList.toggle('chat-open', open);
    if (open) elements.input.focus();
  }

  // ==========================================
  // MESSAGE RENDERING
  // ==========================================

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;

    const content = document.createElement('div');
    content.className = 'chat-msg-content';

    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    formatted = formatted.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );

    content.innerHTML = formatted;
    msg.appendChild(content);
    elements.messages.appendChild(msg);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function showTyping() {
    if (document.getElementById('typingIndicator')) return;
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<div class="chat-msg-content"><span></span><span></span><span></span></div>';
    elements.messages.appendChild(typing);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  // ==========================================
  // INTENT DETECTION
  // ==========================================

  function detectIntent(msg) {
    var m = msg.toLowerCase();
    if (/\b(hire|hiring|job|position|recruit|opportunity|role)\b/.test(m)) return 'hiring';
    if (/\b(freelance|collaborate|partner|work together)\b/.test(m)) return 'collaboration';
    if (/\b(meet|call|schedule|meeting|appointment)\b/.test(m)) return 'appointment';
    if (/\b(contact|email|whatsapp|reach|connect)\b/.test(m)) return 'contact';
    return 'general';
  }

  // ==========================================
  // SUGGESTIONS
  // ==========================================

  function showSuggestions(intent) {
    var existing = document.querySelector('.chat-suggestions');
    if (existing) existing.remove();

    var suggestions = {
      hiring: ['What are his core skills?', 'Show me his projects', 'Schedule a call'],
      collaboration: ['His tech stack', 'Show me projects', 'Contact him'],
      appointment: ['His availability', 'Contact info', 'Tell me more'],
      contact: ['His projects', 'Certifications', 'Why hire him?'],
      general: ['His experience', 'Certifications', 'Tech stack']
    };

    var items = suggestions[intent] || suggestions.general;
    var container = document.createElement('div');
    container.className = 'chat-suggestions';

    items.forEach(function (text) {
      var btn = document.createElement('button');
      btn.className = 'chat-suggestion-btn';
      btn.textContent = text;
      btn.addEventListener('click', function () {
        handleUserMessage(text);
        container.remove();
      });
      container.appendChild(btn);
    });

    elements.messages.appendChild(container);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  // ==========================================
  // LLM API CALL (via server proxy)
  // ==========================================

  async function callLLM(userMessage) {
    // Add to history
    chatHistory.push({ role: 'user', content: userMessage });

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 20000);

    try {
      const response = await fetch(`${CONFIG.API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        chatHistory.pop();
        throw new Error('API ' + response.status);
      }

      const data = await response.json();

      if (!data.reply) {
        chatHistory.pop();
        throw new Error('Empty response');
      }

      // Add assistant reply to history
      chatHistory.push({ role: 'assistant', content: data.reply });
      return data.reply;

    } catch (err) {
      clearTimeout(timeoutId);
      // Remove failed user message from history
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
        chatHistory.pop();
      }
      throw err;
    }
  }

  // ==========================================
  // MESSAGE HANDLING (LLM → Fallback)
  // ==========================================

  async function handleUserMessage(text) {
    if (isProcessing) return;
    isProcessing = true;

    var existing = document.querySelector('.chat-suggestions');
    if (existing) existing.remove();

    addMessage(text, 'user');
    showTyping();
    elements.input.disabled = true;
    elements.send.disabled = true;

    var reply = null;

    // Try LLM API first (via server proxy)
    try {
      reply = await callLLM(text);
    } catch (err) {
      console.warn('LLM unavailable, using smart fallback:', err.message);
      reply = null;
    }

    // Fallback: Intelligent Response Engine
    if (!reply) {
      await new Promise(function (r) { setTimeout(r, 400 + Math.random() * 600); });
      reply = ResponseEngine.generate(text);
    }

    hideTyping();
    addMessage(reply, 'bot');

    var intent = detectIntent(text);
    setTimeout(function () { showSuggestions(intent); }, 300);

    isProcessing = false;
    elements.input.disabled = false;
    elements.send.disabled = false;
    elements.input.focus();
  }

  // ==========================================
  // SEND
  // ==========================================

  function sendMessage() {
    var text = elements.input.value.trim();
    if (!text || isProcessing) return;
    handleUserMessage(text);
    elements.input.value = '';
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  elements.toggle.addEventListener('click', function () {
    setPanelState(!elements.panel.classList.contains('active'));
  });

  if (elements.close) {
    elements.close.addEventListener('click', function () { setPanelState(false); });
  }

  document.querySelectorAll('.chat-quick-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-msg');
      var map = {
        hiring: 'I am interested in hiring Suraj for a developer role',
        collab: 'I want to collaborate on a project with Suraj',
        general: 'Tell me about Suraj and his work'
      };
      handleUserMessage(map[key] || btn.textContent.trim());
    });
  });

  elements.send.addEventListener('click', sendMessage);
  elements.input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
  });

})();
