/* ═══════════════════════════════════════════════════════════
   ADSCALE DEMO CHAT — Medspa-Themed Chatbot Widget
   Self-contained: HTML + CSS + JS in one file
   Connects to n8n webhook for AI responses
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────────── */
  const CONFIG = {
    webhookUrl: 'https://n8n.srv1388391.hstgr.cloud/webhook/4631eaba-5808-401f-854b-4996951eefea/chat',
    companyName: 'AI Front Desk',
    tagline: 'Med Spa Demo',
    welcomeMessage: "Hi! I'm an AI receptionist demo for med spas. Ask me about Botox, fillers, pricing, or booking — I'll show you exactly how the AI handles real client conversations.",
    placeholderText: 'Ask about Botox, fillers, booking...',
    primaryColor: '#C8FF00',
    primaryGlow: 'rgba(200,255,0,0.25)',
    bgDark: '#0A0A0A',
    bgPanel: '#111111',
    bgCard: '#1A1A1A',
    border: '#2A2A2A',
    borderLight: '#3A3A3A',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    fontBody: "'DM Sans', sans-serif",
    fontHeading: "'Bebas Neue', cursive",
    fontMono: "'Space Mono', monospace",
    borderRadius: '0px',
    windowWidth: '400px',
    windowHeight: '580px',
  };

  /* ── SESSION ID (persists per tab) ───────────────────────── */
  let sessionId = sessionStorage.getItem('adscale-demo-session');
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : 'sess-' + Math.random().toString(36).slice(2);
    sessionStorage.setItem('adscale-demo-session', sessionId);
  }

  /* ── INJECT STYLES ───────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* === ADSCALE DEMO CHAT WIDGET === */
    #adscale-chat *,#adscale-chat *::before,#adscale-chat *::after{box-sizing:border-box;margin:0;padding:0}

    /* Toggle button */
    #adscale-chat-toggle{
      position:fixed;bottom:24px;right:24px;z-index:9980;
      width:60px;height:60px;border-radius:0;border:1px solid ${CONFIG.border};cursor:pointer;
      background:${CONFIG.bgDark};
      box-shadow:0 4px 24px rgba(0,0,0,0.4), 0 0 0 0 ${CONFIG.primaryGlow};
      transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
      display:flex;align-items:center;justify-content:center;
      animation:adscale-pulse 3s ease-in-out infinite;
      overflow:hidden;
      position:fixed;
    }
    #adscale-chat-toggle::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(200,255,0,0.1),transparent);
      transform:translateX(-100%);transition:transform 0.5s;
    }
    #adscale-chat-toggle:hover::before{transform:translateX(100%)}
    #adscale-chat-toggle:hover{
      transform:scale(1.05);
      border-color:${CONFIG.primaryColor};
      box-shadow:0 0 30px ${CONFIG.primaryGlow};
    }
    #adscale-chat-toggle svg{width:26px;height:26px;fill:${CONFIG.primaryColor};transition:transform 0.3s;position:relative;z-index:1}
    #adscale-chat-toggle.open svg{transform:rotate(90deg)}
    @keyframes adscale-pulse{
      0%,100%{box-shadow:0 4px 24px rgba(0,0,0,0.4), 0 0 0 0 ${CONFIG.primaryGlow}}
      50%{box-shadow:0 4px 24px rgba(0,0,0,0.4), 0 0 0 6px rgba(200,255,0,0)}
    }

    /* Demo badge on toggle */
    #adscale-chat-toggle::after{
      content:'DEMO';position:absolute;top:-1px;right:-1px;
      font-family:${CONFIG.fontMono};font-size:7px;letter-spacing:0.1em;
      background:${CONFIG.primaryColor};color:${CONFIG.bgDark};
      padding:2px 5px;font-weight:700;
    }

    /* Chat window */
    #adscale-chat-window{
      position:fixed;bottom:96px;right:24px;z-index:9981;
      width:${CONFIG.windowWidth};height:${CONFIG.windowHeight};max-height:calc(100vh - 120px);
      background:${CONFIG.bgPanel};
      border:1px solid ${CONFIG.border};
      border-radius:${CONFIG.borderRadius};
      box-shadow:0 24px 80px rgba(0,0,0,0.6), 0 0 20px ${CONFIG.primaryGlow};
      display:flex;flex-direction:column;
      opacity:0;visibility:hidden;
      transform-origin:bottom right;
      transform:scale(0.3);
      transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
      overflow:hidden;
      font-family:${CONFIG.fontBody};
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }
    #adscale-chat-window.visible{
      opacity:1;visibility:visible;
      transform:scale(1);
    }

    /* Ripple ring on toggle click */
    .adscale-ripple-ring{
      position:absolute;inset:0;
      border:2px solid ${CONFIG.primaryColor};
      pointer-events:none;
      opacity:0;
    }
    #adscale-chat-toggle.ripple .adscale-ripple-ring{
      animation:adscale-ripple 0.5s ease-out forwards;
    }
    @keyframes adscale-ripple{
      0%{transform:scale(1);opacity:0.6;}
      100%{transform:scale(2.5);opacity:0;}
    }

    /* Header */
    .adscale-chat-header{
      display:flex;align-items:center;gap:12px;
      padding:14px 18px;
      background:${CONFIG.bgDark};
      border-bottom:1px solid ${CONFIG.border};
      border-top:2px solid ${CONFIG.primaryColor};
      flex-shrink:0;
    }
    .adscale-chat-header-icon{
      width:36px;height:36px;
      border:1px solid ${CONFIG.border};
      display:flex;align-items:center;justify-content:center;
      background:${CONFIG.bgCard};
      flex-shrink:0;
    }
    .adscale-chat-header-icon span{
      font-family:${CONFIG.fontHeading};
      font-size:16px;color:${CONFIG.primaryColor};letter-spacing:0.02em;
    }
    .adscale-chat-header-info{display:flex;flex-direction:column}
    .adscale-chat-header-name{
      font-family:${CONFIG.fontHeading};
      font-size:16px;font-weight:700;letter-spacing:1px;
      color:${CONFIG.textPrimary};text-transform:uppercase;
    }
    .adscale-chat-header-status{
      font-size:10px;color:${CONFIG.primaryColor};
      font-family:${CONFIG.fontMono};
      letter-spacing:0.08em;text-transform:uppercase;
      display:flex;align-items:center;gap:5px;
    }
    .adscale-chat-header-status::before{
      content:'';width:5px;height:5px;border-radius:50%;
      background:${CONFIG.primaryColor};
      box-shadow:0 0 6px ${CONFIG.primaryGlow};
    }
    .adscale-chat-close{
      margin-left:auto;background:none;border:1px solid transparent;cursor:pointer;
      color:${CONFIG.textSecondary};transition:all 0.25s;
      display:flex;align-items:center;justify-content:center;
      width:32px;height:32px;
    }
    .adscale-chat-close:hover{color:${CONFIG.primaryColor};background:${CONFIG.bgCard};border-color:${CONFIG.border}}
    .adscale-chat-close svg{width:18px;height:18px}

    /* Messages area */
    .adscale-chat-messages{
      flex:1;overflow-y:auto;padding:16px 18px;
      display:flex;flex-direction:column;gap:12px;
      scrollbar-width:thin;
      scrollbar-color:${CONFIG.border} transparent;
    }
    .adscale-chat-messages::-webkit-scrollbar{width:4px}
    .adscale-chat-messages::-webkit-scrollbar-track{background:transparent}
    .adscale-chat-messages::-webkit-scrollbar-thumb{background:${CONFIG.border}}
    .adscale-chat-messages::-webkit-scrollbar-thumb:hover{background:${CONFIG.primaryColor}}

    /* Message bubbles */
    .adscale-msg{
      max-width:82%;padding:12px 16px;
      font-size:14px;line-height:1.65;
      animation:adscale-msg-in 0.3s cubic-bezier(0.16,1,0.3,1);
      word-wrap:break-word;
    }
    @keyframes adscale-msg-in{
      from{opacity:0;transform:translateY(8px)}
      to{opacity:1;transform:translateY(0)}
    }
    .adscale-msg.bot{
      align-self:flex-start;
      background:${CONFIG.bgCard};
      color:${CONFIG.textSecondary};
      border:1px solid ${CONFIG.border};
      border-radius:0 6px 6px 6px;
    }
    .adscale-msg.user{
      align-self:flex-end;
      background:${CONFIG.primaryColor};
      color:${CONFIG.bgDark};
      border-radius:6px 0 6px 6px;
      font-weight:500;
    }
    .adscale-msg.bot a{color:${CONFIG.primaryColor};text-decoration:underline;text-underline-offset:2px}

    /* Welcome message */
    .adscale-welcome{
      display:flex;flex-direction:column;align-items:center;
      text-align:center;padding:20px 12px 8px;gap:10px;
    }
    .adscale-welcome-icon{
      width:48px;height:48px;
      background:${CONFIG.bgCard};border:1px solid ${CONFIG.border};
      display:flex;align-items:center;justify-content:center;
    }
    .adscale-welcome-icon span{
      font-family:${CONFIG.fontHeading};font-size:20px;color:${CONFIG.primaryColor};
    }
    .adscale-welcome-text{font-size:14px;line-height:1.65;color:${CONFIG.textSecondary};max-width:90%}
    .adscale-welcome-demo{
      font-family:${CONFIG.fontMono};font-size:9px;letter-spacing:0.1em;
      text-transform:uppercase;color:${CONFIG.primaryColor};
      border:1px solid ${CONFIG.border};padding:4px 10px;margin-top:4px;
    }

    /* Typing indicator */
    .adscale-typing{
      display:flex;align-items:center;gap:4px;
      align-self:flex-start;
      padding:14px 20px;
      background:${CONFIG.bgCard};
      border:1px solid ${CONFIG.border};
      border-radius:0 6px 6px 6px;
    }
    .adscale-typing span{
      width:6px;height:6px;border-radius:50%;
      background:${CONFIG.textSecondary};
      animation:adscale-dot 1.4s ease-in-out infinite;
    }
    .adscale-typing span:nth-child(2){animation-delay:0.15s}
    .adscale-typing span:nth-child(3){animation-delay:0.3s}
    @keyframes adscale-dot{
      0%,60%,100%{transform:translateY(0);opacity:0.4}
      30%{transform:translateY(-5px);opacity:1;background:${CONFIG.primaryColor}}
    }

    /* Input area */
    .adscale-chat-input{
      display:flex;align-items:flex-end;gap:8px;
      padding:12px 16px;
      border-top:1px solid ${CONFIG.border};
      background:${CONFIG.bgDark};
      flex-shrink:0;
    }
    .adscale-chat-input textarea{
      flex:1;resize:none;border:none;outline:none;
      background:${CONFIG.bgCard};
      color:${CONFIG.textPrimary};
      font-family:${CONFIG.fontBody};
      font-size:14px;line-height:1.5;
      padding:10px 14px;
      border-radius:0;
      border:1px solid ${CONFIG.border};
      max-height:100px;
      transition:border-color 0.2s, box-shadow 0.2s;
    }
    .adscale-chat-input textarea::placeholder{color:${CONFIG.textSecondary};opacity:0.6}
    .adscale-chat-input textarea:focus{
      border-color:${CONFIG.primaryColor};
      box-shadow:0 0 12px ${CONFIG.primaryGlow};
    }
    .adscale-chat-send{
      width:40px;height:40px;border-radius:0;border:1px solid ${CONFIG.primaryColor};cursor:pointer;
      background:${CONFIG.bgDark};
      display:flex;align-items:center;justify-content:center;
      transition:all 0.25s;flex-shrink:0;
      position:relative;overflow:hidden;
    }
    .adscale-chat-send::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(200,255,0,0.15),transparent);
      transform:translateX(-100%);transition:transform 0.5s;
    }
    .adscale-chat-send:hover::before{transform:translateX(100%)}
    .adscale-chat-send:hover{
      background:${CONFIG.primaryColor};
      box-shadow:0 0 20px ${CONFIG.primaryGlow};
    }
    .adscale-chat-send:hover svg{fill:${CONFIG.bgDark}}
    .adscale-chat-send:disabled{opacity:0.4;cursor:not-allowed}
    .adscale-chat-send svg{width:18px;height:18px;fill:${CONFIG.primaryColor};transition:fill 0.25s}

    /* Quick actions */
    .adscale-quick-actions{
      display:flex;flex-wrap:wrap;gap:6px;
      padding:0 18px 12px;
    }
    .adscale-quick-btn{
      background:${CONFIG.bgCard};color:${CONFIG.textSecondary};
      border:1px solid ${CONFIG.border};border-radius:0;
      padding:6px 14px;font-size:10px;
      font-family:${CONFIG.fontMono};font-weight:400;
      text-transform:uppercase;letter-spacing:0.08em;
      cursor:pointer;transition:all 0.25s;white-space:nowrap;
    }
    .adscale-quick-btn:hover{
      border-color:${CONFIG.primaryColor};color:${CONFIG.primaryColor};
      transform:translateY(-2px);
      box-shadow:0 4px 16px ${CONFIG.primaryGlow};
    }

    /* Powered by footer */
    .adscale-chat-footer{
      text-align:center;padding:6px;font-size:9px;
      font-family:${CONFIG.fontMono};
      text-transform:uppercase;letter-spacing:0.1em;
      color:${CONFIG.textSecondary};opacity:0.4;
      border-top:1px solid ${CONFIG.border};
      background:${CONFIG.bgDark};flex-shrink:0;
    }
    .adscale-chat-footer a{color:${CONFIG.primaryColor};text-decoration:none;opacity:1}

    /* Match site's custom cursor behavior */
    @media(pointer:fine){#adscale-chat button{cursor:none}}
    @media(max-width:768px){#adscale-chat button{cursor:pointer}}

    /* Respect reduced motion */
    @media(prefers-reduced-motion:reduce){
      #adscale-chat-toggle{animation:none!important}
      #adscale-chat-window{transition:opacity 0.2s!important;transform:none!important}
      .adscale-msg{animation:none!important}
      .adscale-typing span{animation:none!important;opacity:0.6}
      .adscale-ripple-ring{animation:none!important}
    }

    /* Mobile responsive */
    @media(max-width:768px){
      #adscale-chat-toggle{bottom:16px;right:16px;width:54px;height:54px}
      #adscale-chat-window{
        bottom:0;right:0;left:0;
        width:100%;height:100vh;max-height:100vh;
        border-radius:0;
      }
    }
  `;
  document.head.appendChild(style);

  /* ── BUILD DOM ───────────────────────────────────────────── */
  const root = document.createElement('div');
  root.id = 'adscale-chat';
  root.innerHTML = `
    <!-- Toggle Button -->
    <button id="adscale-chat-toggle" aria-label="Try our chatbot demo">
      <div class="adscale-ripple-ring"></div>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
        <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
      </svg>
    </button>

    <!-- Chat Window -->
    <div id="adscale-chat-window">
      <div class="adscale-chat-header">
        <div class="adscale-chat-header-icon"><span>G</span></div>
        <div class="adscale-chat-header-info">
          <span class="adscale-chat-header-name">${CONFIG.companyName}</span>
          <span class="adscale-chat-header-status">${CONFIG.tagline}</span>
        </div>
        <button class="adscale-chat-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="adscale-chat-messages" id="adscale-chat-messages">
        <div class="adscale-welcome">
          <div class="adscale-welcome-icon"><span>G</span></div>
          <div class="adscale-welcome-text">${CONFIG.welcomeMessage}</div>
          <div class="adscale-welcome-demo">This is a live demo — try it</div>
        </div>
      </div>

      <div class="adscale-quick-actions" id="adscale-quick-actions">
        <button class="adscale-quick-btn" data-msg="How much does Botox cost?">Botox Info</button>
        <button class="adscale-quick-btn" data-msg="I'd like to book a consultation">Book Consultation</button>
        <button class="adscale-quick-btn" data-msg="What filler options do you have and what's the pricing?">Filler Pricing</button>
        <button class="adscale-quick-btn" data-msg="What treatments do you offer?">All Treatments</button>
      </div>

      <div class="adscale-chat-input">
        <textarea id="adscale-chat-textarea" rows="1" placeholder="${CONFIG.placeholderText}"></textarea>
        <button class="adscale-chat-send" id="adscale-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <div class="adscale-chat-footer">Powered by <a href="#contact">AdScale Labs</a></div>
    </div>
  `;
  document.body.appendChild(root);

  /* ── ELEMENTS ────────────────────────────────────────────── */
  const toggle = document.getElementById('adscale-chat-toggle');
  const chatWindow = document.getElementById('adscale-chat-window');
  const messagesEl = document.getElementById('adscale-chat-messages');
  const textarea = document.getElementById('adscale-chat-textarea');
  const sendBtn = document.getElementById('adscale-chat-send');
  const quickActions = document.getElementById('adscale-quick-actions');
  const closeBtn = root.querySelector('.adscale-chat-close');

  let isOpen = false;
  let isLoading = false;

  /* ── TOGGLE OPEN / CLOSE ────────────────────────────────── */
  function openChat() {
    isOpen = true;
    toggle.classList.add('ripple');
    setTimeout(() => toggle.classList.remove('ripple'), 500);
    chatWindow.classList.add('visible');
    toggle.classList.add('open');
    toggle.style.animation = 'none';
    setTimeout(() => textarea.focus(), 400);
  }
  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('visible');
    toggle.classList.remove('open');
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* ── AUTO-RESIZE TEXTAREA ────────────────────────────────── */
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  });

  /* ── SCROLL TO BOTTOM ────────────────────────────────────── */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  /* ── ADD MESSAGE BUBBLE ──────────────────────────────────── */
  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = 'adscale-msg ' + sender;
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  /* ── TYPING INDICATOR ────────────────────────────────────── */
  function showTyping() {
    const el = document.createElement('div');
    el.className = 'adscale-typing';
    el.id = 'adscale-typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    scrollToBottom();
  }
  function hideTyping() {
    const el = document.getElementById('adscale-typing-indicator');
    if (el) el.remove();
  }

  /* ── SEND MESSAGE TO N8N WEBHOOK ─────────────────────────── */
  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;

    // Hide quick actions after first message
    if (quickActions) quickActions.style.display = 'none';

    addMessage(text.trim(), 'user');
    textarea.value = '';
    textarea.style.height = 'auto';

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          chatInput: text.trim(),
          sessionId: sessionId,
        }),
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();

      hideTyping();

      const reply = data.output || data.text || data.response || data.message || 'Sorry, I could not process that. Please try again.';
      addMessage(reply, 'bot');
    } catch (err) {
      hideTyping();
      addMessage('This demo is temporarily unavailable. Contact timasjablonskis@gmail.com to see it in action.', 'bot');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      textarea.focus();
    }
  }

  /* ── EVENT LISTENERS ────────────────────────────────────── */
  sendBtn.addEventListener('click', () => sendMessage(textarea.value));

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(textarea.value);
    }
  });

  // Quick action buttons
  quickActions.addEventListener('click', (e) => {
    const btn = e.target.closest('.adscale-quick-btn');
    if (btn) sendMessage(btn.dataset.msg);
  });

  // Register with site cursor if present
  if (window.matchMedia('(pointer: fine)').matches) {
    root.querySelectorAll('button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

})();
