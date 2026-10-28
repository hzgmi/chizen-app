const fs = require('fs');
let h = fs.readFileSync('client/chizen.html', 'utf8');
const before = h.length;

// 1. حذف التعليق القديم
h = h.replace(/\s*\/\/ Upload via catbox\/tmpfiles\s*\n/, '\n');

// 2. التحقق من fetchWithTimeout
var fwtCount = (h.match(/fetchWithTimeout/g) || []).length;
console.log('fetchWithTimeout ظهور:', fwtCount);

fs.writeFileSync('client/chizen.html', h);
console.log('✅ cleanup |', before, '->', h.length);
console.log('catbox:', (h.match(/catbox/gi) || []).length);
console.log('tmpfiles:', (h.match(/tmpfiles/gi) || []).length);
console.log('Worker:', (h.match(/chizen-uploader\.hazimchat\.workers\.dev/g) || []).length);
