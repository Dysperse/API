// Update user settings
import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  const streakData = await prisma.coachData.findUnique({
    where: { userId: req.query.userIdentifier },
  });
  res.json(streakData);
};
export default handler;
