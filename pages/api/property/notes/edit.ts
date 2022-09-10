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

  const note = await prisma.note.update({
    data: {
      name: req.query.title,
      color: req.query.color ?? "orange",
      content: req.query.content,
      pinned: req.query.pinned === "true",
    },
    where: {
      id: req.query.id,
    },
  });

  res.json(note);
};

export default handler;
