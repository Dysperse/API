/* eslint-disable */

import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";
import Client from "gpt-free";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (name, date) => `
# Input: 
User's goal: ${name}
Goal deadline in days: ${date}

# Instructions: 
Use ONLY the goal name and user-set deadline above to check if it is sensible or not. No further information will be provided.
If the goal is sensible, give a tip. 
Assume the user has zero progress towards this goal so far.
If the goal contains NSFW content, make the suggestion say exactly "NSFW" and the "sensible" to false.
You MUST return ONLY a JSON response, in the format below. 

# Example response: 
{ 
    "sensible": false,
    "suggestion": "Are you really going to earn a million dollars in 7 days?"
}
`;

export default async function handler(req: any, res: any) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });
    const client = new Client();
    const { name, duration }: any = req.query;

    validateParams(req.query, ["name", "duration"]);

    let response = await client
      .model("chat")
      .getCompleteResponse(generatePrompt(name, duration));

    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error("Could not parse JSON");
    }

    res.status(200).json(response);
  } catch (e) {
    res.json({ error: e.message });
  }
}
