import type { NextApiRequest, NextApiResponse } from "next";

type Data = string;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "32mb",
    },
  },
};

export default async function handler(req: any, res: NextApiResponse<Data>) {
  const { imageUrl } = JSON.parse(req.body);
  console.log(imageUrl);
  // POST request to Replicate to start the alt generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + "a2ad9140b19b6b50e1b5cc7c3f8e5e2f2c6d4529",
    },
    body: JSON.stringify({
      version:
        "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      input: { image: imageUrl },
    }),
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the alt generation process & return the result when it's ready
  let altText: string | null = null;
  while (!altText) {
    // Loop in 500ms intervals until the alt text is ready
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + "a2ad9140b19b6b50e1b5cc7c3f8e5e2f2c6d4529",
      },
    });
    let jsonFinalResponse = await finalResponse.json();
    if (jsonFinalResponse.status === "succeeded") {
      altText = jsonFinalResponse.output.split("Caption: ")[1];
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  res.status(200).json(altText ? altText : "Failed to generate alt text");
}
