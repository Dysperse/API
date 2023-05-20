// Update user settings
import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  const user = await prisma.notificationSettings.upsert({
    where: {
      userId: req.query.userIdentifier,
    },

    update: {
      [req.query.name]: req.query.value === "true",
    },
    create: {
      user: {
        connect: {
          identifier: req.query.userIdentifier,
        },
      },
      [req.query.name]: req.query.value === "true",
    },
  });
  res.json(user);
};
export default handler;
