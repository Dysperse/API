import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
import { createInboxNotification } from "../inbox/create";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "owner",
    credentials: [req.query.property, req.query.accessToken],
  });

  // Find email from `user` table
  const user = await prisma.user.findUnique({
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
    req.query.accessToken,req,res
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
