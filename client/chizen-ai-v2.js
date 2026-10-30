/* ═══════════════════════════════════════════════════════════════
   CHIZEN AI v2 — Full-screen ChatGPT-style assistant
   Isolated from chat-widget.js
   Auto-selects best AI model from OpenRouter (4 fallbacks)
   Rollback: remove 2 lines from chizen.html
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ═══ Config ═══
  var OPENROUTER_KEY = ""; // removed for security

  // 4 fallback models — first that works is used
  var MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-1.5-flash-8b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free"
  ];

  var SYSTEM_PROMPT = "أنت مساعد ذكي لمتجر CHIZEN اليمني. مهمتك فقط الإجابة على أسئلة العملاء المتعلقة بالمتجر (منتجات، أقسام، أسعار، دفع، توصيل، تتبع طلبات). إذا سألك المستخدم أي سؤال خارجي، اعتذر بلطف وقل: 'أنا مساعد شيزن، وأقدر أساعدك فقط في كل ما يتعلق بتسوقك من تطبيقنا الحبيب.' ولا تجب على أي سؤال خارجي مهما حدث. تحدث بلهجة ودودة ومختصرة.";

  var WHATSAPP_NUMBER = "967771234567";
  var HISTORY_KEY = "chizen_ai_v2_history";
  var LANG_KEY = "chizen_ai_v2_lang";

  // ═══ State ═══
  var state = {
    overlay: null,
    messages: null,
    input: null,
    sendBtn: null,
    lang: 'ar',
    isTyping: false,
    history: [],
    currentModel: null,
    lastModelCheck: 0
  };

  var TEXTS = {
    ar: {
      title: 'CHIZEN AI',
      status: 'متصل · ذكاء اصطناعي',
      placeholder: 'اكتب رسالتك...',
      welcomeTitle: 'أهلاً بك في CHIZEN AI',
      welcomeSub: 'مساعدك الذكي للتسوق من شيزن',
      suggestionsTitle: '💡 جرب أحد هذه:',
      modelBadge: 'AI · Powered by CHIZEN',
      suggestions: [
        { icon: '🔍', text: 'اعرض لي أفضل العطور' },
        { icon: '🎁', text: 'ساعدني أختار هدية' },
        { icon: '💰', text: 'ما هي أفضل صفقة اليوم؟' },
        { icon: '📦', text: 'كيف أتتبع طلبي؟' }
      ]
    },
    en: {
      title: 'CHIZEN AI',
      status: 'Online · AI Assistant',
      placeholder: 'Type your message...',
      welcomeTitle: 'Welcome to CHIZEN AI',
      welcomeSub: 'Your smart shopping assistant',
      suggestionsTitle: '💡 Try one of these:',
      modelBadge: 'AI · Powered by CHIZEN',
      suggestions: [
        { icon: '🔍', text: 'Show me best perfumes' },
        { icon: '🎁', text: 'Help me pick a gift' },
        { icon: '💰', text: 'Best deal today?' },
        { icon: '📦', text: 'How to track my order?' }
      ]
    }
  };

  function t() { return TEXTS[state.lang]; }

  // ═══ Markdown renderer (light) ═══
  function renderMarkdown(text) {
    if (!text) return '';
    var esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    esc = esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    esc = esc.replace(/\*(.+?)\*/g, '<i>$1</i>');
    esc = esc.replace(/`([^`]+)`/g, '<code>$1</code>');
    esc = esc.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    esc = esc.replace(/\n/g, '<br>');
    return esc;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ═══ History persistence ═══
  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      state.history = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(state.history)) state.history = [];
    } catch (e) { state.history = []; }
  }

  function saveHistory() {
    try {
      var keep = state.history.slice(-40);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(keep));
    } catch (e) {}
  }

  // ═══ Build UI ═══
  function buildOverlay() {
    if (state.overlay) return;

    var overlay = document.createElement('div');
    overlay.className = 'v2-overlay';
    overlay.innerHTML =
      '<div class="v2-header">' +
        '<div class="v2-avatar"><svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="padding:4px;"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M15 9C14.2 8.3 13.1 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C13.1 16 14.2 15.7 15 15"/><path d="M17 4L18 7L21 8L18 9L17 12L16 9L13 8L16 7L17 4Z" fill="currentColor"/></svg></div>' +
        '<div class="v2-header-info">' +
          '<div class="v2-name">' + esc(t().title) + '</div>' +
          '<div class="v2-status" id="v2-status">' + esc(t().status) + '</div>' +
        '</div>' +
        '<div class="v2-hdr-actions">' +
          '<button class="v2-hdr-btn" id="v2-lang-btn" title="Language">' +
            (state.lang === 'ar' ? 'EN' : 'ع') +
          '</button>' +
          '<button class="v2-hdr-btn" id="v2-wa-btn" title="WhatsApp">📱</button>' +
          '<button class="v2-hdr-btn" id="v2-close-btn" title="Close">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="v2-messages" id="v2-messages"></div>' +
      '<div class="v2-input-area">' +
        '<div class="v2-input-wrap">' +
          '<textarea class="v2-textarea" id="v2-input" rows="1" placeholder="' + esc(t().placeholder) + '"></textarea>' +
          '<button class="v2-send-btn" id="v2-send" title="Send">' +
            '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="v2-footer-badge">' + esc(t().modelBadge) + '</div>';

    document.body.appendChild(overlay);

    state.overlay = overlay;
    state.messages = overlay.querySelector('#v2-messages');
    state.input = overlay.querySelector('#v2-input');
    state.sendBtn = overlay.querySelector('#v2-send');

    overlay.querySelector('#v2-close-btn').onclick = close;
    overlay.querySelector('#v2-wa-btn').onclick = openWhatsApp;
    overlay.querySelector('#v2-lang-btn').onclick = toggleLang;
    state.sendBtn.onclick = sendMessage;
    state.input.onkeydown = function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
    state.input.oninput = function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    };
  }

  // ═══ Render initial state ═══
  function renderInitial() {
    if (!state.messages) return;

    // If history exists, render it
    if (state.history.length > 0) {
      state.messages.innerHTML = '';
      state.history.forEach(function (msg) {
        if (msg.role === 'user') addBubble('user', msg.content, true);
        else addBubble('bot', msg.content, true);
      });
      scrollBottom();
      return;
    }

    // Welcome + suggestions
    var html = '';
    html += '<div class="v2-welcome">';
    html +=   '<div class="v2-welcome-avatar"><svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="padding:4px;"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M15 9C14.2 8.3 13.1 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C13.1 16 14.2 15.7 15 15"/><path d="M17 4L18 7L21 8L18 9L17 12L16 9L13 8L16 7L17 4Z" fill="currentColor"/></svg></div>';
    html +=   '<div class="v2-welcome-title">' + esc(t().welcomeTitle) + '</div>';
    html +=   '<div class="v2-welcome-sub">' + esc(t().welcomeSub) + '</div>';
    html += '</div>';
    html += '<div class="v2-sugg-title" style="padding:0 16px;">' + esc(t().suggestionsTitle) + '</div>';
    html += '<div class="v2-suggestions" style="padding:0 16px;">';
    t().suggestions.forEach(function (s, i) {
      html += '<button class="v2-sugg-card" data-sugg="' + i + '">' +
        '<span class="v2-sugg-icon">' + s.icon + '</span>' +
        '<span class="v2-sugg-text">' + esc(s.text) + '</span>' +
        '<span class="v2-sugg-arrow">←</span>' +
      '</button>';
    });
    html += '</div>';

    state.messages.innerHTML = html;

    state.messages.querySelectorAll('[data-sugg]').forEach(function (btn) {
      btn.onclick = function () {
        var idx = parseInt(this.getAttribute('data-sugg'), 10);
        var s = t().suggestions[idx];
        if (!s) return;
        state.input.value = s.text;
        sendMessage();
      };
    });
  }

  // ═══ Add bubble ═══
  function addBubble(role, content, noSave) {
    if (!state.messages) return;

    // Clear welcome if first real message
    var welcome = state.messages.querySelector('.v2-welcome');
    if (welcome) state.messages.innerHTML = '';

    var row = document.createElement('div');
    row.className = 'v2-msg-row ' + role;

    var avatar = document.createElement('div');
    avatar.className = 'v2-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    var bubble = document.createElement('div');
    bubble.className = 'v2-bubble';
    if (role === 'bot') bubble.innerHTML = renderMarkdown(content);
    else bubble.textContent = content;

    var time = document.createElement('span');
    time.className = 'v2-bubble-time';
    time.textContent = new Date().toLocaleTimeString(state.lang === 'ar' ? 'ar-YE' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    bubble.appendChild(time);

    row.appendChild(avatar);
    row.appendChild(bubble);
    state.messages.appendChild(row);

    if (!noSave) {
      state.history.push({ role: role, content: content });
      saveHistory();
    }

    scrollBottom();
  }

  function scrollBottom() {
    if (!state.messages) return;
    setTimeout(function () {
      state.messages.scrollTop = state.messages.scrollHeight;
    }, 50);
  }

  // ═══ Typing indicator ═══
  var typingEl = null;
  function showTyping() {
    if (!state.messages || typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'v2-msg-row bot';
    typingEl.innerHTML =
      '<div class="v2-msg-avatar"><svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="padding:4px;"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M15 9C14.2 8.3 13.1 8 12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C13.1 16 14.2 15.7 15 15"/><path d="M17 4L18 7L21 8L18 9L17 12L16 9L13 8L16 7L17 4Z" fill="currentColor"/></svg></div>' +
      '<div class="v2-bubble"><div class="v2-typing"><span></span><span></span><span></span></div></div>';
    state.messages.appendChild(typingEl);
    scrollBottom();
  }

  function hideTyping() {
    if (typingEl) {
      typingEl.remove();
      typingEl = null;
    }
  }

  // ═══ AI call with 4-model fallback ═══
  async function callAI(userMessage, context) {
      try {
        var res = await fetch("https://chizen-ai.hazimchat.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: (function(){
              var arr = [{ role: "system", content: SYSTEM_PROMPT }];
              if (context) arr.push({ role: "system", content: "[نتائج البحث من المتجر]\n" + context });
              arr.push({ role: "user", content: userMessage });
              return arr;
            })()
          })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        // إنشاء فقاعة الرسالة
        var msgsContainer = document.querySelector(".v2-messages") || document.getElementById("v2-messages");
        var botMsgDiv = document.createElement("div");
        botMsgDiv.className = "v2-msg v2-msg-bot";
        var textDiv = document.createElement("div");
        textDiv.className = "v2-msg-text";
        botMsgDiv.appendChild(textDiv);
        if (msgsContainer) {
            msgsContainer.appendChild(botMsgDiv);
            msgsContainer.scrollTop = msgsContainer.scrollHeight;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullText = "";
        let buffer = "";
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); // احتفظ بالجزء غير المكتمل
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts) {
                  const text = parsed.candidates[0].content.parts[0].text;
                  if (text) {
                    fullText += text;
                    textDiv.innerHTML = fullText.replace(/\n/g, "<br>");
                    if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
                  }
                }
              } catch(e) {}
            }
          }
        }
        return fullText;
      } catch (e) {
        console.error("AI Error:", e);
        return null;
      }
    }

  // ═══ Send ═══
  async function sendMessage() {
    if (!state.input || state.isTyping) return;
    var text = state.input.value.trim();
    if (!text) return;

    state.input.value = '';
    state.input.style.height = 'auto';
    addBubble('user', text);
    showTyping();

    state.isTyping = true;
    try {
      var context = "";
      if (typeof window.__chizenSmartSearch === "function") {
        try { context = window.__chizenSmartSearch(text) || ""; } catch(e){ console.warn("[v343]", e); }
      }
      var reply = await callAI(text, context);
      hideTyping();
      addBubble('bot', reply);
    } catch (e) {
      hideTyping();
      addBubble('bot', 'عذراً، حدث خطأ: ' + (e.message || 'unknown'));
    }
    state.isTyping = false;
  }

  // ═══ Open / Close ═══
  function open() {
    buildOverlay();
    renderInitial();
    state.overlay.classList.add('open');
    setTimeout(function () {
      if (state.input) state.input.focus();
    }, 350);
  }

  function close() {
    if (state.overlay) state.overlay.classList.remove('open');
  }

  // ═══ Language toggle ═══
  function toggleLang() {
    state.lang = state.lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem(LANG_KEY, state.lang); } catch (e) {}
    if (state.overlay) {
      state.overlay.querySelector('.v2-name').textContent = t().title;
      state.overlay.querySelector('#v2-status').textContent = t().status;
      state.overlay.querySelector('#v2-input').placeholder = t().placeholder;
      state.overlay.querySelector('.v2-footer-badge').textContent = t().modelBadge;
      state.overlay.querySelector('#v2-lang-btn').textContent = state.lang === 'ar' ? 'EN' : 'ع';
      state.history = [];
      saveHistory();
      renderInitial();
    }
  }

  // ═══ WhatsApp ═══
  function openWhatsApp() {
    var phone = WHATSAPP_NUMBER;
    try {
      var c = JSON.parse(localStorage.getItem('chizen_contact') || '{}');
      if (c.whatsapp) phone = c.whatsapp.replace(/\D/g, '');
    } catch (e) {}
    window.open('https://wa.me/' + phone, '_blank');
  }

  // ═══ FAB ═══
  function buildFab() {
    if (document.getElementById('v2-fab')) return;
    var fab = document.createElement('button');
    fab.id = 'v2-fab';
    fab.className = 'v2-fab';
    fab.innerHTML = '🤖';
    fab.onclick = open;
    document.body.appendChild(fab);
  }

  // ═══ Init ═══
  function init() {
    try { var saved = localStorage.getItem(LANG_KEY); if (saved === 'ar' || saved === 'en') state.lang = saved; } catch (e) {}
    loadHistory();
    buildFab();
    console.log('[v2-ai] ready · lang:', state.lang, '· history:', state.history.length);
  }

  // ═══ Expose API (compatible with old ChizenChat) ═══
  window.ChizenChatV2 = {
    open: open,
    close: close,
    toggleLang: toggleLang,
    clearHistory: function () {
      state.history = [];
      saveHistory();
      renderInitial();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
