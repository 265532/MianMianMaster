import type { Plugin } from "vite";

const SSE_CHAT_RESPONSES: Record<string, string[]> = {
  default: [
    "你好！",
    "我是今天的面试官，",
    "很高兴能和你交流。",
    "\n\n",
    "我们先从自我介绍开始吧，",
    "请简单介绍一下你自己，",
    "包括你的技术栈和项目经验。",
  ],
  vue: [
    "好的，",
    "我们来聊聊 Vue 3 的问题。",
    "\n\n",
    "请问 Vue 3 的 Composition API ",
    "和 Options API 有什么区别？",
    "你在项目中更倾向于使用哪种？",
    "为什么？",
  ],
  react: [
    "接下来我们聊聊 React。",
    "\n\n",
    "请解释一下 React Hooks ",
    "的闭包陷阱是什么？",
    "你在实际开发中遇到过吗？",
    "是如何解决的？",
  ],
  system: [
    "好的，",
    "我们来讨论一个系统设计问题。",
    "\n\n",
    "如果让你设计一个短链接服务，",
    "你会怎么设计？",
    "请从高可用、",
    "高性能和可扩展性三个角度来分析。",
  ],
};

function pickResponse(message: string): string[] {
  const lower = message.toLowerCase();
  if (lower.includes("vue")) return SSE_CHAT_RESPONSES.vue;
  if (lower.includes("react")) return SSE_CHAT_RESPONSES.react;
  if (lower.includes("系统") || lower.includes("设计")) return SSE_CHAT_RESPONSES.system;
  return SSE_CHAT_RESPONSES.default;
}

export function mockSsePlugin(): Plugin {
  return {
    name: "mock-sse-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";

        const chatMatch = url.match(
          /\/api\/v1\/interview\/sessions\/([\w-]+)\/chat/,
        );
        if (chatMatch && req.method === "POST") {
          const sessionId = chatMatch[1];
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            let userMessage = "";
            try {
              userMessage = JSON.parse(body).message || "";
            } catch {
              userMessage = "";
            }

            console.log(
              `[Mock SSE] Session: ${sessionId}, User message: ${userMessage}`,
            );

            res.writeHead(200, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
              "Access-Control-Allow-Origin": "*",
            });

            const tokens = pickResponse(userMessage);
            let index = 0;

            const sendToken = () => {
              if (index < tokens.length) {
                const token = tokens[index];
                res.write(`event: token\ndata: ${token}\n\n`);
                console.log(`[Mock SSE] → token: "${token}"`);
                index++;
                setTimeout(sendToken, 80 + Math.random() * 120);
              } else {
                res.write(`event: done\ndata: [DONE]\n\n`);
                console.log("[Mock SSE] → done");
                res.end();
              }
            };

            setTimeout(sendToken, 200);
          });
          return;
        }

        next();
      });
    },
  };
}
