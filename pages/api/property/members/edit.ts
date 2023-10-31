import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { createInboxNotification } from "../inbox/create";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "owner",
      credentials: [req.query.property, req.query.accessToken],
    });

    await createInboxNotification(
      req.query.changerName,
      `made ${req.query.affectedName} a ${req.query.permission}${
        req.query.permission === "read-only" ? " member" : ""
      }`,
      new Date(req.query.timestamp),
      req.query.property,
      req.query.accessToken,
      req,
      res
    );
    //   Delete user from `propertyInvite` table
    const data = await prisma.propertyInvite.update({
      where: {
        id: req.query.id,
      },
      data: {
        permission: req.query.permission,
      },
    });

    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
