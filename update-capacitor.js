const fs = require('fs');
const file = 'capacitor.config.json';
let cfg = JSON.parse(fs.readFileSync(file, 'utf8'));

cfg.plugins = cfg.plugins || {};

cfg.plugins.SplashScreen = {
  launchShowDuration: 2000,
  launchAutoHide: true,
  launchFadeOutDuration: 500,
  backgroundColor: "#0a0a15",
  androidSplashResourceName: "splash",
  androidScaleType: "CENTER_CROP",
  showSpinner: false,
  splashFullScreen: true,
  splashImmersive: true
};

cfg.plugins.StatusBar = {
  style: "DARK",
  backgroundColor: "#0a0a15",
  overlaysWebView: false
};

fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
console.log('✅ تم تحديث capacitor.config.json');
console.log(fs.readFileSync(file, 'utf8'));
