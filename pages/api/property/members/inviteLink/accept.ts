import { prisma } from "../../../../../lib/server/prisma";

const handler = async (req, res) => {
  // Find email from `user` table
  const user = await prisma.user.findUnique({
    where: {
      email: req.query.email,
    },
  });

  if (!user || !req.query.token) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  // Delete invite link
  await prisma.propertyLinkInvite.delete({
    where: {
      token: req.query.token,
    },
  });

  // Get user id
  const userId = user.id;
  const data = await prisma.propertyInvite.create({
    data: {
      profile: {
        connect: { id: req.query.property },
      },
      user: {
        connect: { id: userId },
      },
      accepted: false,
      selected: false,
      permission: "member",
    },
    include: {
      profile: true,
    },
  });

  res.json(data);
};
export default handler;
