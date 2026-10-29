const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

// فحص: مطبق مسبقاً؟
if (h.indexOf("v310-splash-logo") !== -1) {
  console.log("⚠️ v310 مطبق مسبقاً");
  process.exit(0);
}

// إيجاد img الشعار القديم
var imgRegex = /<img\s+src="https:\/\/i\.ibb\.co\/FkvCmDwy\/logo\.png"[^>]*>/;
var match = h.match(imgRegex);
if (!match) {
  console.error("❌ old logo img not found");
  process.exit(1);
}

console.log("📌 old logo:", match[0].slice(0, 80) + "...");

// الشعار الجديد — CSS extraction
var newLogo = '<div id="v310-splash-logo" style="' +
  'width:140px;height:140px;' +
  'background-image:url(\'https://i.ibb.co/RVGHPhr/file-00000000b0a4822f87083997663d8e76.png\');' +
  'background-size:200% 200%;' +
  'background-position:100% 0%;' +
  'background-repeat:no-repeat;' +
  '-webkit-mask-image:none;' +
  'mask-image:none;' +
  'filter:drop-shadow(0 8px 24px rgba(168,85,247,0.35));' +
  '"></div>';

// استبدال
h = h.replace(match[0], newLogo);

// إضافة CSS override لإزالة mask عنصر .chz-sp-logo القديم (احتياط)
var cssOverride = '<style id="v310-css">\n' +
  '  #chz-splash-v63 #v310-splash-logo {\n' +
  '    -webkit-mask-image: none !important;\n' +
  '    mask-image: none !important;\n' +
  '  }\n' +
  '</style>\n';

// حقن CSS قبل </head>
var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head> not found"); process.exit(1); }
h = h.slice(0, headEnd) + cssOverride + h.slice(headEnd);

// كتابة
fs.writeFileSync(target, h);

console.log("✅ v310: splash logo replaced");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
