export default function handler(req, res) {
  res.json({
    data: false,
  });
}

// import executeQuery from "../../../lib/db";
// import { v4 as uuidv4 } from "uuid";

// const handler = async (req, res) => {
//   try {
//     const step1 = await executeQuery({
//       query: "SELECT * FROM SyncTokens",
//       values: [],
//     });

//     step1.forEach(async (step1Data) => {
//       const userId = step1Data.user;
//       const users = await executeQuery({
//         query: "UPDATE SyncTokens SET accessToken = ? WHERE id = ?",
//         values: [uuidv4(), step1Data.id],
//       });

//       if (users[0]) {
//         const accessToken = users[0].SyncToken;
//         await executeQuery({
//           query: "UPDATE ListNames SET user = ? WHERE id = ?",
//           values: [accessToken, step1Data.id],
//         });
//       } else {
//         console.log("user not found");
//       }
//     });
//     res.json({
//       data: true,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };
// export default handler;
