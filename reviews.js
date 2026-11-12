// reviews.js - نظام التقييمات مع Firebase Auth
(function(){
// Firebase init (مستقل)
if (window.FIREBASE_CONFIG && !firebase.apps.length) {
  try {
    firebase.initializeApp(window.FIREBASE_CONFIG);
    console.log('[REVIEWS] Firebase initialized');
  } catch(e) {
    console.error('[REVIEWS] Firebase init error:', e.message);
  }
}
var db = window.db || (window.FB && window.FB.db) || firebase.firestore();
if (!window.db && db) window.db = db;
console.log('[REVIEWS] db ready:', !!db);
console.log('[REVIEWS] auth ready:', !!firebase.auth);

  
window.showToast = function(msg) {
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 10px 25px rgba(0,0,0,0.3);';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
};

  var selectedRating = 0;
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
      star.addEventListener('mouseout', function() { highlightStars(selectedRating); });
      star.addEventListener('click', function() {
        selectedRating = Number(this.dataset.value);
        highlightStars(selectedRating);
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
      document.getElementById('alreadyReviewedMsg').style.display = 'block';
      loadReviews();
    }).catch(function(e) {
      console.error('[REVIEW] Error:', e);
      showToast('❌ فشل: ' + e.message);
    });
  }

  window.submitReview = function() {
    if (selectedRating === 0) {
      showToast('⚠️ اختر عدد النجوم أولاً');
      return;
    }
    var text = document.getElementById('reviewText').value.trim();
    if (!(window.currentProduct || (window.APP && window.APP.currentProd))) {
      showToast('⚠️ المنتج غير محمل');
      return;
    }

    var reviewData = {
      productId: (window.currentProduct || (window.APP && window.APP.currentProd)).id,
      userId: currentUserId || 'pending',
      rating: Number(selectedRating),
      text: text,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    if (myReviewId) {
      // تحديث التقييم الموجود
      db.collection('reviews').doc(myReviewId).update(reviewData).then(function() {
        showToast('✅ شكراً لك! تم تحديث تقييمك');
        document.getElementById('reviewFormContainer').style.display = 'none';
        loadReviews();
      }).catch(function(e) {
        showToast('❌ فشل: ' + e.message);
      });
      return;
    }
    
    pendingReview = {
      productId: (window.currentProduct || (window.APP && window.APP.currentProd)).id,
      userId: currentUserId || 'pending',
      rating: Number(selectedRating),
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      dislikes: 0
    };

    if (authReady && currentUserId) {
      pendingReview.userId = currentUserId;
      doSubmitReview();
    } else {
      showToast('⏳ جاري الإرسال...');
      // محاولة الإرسال بعد 3 ثوانٍ حتى لو Auth لم يكتمل
      setTimeout(function() {
        if (!authReady && pendingReview) {
          showToast('⚠️ فشل الاتصال. تحقق من Anonymous Auth في Firebase');
        }
      }, 3000);
      // سيتم الإرسال تلقائياً عند اكتمال Auth (في onAuthStateChanged)
    }
  };

  // جلب التقييمات
  window.loadReviews = function() {
    if (!(window.currentProduct || (window.APP && window.APP.currentProd))) return;
    var list = document.getElementById('reviewsList');
    if (!list) return;

    db.collection('reviews')
      .where('productId', '==', (window.currentProduct || (window.APP && window.APP.currentProd)).id)
      .limit(20)
      .get()
      .then(function(snapshot) {
        list.innerHTML = '';
        if (snapshot.empty) {
          list.innerHTML = '<div style="text-align:center;padding:15px;color:#94a3b8;font-size:12px;">لا توجد تقييمات بعد. كن أول من يقيم!</div>';
          return;
        }
        var reviews = [];
        snapshot.forEach(function(doc) {
          var r = doc.data();
          r.id = doc.id;
          reviews.push(r);
        });
        reviews.sort(function(a, b) {
          var ta = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
          var tb = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
          return tb - ta;
        });
        // البحث عن تقييم المستخدم الحالي
        myReviewId = null;
        myReviewData = null;
        reviews.forEach(function(r) {
          if (r.userId === currentUserId) {
            myReviewId = r.id;
            myReviewData = r;
          }
        });
        // إذا كان لديه تقييم، اعرض زر التعديل بدلاً من النموذج
        var formContainer = document.getElementById('reviewFormContainer');
        var alreadyMsg = document.getElementById('alreadyReviewedMsg');
        if (myReviewId) {
          if (formContainer) formContainer.style.display = 'none';
          if (alreadyMsg) alreadyMsg.style.display = 'none';
        } else {
          if (formContainer) formContainer.style.display = 'block';
          if (alreadyMsg) alreadyMsg.style.display = 'none';
        }
        
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
          card.appendChild(header);

          var starsDiv = document.createElement('div');
          starsDiv.className = 'review-stars';
          starsDiv.innerHTML = starsHtml;
          card.appendChild(starsDiv);

          var textP = document.createElement('p');
          textP.className = 'review-text';
          textP.textContent = r.text || 'تقييم سريع';
          card.appendChild(textP);

          var actions = document.createElement('div');
          actions.className = 'review-actions';
          var likeBtn = document.createElement('button');
          likeBtn.className = 'action-btn';
          likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i> <span>' + (r.likes || 0) + '</span>';
          likeBtn.onclick = function() { voteReview(r.id, 'like', this); };
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
    highlightStars(selectedRating);
    document.getElementById('reviewText').value = myReviewData.text || '';
    document.getElementById('reviewFormContainer').style.display = 'block';
    document.getElementById('alreadyReviewedMsg').style.display = 'none';
  };

  // بدء التشغيل
  initAuth();
  
  var tries = 0;
  // setInterval removed for performance

})();
