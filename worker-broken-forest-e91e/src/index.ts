import { Ai } from './vendor/@cloudflare/ai';

export default {
  async fetch(request, env) {
    async function readRequestBody(request) {
      const contentType = request.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return JSON.stringify(await request.json());
      } else if (contentType.includes("application/text")) {
        return request.text();
      } else if (contentType.includes("text/html")) {
        return request.text();
      } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
      } else {
        return "a file";
      }
    }
    const tasks = [];
    let response = [];

    const body = await readRequestBody(request);
    const ai = new Ai(env.AI);

    // messages - chat style input
    let chat = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...JSON.parse(body)
      ]
    };

    console.log(chat);

    response = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat);
    tasks.push({ inputs: chat, response });

    return Response.json(tasks);
  }
};
