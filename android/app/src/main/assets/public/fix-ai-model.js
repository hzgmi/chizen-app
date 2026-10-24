const fs = require('fs');
const chatPath = 'chat-widget.js';
let js = fs.readFileSync(chatPath, 'utf8');

// استبدال الموديل القديم بالراوتر الذكي
const oldModel = 'meta-llama/llama-3-8b-instruct:free';
const newModel = 'openrouter/free';

if (js.includes(oldModel)) {
    js = js.split(oldModel).join(newModel);
    fs.writeFileSync(chatPath, js);
    console.log(`✅ تم تغيير الموديل من "${oldModel}" إلى "${newModel}" بنجاح.`);
} else if (js.includes(newModel)) {
    console.log('✅ الموديل محدث بالفعل إلى openrouter/free.');
} else {
    console.log('⚠️ لم يتم العثور على نص الموديل، جاري البحث عن أي موديل آخر...');
    // محاولة استبدال أي موديل ينتهي بـ :free
    js = js.replace(/"model"\s*:\s*"[^"]*:free"/g, '"model": "openrouter/free"');
    fs.writeFileSync(chatPath, js);
    console.log('✅ تم استبدال الموديل بنجاح.');
}

console.log('\n--- اختبار الاتصال الجديد ---');

// إعادة اختبار الدالة
const keyMatch = js.match(/const OPENROUTER_KEY\s*=\s*["']([^"']+)["']/);
if (!keyMatch) { console.log('❌ المفتاح غير موجود'); process.exit(1); }
const apiKey = keyMatch[1];

async function testAI(userMsg) {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    { role: "system", content: "أنت مساعد ذكي لمتجر CHIZEN اليمني. مهمتك فقط الإجابة على أسئلة العملاء المتعلقة بالمتجر. إذا سألك المستخدم أي سؤال خارجي، اعتذر بلطف وقل: 'أنا مساعد شيزن، وأقدر أساعدك فقط في كل ما يتعلق بتسوقك من تطبيقنا الحبيب.'" },
                    { role: "user", content: userMsg }
                ]
            })
        });
        
        const data = await res.json();
        if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
        return `خطأ: ${JSON.stringify(data)}`;
    } catch (e) {
        return `فشل: ${e.message}`;
    }
}

(async () => {
    console.log('⏳ جاري إرسال سؤال تجريبي...');
    const reply = await testAI("ما هي طرق الدفع؟");
    console.log(`\n📥 الرد:\n"${reply}"\n`);
})();
