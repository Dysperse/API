import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";
import { createInboxNotification } from "../../inbox/create";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "owner",
    credentials: [req.query.property, req.query.accessToken],
  });

  await createInboxNotification(
    req.query.inviterName,
    `created an invite link for this group`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken,
    req,
    res
  );

  // Get user id
  const data = await prisma.propertyLinkInvite.create({
    data: {
      property: {
        connect: {
          id: req.query.property,
        },
      },
    },
  });

  res.json(data);
};
export default handler;
