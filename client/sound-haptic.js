/* CHIZEN — Sound & Haptic Feedback Engine */
(function(){
  'use strict';
  
  var CHIZEN_FEEDBACK = {
    soundsEnabled: true,
    hapticsEnabled: true,
    _ctx: null,
    
    init: function(){
      try {
        this.soundsEnabled = localStorage.getItem('chizen_sounds') !== 'off';
        this.hapticsEnabled = localStorage.getItem('chizen_haptics') !== 'off';
      } catch(e) {}
    },
    
    _getCtx: function(){
      if (!this._ctx) {
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this._ctx = new AC();
        } catch(e) {}
      }
      // Resume if suspended (iOS/Safari)
      if (this._ctx && this._ctx.state === 'suspended') {
        try { this._ctx.resume(); } catch(e) {}
      }
      return this._ctx;
    },
    
    _tone: function(ctx, start, freq, dur, vol, type){
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    },
    
    play: function(type){
      if (!this.soundsEnabled) return;
      var ctx = this._getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      
      try {
        switch(type) {
          case 'tap':
            this._tone(ctx, t, 900, 0.04, 0.1, 'sine');
            break;
          case 'success':
            this._tone(ctx, t, 523.25, 0.10, 0.18, 'sine');
            this._tone(ctx, t + 0.08, 659.25, 0.10, 0.18, 'sine');
            this._tone(ctx, t + 0.16, 783.99, 0.18, 0.22, 'sine');
            break;
          case 'error':
            this._tone(ctx, t, 200, 0.12, 0.2, 'sawtooth');
            this._tone(ctx, t + 0.12, 160, 0.20, 0.2, 'sawtooth');
            break;
          case 'notification':
            this._tone(ctx, t, 880, 0.08, 0.18, 'sine');
            this._tone(ctx, t + 0.09, 1174.66, 0.15, 0.18, 'sine');
            break;
          case 'purchase':
            this._tone(ctx, t, 523.25, 0.08, 0.18, 'sine');
            this._tone(ctx, t + 0.10, 659.25, 0.08, 0.18, 'sine');
            this._tone(ctx, t + 0.20, 783.99, 0.10, 0.20, 'sine');
            this._tone(ctx, t + 0.32, 1046.50, 0.28, 0.22, 'sine');
            break;
          case 'coin':
            this._tone(ctx, t, 1318.51, 0.06, 0.15, 'sine');
            this._tone(ctx, t + 0.06, 1760.00, 0.12, 0.18, 'sine');
            break;
          case 'toggle':
            this._tone(ctx, t, 700, 0.03, 0.08, 'sine');
            break;
          default:
            this._tone(ctx, t, 900, 0.04, 0.1, 'sine');
        }
      } catch(e) {}
    },
    
    vibrate: function(pattern){
      if (!this.hapticsEnabled) return;
      
      // Capacitor Haptics (APK)
      var Haptics = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (Haptics) {
        try {
          if (typeof pattern === 'string') {
            var styleMap = { light: 'LIGHT', medium: 'MEDIUM', heavy: 'HEAVY' };
            Haptics.impact({ style: styleMap[pattern] || 'LIGHT' });
          } else {
            // For patterns, use vibrate via Capacitor if available
            if (window.Capacitor.Plugins.Haptics.notification) {
              Haptics.notification({ type: 'SUCCESS' });
            } else {
              Haptics.impact({ style: 'MEDIUM' });
            }
          }
          return;
        } catch(e) {}
      }
      
      // Web Vibration API
      if (navigator.vibrate) {
        var presets = {
          light: 12,
          medium: 22,
          heavy: 40,
          success: [30, 40, 30],
          error: [100, 60, 100],
          notification: [60, 40, 60],
          purchase: [50, 30, 50, 30, 120],
          toggle: 8
        };
        if (typeof pattern === 'string') pattern = presets[pattern] || 12;
        try { navigator.vibrate(pattern); } catch(e) {}
      }
    },
    
    // ─── Combined helpers ───
    tap:        function(){ this.play('tap'); this.vibrate('light'); },
    toggle:     function(){ this.play('toggle'); this.vibrate('toggle'); },
    success:    function(){ this.play('success'); this.vibrate('success'); },
    error:      function(){ this.play('error'); this.vibrate('error'); },
    notify:     function(){ this.play('notification'); this.vibrate('notification'); },
    purchase:   function(){ this.play('purchase'); this.vibrate('purchase'); },
    coin:       function(){ this.play('coin'); this.vibrate('light'); },
    
    // ─── Settings ───
    setSounds: function(on){
      this.soundsEnabled = !!on;
      try { localStorage.setItem('chizen_sounds', on ? 'on' : 'off'); } catch(e) {}
    },
    setHaptics: function(on){
      this.hapticsEnabled = !!on;
      try { localStorage.setItem('chizen_haptics', on ? 'on' : 'off'); } catch(e) {}
    }
  };
  
  CHIZEN_FEEDBACK.init();
  window.ChizenFeedback = CHIZEN_FEEDBACK;
  window.Sound = CHIZEN_FEEDBACK; // short alias
  
  // ─── Auto-hook all buttons via event delegation ───
  function hookClicks(){
    if (!document.body) { setTimeout(hookClicks, 200); return; }
    
    document.body.addEventListener('click', function(e){
      var target = e.target;
      if (!target) return;
      
      // Determine element category
      var btn = target.closest('button, .btn, [role="button"], .bn-item, .tvl-submit, .tvl-chip, .cm-btn, .notif-item, .tvl-portal, .chz-icon-box, .tvl-back, .ord-back, .cm-back, .notif-back, .tvl-confirm, .tvl-price-confirm');
      if (!btn) {
        // Also catch toggles and switches
        if (target.closest('[onclick]')) btn = target.closest('[onclick]');
        else return;
      }
      
      // Skip if explicitly marked silent
      if (btn.dataset && btn.dataset.sound === 'off') return;
      
      // Determine sound type
      var soundAttr = btn.dataset && btn.dataset.sound;
      if (soundAttr === 'success') { CHIZEN_FEEDBACK.success(); return; }
      if (soundAttr === 'error') { CHIZEN_FEEDBACK.error(); return; }
      if (soundAttr === 'purchase') { CHIZEN_FEEDBACK.purchase(); return; }
      if (soundAttr === 'coin') { CHIZEN_FEEDBACK.coin(); return; }
      if (soundAttr === 'toggle') { CHIZEN_FEEDBACK.toggle(); return; }
      
      // Default: tap
      CHIZEN_FEEDBACK.tap();
    }, true); // capture phase — before other handlers
    
    console.log('[feedback] auto-hook ready');
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookClicks);
  } else {
    hookClicks();
  }
  
  console.log('[feedback] engine ready — sounds:', CHIZEN_FEEDBACK.soundsEnabled, '| haptics:', CHIZEN_FEEDBACK.hapticsEnabled);
})();
