const fs = require("fs");
const target = "client/chizen.html";
var h = fs.readFileSync(target, "utf8");
var before = h.length;

if (h.indexOf("v329-product-fix") !== -1) {
  console.log("⚠️ v329 مطبق مسبقاً");
  process.exit(0);
}

// ═══ 1. تحديث skeleton بالشعار ═══
var newSkeletonCss = '\n<style id="v329-product-fix">\n' +
'  /* Skeleton بالشعار الفضي */\n' +
'  .v328-skeleton-img::before {\n' +
'    content: "CHIZEN";\n' +
'    position: absolute;\n' +
'    top: 50%;\n' +
'    left: 50%;\n' +
'    transform: translate(-50%, -50%);\n' +
'    font-family: "Bodoni Moda", "Tajawal", Georgia, serif;\n' +
'    font-weight: 900;\n' +
'    font-size: 22px;\n' +
'    letter-spacing: 0.12em;\n' +
'    background: linear-gradient(135deg, #b8b8c8 0%, #ffffff 25%, #e0e0ee 42%, #ffffff 55%, #9a9aae 75%, #ffffff 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'    animation: v329SilverShine 3s ease-in-out infinite;\n' +
'    opacity: 0.55;\n' +
'    z-index: 1;\n' +
'  }\n' +
'  html[data-theme="dark"] .v328-skeleton-img::before {\n' +
'    background: linear-gradient(135deg, #6a6a80 0%, #d0d0e0 25%, #9090a8 42%, #e0e0f0 55%, #7a7a92 75%, #c0c0d0 100%);\n' +
'    background-size: 250% 250%;\n' +
'    -webkit-background-clip: text;\n' +
'    background-clip: text;\n' +
'    -webkit-text-fill-color: transparent;\n' +
'  }\n' +
'  @keyframes v329SilverShine {\n' +
'    0%, 100% { background-position: 0% 50%; }\n' +
'    50% { background-position: 100% 50%; }\n' +
'  }\n' +
'  \n' +
'  /* إزالة الفراغ الأبيض - ملء الشاشة */\n' +
'  #app, #screens, .screen {\n' +
'    min-height: 100vh !important;\n' +
'    background: #faf7ff !important;\n' +
'  }\n' +
'  html[data-theme="dark"] #app,\n' +
'  html[data-theme="dark"] #screens,\n' +
'  html[data-theme="dark"] .screen {\n' +
'    background: #0a0825 !important;\n' +
'  }\n' +
'  \n' +
'  /* حواف مدورة جميلة لصور المنتجات */\n' +
'  .prod-i {\n' +
'    height: auto !important;\n' +
'    aspect-ratio: 1 / 1 !important;\n' +
'    border-radius: 16px 16px 0 0 !important;\n' +
'    overflow: hidden !important;\n' +
'    background: #f4f6fa !important;\n' +
'  }\n' +
'  .prod-i img {\n' +
'    width: 100% !important;\n' +
'    height: 100% !important;\n' +
'    object-fit: cover !important;\n' +
'    border-radius: 16px 16px 0 0 !important;\n' +
'  }\n' +
'  \n' +
'  /* الشريط البنفسجي - شفاف وأنيق بدل الصلب */\n' +
'  .prod-b {\n' +
'    background: rgba(255, 255, 255, 0.92) !important;\n' +
'    color: #7c3aed !important;\n' +
'    backdrop-filter: blur(8px) !important;\n' +
'    -webkit-backdrop-filter: blur(8px) !important;\n' +
'    border: 1px solid rgba(124, 58, 237, 0.2) !important;\n' +
'    padding: 4px 10px !important;\n' +
'    font-size: 9.5px !important;\n' +
'    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;\n' +
'  }\n' +
'  \n' +
'  /* skeleton أكبر لملء الشاشة */\n' +
'  .v328-skeleton-card {\n' +
'    min-height: 260px !important;\n' +
'    border-radius: 16px !important;\n' +
'    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04) !important;\n' +
'  }\n' +
'  .v328-skeleton-img {\n' +
'    border-radius: 16px 16px 0 0 !important;\n' +
'  }\n' +
'</style>\n';

var headEnd = h.indexOf("</head>");
if (headEnd === -1) { console.error("❌ </head>"); process.exit(1); }
h = h.slice(0, headEnd) + newSkeletonCss + h.slice(headEnd);

fs.writeFileSync(target, h);
console.log("✅ v329: product fix");
console.log("  قبل:  " + before + " bytes");
console.log("  بعد:  " + h.length + " bytes");
console.log("  فرق:  +" + (h.length - before) + " bytes");
