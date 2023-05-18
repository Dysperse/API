import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import cacheData from "memory-cache";
import { createInboxNotification } from "./inbox/create";

const handler = async (req, res) => {
  try {
    await validatePermissions({
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
        vanishingTasks: req.query.vanishingTasks === "true",
      },
    });

    cacheData.clear();
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
