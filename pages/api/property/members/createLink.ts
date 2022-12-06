import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
import { createInboxNotification } from "../inbox/create";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions !== "owner") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  await createInboxNotification(
    req.query.inviterName,
    `created an invite link for this group`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken
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
