/* CHIZEN Session Fix v3 — Safe Mode */
(function(){
  function patch(){
    try {
      if (!window.APP) { setTimeout(patch, 100); return; }
      if (window.APP._sessionFixed) return;
      window.APP._sessionFixed = true;

      window.APP.syncBackground = function() {
        var self = this;
        try {
          if (!window.FB || !FB.ready) {
            setTimeout(function(){ self.syncBackground(); }, 300);
            return;
          }

          if (FB.currentUser) {
            self.onUserReady(FB.currentUser);
            return;
          }

          // استرجاع احتياطي من الذاكرة المحلية
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

          // الاستماع للتغييرات
          FB.auth.onAuthStateChanged(function(user){
            if (user) self.onUserReady(user);
          });

        } catch(e) {
          console.error('[SessionFix] Safe catch:', e);
        }
      };
    } catch(e) {
      console.error('[SessionFix] Patch error:', e);
    }
  }
  patch();
})();
