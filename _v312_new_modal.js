window.__showLoginModal = function(actionLabel, pendingAction){
  if (pendingAction) window.__savePending(pendingAction);
  
  var existing = document.getElementById("v303-login-modal");
  if (existing) existing.remove();
  
  var isDark = document.documentElement.getAttribute("data-theme") !== "light";
  var cardBg = isDark ? "#1a1730" : "#ffffff";
  var textColor = isDark ? "#ffffff" : "#1a1a2e";
  var subColor = isDark ? "#a78bfa" : "#6b7280";
  var borderColor = isDark ? "rgba(168,85,247,0.2)" : "#e5e7eb";
  var overlayBg = isDark ? "rgba(0,0,0,0.7)" : "rgba(17,24,39,0.45)";
  var desc = (actionLabel || "للمتابعة") + "، يرجى تسجيل الدخول إلى حسابك";
  
  var overlay = document.createElement("div");
  overlay.id = "v303-login-modal";
  overlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:" + overlayBg + ";backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Tajawal,system-ui,sans-serif;animation:v312fadein 0.18s ease";
  
  var html = '';
  html += '<div style="background:' + cardBg + ';border:1px solid ' + borderColor + ';border-radius:16px;padding:28px 24px 20px;max-width:380px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.18);position:relative;animation:v312slideup 0.22s ease">';
  html += '<button id="v303-close-x" style="position:absolute;top:12px;right:12px;width:30px;height:30px;background:transparent;border:none;color:' + subColor + ';font-size:22px;cursor:pointer;border-radius:8px;display:flex;align-items:center;justify-content:center;line-height:1">×</button>';
  html += '<div style="text-align:center;margin-bottom:18px"><span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:' + (isDark ? "rgba(168,85,247,0.12)" : "rgba(124,58,237,0.08)") + ';color:#7c3aed;border-radius:20px;font-size:11px;font-weight:700">● أنت تتصفح كزائر</span></div>';
  html += '<div style="width:52px;height:52px;margin:0 auto 18px;border-radius:14px;background:' + (isDark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.08)") + ';display:flex;align-items:center;justify-content:center">';
  html += '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  html += '</div>';
  html += '<div style="font-size:18px;font-weight:800;color:' + textColor + ';text-align:center;margin-bottom:10px;line-height:1.4">سجّل الدخول للمتابعة</div>';
  html += '<div style="font-size:13.5px;color:' + subColor + ';text-align:center;line-height:1.65;margin-bottom:22px">' + desc + '</div>';
  html += '<button id="v303-register-btn" style="width:100%;padding:14px;background:#7c3aed;color:#fff;border:none;border-radius:10px;font-family:inherit;font-weight:700;font-size:15px;cursor:pointer;margin-bottom:10px">تسجيل الدخول</button>';
  html += '<button id="v303-continue-btn" style="width:100%;padding:14px;background:transparent;color:' + subColor + ';border:1px solid ' + borderColor + ';border-radius:10px;font-family:inherit;font-weight:600;font-size:14px;cursor:pointer">متابعة كزائر</button>';
  html += '</div>';
  html += '<style>@keyframes v312fadein{from{opacity:0}to{opacity:1}}@keyframes v312slideup{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}</style>';
  
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  
  document.getElementById("v303-register-btn").onclick = function(){
    window.location.href = "index.html";
  };
  document.getElementById("v303-continue-btn").onclick = function(){
    overlay.style.opacity = "0";
    setTimeout(function(){ overlay.remove(); }, 200);
    try { localStorage.removeItem(PENDING_KEY); } catch(e){}
  };
  document.getElementById("v303-close-x").onclick = function(){
    overlay.style.opacity = "0";
    setTimeout(function(){ overlay.remove(); }, 200);
    try { localStorage.removeItem(PENDING_KEY); } catch(e){}
  };
};
