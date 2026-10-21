/* ═══ CHIZEN Chat Widget — Standalone (No Blaze Required) ═══ */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '967771234567';

  const QUICK_REPLIES = {
    ar: [
      { keys: ['سعر', 'أسعار', 'بكم', 'كم سعر'], text: 'الأسعار على كل منتج. اضغط على المنتج لرؤيتها 💰' },
      { keys: ['مرحبا', 'أهلاً', 'السلام', 'هلا'], text: 'أهلاً وسهلاً! 👋 كيف أساعدك؟' },
      { keys: ['شكرا', 'شكراً'], text: 'العفو! 🌸' },
      { keys: ['كوبون', 'خصم', 'كود'], text: 'اطلب كود ترحيب من "🎁 كود ترحيب" — خصم 15%' }
    ],
    en: [
      { keys: ['price', 'cost', 'how much'], text: 'Prices on each product 💰' },
      { keys: ['hi', 'hello', 'hey'], text: 'Welcome! 👋' },
      { keys: ['thanks', 'thank'], text: 'You are welcome! 🌸' },
      { keys: ['coupon', 'discount'], text: 'Get a 15% code from "🎁 Welcome Code"' }
    ]
  };

  const FAQ = {
    ar: [
      { a: 'من الرئيسية → "طلباتي" → حالة كل طلب.', tags: ['طلب', 'تتبع', 'طلبي', 'وصل'] },
      { a: 'داخل عدن: 1-2 أيام.\nخارج عدن: 3-5 أيام.', tags: ['متى', 'توصيل', 'وقت', 'يوصل'] },
      { a: 'حوالة بنكية أو دفع عند التسليم.', tags: ['دفع', 'بنك', 'حوالة', 'كاش'] },
      { a: 'خلال 7 أيام من الاستلام بحالة أصلية.', tags: ['إرجاع', 'استبدال', 'مرتجع'] },
      { a: 'نقطة لكل 10 ريال. 100 = 10 ريال.', tags: ['نقاط', 'ولاء'] },
      { a: 'عدن، تعز، صنعاء، الحديدة، إب.', tags: ['نقطة', 'تسليم', 'استلام'] },
      { a: 'شحن مجاني فوق 200 ريال.', tags: ['شحن', 'مجاني'] },
      { a: 'زر الواتساب الأخضر أعلى المحادثة.', tags: ['تواصل', 'واتساب'] }
    ],
    en: [
      { a: 'Home → My Orders → status.', tags: ['track', 'order'] },
      { a: 'Inside Aden: 1-2 days.\nOutside: 3-5 days.', tags: ['when', 'delivery'] },
      { a: 'Bank transfer or cash on delivery.', tags: ['payment', 'pay'] },
      { a: 'Within 7 days in original condition.', tags: ['return'] },
      { a: '1 point per 10 SAR. 100 = 10 SAR.', tags: ['points'] },
      { a: 'Aden, Taiz, Sanaa, Hodeidah, Ibb.', tags: ['pickup'] },
      { a: 'Free for orders above 200 SAR.', tags: ['shipping'] },
      { a: 'Green WhatsApp button at top.', tags: ['contact'] }
    ]
  };

  const UI_TEXT = {
    ar: {
      title: 'مساعد شيزن', subtitle: 'متصل · رد فوري',
      inputPlaceholder: 'اكتب سؤالك...',
      welcomeTitle: '👋 أهلاً بك في CHIZEN',
      welcomeSub: 'اختر ما تحتاجه:',
      optAI: 'اسأل سؤالاً', optSupport: 'فريق الدعم',
      optDelivery: 'حجز توصيل', optCoupon: 'كود ترحيب',
      selectOrder: 'اختر الطلب', selectDay: 'اختر اليوم', selectTime: 'اختر الوقت',
      slots: { morning: 'صباحاً (9-12)', noon: 'ظهراً (12-3)', afternoon: 'عصراً (3-6)', evening: 'مساءً (6-9)' },
      days: { today: 'اليوم', tomorrow: 'غداً', after: 'بعد غد' },
      confirm: 'تأكيد', loading: 'جاري التحميل...',
      couponIssued: 'كوبون الترحيب الخاص بك', couponHint: 'خصم 15% — صالح 30 يوماً',
      errorNoOrder: 'لا توجد طلبات',
      errorGeneric: 'اختر الطلب واليوم والوقت',
      copied: 'تم النسخ ✓',
      aiBusy: 'لم أفهم سؤالك. جرب: "تتبع طلبي" أو "متى يوصل" أو تواصل واتساب 📱',
      slotBooked: '✅ تم تسجيل موعد التوصيل',
      slotFail: 'فشل الحجز — جرب لاحقاً',
      alreadyCoupon: 'لديك كوبون ترحيب مسبقاً 🎁',
      couponFail: 'فشل إنشاء الكوبون',
      loginFirst: 'سجل الدخول أولاً'
    },
    en: {
      title: 'CHIZEN Assistant', subtitle: 'Online · Instant reply',
      inputPlaceholder: 'Type your question...',
      welcomeTitle: '👋 Welcome to CHIZEN',
      welcomeSub: 'Choose:',
      optAI: 'Ask a question', optSupport: 'Support',
      optDelivery: 'Schedule', optCoupon: 'Welcome Code',
      selectOrder: 'Order', selectDay: 'Day', selectTime: 'Time',
      slots: { morning: 'Morning (9-12)', noon: 'Noon (12-3)', afternoon: 'Afternoon (3-6)', evening: 'Evening (6-9)' },
      days: { today: 'Today', tomorrow: 'Tomorrow', after: 'Day After' },
      confirm: 'Confirm', loading: 'Loading...',
      couponIssued: 'Your welcome coupon', couponHint: '15% off — valid 30 days',
      errorNoOrder: 'No orders',
      errorGeneric: 'Select order, day and time',
      copied: 'Copied ✓',
      aiBusy: 'Did not understand. Try: "Track order" or WhatsApp 📱',
      slotBooked: '✅ Delivery slot saved',
      slotFail: 'Booking failed — try later',
      alreadyCoupon: 'You already have a coupon 🎁',
      couponFail: 'Coupon failed',
      loginFirst: 'Please login first'
    }
  };

  const SUGGESTIONS = {
    ar: ['كيف أتتبع طلبي؟', 'متى يوصل الطلب؟', 'طرق الدفع؟', 'شحن مجاني؟'],
    en: ['Track my order?', 'Delivery time?', 'Payment?', 'Free shipping?']
  };

  const state = {
    chatModal: null, chatMessages: null, chatInput: null,
    isOpen: false, isTyping: false, conversationStarted: false,
    currentLang: 'ar', _slotSelected: null, _daySelected: null
  };

  try { state.currentLang = localStorage.getItem('chizen_chat_lang') || 'ar'; } catch(e) {}
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function t() { return UI_TEXT[state.currentLang]; }
  function nowTime() { return new Date().toLocaleTimeString(state.currentLang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }); }

  function createWidget() {
    if (document.getElementById('chizen-chat-root')) return;

    const fab = document.createElement('button');
    fab.className = 'chat-fab';
    fab.setAttribute('aria-label', 'CHIZEN Assistant');
    fab.textContent = '💬';
    fab.onclick = openChat;

    const overlay = document.createElement('div');
    overlay.className = 'chat-overlay';
    overlay.id = 'chat-overlay';
    overlay.innerHTML = `
      <div class="chat-sheet">
        <div class="chat-header">
          <div class="chat-avatar">🤖</div>
          <div class="chat-header-info">
            <div class="chat-header-name"><span id="chat-title">${t().title}</span><span class="chat-status-dot"></span></div>
            <div class="chat-header-sub" id="chat-subtitle">${t().subtitle}</div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-lang-btn" id="chat-lang-btn" onclick="ChizenChat.toggleLang()">${state.currentLang === 'ar' ? 'EN' : 'ع'}</button>
            <button class="chat-wa-btn" onclick="ChizenChat.openWhatsApp()" title="WhatsApp">💬</button>
            <button class="chat-close" onclick="ChizenChat.close()">×</button>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-suggestions" id="chat-suggestions"></div>
        <div class="chat-input-area">
          <textarea class="chat-input" id="chat-input" placeholder="${t().inputPlaceholder}" rows="1"></textarea>
          <button class="chat-send" onclick="ChizenChat.sendMessage()">➤</button>
        </div>
      </div>`;
    overlay.onclick = e => { if (e.target === overlay) closeChat(); };

    const slotModal = document.createElement('div');
    slotModal.className = 'chat-slot-modal';
    slotModal.id = 'chat-slot-modal';
    slotModal.innerHTML = '<div class="chat-slot-box" id="chat-slot-box"></div>';
    slotModal.onclick = e => { if (e.target === slotModal) closeSlotModal(); };

    const root = document.createElement('div');
    root.id = 'chizen-chat-root';
    root.appendChild(fab);
    root.appendChild(overlay);
    root.appendChild(slotModal);
    document.body.appendChild(root);

    state.chatModal = overlay;
    state.chatMessages = document.getElementById('chat-messages');
    state.chatInput = document.getElementById('chat-input');

    state.chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    state.chatInput.addEventListener('input', () => {
      state.chatInput.style.height = 'auto';
      state.chatInput.style.height = Math.min(state.chatInput.scrollHeight, 90) + 'px';
    });
  }

  function openChat() {
    if (!document.getElementById('chizen-chat-root')) createWidget();
    state.chatModal.classList.add('active');
    state.isOpen = true;
    if (!state.conversationStarted) { showWelcome(); state.conversationStarted = true; }
    setTimeout(() => state.chatInput.focus(), 350);
  }
  function closeChat() { state.chatModal.classList.remove('active'); state.isOpen = false; }

  function toggleLang() {
    state.currentLang = state.currentLang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('chizen_chat_lang', state.currentLang); } catch(e) {}
    document.documentElement.lang = state.currentLang;
    document.documentElement.dir = state.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('chat-title').textContent = t().title;
    document.getElementById('chat-subtitle').textContent = t().subtitle;
    document.getElementById('chat-input').placeholder = t().inputPlaceholder;
    document.getElementById('chat-lang-btn').textContent = state.currentLang === 'ar' ? 'EN' : 'ع';
    state.chatMessages.innerHTML = '';
    showWelcome();
  }

  function showWelcome() {
    state.chatMessages.innerHTML = `
      <div class="chat-welcome">
        <div class="chat-welcome-title">${t().welcomeTitle}</div>
        <div>${t().welcomeSub}</div>
        <div class="chat-welcome-options">
          <div class="chat-welcome-option" onclick="ChizenChat.startAI()"><span class="ico">🤖</span><span class="lbl">${t().optAI}</span></div>
          <div class="chat-welcome-option" onclick="ChizenChat.openWhatsApp()"><span class="ico">💬</span><span class="lbl">${t().optSupport}</span></div>
          <div class="chat-welcome-option" onclick="ChizenChat.openSchedule()"><span class="ico">⏱️</span><span class="lbl">${t().optDelivery}</span></div>
          <div class="chat-welcome-option" onclick="ChizenChat.claimCoupon()"><span class="ico">🎁</span><span class="lbl">${t().optCoupon}</span></div>
        </div>
      </div>`;
    renderSuggestions(SUGGESTIONS[state.currentLang]);
  }

  function renderSuggestions(list) {
    const c = document.getElementById('chat-suggestions');
    if (!c) return;
    c.innerHTML = list.map(s => `<button class="chat-suggestion" onclick="ChizenChat.askQuick('${s.replace(/'/g, "\\'")}')">${esc(s)}</button>`).join('');
  }

  function startAI() {
    document.getElementById('chat-suggestions').innerHTML = '';
    addBubble('bot', state.currentLang === 'ar' ? 'تفضل، اكتب سؤالك 👇' : 'Go ahead, type your question 👇');
    state.chatInput.focus();
  }

  
  const OPENROUTER_KEY = "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";
  
  async function callOpenRouterAI(userMessage) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://chizen.netlify.app",
          "X-Title": "CHIZEN Store"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-lite-preview-02-05:free",
          messages: [
            { role: "system", content: "أنت مساعد ذكي لمتجر CHIZEN اليمني. مهمتك فقط الإجابة على أسئلة العملاء المتعلقة بالمتجر (منتجات، أقسام، أسعار، دفع، توصيل، تتبع طلبات). إذا سألك المستخدم أي سؤال خارجي، اعتذر بلطف وقل: 'أنا مساعد شيزن، وأقدر أساعدك فقط في كل ما يتعلق بتسوقك من تطبيقنا الحبيب.' ولا تجب على أي سؤال خارجي مهما حدث. تحدث بلهجة ودودة." },
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      return "عذراً، لم أفهم سؤالك. جرب تسأل بطريقة تانية.";
    } catch (error) {
      console.error("AI Error:", error);
      return "عذراً، هناك مشكلة في الاتصال حالياً. حاول لاحقاً.";
    }
  }

async function sendMessage() {
    if (state.isTyping) return;
    const text = state.chatInput.value.trim();
    if (!text) return;

    state.chatInput.value = '';
    state.chatInput.style.height = 'auto';
    addBubble('user', text);
    document.getElementById('chat-suggestions').innerHTML = '';

    // 1. Quick
    const quick = matchQuick(text);
    if (quick) { setTimeout(() => addBubble('bot', quick), 300); return; }

    // 2. FAQ
    const faq = matchFAQ(text);
    if (faq) { setTimeout(() => addBubble('bot', faq.a), 400); return; }

    // 3. Fallback
    
    showTyping();
    setTimeout(async () => {
        const aiReply = await callOpenRouterAI(text);
        hideTyping();
        addBubble('bot', aiReply);
    }, 500);

  }

  function matchQuick(text) {
    const lower = text.toLowerCase();
    for (const item of QUICK_REPLIES[state.currentLang]) {
      for (const k of item.keys) if (lower.includes(k)) return item.text;
    }
    return null;
  }
  function matchFAQ(text) {
    const lower = text.toLowerCase();
    for (const item of FAQ[state.currentLang]) {
      for (const tag of item.tags) if (lower.includes(tag)) return item;
    }
    return null;
  }

  function addBubble(role, content, extraClass) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (extraClass || role);
    div.textContent = content;
    const time = document.createElement('span');
    time.className = 'chat-msg-time';
    time.textContent = nowTime();
    div.appendChild(time);
    state.chatMessages.appendChild(div);
    state.chatMessages.scrollTop = state.chatMessages.scrollHeight;
  }

  function showTyping() {
    const t2 = document.createElement('div');
    t2.className = 'chat-typing';
    t2.id = 'chat-typing';
    t2.innerHTML = '<span></span><span></span><span></span>';
    state.chatMessages.appendChild(t2);
    state.chatMessages.scrollTop = state.chatMessages.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('chat-typing'); if (el) el.remove(); }

  /* ═══ حجز التوصيل — حفظ مباشر بدون Cloud Function ═══ */
  function openSchedule() {
    const box = document.getElementById('chat-slot-box');
    box.innerHTML = `
      <div class="chat-slot-title">⏱️ ${t().optDelivery}</div>
      <label class="chat-slot-label">${t().selectOrder}</label>
      <select class="chat-slot-opt" id="chat-slot-order" style="width:100%;padding:12px;margin-bottom:16px;text-align:right;">
        <option value="">${t().loading}</option>
      </select>
      <label class="chat-slot-label">${t().selectDay}</label>
      <div class="chat-slot-options" id="chat-slot-days">
        <button class="chat-slot-opt" data-day="today">${t().days.today}</button>
        <button class="chat-slot-opt" data-day="tomorrow">${t().days.tomorrow}</button>
        <button class="chat-slot-opt" data-day="after">${t().days.after}</button>
      </div>
      <label class="chat-slot-label">${t().selectTime}</label>
      <div class="chat-slot-options" id="chat-slot-times">
        <button class="chat-slot-opt" data-slot="morning">${t().slots.morning}</button>
        <button class="chat-slot-opt" data-slot="noon">${t().slots.noon}</button>
        <button class="chat-slot-opt" data-slot="afternoon">${t().slots.afternoon}</button>
        <button class="chat-slot-opt" data-slot="evening">${t().slots.evening}</button>
      </div>
      <button class="chat-slot-opt" style="width:100%;margin-top:16px;background:linear-gradient(135deg,#ff27c9,#8d24ff);border:none;color:white;font-weight:900;" onclick="ChizenChat.confirmSlot()">${t().confirm}</button>
      <button class="chat-slot-close" style="margin-top:8px;" onclick="ChizenChat.closeSchedule()">✕</button>`;
    document.getElementById('chat-slot-modal').classList.add('active');
    loadUserOrders();
    state._slotSelected = null;
    state._daySelected = null;
    document.querySelectorAll('#chat-slot-days .chat-slot-opt').forEach(b => {
      b.onclick = () => { document.querySelectorAll('#chat-slot-days .chat-slot-opt').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); state._daySelected = b.dataset.day; };
    });
    document.querySelectorAll('#chat-slot-times .chat-slot-opt').forEach(b => {
      b.onclick = () => { document.querySelectorAll('#chat-slot-times .chat-slot-opt').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); state._slotSelected = b.dataset.slot; };
    });
  }

  async function loadUserOrders() {
    const select = document.getElementById('chat-slot-order');
    try {
      if (!window.firebase || !firebase.auth) { select.innerHTML = '<option value="">غير متاح</option>'; return; }
      const uid = firebase.auth().currentUser?.uid;
      if (!uid) { select.innerHTML = `<option value="">${t().loginFirst}</option>`; return; }
      const snap = await firebase.firestore().collection('orders').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(5).get();
      if (snap.empty) { select.innerHTML = `<option value="">${t().errorNoOrder}</option>`; return; }
      select.innerHTML = snap.docs.map(d => {
        const o = d.data();
        return `<option value="${d.id}">#${d.id.slice(0, 8)} — ${o.total} ريال</option>`;
      }).join('');
    } catch (e) {
      select.innerHTML = '<option value="">فشل التحميل</option>';
    }
  }

  async function confirmSlot() {
    const orderId = document.getElementById('chat-slot-order').value;
    const slot = state._slotSelected;
    const day = state._daySelected;
    if (!orderId || !slot || !day) { alert(t().errorGeneric); return; }

    const date = new Date();
    if (day === 'tomorrow') date.setDate(date.getDate() + 1);
    if (day === 'after') date.setDate(date.getDate() + 2);
    const dateStr = date.toISOString().slice(0, 10);

    try {
      await firebase.firestore().collection('orders').doc(orderId).update({
        deliverySlot: { slot, date: dateStr, scheduledAt: firebase.firestore.FieldValue.serverTimestamp() }
      });
      closeSlotModal();
      addBubble('bot', t().slotBooked);
      try { localStorage.setItem('chizen_scheduled_delivery', JSON.stringify({ orderId, slot, date: dateStr })); } catch(e) {}
    } catch (e) {
      alert(t().slotFail);
    }
  }

  function closeSlotModal() { document.getElementById('chat-slot-modal').classList.remove('active'); }

  /* ═══ كوبون ترحيب — توليد محلي + حفظ في حساب المستخدم ═══ */
  async function claimWelcomeCoupon() {
    // 1. تحقق من الكوبون المحفوظ
    try {
      const saved = localStorage.getItem('chizen_welcome_coupon');
      if (saved) { showCouponBubble(saved); return; }
    } catch(e) {}

    // 2. تحقق من حساب المستخدم في Firestore
    try {
      const uid = firebase.auth()?.currentUser?.uid;
      if (uid) {
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        if (userDoc.exists && userDoc.data().welcomeCoupon) {
          const code = userDoc.data().welcomeCoupon;
          try { localStorage.setItem('chizen_welcome_coupon', code); } catch(e) {}
          showCouponBubble(code);
          return;
        }
      }
    } catch(e) {}

    // 3. توليد كوبون جديد محلياً
    showTyping();
    setTimeout(async () => {
      hideTyping();
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let suffix = '';
      for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
      const code = 'WELCOME-' + suffix;

      try { localStorage.setItem('chizen_welcome_coupon', code); } catch(e) {}

      try {
        const uid = firebase.auth()?.currentUser?.uid;
        if (uid) {
          await firebase.firestore().collection('users').doc(uid).set({
            welcomeCoupon: code,
            welcomeCouponIssued: true,
            welcomeCouponIssuedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      } catch(e) { console.warn('Save coupon:', e); }

      showCouponBubble(code);
    }, 600);
  }

  function showCouponBubble(code) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `
      <div class="chat-coupon-card">
        <div style="font-size:14px;font-weight:900;color:#e8eeff;">🎁 ${t().couponIssued}</div>
        <div class="chat-coupon-code">${esc(code)}</div>
        <div class="chat-coupon-hint">${t().couponHint}</div>
        <button style="margin-top:10px;padding:8px 16px;background:rgba(255,179,71,.2);border:1px solid rgba(255,179,71,.5);border-radius:8px;color:#ffb347;font-family:Tajawal,sans-serif;font-weight:900;font-size:12px;cursor:pointer;" onclick="ChizenChat.copyCode('${esc(code)}')">📋 ${t().copied}</button>
      </div>`;
    state.chatMessages.appendChild(div);
    state.chatMessages.scrollTop = state.chatMessages.scrollHeight;
  }

  function copyCode(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showToast(t().copied));
    else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove(); showToast(t().copied);
    }
  }

  function showToast(msg) {
    let el = document.getElementById('chat-toast');
    if (!el) { el = document.createElement('div'); el.id = 'chat-toast'; el.className = 'chat-toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(window._chatToastTimer);
    window._chatToastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  }

  function openWhatsApp() {
    let phone = WHATSAPP_NUMBER;
    try { const c = JSON.parse(localStorage.getItem('chizen_contact') || '{}'); if (c.whatsapp) phone = c.whatsapp.replace(/\D/g, ''); } catch(e) {}
    window.open('https://wa.me/' + phone, '_blank');
  }

  window.ChizenChat = {
    open: openChat, close: closeChat,
    startAI: startAI, openWhatsApp: openWhatsApp,
    askQuick: function(text) { state.chatInput.value = text; sendMessage(); },
    claimCoupon: claimWelcomeCoupon,
    openSchedule: openSchedule, closeSchedule: closeSlotModal,
    confirmSlot: confirmSlot, toggleLang: toggleLang,
    sendMessage: sendMessage, copyCode: copyCode
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createWidget);
  else createWidget();
})();
