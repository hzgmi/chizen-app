// urgency.js - شريط الطلب السريع (للعروض الخاطفة فقط)
(function(){
  var timerInterval = null;

  function buildUrgencyBar() {
    if (!window._product) return;
    
    var isFlash = window._product.flashEnabled === true;
    var existingBar = document.querySelector('.urgency-bar');
    
    // إذا لم يكن عرضاً خاطفاً، احذف الشريط إن وجد
    if (!isFlash) {
      if (existingBar) existingBar.remove();
      return;
    }
    
    // إذا كان عرضاً خاطفاً، أضف الشريط (إذا لم يكن موجوداً)
    if (existingBar) return;
    
    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    var bar = document.createElement('div');
    bar.className = 'urgency-bar';
    
    var endsAt = window._product.flashEndsAt;
    var endTime;
    if (endsAt) {
      endTime = new Date(endsAt).getTime();
    } else {
      endTime = new Date();
      endTime.setHours(23, 59, 59, 999);
      endTime = endTime.getTime();
    }

    var stock = window._product.flashStock != null ? Number(window._product.flashStock) : 0;
    var stockText = stock > 0 && stock <= 10 ? 'بقي ' + stock + ' قطع فقط!' : '';

    var html = '<div class="urgency-row">';
    html += '<div class="urgency-label">⏳ ينتهي العرض بعد:</div>';
    html += '<div class="urgency-timer" id="urgency-timer">--:--:--</div>';
    html += '</div>';
    
    html += '<div class="urgency-badges">';
    html += '<div class="urgency-badge badge-cod">💵 دفع عند الاستلام</div>';
    html += '<div class="urgency-badge badge-ship">🚚 توصيل سريع</div>';
    if (stockText) {
      html += '<div class="urgency-badge badge-stock">🔥 ' + stockText + '</div>';
    }
    html += '</div>';
    
    bar.innerHTML = html;
    gallery.parentNode.insertBefore(bar, gallery.nextSibling);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      var now = new Date().getTime();
      var diff = endTime - now;
      if (diff <= 0) {
        clearInterval(timerInterval);
        var timerEl = document.getElementById('urgency-timer');
        if (timerEl) timerEl.textContent = 'انتهى!';
        return;
      }
      var h = Math.floor(diff / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);
      var timerEl = document.getElementById('urgency-timer');
      if (timerEl) {
        timerEl.textContent = 
          String(h).padStart(2, '0') + ':' + 
          String(m).padStart(2, '0') + ':' + 
          String(s).padStart(2, '0');
      }
    }, 1000);
  }

  setInterval(buildUrgencyBar, 800);
})();
