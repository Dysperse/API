/* eslint-disable */

import { validatePermissions } from "@/lib/server/validatePermissions";
import Client from "gpt-free";

type Data = {
  error?: string;
  prompt?: string;
  response?: string;
};

const generatePrompt = (month) => `
# Input: 
Month of year: ${month}

# Instructions: 
Based on the time of the year, generate a personalized, new routine which will benefit the user. 
Categories can be anything, from "Health" to "Finances" to "Education" to "Career advancement" or anything which will help a person.
Emojis must only be a lowercase unicode string.

# Example response: 
{
   "name": "Gain muscle (without equipment)",
   "emoji": "1f4aa",
   "timeOfDay": 14,
   "daysOfWeek": "[true, true, true, true, true, true, true]",
   "durationDays": 100,
   "category": "Fitness",
   "items": [
      {
         "name": "10 push-ups every day",
         "stepName": "Do 10 push-ups today",
         "category": "Fitness",
         "description": "Do 10 push-ups every day",
         "durationDays": 100,
         "time": "afternoon"
      },
      {
         "name": "50 squats every day",
         "stepName": "Do 50 squats today",
         "category": "Fitness",
         "description": "Perform 50 squats every day to build leg muscles.",
         "durationDays": 30,
         "time": "morning"
      },
      {
         "name": "50 crunches every day",
         "stepName": "Do 50 crunches today",
         "category": "Fitness",
         "description": "Perform 50 crunches every day to build core muscles.",
         "durationDays": 60,
         "time": "morning"
      }
   ]
}
`;

export default async function handler(req: any, res: any) {
  try {
 //   await validatePermissions({
//      minimum: "read-only",
//      credentials: [req.query.property, req.query.accessToken],
//    });
 //   const client = new Client();
  //  const { month }: any = req.query;

 //   if (!month) {
//      res.status(403).json({
//        error: "Month not defined",
////      });
 //   }

//    let response = await client
   //   .model("chat")
//      .getCompleteResponse(generatePrompt(month));
//
//    try {
//      response = JSON.parse(response);
//    } catch (e) {
//      console.error("Could not parse JSON");
//    }

//    console.log(response);

    res.status(200).json({
      month,
      response: {

   "name": "Gain muscle (without equipment)",

   "emoji": "1f4aa",

   "timeOfDay": 14,

   "daysOfWeek": "[true, true, true, true, true, true, true]",

   "durationDays": 100,

   "category": "Fitness",

   "items": [

      {

         "name": "10 push-ups every day",

         "stepName": "Do 10 push-ups today",

         "category": "Fitness",

         "description": "Do 10 push-ups every day",

         "durationDays": 100,

         "time": "afternoon"

      },

      {

         "name": "50 squats every day",

         "stepName": "Do 50 squats today",

         "category": "Fitness",

         "description": "Perform 50 squats every day to build leg muscles.",

         "durationDays": 30,

         "time": "morning"

      },

      {

         "name": "50 crunches every day",

         "stepName": "Do 50 crunches today",

         "category": "Fitness",

         "description": "Perform 50 crunches every day to build core muscles.",

         "durationDays": 60,

         "time": "morning"

      }

   ]

},
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
