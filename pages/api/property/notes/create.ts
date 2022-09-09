import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const note = await prisma.note.create({
    data: {
      property: {
        connect: {
          propertyId: req.query.property,
        },
      },
      name: req.query.title,
      content: req.query.content,
      pinned: req.query.pinned === "true",
    },
  });

  res.json(note);
};

export default handler;
