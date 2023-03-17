import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.board.update({
    where: {
      id: req.query.id,
    },
    data: {
      public: req.query.public === "true",
    },
  });

  res.json({
    data,
    success: true,
  });
};

export default handler;
