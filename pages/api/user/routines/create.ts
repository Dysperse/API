import { prisma } from "../../../../lib/prismaClient";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

// name         String
//   stepName     String
//   category     String
//   durationDays Int
//   progress     Int    @default(0)
//   time         String
//   emoji        String

//   completed Boolean @default(false)
export default async function (req, res) {
  const data = await prisma.routineItem.create({
    data: {
      name: req.query.name,
      stepName: req.query.stepName,
      category: req.query.category,
      durationDays: req.query.durationDays,
      time: req.query.time,
      emoji: req.query.emoji,

      user: {
        connect: {
          id: req.query.userIdentifier,
        },
      },
    },
  });
  res.json(data);
}
