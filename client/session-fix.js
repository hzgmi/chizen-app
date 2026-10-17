/* CHIZEN Session Fix v4 — Secure Mode */
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
