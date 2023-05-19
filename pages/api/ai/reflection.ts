/* eslint-disable */

import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";
import Client from "gpt-free";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (emoji, data) => `
# Input: 
Data: ${data}
User's mood represented in an emoji unicode: ${emoji}

# Instructions: 
Based on the mental/physical health reflection data provided above, provide a JSON response in order to help the user feel better.

# Example response: 
{ 
    "general": "I'm sorry to hear that you're feeling sad and stressed. It seems like you are going through a lot right now. It's important to prioritize your mental health and well-being. Here are some personalized suggestions: ",
    "suggestions": [
        {"name": "Take a nap", "suggestion": "You mentioned that you didn't get enough rest. Try taking a 2-hour nap to help clear your mood."},
        {"name": "Limit exposure to news and social media", "suggestion": "Since you mentioned that you're feeling stressed, it may be helpful to limit your exposure to stressors such as news and social media"},
        {"name": "Talk about your feelings with a friend or family member", "suggestion": "I'm so sorry to hear that you're feeling sad. Consider having a conversation with your friend or family member"}
    ]
}
`;

export default async function handler(req: any, res: any) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });
    const client = new Client();
    const { emoji, data }: any = req.query;

    validateParams(req.query, ["emoji", "data"]);

    let response = await client
      .model("chat")
      .getCompleteResponse(generatePrompt(emoji, data));

    try {
      response = JSON.parse(response);
    } catch (e) {
      console.error("Could not parse JSON");
    }

    res.status(200).json({
      data,
      response,
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
