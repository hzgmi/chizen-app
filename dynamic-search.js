
// dynamic-search.js - النص الديناميكي للبحث
(function(){
  var input = null;
  var phrases = [];
  var idx = 0;

  function updatePlaceholder() {
    if (!input) {
      input = document.getElementById('search-in-new') || document.getElementById('search-in');
    }
    if (!input) return;

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
      input.placeholder = 'ابحث عن: ' + phrases[idx % phrases.length] + '...';
      idx++;
    }
  }

  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    var inputExists = document.getElementById('search-in-new') || document.getElementById('search-in');
    if (inputExists && window.APP && window.APP.products && window.APP.products.length > 0) {
      clearInterval(iv);
      updatePlaceholder();
      setInterval(updatePlaceholder, 3000);
    }
    if (tries > 40) clearInterval(iv);
  }, 500);
})();
