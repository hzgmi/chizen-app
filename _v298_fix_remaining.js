const fs = require('fs');
let h = fs.readFileSync('client/chizen.html', 'utf8');
const before = h.length;

// ═══ 1. إصلاح نص 7828 (ارفع على imgbb) ═══
const oldText = '<div style="font-size:10px;color:#9ca3af;margin-top:4px;">ارفع على <a href="https://imgbb.com" target="_blank" style="color:#10b981;text-decoration:underline;">imgbb.com</a> وضع الرابط المباشر (Direct Link)</div>';
const newText = '<div style="font-size:10px;color:#9ca3af;margin-top:4px;">ارفع صورة السند مباشرة — تُحفظ بأمان</div>';
if (h.includes(oldText)) {
  h = h.replace(oldText, newText);
  console.log('✅ 1: نص 7828 محدّث');
} else {
  console.log('⚠️ 1: النص لم يعد موجوداً');
}

// ═══ 2. استبدال كتلة الرفع بـ imgbb (شراء النقاط) ═══
// نبحث عن بداية الكتلة ونهايتها بدقة
const startMarker = "      var formData = new FormData();\n      formData.append('image', file);\n      var IMGBB_KEY = '0207a2f59e64d6e294ab7974e44d23aa';\n\n      var imgRes = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, {\n        method: 'POST',\n        body: formData\n      });\n      var imgData = await imgRes.json();\n\n      if (!imgData.success) throw new Error('فشل رفع الصورة');";

const startIdx = h.indexOf(startMarker);
if (startIdx === -1) {
  console.log('❌ startMarker not found');
  console.log('محاولة صيغة بديلة...');
  // صيغة بديلة (بدون \n دقيقة)
  const altRegex = /var formData = new FormData\(\);\s*formData\.append\(['"]image['"], file\);\s*var IMGBB_KEY = ['"]0207a2f59e64d6e294ab7974e44d23aa['"];\s*var imgRes = await fetch\(['"]https:\/\/api\.imgbb\.com\/1\/upload\?key=['"] \+ IMGBB_KEY,\s*\{[^}]+\}\);\s*var imgData = await imgRes\.json\(\);\s*if \(!imgData\.success\) throw new Error\(['"]فشل رفع الصورة['"]\);/;
  
  const m = h.match(altRegex);
  if (!m) {
    console.log('❌ alt regex also failed');
    process.exit(1);
  }
  
  const replacement = [
    "// ═══ v298: Cloudflare Worker + compress ═══",
    "      function __compressImg(file){",
    "        return new Promise(function(resolve,reject){",
    "          var im=new Image(),u=URL.createObjectURL(file);",
    "          im.onload=function(){",
    "            URL.revokeObjectURL(u);",
    "            var w=im.width,hh=im.height,md=1400;",
    "            if(w>md||hh>md){if(w>hh){hh=Math.round(hh*md/w);w=md;}else{w=Math.round(w*md/hh);hh=md;}}",
    "            var c=document.createElement('canvas');c.width=w;c.height=hh;",
    "            c.getContext('2d').drawImage(im,0,0,w,hh);",
    "            c.toBlob(function(b){b?resolve(b):reject(new Error('compress failed'));},'image/jpeg',0.85);",
    "          };",
    "          im.onerror=function(){URL.revokeObjectURL(u);reject(new Error('load failed'));};",
    "          im.src=u;",
    "        });",
    "      }",
    "      var __WORKER='https://chizen-uploader.hazimchat.workers.dev';",
    "      var __compressed=await __compressImg(file);",
    "      console.log('[V298] Original:',Math.round(file.size/1024)+'KB -> Compressed:',Math.round(__compressed.size/1024)+'KB');",
    "      var __res=await fetch(__WORKER,{method:'POST',headers:{'Content-Type':'image/jpeg'},body:__compressed});",
    "      if(!__res.ok) throw new Error('فشل رفع '+__res.status);",
    "      var imgData=await __res.json();",
    "      if(!imgData.url) throw new Error('لا رابط عائد');"
  ].join('\n');
  
  h = h.replace(altRegex, replacement);
  console.log('✅ 2: كتلة الرفع مستبدلة');
} else {
  // استبدال دقيق عبر indices
  const endMarker = "      if (!imgData.success) throw new Error('فشل رفع الصورة');";
  const endIdx = h.indexOf(endMarker, startIdx);
  if (endIdx === -1) { console.log('❌ endMarker not found'); process.exit(1); }
  
  const replacement = [
    "// ═══ v298: Cloudflare Worker + compress ═══",
    "      function __compressImg(file){",
    "        return new Promise(function(resolve,reject){",
    "          var im=new Image(),u=URL.createObjectURL(file);",
    "          im.onload=function(){",
    "            URL.revokeObjectURL(u);",
    "            var w=im.width,hh=im.height,md=1400;",
    "            if(w>md||hh>md){if(w>hh){hh=Math.round(hh*md/w);w=md;}else{w=Math.round(w*md/hh);hh=md;}}",
    "            var c=document.createElement('canvas');c.width=w;c.height=hh;",
    "            c.getContext('2d').drawImage(im,0,0,w,hh);",
    "            c.toBlob(function(b){b?resolve(b):reject(new Error('compress failed'));},'image/jpeg',0.85);",
    "          };",
    "          im.onerror=function(){URL.revokeObjectURL(u);reject(new Error('load failed'));};",
    "          im.src=u;",
    "        });",
    "      }",
    "      var __WORKER='https://chizen-uploader.hazimchat.workers.dev';",
    "      var __compressed=await __compressImg(file);",
    "      console.log('[V298] Original:',Math.round(file.size/1024)+'KB -> Compressed:',Math.round(__compressed.size/1024)+'KB');",
    "      var __res=await fetch(__WORKER,{method:'POST',headers:{'Content-Type':'image/jpeg'},body:__compressed});",
    "      if(!__res.ok) throw new Error('فشل رفع '+__res.status);",
    "      var imgData=await __res.json();",
    "      if(!imgData.url) throw new Error('لا رابط عائد');"
  ].join('\n');
  
  h = h.slice(0, startIdx) + replacement + h.slice(endIdx + endMarker.length);
  console.log('✅ 2: كتلة الرفع مستبدلة');
}

// ═══ 3. تحديث receiptUrl (من imgData.data.url إلى imgData.url) ═══
if (h.includes('receiptUrl: imgData.data.url,')) {
  h = h.replace('receiptUrl: imgData.data.url,', 'receiptUrl: imgData.url,');
  console.log('✅ 3: receiptUrl محدّث');
}

fs.writeFileSync('client/chizen.html', h);
console.log('━━━━━━━━━━━━━━━━━━');
console.log('الحجم:', before, '->', h.length);
console.log('imgbb متبقي:', (h.match(/imgbb/gi) || []).length);
console.log('Worker مستخدم:', (h.match(/chizen-uploader\.hazimchat\.workers\.dev/g) || []).length);
