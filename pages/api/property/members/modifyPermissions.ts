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
    req.query.changerName,
    `made ${req.query.affectedName} a ${req.query.permission}${
      req.query.permission === "read-only" ? " member" : ""
    }`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken
  );
  //   Delete user from `propertyInvite` table
  const data = await prisma.propertyInvite.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      permission: req.query.permission,
    },
  });

  res.json(data);
};
export default handler;
