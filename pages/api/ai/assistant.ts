export default async function handler(req, res) {
  const data = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/187c087b112733cc2dab91bda7e28e76/ai/run/@cf/meta/llama-2-7b-chat-int8",
    {
      method: "POST",
      body: req.body,
      headers: {
        Authentication: `Bearer ${process.env.CLOUDFLARE_ACCESS_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  res.json(data);
}
