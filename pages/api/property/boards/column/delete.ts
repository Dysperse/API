import { DispatchGroupNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    await DispatchGroupNotification(req.query.property, req.query.accessToken, {
      title: `${req.query.boardName}`,
      body: `${req.query.who} deleted a column: "${req.query.columnName}"`,
      icon: req.query.boardEmoji,
    });

    // Delete column, and all tasks in it
    const data = await prisma.column.delete({
      where: {
        id: req.query.id,
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
