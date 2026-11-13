// reviews.js - نظام التقييمات مع Firebase Auth
(function(){
// Firebase init (بدون إعادة تهيئة)
// chizen.html يهيئ Firebase بالفعل، لذا لا نعيد التهيئة
var db = window.db || (window.FB && window.FB.db);
if (!db) {
  // إذا لم يكن هناك db (لأننا في details.html مثلاً)، نهيئ Firebase
  if (window.FIREBASE_CONFIG && !firebase.apps.length) {
    try { firebase.initializeApp(window.FIREBASE_CONFIG); } catch(e) {}
  }
  db = firebase.firestore();
  window.db = db;
}
console.log('[REVIEWS] db ready:', !!db);

  
window.showToast = function(msg) {
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 10px 25px rgba(0,0,0,0.3);';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
};

  window.selectedRating = 0;
  var myReviewId = null;
  var myReviewData = null;
  var currentUserId = null;
  var authReady = false;

  // تهيئة Firebase Auth
  function initAuth() {
    if (!window.firebase || !firebase.auth) {
      console.error('[AUTH] Firebase Auth not available');
      showToast('❌ Firebase Auth غير متاح');
      return;
    }
    var auth = firebase.auth();
    console.log('[AUTH] Got auth instance');
    auth.onAuthStateChanged(function(user) {
      console.log('[AUTH] State changed:', user ? user.uid : 'null');
      if (user) {
        currentUserId = user.uid;
        authReady = true;
        console.log('[AUTH] Signed in:', user.uid);
        if ((window.currentProduct || (window.APP && window.APP.currentProd))) loadReviews();
        if (pendingReview) { pendingReview.userId = user.uid; doSubmitReview(); }
      } else {
        auth.signInAnonymously().then(function(result) {
          currentUserId = result.user.uid;
          authReady = true;
          console.log('[AUTH] Anonymous:', result.user.uid);
          if ((window.currentProduct || (window.APP && window.APP.currentProd))) loadReviews();
          if (pendingReview) { pendingReview.userId = currentUserId; doSubmitReview(); }
        }).catch(function(err) {
          console.error('[AUTH] Failed:', err.code, err.message);
          showToast('❌ Auth: ' + err.code);
          currentUserId = 'guest_' + Math.random().toString(36).substr(2, 9);
          if ((window.currentProduct || (window.APP && window.APP.currentProd))) loadReviews();
        });
      }
    });
  }

  // تفعيل النجوم (مع انتظار ظهورها)
  var starsAttached = false;
  function setupStars() {
    if (starsAttached) return;
    var stars = document.querySelectorAll('#starInput i');
    if (!stars.length) return;
    stars.forEach(function(star) {
      star.addEventListener('mouseover', function() { highlightStars(this.dataset.value); });
      star.addEventListener('mouseout', function() { highlightStars(window.selectedRating); });
      star.addEventListener('click', function() {
        window.selectedRating = Number(this.dataset.value);
        highlightStars(window.selectedRating);
      });
    });
    starsAttached = true;
    console.log('[STARS] Events attached to', stars.length, 'stars');
  }

  // محاولة ربط النجوم كل 300ms حتى تظهر

  // استخدام MutationObserver بدلاً من setInterval (أكثر كفاءة)
  var observer = new MutationObserver(function() {
    setupStars();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  // محاولة أولية
  setTimeout(setupStars, 100);


  window.highlightStars = function(count) {
    document.querySelectorAll('#starInput i').forEach(function(star) {
      if (Number(star.dataset.value) <= count) star.classList.add('active');
      else star.classList.remove('active');
    });
  };

  // إرسال تقييم
  var pendingReview = null;

  function doSubmitReview() {
    if (!pendingReview) return;
    var review = pendingReview;
    pendingReview = null;
    
    db.collection('reviews').add(review).then(function() {
      showToast('✅ شكراً لك! تم إرسال تقييمك بنجاح');
      document.getElementById('reviewFormContainer').style.display = 'none';
      // document.getElementById('alreadyReviewedMsg').style.display = 'block'; // removed
      loadReviews();
    }).catch(function(e) {
      console.error('[REVIEW] Error:', e);
      showToast('❌ فشل: ' + e.message);
    });
  }

  window.submitReview = function() {
    console.log('[REVIEW] submitReview called!', {
      selectedRating: window.selectedRating,
      currentProduct: !!window.currentProduct,
      appCurrentProd: !!(window.APP && window.APP.currentProd),
      dbReady: !!db,
      textareaValue: document.getElementById('reviewText') ? document.getElementById('reviewText').value : 'NO TEXTAREA'
    });
    // التحقق من النجوم
    if (!window.selectedRating || window.selectedRating === 0) {
      window.showToast('⚠️ اختر عدد النجوم أولاً');
      return;
    }
    
    // التحقق من المنتج
    var prod = window.currentProduct || (window.APP && window.APP.currentProd);
    if (!prod) {
      window.showToast('⚠️ المنتج غير محمل');
      return;
    }
    
    // التحقق من النص
    var textEl = document.getElementById('reviewText');
    var text = textEl ? textEl.value.trim() : '';
    
    // التحقق من db
    if (!db) {
      window.showToast('❌ خطأ في الاتصال');
      console.error('[REVIEW] db is null', { windowDb: window.db, FB: window.FB, firebase: !!window.firebase });
      return;
    }
    
    // تشخيص
    console.log('[REVIEW] Submitting:', {
      productId: prod.id,
      rating: window.selectedRating,
      text: text,
      userId: currentUserId,
      dbReady: !!db
    });
    
    // إنشاء بيانات التقييم
    var reviewData = {
      productId: prod.id,
      userId: currentUserId || 'pending',
      rating: Number(window.selectedRating),
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      dislikes: 0
    };
    
    // إرسال التقييم
    db.collection('reviews').add(reviewData).then(function() {
      window.showToast('✅ شكراً لك! تم إرسال تقييمك');
      var form = document.getElementById('reviewFormContainer');
      // var msg = document.getElementById('alreadyReviewedMsg'); // removed
      if (form) form.style.display = 'none';
      if (msg) msg.style.display = 'block';
      if (typeof window.loadReviews === 'function') window.loadReviews();
    }).catch(function(e) {
      console.error('[REVIEW] Error:', e);
      window.showToast('❌ فشل: ' + e.message);
    });
  };

  // جلب التقييمات
  window.loadReviews = function() {
  var prod = window.currentProduct || (window.APP && window.APP.currentProd);
  if (!prod || !prod.id) return; // لا يوجد منتج حالي
  
  var list = document.getElementById('reviewsList');
  var formContainer = document.getElementById('reviewFormContainer');
  var alreadyMsg = document.getElementById('alreadyReviewedMsg');
  
  // 1. عرض مؤشر تحميل فوري (Skeleton) للسرعة
  if (list) list.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;font-size:12px;">⏳ جاري تحميل التقييمات...</div>';
  if (formContainer) formContainer.style.display = 'block';
  if (alreadyMsg) alreadyMsg.style.display = 'none';

  // 2. الحصول على الـ ID الحالي وحفظه في متغير محلي لعزل الطلب
  var targetProductId = String(prod.id);
  
  // 3. إلغاء أي طلب سابق (إذا وجد)
  if (window._reviewLoadToken) {
    window._reviewLoadToken.cancelled = true;
  }
  var currentToken = { cancelled: false };
  window._reviewLoadToken = currentToken;

  // 4. انتظار بسيط لـ currentUserId إذا لم يكن جاهزاً
  if (typeof currentUserId === 'undefined' || !currentUserId) {
    setTimeout(function() { 
      if (!currentToken.cancelled) window.loadReviews(); 
    }, 300);
    return;
  }

  db.collection('reviews')
    .where('productId', '==', targetProductId)
    .limit(20)
    .get()
    .then(function(snapshot) {
      // ═══ الحماية الصارمة: إذا تم إلغاء الطلب أو تغير المنتج، لا نعرض شيئاً ═══
      if (currentToken.cancelled) {
        console.log("[Reviews] Request cancelled (product changed)");
        return;
      }
      var currentProdNow = window.currentProduct || (window.APP && window.APP.currentProd);
      if (!currentProdNow || String(currentProdNow.id) !== targetProductId) {
        console.log("[Reviews] Product changed during load, aborting render");
        return;
      }
      // ═══════════════════════════════════════════════════════════════════════════

      if (!list) return;
      list.innerHTML = '';
      
      if (snapshot.empty) {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:12px;">لا توجد تقييمات بعد. كن أول من يقيم!</div>';
        return;
      }
      
      var reviews = [];
      snapshot.forEach(function(doc) {
        var r = doc.data();
        r.id = doc.id;
        reviews.push(r);
      });
      
      // ترتيب حسب الأحدث
      reviews.sort(function(a, b) {
        var ta = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        var tb = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return tb - ta;
      });
      
      // البحث عن تقييم المستخدم الحالي
      var myReviewId = null;
      reviews.forEach(function(r) {
        if (r.userId === currentUserId) myReviewId = r.id;
      });
      
      // إخفاء النموذج وإظهار رسالة إذا كان المستخدم قد قيّم مسبقاً
      if (myReviewId) {
        if (formContainer) formContainer.style.display = 'none';
        if (alreadyMsg) alreadyMsg.style.display = 'block';
      } else {
        if (formContainer) formContainer.style.display = 'block';
        if (alreadyMsg) alreadyMsg.style.display = 'none';
      }
      
      // عرض التقييمات
      reviews.forEach(function(r) {
        var starsHtml = '';
        for (var i = 1; i <= 5; i++) {
          starsHtml += '<i class="' + (i <= r.rating ? 'fas' : 'far') + ' fa-star"></i>';
        }
        
        var card = document.createElement('div');
        card.className = 'review-card';
        
        var header = document.createElement('div');
        header.className = 'review-header';
        
        var userSpan = document.createElement('span');
        userSpan.className = 'review-user';
        if (r.userId === currentUserId) {
          userSpan.innerHTML = 'أنت <button onclick="editMyReview()" style="background:transparent;border:none;color:#3b82f6;cursor:pointer;font-size:14px;padding:0 4px;" title="تعديل تقييمك">✏️</button>';
        } else {
          userSpan.textContent = 'عميل';
        }
        
        var dateSpan = document.createElement('span');
        dateSpan.className = 'review-date';
        dateSpan.textContent = (r.createdAt ? 'مؤخراً' : 'الآن');
        
        header.appendChild(userSpan);
        header.appendChild(dateSpan);
        
        var starsContainer = document.createElement('div');
        starsContainer.className = 'review-stars';
        starsContainer.innerHTML = starsHtml;
        
        card.appendChild(header);
        card.appendChild(starsContainer);
        
        if (r.comment && r.comment.trim() !== '') {
          var textP = document.createElement('p');
          textP.className = 'review-text';
          textP.textContent = r.comment;
          card.appendChild(textP);
        }
        
        list.appendChild(card);
      });
    })
    .catch(function(e) {
      if (currentToken.cancelled) return;
      console.error('[REVIEWS] Load error:', e);
      if (list) list.innerHTML = '<div style="text-align:center;padding:15px;color:#ef4444;font-size:12px;">⚠️ فشل تحميل التقييمات</div>';
    });
};


          var dislikeBtn = document.createElement('button');
          dislikeBtn.className = 'action-btn';
          dislikeBtn.innerHTML = '<i class="far fa-thumbs-down"></i> <span>' + (r.dislikes || 0) + '</span>';
          dislikeBtn.onclick = function() { voteReview(r.id, 'dislike', this); };
          actions.appendChild(likeBtn);
          actions.appendChild(dislikeBtn);
          card.appendChild(actions);

          list.appendChild(card);
        });
      })
      .catch(function(e) {
        console.error('[REVIEWS] Load error:', e);
        list.innerHTML = '<div style="text-align:center;padding:15px;color:#ef4444;font-size:12px;">⚠️ فشل تحميل التقييمات</div>';
      });
  };

  // إعجاب/عدم إعجاب
  window.voteReview = function(reviewId, type, btn) {
    if (!currentUserId) {
      showToast('⚠️ يرجى تسجيل الدخول');
      return;
    }
    var field = type === 'like' ? 'likes' : 'dislikes';
    var span = btn.querySelector('span');
    var count = parseInt(span.textContent) + 1;
    span.textContent = count;
    btn.classList.add(type === 'like' ? 'active-like' : 'active-dislike');
    btn.disabled = true;
    var update = {};
    update[field] = firebase.firestore.FieldValue.increment(1);
    db.collection('reviews').doc(reviewId).update(update).catch(function() {});
  };

  // دالة تعديل التقييم
  window.editMyReview = function() {
    if (!myReviewData) return;
    selectedRating = myReviewData.rating;
    highlightStars(window.selectedRating);
    document.getElementById('reviewText').value = myReviewData.text || '';
    document.getElementById('reviewFormContainer').style.display = 'block';
    document.getElementById('alreadyReviewedMsg').style.display = 'none'; // يبقى مخفياً
  };

  // بدء التشغيل
  initAuth();
  
  var tries = 0;
  // setInterval removed for performance

})();
