const fs = require('fs');
const file = 'firestore.rules';
let rules = fs.readFileSync(file, 'utf8');

const oldRule = /match \/notifications\/\{id\}\s*\{[\s\S]*?\}/;
const newRule = `match /notifications/{id} {
      allow read: if isSignedIn();
      allow create: if isAdmin();
      allow update, delete: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
    }`;

if (oldRule.test(rules)) {
  rules = rules.replace(oldRule, newRule);
  fs.writeFileSync(file, rules);
  console.log('✅ تم تحديث قاعدة الإشعارات.');
  console.log('  الآن المستخدم يستطيع حذف إشعاراته فقط.');
} else {
  console.log('⚠️ لم يجد قاعدة notifications.');
}
