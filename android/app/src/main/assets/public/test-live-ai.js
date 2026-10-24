const fs = require('fs');
const chatJs = fs.readFileSync('chat-widget.js', 'utf8');

console.log("=== ١. فحص وجود المفتاح في الكود ===");
const keyMatch = chatJs.match(/const OPENROUTER_KEY\s*=\s*["']([^"']+)["']/);
let apiKey = '';

if (keyMatch && keyMatch[1]) {
    apiKey = keyMatch[1];
    if (apiKey === 'ضع_المفتاح_هنا' || apiKey.trim() === '') {
        console.log("❌ خطأ: المفتاح لسه (ضع_المفتاح_هنا). التطبيق مش هيشتغل!");
        process.exit(1);
    } else {
        console.log(`✅ المفتاح موجود، بيبدأ بـ: ${apiKey.substring(0, 10)}...`);
    }
} else {
    console.log("❌ خطأ: مفيش مفتاح OpenRouter في الكود!");
    process.exit(1);
}

console.log("\n=== ٢. فحص رسالة التقييد (System Prompt) ===");
if (chatJs.includes("أنا مساعد شيزن، وأقدر أساعدك فقط")) {
    console.log("✅ رسالة التقييد موجودة (الذكاء الاصطناعي هيرفض الأسئلة الخارجية).");
} else {
    console.log("⚠️ تحذير: رسالة التقييد مش موجودة، الـ AI ممكن يجاوب على أي حاجة!");
}

console.log("\n=== ٣. اختبار حقيقي للاتصال بـ OpenRouter (Live Test) ===");
console.log("⏳ جاري إرسال سؤال تجريبي للسيرفر...");

async function testAI(userMsg) {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct:free",
                messages: [
                    { role: "system", content: "أنت مساعد ذكي لمتجر CHIZEN اليمني. مهمتك فقط الإجابة على أسئلة العملاء المتعلقة بالمتجر. إذا سألك المستخدم أي سؤال خارجي، اعتذر بلطف وقل: 'أنا مساعد شيزن، وأقدر أساعدك فقط في كل ما يتعلق بتسوقك من تطبيقنا الحبيب.'" },
                    { role: "user", content: userMsg }
                ]
            })
        });
        
        const data = await res.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            return `خطأ من السيرفر: ${JSON.stringify(data)}`;
        }
    } catch (e) {
        return `فشل الاتصال: ${e.message}`;
    }
}

(async () => {
    const storeQuestion = await testAI("ما هي طرق الدفع المتاحة عندكم؟");
    console.log(`\n📥 رد الذكاء الاصطناعي (سؤال داخلي عن المتجر):\n"${storeQuestion}"\n`);
    
    const externalQuestion = await testAI("كيف أطبخ كبسة لحم؟");
    console.log(`📥 رد الذكاء الاصطناعي (سؤال خارجي):\n"${externalQuestion}"\n`);
    
    console.log("✅ انتهى الاختبار.");
})();
