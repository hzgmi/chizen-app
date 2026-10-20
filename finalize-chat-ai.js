const fs = require('fs');
const cssPath = '/data/data/com.termux/files/home/chizen-audit/chizen-app/client/chat-widget.css';
const jsPath = '/data/data/com.termux/files/home/chizen-audit/chizen-app/client/chat-widget.js';

// ═══ ١. إصلاح واجهة المحادثة مع الكيبورد (CSS) ═══
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('Keyboard Fix')) {
    css += `
/* Keyboard Fix & Layout Overhaul */
.chat-overlay.active { display: flex !important; flex-direction: column; height: 100vh; height: 100dvh; }
.chat-sheet { display: flex !important; flex-direction: column; height: 100% !important; max-height: 100% !important; width: 100% !important; border-radius: 0 !important; background: #efeae2 url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') repeat !important; }
.chat-messages { flex: 1 1 auto !important; overflow-y: auto !important; padding: 15px !important; }
.chat-input-area { flex: 0 0 auto !important; padding-bottom: env(safe-area-inset-bottom, 10px) !important; background: #f0f2f5 !important; }
`;
    fs.writeFileSync(cssPath, css);
    console.log('✅ تم إصلاح واجهة المحادثة مع الكيبورد');
}

// ═══ ٢. إضافة المفتاح وتقييد الذكاء الاصطناعي ═══
let js = fs.readFileSync(jsPath, 'utf8');

const OPENROUTER_API_KEY = "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"; 

js = js.replace(/const OPENROUTER_KEY = '[^']*';/g, '');
js = js.replace(/async function callOpenRouterAI[\s\S]*?return "عذراً، هناك مشكلة في الاتصال حالياً. يرجى المحاولة لاحقاً.";\s*\}\s*\}/g, '');

const aiCode = `
  const OPENROUTER_KEY = "${OPENROUTER_API_KEY}";
  
  async function callOpenRouterAI(userMessage) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": \`Bearer \${OPENROUTER_KEY}\`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://chizen.netlify.app",
          "X-Title": "CHIZEN Store"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: [
            { role: "system", content: "أنت مساعد ذكي لمتجر CHIZEN اليمني. مهمتك فقط الإجابة على أسئلة العملاء المتعلقة بالمتجر (منتجات، أقسام، أسعار، دفع، توصيل، تتبع طلبات). إذا سألك المستخدم أي سؤال خارجي، اعتذر بلطف وقل: 'أنا مساعد شيزن، وأقدر أساعدك فقط في كل ما يتعلق بتسوقك من تطبيقنا الحبيب.' ولا تجب على أي سؤال خارجي مهما حدث. تحدث بلهجة ودودة." },
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      return "عذراً، لم أفهم سؤالك. جرب تسأل بطريقة تانية.";
    } catch (error) {
      console.error("AI Error:", error);
      return "عذراً، هناك مشكلة في الاتصال حالياً. حاول لاحقاً.";
    }
  }
`;

js = js.replace('async function sendMessage()', aiCode + '\nasync function sendMessage()');

const fallbackRegex = /setTimeout\(\(\) => \{[\s\S]*?addBubble\('bot', t\(\)\.aiBusy\);[\s\S]*?\}, 500\);/;
js = js.replace(fallbackRegex, `
    showTyping();
    setTimeout(async () => {
        const aiReply = await callOpenRouterAI(text);
        hideTyping();
        addBubble('bot', aiReply);
    }, 500);
`);

fs.writeFileSync(jsPath, js);
console.log('✅ تم دمج مفتاح OpenRouter وتقييد الإجابات للمتجر فقط');
