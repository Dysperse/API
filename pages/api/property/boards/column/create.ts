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
      body: `${req.query.who} created a new column: ${req.query.title}`,
      icon: req.query.emoji,
    });

    const data = await prisma.column.create({
      data: {
        name: req.query.title,
        emoji: req.query.emoji,
        board: {
          connect: {
            id: req.query.id,
          },
        },
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
