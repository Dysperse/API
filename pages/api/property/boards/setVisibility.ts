import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

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
