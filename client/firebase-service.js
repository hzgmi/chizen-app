/* CHIZEN — Firebase Service v3 (Fixed Session) */
window.esc = function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
};

window.FB = {
  app: null, auth: null, db: null,
  ready: false, currentUser: null, currentProfile: null,

  init: async function() {
    if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey) return false;
    try {
      this.app = (!firebase.apps.length)
        ? firebase.initializeApp(window.FIREBASE_CONFIG)
        : firebase.app();
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      /* ═══ الأهم: انتظر setPersistence قبل ready ═══ */
      try {
        this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(){});
        console.log('[FB] setPersistence LOCAL ✓');
      } catch(e) { console.warn('[FB] setPersistence:', e); }

      this.db.enablePersistence().catch(function(err){
        if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
          console.log('[FB] Persistence:', err.code);
        }
      });

      /* ═══ انتظر أول onAuthStateChanged ═══ */
      // إعلان الجاهزية فوراً لتجنب رسالة "جاري التحميل"
      this.ready = true;
      
      // الاستماع لحالة الدخول في الخلفية
      this.auth.onAuthStateChanged(function(user) {
        FB.currentUser = user;
      });
      console.log('[FB] Initialized ✓ currentUser:', this.currentUser ? this.currentUser.uid : 'null');
      return true;
    } catch (e) {
      console.error('[FB] Init failed:', e);
      this.ready = true;
      return false;
    }
  },

  onAuthChange: function(cb) {
    if (!this.ready) { cb(null); return; }
    this.auth.onAuthStateChanged(function(user){
      FB.currentUser = user;
      cb(user);
    });
  },

  loginEmail: async function(email, password) {
    if (!this.ready) throw new Error('Firebase not ready');
    return await this.auth.signInWithEmailAndPassword(email, password);
  },
  signupEmail: async function(email, password) {
    if (!this.ready) throw new Error('Firebase not ready');
    return await this.auth.createUserWithEmailAndPassword(email, password);
  },
  loginGoogle: async function() {
    if (!this.ready) throw new Error('Firebase not ready');
    var provider = new firebase.auth.GoogleAuthProvider();
    return await this.auth.signInWithPopup(provider);
  },
  handleGoogleRedirect: async function() {
    if (!this.ready) return null;
    try {
      var r = await this.auth.getRedirectResult();
      return (r && r.user) ? r.user : null;
    } catch(e) { return null; }
  },
  logout: async function() {
    if (!this.ready) return;
    await this.auth.signOut();
  },
  updateDisplayName: async function(name) {
    if (!this.ready || !this.currentUser) return;
    await this.currentUser.updateProfile({ displayName: name });
    this.currentUser = this.auth.currentUser;
  },
  sendPasswordReset: async function(email) {
    if (!this.ready) throw new Error('Firebase not ready');
    return await this.auth.sendPasswordResetEmail(email);
  },
  getUserId: function() { return this.currentUser ? this.currentUser.uid : null; },
  getUserEmail: function() { return this.currentUser ? this.currentUser.email : null; },
  getUserName: function() { return this.currentUser ? (this.currentUser.displayName || '') : ''; },

  saveUserProfile: async function(data) {
    if (!this.ready || !this.currentUser) return;
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    data.email = this.currentUser.email;
    data.uid = this.currentUser.uid;
    await this.db.collection('users').doc(this.currentUser.uid).set(data, { merge: true });
  },
  getUserProfile: async function() {
    if (!this.ready || !this.currentUser) return null;
    try {
      var doc = await this.db.collection('users').doc(this.currentUser.uid).get();
      this.currentProfile = doc.exists ? doc.data() : null;
      return this.currentProfile;
    } catch(e) { return null; }
  },
  getAllUsers: async function() {
    if (!this.ready) return [];
    try {
      var snap = await this.db.collection('users').limit(500).get();
      var arr = [];
      snap.forEach(function(doc){ var d = doc.data(); d.uid = doc.id; arr.push(d); });
      return arr;
    } catch(e) { return []; }
  },
  deleteUser: async function(uid) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('users').doc(uid).delete();
  },
  getProducts: async function() {
    if (!this.ready) return [];
    try {
      var snap = await this.db.collection('products').limit(500).get();
      var arr = [];
      snap.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      arr.sort(function(a,b){ return ((b.createdAt&&b.createdAt.seconds)||0) - ((a.createdAt&&a.createdAt.seconds)||0); });
      return arr;
    } catch(e) { return []; }
  },
  addProduct: async function(p) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({}, p); delete pl.id;
    pl.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    pl.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    var ref = await this.db.collection('products').add(pl);
    return ref.id;
  },
  updateProduct: async function(id, p) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({}, p); delete pl.id;
    pl.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('products').doc(id).update(pl);
  },
  deleteProduct: async function(id) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('products').doc(id).delete();
  },
  getBanners: async function() {
    if (!this.ready) return null;
    try {
      var doc = await this.db.collection('config').doc('banners').get();
      if (!doc.exists) return null;
      var data = doc.data();
      return (data && data.list && data.list.length) ? data.list : null;
    } catch(e) { return null; }
  },
  setBanners: async function(list) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('config').doc('banners').set({
      list: list,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  },
  getConfig: async function(key) {
    if (!this.ready) return null;
    try {
      var doc = await this.db.collection('config').doc(key).get();
      return doc.exists ? doc.data() : null;
    } catch(e) { return null; }
  },
  setConfig: async function(key, data) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({}, data);
    pl.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('config').doc(key).set(pl, { merge: true });
  },
  getDeal: async function() {
    if (!this.ready) return null;
    try {
      var doc = await this.db.collection('config').doc('deal').get();
      return doc.exists ? doc.data() : null;
    } catch(e) { return null; }
  },
  setDeal: async function(deal) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({}, deal);
    pl.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('config').doc('deal').set(pl, { merge: true });
  },
  deleteDeal: async function() {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('config').doc('deal').delete();
  },
  getUserOrders: async function() {
    if (!this.ready || !this.currentUser) return [];
    try {
      var snap = await this.db.collection('orders').where('userId','==',this.currentUser.uid).limit(200).get();
      var arr = [];
      snap.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      arr.sort(function(a,b){ return ((b.createdAt&&b.createdAt.seconds)||0) - ((a.createdAt&&a.createdAt.seconds)||0); });
      return arr;
    } catch(e) { return []; }
  },
  getAllOrders: async function() {
    if (!this.ready) return [];
    try {
      var snap = await this.db.collection('orders').limit(300).get();
      var arr = [];
      snap.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      arr.sort(function(a,b){ return ((b.createdAt&&b.createdAt.seconds)||0) - ((a.createdAt&&a.createdAt.seconds)||0); });
      return arr;
    } catch(e) { return []; }
  },
  addOrder: async function(order) {
    if (!this.ready) throw new Error('Firebase not ready');
    order.userId = this.getUserId();
    order.userEmail = this.getUserEmail();
    order.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    var ref = await this.db.collection('orders').add(order);
    return ref.id;
  },
  updateOrderStatus: async function(id, status) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('orders').doc(id).update({
      status: status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  deleteOrder: async function(id) {
    if (!this.ready) throw new Error('Firebase not ready');
    await this.db.collection('orders').doc(id).delete();
  },
  getNotifications: async function() {
    if (!this.ready || !this.currentUser) return [];
    try {
      var uid = this.currentUser.uid;
      var a1 = await this.db.collection('notifications').where('userId','==',uid).limit(50).get();
      var a2 = await this.db.collection('notifications').where('userId','==','ALL').limit(50).get();
      var arr = [];
      a1.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      a2.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      arr.sort(function(a,b){ return ((b.createdAt&&b.createdAt.seconds)||0) - ((a.createdAt&&a.createdAt.seconds)||0); });
      return arr.slice(0, 60);
    } catch(e) { return []; }
  },
  addNotification: async function(notif) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({ userId: 'ALL' }, notif);
    pl.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('notifications').add(pl);
  },
  addUserNotification: async function(uid, notif) {
    if (!this.ready) throw new Error('Firebase not ready');
    var pl = Object.assign({ userId: uid }, notif);
    pl.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('notifications').add(pl);
  },
  updateUserPoints: async function(points) {
    if (!this.ready || !this.currentUser) return;
    await this.db.collection('users').doc(this.currentUser.uid).set({
      loyaltyPoints: points,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  },
  addPointsTransaction: async function(t) {
    if (!this.ready || !this.currentUser) return;
    t.userId = this.currentUser.uid;
    t.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.db.collection('users').doc(this.currentUser.uid).collection('points_tx').add(t);
  },
  getPointsTransactions: async function() {
    if (!this.ready || !this.currentUser) return [];
    try {
      var snap = await this.db.collection('users').doc(this.currentUser.uid).collection('points_tx').limit(100).get();
      var arr = [];
      snap.forEach(function(doc){ var d = doc.data(); d.id = doc.id; arr.push(d); });
      return arr;
    } catch(e) { return []; }
  }
};

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', function(){ FB.init(); });
else
  FB.init();
