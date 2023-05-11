/* eslint-disable */

import Client from "gpt-free";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (taskName) => `
# Input: 
Task name: ${taskName}

# Instructions: 
Given a task name, generate 10 or less subtasks, using the example below. You MUST return a JSON response ONLY. 
If the user input is inappropriate or contains foul/vulgar language or ANY sex references, return "{"error": "Your prompt violates our AI content generation policy"}"

# Example response: 
{
  "task_name": "Write a blog post",
  "subtasks": [
    "Research topic ideas",
    "Outline blog post",
    "Write introduction",
    "Write body paragraphs",
    "Write conclusion",
    "Edit for grammar and spelling",
    "Add images to blog post",
    "Format blog post for publishing",
    "Choose a catchy title",
    "Come up with meta description"
  ]
}
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = new Client();
  const { prompt }: any = req.query;

  if (!prompt) {
    res.status(403).json({
      error: "Prompt not defined",
    });
  }

  let response = await client
    .model("chat")
    .getCompleteResponse(generatePrompt(prompt));

  try {
    response = JSON.parse(response);
  } catch (e) {
    console.log(prompt, response);
    console.error("Could not parse JSON");
  }

  res.status(200).json({
    prompt,
    response,
  });
}
