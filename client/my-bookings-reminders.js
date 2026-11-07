/* ═══════════════════════════════════════════════════════════════
   CHIZEN — Smart Reminders & Travel Details
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  window.MyReminders = {
    // حساب الفرق بالأيام بين تاريخين
    daysDiff: function(dateStr) {
      if (!dateStr) return null;
      var parts = dateStr.split('-');
      if (parts.length !== 3) return null;
      var target = new Date(parts[0], parts[1]-1, parts[2]);
      var now = new Date();
      now.setHours(0,0,0,0);
      target.setHours(0,0,0,0);
      var diff = target.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },

    // توليد رسالة تذكير بناءً على نوع الحجز والتاريخ
    generateMessage: function(b) {
      var d = b.data || {};
      var type = b.type;
      var dateStr = d.date || d.checkin;
      if (!dateStr) return null;

      var days = this.daysDiff(dateStr);
      if (days === null) return null;

      // 1. رسائل الرحلات العادية (طيران، باص، فندق)
      if (type === 'flight' || type === 'bus' || type === 'hotel') {
        if (days < 0) return { type: 'past', text: '✈️ نتمنى أن تكون رحلتك كانت سعيدة!' };
        if (days === 0) return { type: 'urgent', text: '🔴 رحلتك اليوم! لا تنسَ جواز السفر والتذكرة.' };
        if (days === 1) return { type: 'urgent', text: '⏰ رحلتك غداً. تأكد من تجهيز حقائبك.' };
        if (days <= 3) return { type: 'warning', text: '📅 رحلتك بعد ' + days + ' أيام. نتمنى لك سفراً سعيداً.' };
        return { type: 'info', text: '🗓️ رحلتك بعد ' + days + ' يوماً. موعد المغادرة: ' + dateStr };
      }

      // 2. رسائل العمرة والحج (تذكير لطيف بانتهاء التأشيرة والغرامات)
      if (type === 'hajj' || type === 'umrah') {
        // افتراض أن مدة التأشيرة 30 يوماً من تاريخ السفر
        var visaEndDays = days + 30; 
        
        if (days > 0) {
          return { type: 'info', text: '🕋 رحلتك بعد ' + days + ' يوماً. نتمنى لك عمرة مقبولة.' };
        }
        
        // إذا كان في الرحلة حالياً
        if (days <= 0 && visaEndDays > 0) {
           var msg = '🕋 أنت في رحلة مباركة. ';
           if (visaEndDays <= 3) {
             msg = '⚠️ تنبيه لطيف: متبقي ' + visaEndDays + ' أيام على انتهاء تأشيرتك. لتجنب أي غرامات مالية عليك أو على المكتب، نرجو ترتيب مغادرتك قريباً.';
           } else {
             msg = '🕋 نتمنى لك إقامة طيبة. متبقي ' + visaEndDays + ' يوماً على انتهاء مدة التأشيرة.';
           }
           return { type: visaEndDays <= 3 ? 'warning' : 'info', text: msg };
        }

        if (visaEndDays <= 0) {
          return { type: 'danger', text: '⚠️ لقد انتهت مدة التأشيرة. يرجى التواصل مع الدعم فوراً لتجنب الغرامات.' };
        }
      }
      return null;
    },

    // إرجاع شكل الشارة (Badge) والتلوين
    getBadgeClass: function(type) {
      if (type === 'danger') return 'background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid #ef4444;';
      if (type === 'warning') return 'background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid #f59e0b;';
      if (type === 'urgent') return 'background:rgba(239,68,68,0.1);color:#ef4444;';
      if (type === 'past') return 'background:rgba(107,114,128,0.1);color:#9ca3af;';
      return 'background:rgba(59,130,246,0.1);color:#3b82f6;';
    }
  };
})();
