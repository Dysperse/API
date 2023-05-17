import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.update({
      where: {
        id: req.query.id,
      },
      data: {
        lastUpdated: req.query.date,
        ...(req.query.name && { name: req.query.name }),
        ...((req.query.description || req.query.description === "") && {
          description: req.query.description,
        }),
        ...(req.query.due &&
          req.query.due !== "" && {
            due: req.query.due,
          }),
        ...(req.query.due === "" && {
          due: null,
        }),
        ...(req.query.color && { color: req.query.color }),
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
