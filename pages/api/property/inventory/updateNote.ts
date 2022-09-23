import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req: any, res) => {
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
      note:
        CryptoJS.AES.encrypt(
          req.query.note,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "",
    },
  });

  res.json(data);
};

export default handler;
