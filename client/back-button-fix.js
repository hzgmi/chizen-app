/* منع زر الرجوع من إغلاق التطبيق وإظهار تنبيه بدلًا من ذلك */
(function(){
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', function() {
      var currentScreen = window.APP && window.APP.currentScreenId ? window.APP.currentScreenId : 'home';
      
      if (currentScreen !== 'home') {
        // إذا كان في صفحة داخلية، ارجع للرئيسية
        if (window.APP && window.APP.goTab) window.APP.goTab('home');
      } else {
        // إذا كان في الرئيسية، لا تغلق التطبيق فوراً، بل أظهر تنبيهاً
        if (window.APP && window.APP.toast) {
          window.APP.toast('اضغط مرة أخرى للخروج');
        }
        // انتظر 2 ثانية قبل الإغلاق الفعلي (نظام أندرويد)
        var lastBackPress = window._lastBackPress || 0;
        var now = Date.now();
        if (now - lastBackPress < 2000) {
          window.Capacitor.Plugins.App.exitApp();
        }
        window._lastBackPress = now;
      }
    });
  }
})();
