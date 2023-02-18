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
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      userId: req.query.userIdentifier,
      completed: false,
    },
    orderBy: {
      progress: "asc",
    },
  });
  res.json(data);
}
