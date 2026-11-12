// reviews.js - نظام التقييمات مع Firebase Auth
(function(){
  var selectedRating = 0;
  var currentUserId = null;
  var authReady = false;

  // تهيئة Firebase Auth
  function initAuth() {
    if (!window.firebase || !firebase.auth) {
      console.error('[AUTH] Firebase Auth not available');
      return;
    }
    var auth = firebase.auth();
    auth.onAuthStateChanged(function(user) {
      if (user) {
        currentUserId = user.uid;
        authReady = true;
        console.log('[AUTH] Signed in:', user.uid);
        if (window.currentProduct) loadReviews();
        if (pendingReview) { pendingReview.userId = user.uid; doSubmitReview(); }
      } else {
        auth.signInAnonymously().then(function(result) {
          currentUserId = result.user.uid;
          authReady = true;
          console.log('[AUTH] Anonymous:', result.user.uid);
          if (window.currentProduct) loadReviews();
          if (pendingReview) { pendingReview.userId = currentUserId; doSubmitReview(); }
        }).catch(function(err) {
          console.error('[AUTH] Failed:', err.message);
          currentUserId = 'guest_' + Math.random().toString(36).substr(2, 9);
          if (window.currentProduct) loadReviews();
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
  setInterval(setupStars, 300);

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
      showToast('✅ تم إرسال تقييمك');
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
    if (!window.currentProduct) {
      showToast('⚠️ المنتج غير محمل');
      return;
    }

    pendingReview = {
      productId: window.currentProduct.id,
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
      showToast('⏳ جاري الاتصال... سيتم الإرسال تلقائياً');
      // سيتم الإرسال تلقائياً عند اكتمال Auth (في onAuthStateChanged)
    }
  };

  // جلب التقييمات
  window.loadReviews = function() {
    if (!window.currentProduct) return;
    var list = document.getElementById('reviewsList');
    if (!list) return;

    db.collection('reviews')
      .where('productId', '==', window.currentProduct.id)
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
          userSpan.textContent = (r.userId === currentUserId ? 'أنت' : 'عميل');
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

  // بدء التشغيل
  initAuth();
  
  var tries = 0;
  var iv = setInterval(function() {
    tries++;
    if (window.currentProduct) {
      clearInterval(iv);
      if (authReady) loadReviews();
    }
    if (tries > 30) clearInterval(iv);
  }, 500);
})();
