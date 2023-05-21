/* eslint-disable */

import { validateParams } from "@/lib/server/validateParams";
import Client from "gpt-free";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (date, taskName) => `
# Input: 
Task name: ${taskName}
Date name: ${date}

# Instructions: 
Generate 1-2 date suggestions using the task name and provided date to provide "chips" which the user can tap to easily set the date.
You MUST return ONLY a JSON response in the format specified below (do not include anything other the JSON, such as surrounding text):

# Example response (Input date: "2023-05-21T18:48:31.554Z"):
[{ "date": "2023-6-1T18:48:31.554Z", "label": "Next Thursday" }]
`;

export default async function handler(req: any, res: any) {
  try {
    // await validatePermissions({
    //   minimum: "read-only",
    //   credentials: [req.query.property, req.query.accessToken],
    // });

    const client = new Client();
    const { date, taskName }: any = req.query;
    console.log(date);

    validateParams(req.query, ["date", "taskName"]);

    let response = await client
      .model("chat")
      .getCompleteResponse(generatePrompt(date, taskName));

    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error("Could not parse JSON");
    }

    console.log(response);

    res.status(200).json({
      date,
      taskName,
      response,
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
