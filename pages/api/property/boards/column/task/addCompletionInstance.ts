import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    // const data = await prisma.completionInstance.create({
    //   where: {
    //     id: req.query.id,
    //   },
    //   data: {
    //     // TODO
    //     completedAt: dayjs().toDate(),
    //     iteration: dayjs().toDate(),
    //   },
    // });

    res.json({});
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
