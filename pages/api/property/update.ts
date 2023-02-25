import cacheData from "memory-cache";
import { prisma } from "../../../lib/prismaClient";
import { validatePermissions } from "../../../lib/validatePermissions";
import { createInboxNotification } from "./inbox/create";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });
  await createInboxNotification(
    req.query.userName,
    `changed the ${req.query.changedKey} of the group to "${req.query.changedValue}"`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken,
    req,
    res
  );

  //   Update name, type, and bannerColor
  const data = await prisma.property.update({
    where: {
      id: req.query.property,
    },
    data: {
      name: req.query.name || undefined,
      type: req.query.type || undefined,
      color: req.query.color || undefined,
    },
  });

  cacheData.del(req.query.sessionId);
  res.json(data);
};
export default handler;
