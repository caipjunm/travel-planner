// Cloudflare Worker — AI API 代理
// 部署后你的 Key 只存在于 Cloudflare 服务端，前端不会暴露
//
// 部署方法：
// 1. 打开 https://dash.cloudflare.com/ → Workers & Pages → 创建 Worker
// 2. 把这段代码粘贴进去，替换下面的 API_KEY
// 3. 点「部署」，记下 Worker 的 URL（类似 https://travel-proxy.你的用户名.workers.dev）
// 4. 在旅行计划生成器的 API 地址填入这个 URL

const API_KEY = 'sk-cbab2349c7a947c39f7320dcf4210603';
const TARGET = 'https://api.deepseek.com/v1/chat/completions';

export default {
  async fetch(request) {
    // 只允许 POST
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405 });
    }

    // 转发请求到 DeepSeek，注入 API Key
    const proxyReq = new Request(TARGET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: request.body
    });

    // 添加 CORS 头，允许你的域名访问
    const resp = await fetch(proxyReq);
    const corsResp = new Response(resp.body, resp);
    corsResp.headers.set('Access-Control-Allow-Origin', '*');
    corsResp.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    corsResp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return corsResp;
  }
};
