import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.item.deleteMany({
    where: {
      trash: true,
    },
  });
  res.json(data);
};

export default handler;
