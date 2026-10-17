/* CHIZEN Session Fix v2 — يعتمد على FB.ready بعد استرجاع الجلسة */
(function(){
  function patch(){
    if (!window.APP) { setTimeout(patch, 50); return; }
    if (window.APP._sessionFixed) return;
    window.APP._sessionFixed = true;

    window.APP.syncBackground = function() {
      var self = this;
      if (!window.FB || !FB.ready) {
        setTimeout(function(){ self.syncBackground(); }, 300);
        return;
      }

      /* FB.ready=true يعني الجلسة استُرجعَت بالفعل */
      if (FB.currentUser) {
        self.onUserReady(FB.currentUser);
        return;
      }

      /* تحقق من localStorage كاحتياط أخير */
      try {
        var s = localStorage.getItem('chizen_state');
        if (s) {
          var p = JSON.parse(s);
          if (p.user && p.user.uid) {
            self.state.user = p.user;
            if (typeof p.loyaltyPoints === 'number') self.loyaltyPoints = p.loyaltyPoints;
            self.updateUserName();
            self.updateLoyalty();
          }
        }
      } catch(e) {}

      /* استمع لأي تغيير مستقبلي */
      FB.auth.onAuthStateChanged(function(user){
        if (user) {
          self.onUserReady(user);
        }
      });

      /* لا تطرد — فقط أظهر زر "تسجيل الدخول" بعد وقت طويل */
      setTimeout(function(){
        if (FB.currentUser) return;
        if (self.state.user && self.state.user.uid) return;
        var c = document.getElementById('screens');
        if (c && !document.getElementById('session-expired-msg')) {
          c.innerHTML = '<div id="session-expired-msg" style="padding:80px 20px;text-align:center;color:#B8A5D4;font-size:14px;line-height:2;">' +
            '<div style="font-size:48px;margin-bottom:20px;">🔐</div>' +
            'انتهت الجلسة<br>' +
            '<button onclick="window.location.replace(\'index.html\')" style="margin-top:20px;padding:12px 30px;border:none;border-radius:12px;background:linear-gradient(135deg,#FB923C,#EC4899);color:white;font-family:Cairo,sans-serif;font-weight:900;cursor:pointer;">العودة لتسجيل الدخول</button></div>';
        }
      }, 10000);
    };

    var patchFB = function(){
      if (!window.FB || !window.FB.handleGoogleRedirect) { setTimeout(patchFB, 50); return; }
      if (FB._redirectPatched) return;
      FB._redirectPatched = true;
      var orig = FB.handleGoogleRedirect;
      FB.handleGoogleRedirect = async function(){
        var hasOAuth =
          window.location.hash.indexOf('access_token') > -1 ||
          window.location.hash.indexOf('id_token') > -1 ||
          window.location.search.indexOf('code=') > -1;
        if (!hasOAuth) return null;
        return orig.apply(this, arguments);
      };
    };
    patchFB();

    console.log('[SessionFix v2] Applied');
  }
  patch();
})();
