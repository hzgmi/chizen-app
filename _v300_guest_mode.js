const fs = require('fs');
let h = fs.readFileSync('client/chizen.html', 'utf8');
const before = h.length;
let changes = [];

// ═══ 1. تعديل syncBg — الزائر يدخل بدل redirect ═══
const oldElse = `      } else {
        // ❌ Not authenticated — redirect IMMEDIATELY (no 3s wait)
        try { console.log('[auth] no user — redirecting to login'); } catch(e){}
        window.__chzRedirect('no-user');
      }`;

const newElse = `      } else {
        // v300: GUEST MODE — لا redirect
        try { console.log('[v300] guest mode activated'); } catch(e){}
        window.__guestActive = true;
        try { localStorage.setItem('chizen_guest', 'true'); } catch(e){}
        document.documentElement.classList.add('chz-auth-ok');
        var splashEl = document.getElementById('chz-splash-v63');
        if (splashEl) {
          splashEl.style.opacity = '0';
          splashEl.style.transition = 'opacity 0.3s ease';
          setTimeout(function(){ if (splashEl.parentNode) splashEl.parentNode.removeChild(splashEl); }, 350);
        }
        if (self.state) self.state.user = null;
      }`;

if (h.includes(oldElse)) {
  h = h.replace(oldElse, newElse);
  changes.push('syncBg else→guest');
} else {
  console.log('⚠️ syncBg else not matched');
}

// ═══ 2. نفس التعديل في onAuthStateChanged الثاني (سطر 20259) ═══
const oldSecond = `      FB.auth.onAuthStateChanged(function(u){
        if (u) {`;
const newSecond = `      FB.auth.onAuthStateChanged(function(u){
        if (u) {`;
// لا نحتاج تعديله - يبدو أنه يتعامل فقط مع المسجلين

// ═══ 3. helpers global ═══
const helpers = `
// ═══ v301: Guest Mode Helpers ═══
window.__isGuest = function() {
  if (window.FB && window.FB.currentUser) return false;
  return window.__guestActive === true || (localStorage.getItem('chizen_guest') === 'true');
};
window.__checkGuest = function(action) {
  if (window.__isGuest()) {
    if (typeof window.__showLoginModal === 'function') {
      window.__showLoginModal(action || 'هذه العملية');
    } else {
      var r = confirm('سجّل للقيام بهذه العملية.\\n\\nالذهاب لصفحة التسجيل؟');
      if (r) window.location.href = 'index.html';
    }
    return true;
  }
  return false;
};
window.__openLogin = function() {
  window.location.href = 'index.html';
};
// عند logout - امسح guest flag
var _origLogout = window.__chzLogout;
window.__chzLogout = function() {
  try { localStorage.removeItem('chizen_guest'); } catch(e){}
  window.__guestActive = false;
  if (_origLogout) return _origLogout.apply(this, arguments);
  if (window.FB && window.FB.auth) window.FB.auth.signOut();
  window.location.reload();
};
`;

// إضافة helpers قبل نهاية body
const bodyEnd = h.lastIndexOf('</body>');
if (bodyEnd === -1) throw new Error('body end not found');
h = h.slice(0, bodyEnd) + '<script>' + helpers + '</script>\n' + h.slice(bodyEnd);
changes.push('helpers added');

fs.writeFileSync('client/chizen.html', h);
console.log('✅ v300+v301: ' + changes.join(', ') + ' | ' + before + ' -> ' + h.length);
