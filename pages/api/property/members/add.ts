import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
import { createInboxNotification } from "../inbox/create";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions !== "owner") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Find email from `user` table
  const user = await prisma.user.findUnique({
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      email: req.query.email,
    },
  });

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  // Get user id
  const userId = user.id;

  await createInboxNotification(
    req.query.inviterName,
    `invited ${user.name} with the permissions: ${req.query.permission}`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken
  );

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
      permission: req.query.permission,
    },
    include: {
      profile: true,
    },
  });

  res.json(data);
};
export default handler;
