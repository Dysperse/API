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
export default async function (req: any, res: any) {
  const data = await prisma.routineItem.update({
    data: {
      progress: parseInt(req.query.progress),
      lastCompleted: req.query.date,
    },
    where: {
      id: parseInt(req.query.id),
    },
  });
  res.json(data);
}
