import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  //   Update the note on an item
  const data: any | null = await prisma.item.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      room: req.query.room,
    },
  });

  res.json(data);
};

export default handler;
