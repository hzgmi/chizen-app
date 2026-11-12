
// dynamic-search.js - محسّن للأداء (Performance Optimized)
(function(){
  var input = null;
  var phrases = [];
  var idx = 0;
  var lastUpdate = 0;
  var frameId = null;
  var activeAnimation = false;

  // تحديث النص باستخدام requestAnimationFrame
  function tick(timestamp) {
    if (!input) {
      input = document.getElementById('search-in-new') || document.getElementById('search-in');
    }
    if (!input) {
      frameId = requestAnimationFrame(tick);
      return;
    }

    // نحدث كل 3 ثوانٍ فقط
    if (timestamp - lastUpdate > 3000) {
      if (phrases.length === 0 && window.APP && window.APP.products && window.APP.products.length > 0) {
        var prods = window.APP.products;
        var shuffled = prods.slice().sort(function(){ return Math.random() - 0.5; });
        for (var i = 0; i < Math.min(5, shuffled.length); i++) {
          phrases.push(shuffled[i].name || 'منتج');
        }
        phrases.push('عروض خاطفة');
        phrases.push('أفضل الأسعار');
        phrases.push('تسوق الآن');
      }

      if (phrases.length > 0) {
        // تطبيق will-change قبل الحركة
        if (!activeAnimation) {
          input.style.willChange = 'transform, opacity';
          input.style.backfaceVisibility = 'hidden';
          activeAnimation = true;
        }

        input.placeholder = 'ابحث عن: ' + phrases[idx % phrases.length] + '...';
        idx++;

        // إزالة will-change بعد انتهاء الحركة (بعد 1 ثانية من التحديث)
        clearTimeout(input._willChangeTimer);
        input._willChangeTimer = setTimeout(function(){
          input.style.willChange = 'auto';
          activeAnimation = false;
        }, 1000);
      }
      lastUpdate = timestamp;
    }
    frameId = requestAnimationFrame(tick);
  }

  // بدء الحركة بعد تحميل البيانات
  var tries = 0;
  var checkData = setInterval(function(){
    tries++;
    var inputExists = document.getElementById('search-in-new') || document.getElementById('search-in');
    if (inputExists && window.APP && window.APP.products && window.APP.products.length > 0) {
      clearInterval(checkData);
      frameId = requestAnimationFrame(tick);
    }
    if (tries > 40) clearInterval(checkData);
  }, 500);
})();
