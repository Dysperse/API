import { prisma } from "../../../../lib/prismaClient";

// name         String
//   stepName     String
//   category     String
//   durationDays Int
//   progress     Int    @default(0)
//   time         String
//   emoji        String

//   completed Boolean @default(false)
export default async function handler(req, res) {
  const data = await prisma.routineItem.findMany({
    where: {
      userId: req.query.userIdentifier,
    },
  });
  res.json(data);
}
