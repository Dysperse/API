// import { prisma } from "../../lib/server/prisma";

// /**
//  * API handler for the /api/login endpoint
//  * @param {any} req
//  * @param {any} res
//  * @returns {any}
//  */
// export default async function handler(req, res) {
//   const data = await prisma.column.findMany();
//   data.forEach(async (column) => {
//     let emoji = column.emoji;
//     emoji = emoji.replace(
//       "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/",
//       ""
//     );
//     emoji = emoji.replace(".png", "");

//     await prisma.column.update({
//       where: {
//         id: column.id,
//       },
//       data: {
//         emoji,
//       },
//     });
//   });
//   res.json({ success: true });
// }
