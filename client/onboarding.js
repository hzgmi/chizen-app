/* CHIZEN Onboarding v1 */
(function(){
  var PREFIX = 'chizen_onboarding_v1_';
  window.ChizenOnboarding = {
    steps: [], current: 0, userKey: '', overlay: null, tooltip: null, highlight: null,
    init: function() {
      var self = this;
      var wait = setInterval(function(){
        if (window.APP && document.getElementById('screen-home')) {
          clearInterval(wait);
          self.setup();
        }
      }, 100);
    },
    setup: function() {
      if (!window.FB || !FB.currentUser) {
        var self = this;
        setTimeout(function(){ self.setup(); }, 500);
        return;
      }
      this.userKey = PREFIX + FB.currentUser.uid;
      try {
        if (localStorage.getItem(this.userKey) === 'done') return;
      } catch(e){}
      var self = this;
      setTimeout(function(){ self.start(); }, 1500);
    },
    start: function() {
      this.steps = this.buildSteps();
      this.current = 0;
      this.createUI();
      this.showStep(0);
    },
    buildSteps: function() {
      return [
        { title: 'أهلاً بك في CHIZEN!', desc: 'دعنا نأخذك في جولة سريعة لتعرف كيف تستخدم التطبيق — لن تأخذ أكثر من دقيقة.', target: null, arrow: 'center' },
        { title: 'تصفح الأقسام', desc: 'اختر القسم الذي تريد التسوق منه — منزلية، إلكترونيات، تجميل، مدرسية، وأكثر.', target: '#cats-container', arrow: 'top' },
        { title: 'ابحث عن أي منتج', desc: 'اكتب اسم المنتج أو الماركة هنا للوصول السريع.', target: '.search-box', arrow: 'top' },
        { title: 'سلتك', desc: 'كل ما تضيفه يظهر هنا — يمكنك تعديل الكميات قبل الشراء.', target: '#cart-badge', arrow: 'bottom' },
        { title: 'إشعاراتك', desc: 'ستصلك هنا العروض الجديدة وتحديثات طلباتك أول بأول.', target: '.icon-btn:first-child', arrow: 'bottom' },
        { title: 'طلباتك', desc: 'تابع حالة كل طلب من هنا — قيد المعالجة، في الطريق، أو مكتمل.', target: '#bottom-nav .nav-item:nth-child(3)', arrow: 'top' },
        { title: 'حسابك', desc: 'نقاط الولاء، المفضلة، الإعدادات، والمساعدة — كل شيء عن حسابك هنا.', target: '#bottom-nav .nav-item:nth-child(4)', arrow: 'top' },
        { title: 'ابدأ التسوق!', desc: 'أنت جاهز الآن 🎉 — اضغط على أي منتج لعرض تفاصيله وإضافته للسلة.', target: null, arrow: 'center' }
      ];
    },
    createUI: function() {
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9998;transition:opacity 0.3s;opacity:0;';
      document.body.appendChild(ov);
      this.overlay = ov;

      var hl = document.createElement('div');
      hl.style.cssText = 'position:fixed;border:3px solid #EC4899;border-radius:16px;box-shadow:0 0 0 9999px rgba(0,0,0,0.75);z-index:9999;transition:all 0.4s ease;display:none;pointer-events:none;';
      document.body.appendChild(hl);
      this.highlight = hl;

      var tt = document.createElement('div');
      tt.style.cssText = 'position:fixed;background:linear-gradient(135deg,#372254,#1F0D35);border:1px solid #3A2560;border-radius:18px;padding:20px;max-width:340px;width:calc(100% - 40px);z-index:10000;box-shadow:0 20px 60px rgba(0,0,0,0.6);opacity:0;transform:translateY(20px);transition:all 0.4s;direction:rtl;font-family:Cairo,sans-serif;';
      tt.innerHTML =
        '<div id="onb-title" style="font-size:17px;font-weight:900;color:#FEF3E2;margin-bottom:8px;"></div>' +
        '<div id="onb-desc" style="font-size:13px;color:#B8A5D4;line-height:1.7;margin-bottom:16px;"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
          '<div id="onb-steps" style="font-size:11px;color:#6E5A8A;font-weight:700;"></div>' +
          '<div style="display:flex;gap:8px;">' +
            '<button id="onb-skip" style="padding:10px 16px;background:transparent;border:1px solid #3A2560;border-radius:10px;color:#8B7AA8;font-family:Cairo,sans-serif;font-size:12px;font-weight:900;cursor:pointer;">تخطي</button>' +
            '<button id="onb-next" style="padding:10px 20px;background:linear-gradient(135deg,#FB923C,#EC4899);border:none;border-radius:10px;color:white;font-family:Cairo,sans-serif;font-size:12px;font-weight:900;cursor:pointer;">التالي</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(tt);
      this.tooltip = tt;

      var self = this;
      document.getElementById('onb-skip').onclick = function(){ self.finish(); };
      document.getElementById('onb-next').onclick = function(){ self.next(); };

      setTimeout(function(){
        ov.style.opacity = '1';
        tt.style.opacity = '1';
        tt.style.transform = 'translateY(0)';
      }, 50);
    },
    showStep: function(idx) {
      var step = this.steps[idx];
      if (!step) return this.finish();
      var hl = this.highlight, tt = this.tooltip;
      document.getElementById('onb-title').textContent = step.title;
      document.getElementById('onb-desc').textContent = step.desc;
      document.getElementById('onb-steps').textContent = (idx + 1) + ' / ' + this.steps.length;
      var nextBtn = document.getElementById('onb-next');
      nextBtn.textContent = (idx === this.steps.length - 1) ? 'ابدأ الآن!' : 'التالي';

      if (!step.target) {
        hl.style.display = 'none';
        tt.style.top = '50%'; tt.style.left = '50%';
        tt.style.transform = 'translate(-50%, -50%)';
        return;
      }
      var target = document.querySelector(step.target);
      if (!target) {
        hl.style.display = 'none';
        tt.style.top = '50%'; tt.style.left = '50%';
        tt.style.transform = 'translate(-50%, -50%)';
        return;
      }
      var rect = target.getBoundingClientRect();
      var pad = 8;
      hl.style.display = 'block';
      hl.style.top = (rect.top - pad) + 'px';
      hl.style.left = (rect.left - pad) + 'px';
      hl.style.width = (rect.width + pad * 2) + 'px';
      hl.style.height = (rect.height + pad * 2) + 'px';

      var wH = window.innerHeight, wW = window.innerWidth;
      var tTop, tLeft;
      if (step.arrow === 'top') {
        tTop = rect.top - 220;
        if (tTop < 20) tTop = rect.bottom + 20;
      } else if (step.arrow === 'bottom') {
        tTop = rect.bottom + 20;
        if (tTop > wH - 240) tTop = rect.top - 220;
      } else {
        tTop = wH / 2 - 100;
      }
      tLeft = Math.max(20, Math.min(rect.left, wW - 360));
      tt.style.top = tTop + 'px';
      tt.style.left = tLeft + 'px';
      tt.style.transform = 'translate(0, 0)';
    },
    next: function() {
      this.current++;
      if (this.current >= this.steps.length) this.finish();
      else this.showStep(this.current);
    },
    finish: function() {
      var self = this;
      try { localStorage.setItem(this.userKey, 'done'); } catch(e){}
      if (this.overlay) {
        this.overlay.style.opacity = '0';
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'translateY(20px)';
        if (this.highlight) this.highlight.style.display = 'none';
        setTimeout(function(){
          if (self.overlay) self.overlay.remove();
          if (self.tooltip) self.tooltip.remove();
          if (self.highlight) self.highlight.remove();
        }, 400);
      }
    }
  };
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function(){ ChizenOnboarding.init(); });
  else
    ChizenOnboarding.init();
})();
