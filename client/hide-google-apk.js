/* إخفاء زر جوجل داخل التطبيق (APK) لأنه لا يعمل بدون Native Plugin */
(function(){
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    document.addEventListener('DOMContentLoaded', function() {
      var googleBtn = document.getElementById('btn-google');
      if (googleBtn) {
        googleBtn.style.display = 'none';
      }
      var divider = document.querySelector('.divider');
      if (divider) {
        divider.style.display = 'none';
      }
    });
  }
})();
