/* ═══════════════════════════════════════════
   CHIZEN NOTIFICATION SOUND
   صوت مخصص يُولّد برمجياً — بدون ملف صوتي
   ═══════════════════════════════════════════ */

window.ChizenSound = {
  
  audioCtx: null,
  
  init: function() {
    if (!this.audioCtx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.audioCtx = new AC();
      } catch (e) { console.log('[Sound] AudioContext not supported'); }
    }
  },
  
  play: function() {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    
    var ctx = this.audioCtx;
    var now = ctx.currentTime;
    
    this.playNote(523.25, now, 0.25, 0.15);
    this.playNote(659.25, now + 0.12, 0.25, 0.15);
    this.playNote(783.99, now + 0.24, 0.35, 0.20);
    this.playNote(1046.50, now + 0.30, 0.4, 0.05);
  },
  
  playNote: function(freq, startTime, duration, volume) {
    var ctx = this.audioCtx;
    
    var osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    var osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  },
  
  playOrder: function() {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    
    var ctx = this.audioCtx;
    var now = ctx.currentTime;
    
    this.playNote(659.25, now, 0.2, 0.15);
    this.playNote(783.99, now + 0.15, 0.2, 0.15);
    this.playNote(1046.50, now + 0.30, 0.5, 0.20);
  },
  
  playOffer: function() {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    
    var ctx = this.audioCtx;
    var now = ctx.currentTime;
    
    this.playNote(523.25, now, 0.15, 0.12);
    this.playNote(659.25, now + 0.08, 0.15, 0.14);
    this.playNote(783.99, now + 0.16, 0.15, 0.16);
    this.playNote(1046.50, now + 0.24, 0.4, 0.18);
  },
  
  playPoints: function() {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    
    var ctx = this.audioCtx;
    var now = ctx.currentTime;
    
    this.playNote(880, now, 0.2, 0.12);
    this.playNote(1174.66, now + 0.12, 0.4, 0.15);
  }
};

document.addEventListener('touchstart', function once() {
  ChizenSound.init();
  document.removeEventListener('touchstart', once);
}, { once: true });

document.addEventListener('click', function once() {
  ChizenSound.init();
  document.removeEventListener('click', once);
}, { once: true });