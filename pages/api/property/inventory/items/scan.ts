import type { NextApiResponse } from "next";

type Data = string;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "32mb",
    },
  },
};

async function query(url) {
  const data = new Buffer(url.split(",")[1], "base64");

  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
    {
      headers: {
        Authorization: "Bearer " + process.env.AI_AUTH_TOKEN,
      },
      method: "POST",
      body: data,
    }
  );
  const result = await response.json();
  return result;
}

export default async function handler(req: any, res: NextApiResponse<Data>) {
  const { imageUrl } = JSON.parse(req.body);

  const response = await query(imageUrl);

  res.json(response);
}
