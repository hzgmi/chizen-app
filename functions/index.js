const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.sendBroadcast = functions.region('us-central1').firestore.document('config/broadcast').onWrite(async (change, context) => {
  const data = change.after.data();
  if (!data || data.sent === true) return null;
  const title = data.title || 'CHIZEN';
  const body = data.body || '';
  const type = data.type || 'general';
  const usersSnap = await db.collection('users').get();
  const tokens = [];
  usersSnap.forEach(doc => {
    const t = doc.data().fcmToken;
    if (t && typeof t === 'string' && t.length > 10) tokens.push(t);
  });
  if (!tokens.length) {
    await change.after.ref.update({ sent: true, sentAt: Date.now(), count: 0 });
    return null;
  }
  const chunks = [];
  for (let i = 0; i < tokens.length; i += 500) chunks.push(tokens.slice(i, i + 500));
  let successCount = 0;
  for (const chunk of chunks) {
    try {
      const resp = await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        notification: { title, body },
        data: { type, clickAction: 'OPEN_APP' },
        android: { priority: 'high', notification: { channelId: 'chizen_default', sound: 'default' } },
        webpush: { fcmOptions: { link: '/chizen.html' } }
      });
      successCount += resp.successCount;
    } catch (e) { console.error('chunk failed:', e); }
  }
  await change.after.ref.update({ sent: true, sentAt: Date.now(), count: successCount });
  return null;
});

exports.onOrderStatusChange = functions.region('us-central1').firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const before = change.before.data();
  const after = change.after.data();
  if (before.status === after.status) return null;
  if (!after.userId) return null;
  const titles = { shipped: 'طلبك في الطريق 🚚', completed: 'تم تسليم طلبك ✓', cancelled: 'تم إلغاء الطلب' };
  const bodies = { shipped: 'طلب #' + context.params.orderId + ' خرج من المستودع', completed: 'طلب #' + context.params.orderId + ' جاهز للاستلام', cancelled: 'طلب #' + context.params.orderId + ' تم إلغاؤه' };
  if (!titles[after.status]) return null;
  const userDoc = await db.collection('users').doc(after.userId).get();
  const token = userDoc.exists ? userDoc.data().fcmToken : null;
  if (!token) return null;
  try {
    await admin.messaging().send({
      token,
      notification: { title: titles[after.status], body: bodies[after.status] },
      data: { type: 'order', orderId: context.params.orderId },
      android: { priority: 'high', notification: { channelId: 'chizen_default', sound: 'default' } }
    });
  } catch (e) { console.error('order notif failed:', e); }
  return null;
});
