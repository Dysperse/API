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
  const data = await prisma.routineItem.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  res.json(data);
}
