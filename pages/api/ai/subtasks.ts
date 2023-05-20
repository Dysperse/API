/* eslint-disable */

import { validatePermissions } from "@/lib/server/validatePermissions";
import Client from "gpt-free";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (taskName) => `
# Input: 
Task name: ${taskName}

# Instructions: 
Given a task name, generate 7 or less subtasks.
If the user input is inappropriate or contains foul/vulgar language or ANY sex references, return "{"error": "Your prompt violates our AI content generation policy"}"
You MUST keep descriptions as short and concise as possible, and CANNOT be more than one sentence. Descriptions must be descriptive enough to help the person know exactly how to complete the task.
When providing a task that includes studying anything (or mentions a quiz, test, or exam) and it tells what they are trying to study for, it is important to give subtasks specific to the topic the user tells in order to help the user succceed.
You MUST return a JSON response (which can be parsed by JavaScript) ONLY, similar to the example response below.

# Example response: 

{
  "task_name": "Write a blog post",
  "subtasks": [
    {
      "name": "Research topic ideas",
      "description": "Choose a topic. This could be something that you're passionate about, something that you know a lot about, or something that you think your readers would be interested in"
    },
    {
      "name": "Do your research",
      "description": "Once you've chosen a topic, it's important to do your research. This means gathering information from a variety of sources, including books, articles, websites, and interviews"
    },
    {
      "name": "Create an outline",
      "description": "Once you've done your research, it's time to create an outline for your blog post. This will help you organize your thoughts and make sure that your post flows well"
    },
    {
      "name": "Write your blog post",
      "description": "Now it's time to start writing your blog post! Be sure to use clear and concise language, and break up your text with headings, subheadings, and images."
    },
    {
      "name": "Edit and proofread your blog post",
      "description": "Once you've finished writing your blog post, it's important to edit and proofread it carefully. This will help you catch any errors in grammar, spelling, or punctuation"
    },
    {
      "name": "Publish your blog post",
      "description": "Once you're happy with your blog post, it's time to publish it! Be sure to promote your blog post on social media and other online channels"
    }
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
      console.error("Could not parse JSON");
    }

    console.log(response);

    res.status(200).json({
      prompt,
      response,
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
