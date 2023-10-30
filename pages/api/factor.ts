// import { prisma } from "@/lib/server/prisma";

// /**
//  * API handler for the /api/login endpoint
//  * @param {any} req
//  * @param {any} res
//  * @returns {any}
//  */
// export default async function handler(req, res) {
//   const users = await prisma.user.findMany({
//     where: {
//       notificationSubscription: { not: null },
//     },
//   });
//   for (const user of users) {
//     await prisma.notificationSettings.upsert({
//       where: {
//         userId: user.identifier,
//       },
//       create: {
//         pushSubscription: JSON.parse(user.notificationSubscription),
//         user: { connect: { identifier: user.identifier } },
//       },
//       update: {
//         pushSubscription: JSON.parse(user.notificationSubscription),
//       },
//     });
//   }
//   res.json({ success: true });
// }
