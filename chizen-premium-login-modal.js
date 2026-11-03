/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Premium Login Modal v1.0
   تصميم رسمي أنيق موحّد لكل التطبيق
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var PENDING_KEY = "chizen_pending_action";

  // استبدال __showLoginModal بعد تحميل كل شيء
  function installPremiumModal() {
    if (!window.__showLoginModal || window.__premiumModalReady) {
      setTimeout(installPremiumModal, 500);
      return;
    }
    window.__premiumModalReady = true;

    window.__showLoginModal = function(actionLabel, pendingAction) {
      // نحفظ الإجراء المعلّق
      if (pendingAction) {
        try { localStorage.setItem(PENDING_KEY, JSON.stringify(pendingAction)); } catch(e) {}
      }

      // إزالة أي modal سابق
      var existing = document.getElementById("chz-premium-login-modal");
      if (existing) existing.remove();

      // كشف الوضع
      var isDark = document.documentElement.getAttribute("data-theme") !== "light";
      var cardBg = isDark
        ? 'linear-gradient(135deg, #131E42 0%, #0A1024 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #FFFEF9 100%)';
      var borderColor = '#C5A059';
      var textColor = isDark ? '#FFFFFF' : '#121A26';
      var subColor = isDark ? 'rgba(255,255,255,0.7)' : '#7A8596';
      var desc = (actionLabel || 'للمتابعة') + '، يرجى تسجيل الدخول إلى حسابك';

      // Overlay
      var overlay = document.createElement('div');
      overlay.id = 'chz-premium-login-modal';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(7,9,15,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Tajawal,system-ui,sans-serif;animation:chzPmFadeIn 0.25s ease';

      // Card
      var card = document.createElement('div');
      card.style.cssText = 'background:' + cardBg + ';border:2px solid ' + borderColor + ';border-radius:24px;padding:32px 24px 24px;max-width:380px;width:100%;box-shadow:0 24px 60px rgba(197,160,89,0.35),0 0 0 1px rgba(197,160,89,0.15);position:relative;animation:chzPmSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);direction:rtl';

      card.innerHTML = ''
        // زر X
        + '<button id="chz-pm-close" style="position:absolute;top:14px;left:14px;width:32px;height:32px;background:rgba(255,255,255,0.06);border:1px solid rgba(197,160,89,0.3);color:' + subColor + ';font-size:18px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:1;padding:0">×</button>'

        // شارة "أنت زائر"
        + '<div style="text-align:center;margin-bottom:18px"><span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(197,160,89,0.12);color:#C5A059;border:1px solid rgba(197,160,89,0.35);border-radius:20px;font-size:11.5px;font-weight:800;letter-spacing:0.5px">● أنت في وضع الزائر</span></div>'

        // أيقونة القفل الذهبي
        + '<div style="width:72px;height:72px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#F2E3C6 0%,#C5A059 50%,#9A7B4F 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(197,160,89,0.5)">'
        +   '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#07090F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
        + '</div>'

        // العنوان
        + '<h2 style="font-size:21px;font-weight:900;color:' + textColor + ';text-align:center;margin:0 0 12px;line-height:1.3">سجّل الدخول للمتابعة</h2>'

        // الرسالة
        + '<p style="font-size:14px;color:' + subColor + ';text-align:center;line-height:1.65;margin:0 0 24px;font-weight:600">' + desc + '</p>'

        // زر أساسي ذهبي
        + '<button id="chz-pm-login" style="width:100%;padding:15px;background:linear-gradient(135deg,#F2E3C6 0%,#C5A059 50%,#9A7B4F 100%);color:#07090F;border:none;border-radius:14px;font-family:Tajawal,sans-serif;font-weight:900;font-size:16px;letter-spacing:0.5px;cursor:pointer;margin-bottom:10px;box-shadow:0 6px 20px rgba(197,160,89,0.45)">تسجيل الدخول الآن</button>'

        // زر ثانوي
        + '<button id="chz-pm-guest" style="width:100%;padding:13px;background:transparent;color:' + subColor + ';border:1.5px solid rgba(197,160,89,0.3);border-radius:14px;font-family:Tajawal,sans-serif;font-weight:700;font-size:14px;cursor:pointer">متابعة كزائر</button>';

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      // animations
      var style = document.createElement('style');
      style.textContent = '@keyframes chzPmFadeIn{from{opacity:0}to{opacity:1}}@keyframes chzPmSlideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}';
      document.head.appendChild(style);

      // أحداث
      document.getElementById('chz-pm-login').onclick = function(){
        window.location.href = 'index.html?login=1';
      };

      document.getElementById('chz-pm-guest').onclick = function(){
        overlay.style.opacity = '0';
        setTimeout(function(){ overlay.remove(); }, 200);
        try { localStorage.removeItem(PENDING_KEY); } catch(e){}
      };

      document.getElementById('chz-pm-close').onclick = function(){
        overlay.style.opacity = '0';
        setTimeout(function(){ overlay.remove(); }, 200);
        try { localStorage.removeItem(PENDING_KEY); } catch(e){}
      };

      // إغلاق بـ Escape
      document.addEventListener('keydown', function escHandler(e){
        if (e.key === 'Escape' && document.getElementById('chz-premium-login-modal')) {
          overlay.style.opacity = '0';
          setTimeout(function(){ overlay.remove(); }, 200);
          document.removeEventListener('keydown', escHandler);
        }
      });
    };

    console.log('[PREMIUM-MODAL] ✅ التصميم الجديد جاهز');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installPremiumModal);
  } else {
    installPremiumModal();
  }
})();
