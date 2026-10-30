/* ═══════════════════════════════════════════════════════════════
   CHIZEN AI v2 — Smart Search
   يُبحث في APP.products (onSnapshot live) قبل إرسال AI
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // مرادفات + كلمات مفتاحية
  var SYNONYMS = {
    'عطر':     ['عطر', 'عطور', 'بارفان', 'perfume', 'fragrance'],
    'عطور':    ['عطر', 'عطور', 'بارفان', 'perfume'],
    'حذاء':    ['حذاء', 'أحذية', 'shoe', 'shoes', 'sneakers'],
    'أحذية':   ['حذاء', 'أحذية', 'shoe', 'shoes'],
    'قميص':    ['قميص', 'قمصان', 'shirt', 'tshirt', 'تيشيرت'],
    'فستان':   ['فستان', 'فساتين', 'dress'],
    'ساعة':    ['ساعة', 'ساعات', 'watch'],
    'حقيبة':   ['حقيبة', 'حقيبة يد', 'bag', 'handbag'],
    'شنطة':    ['حقيبة', 'شنطة', 'bag'],
    'جوال':    ['جوال', 'هاتف', 'phone', 'smartphone', 'آيفون', 'سامسونج', 'iphone', 'samsung'],
    'هاتف':    ['جوال', 'هاتف', 'phone', 'smartphone'],
    'لابتوب':  ['لابتوب', 'حاسوب', 'laptop', 'computer', 'macbook'],
    'حاسوب':   ['لابتوب', 'حاسوب', 'laptop'],
    'أريكة':   ['أريكة', 'كنبة', 'sofa', 'couch'],
    'كرسي':    ['كرسي', 'كراسي', 'chair'],
    'طاولة':   ['طاولة', 'مكتب', 'table', 'desk'],
    'سرير':    ['سرير', 'beds', 'bed'],
    'كتاب':    ['كتاب', 'كتب', 'book', 'books'],
    'لعبة':    ['لعبة', 'ألعاب', 'toy', 'toys'],
    'كرة':     ['كرة', 'كرة قدم', 'ball', 'football'],
    'رياضة':   ['رياضة', 'رياضي', 'sport', 'sports'],
    'هدية':    ['عطر', 'حقيبة', 'ساعة', 'وشاح', 'زينة'],
    'رخيص':    ['__CHEAP__'],
    'غالي':    ['__EXPENSIVE__'],
    'فاخر':    ['__EXPENSIVE__']
  };

  var CATEGORY_ALIASES = {
    electronics:  ['إلكترونيات', 'الكترونيات', 'جوال', 'هاتف', 'لابتوب', 'حاسوب', 'iphone', 'samsung', 'apple'],
    fashion:      ['أزياء', 'ازياء', 'موضة', 'فستان', 'فساتين', 'dress'],
    clothing:     ['ملابس', 'قميص', 'قمصان', 'تيشيرت', 'بنطال', 'جاكيت'],
    shoes_bags:   ['أحذية', 'احذية', 'حذاء', 'شنط', 'حقيبة', 'شنطة', 'shoe', 'bag'],
    beauty:       ['جمال', 'عطور', 'عطر', 'مكياج', 'عناية', 'perfume', 'makeup'],
    kids_sports:  ['أطفال', 'اطفال', 'رياضة', 'رياضي', 'لعبة', 'ألعاب'],
    home:         ['منزل', 'أثاث', 'اثاث', 'أريكة', 'كرسي', 'طاولة', 'سرير', 'sofa'],
    supermarket:  ['سوبرماركت', 'بقالة', 'طعام', 'أكل']
  };

  // استخراج الكلمات
  function extractKeywords(query) {
    var q = String(query || '').toLowerCase();
    var tokens = q.split(/[\s,،.؟?!]+/).filter(function (t) { return t.length >= 2; });
    var keys = [];
    tokens.forEach(function (tok) {
      for (var syn in SYNONYMS) {
        if (tok.indexOf(syn) !== -1 || syn.indexOf(tok) !== -1) {
          SYNONYMS[syn].forEach(function (s) {
            if (keys.indexOf(s) === -1) keys.push(s);
          });
        }
      }
      if (keys.indexOf(tok) === -1) keys.push(tok);
    });
    return keys;
  }

  // استخراج نطاق سعري
  function extractPriceRange(query) {
    var q = String(query || '');
    var m = q.match(/تحت\s*(\d+)/) || q.match(/أقل\s*من\s*(\d+)/) || q.match(/< *(\d+)/);
    if (m) return { min: 0, max: Number(m[1]) };
    m = q.match(/فوق\s*(\d+)/) || q.match(/أكثر\s*من\s*(\d+)/) || q.match(/> *(\d+)/);
    if (m) return { min: Number(m[1]), max: Infinity };
    m = q.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (m) return { min: Number(m[1]), max: Number(m[2]) };
    return null;
  }

  // تقييم منتج
  function scoreProduct(p, keys, priceRange) {
    var score = 0;
    var hay = ((p.name || '') + ' ' + (p.brand || '') + ' ' + (p.desc || '') + ' ' + (p.category || '')).toLowerCase();

    keys.forEach(function (k) {
      if (!k || k.indexOf('__') === 0) return;
      if (hay.indexOf(k.toLowerCase()) !== -1) score += 10;
    });

    // قسم
    var cat = p.category || '';
    var aliases = CATEGORY_ALIASES[cat] || [];
    aliases.forEach(function (a) {
      if (keys.some(function (k) { return k.indexOf(a) !== -1 || a.indexOf(k) !== -1; })) score += 15;
    });

    // نطاق السعر
    if (priceRange) {
      var price = Number(p.price) || 0;
      if (price >= priceRange.min && price <= priceRange.max) score += 20;
      else score -= 10;
    }

    // رخيص
    if (keys.indexOf('__CHEAP__') !== -1 && Number(p.price) < 500) score += 15;
    // غالي/فاخر
    if (keys.indexOf('__EXPENSIVE__') !== -1 && Number(p.price) >= 800) score += 15;

    // مخزون
    if (Number(p.stock) > 0) score += 3;

    return score;
  }

  // البحث الرئيسي
  window.__chizenSmartSearch = function (query) {
    try {
      var products = (window.APP && window.APP.products) ? window.APP.products : [];
      if (!products.length) return '';

      var keys = extractKeywords(query);
      if (!keys.length) return '';
      var priceRange = extractPriceRange(query);

      var scored = products
        .map(function (p) { return { p: p, s: scoreProduct(p, keys, priceRange) }; })
        .filter(function (x) { return x.s > 5; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8);

      if (!scored.length) {
        return 'لا توجد منتجات في المتجر تطابق البحث عن "' + query + '" (إجمالي ' + products.length + ' منتج متوفر).';
      }

      var lines = ['منتجات المتجر المطابقة للبحث عن "' + query + '":'];
      scored.forEach(function (x, i) {
        var p = x.p;
        var stock = Number(p.stock);
        lines.push(
          (i + 1) + '. ' + (p.name || '—') +
          ' | ماركة: ' + (p.brand || '—') +
          ' | سعر: ' + (Number(p.price) || 0).toFixed(0) + ' ر.س' +
          ' | قسم: ' + (p.category || '—') +
          ' | ' + (stock > 0 ? 'متوفر (' + stock + ')' : 'نفذ')
        );
      });
      lines.push('إجمالي منتجات المتجر: ' + products.length + '. استخدم هذه البيانات للإجابة بدقة.');
      return lines.join('\n');
    } catch (e) {
      console.warn('[smartsearch] error:', e);
      return '';
    }
  };

  console.log('[v343] smart search ready');
})();
