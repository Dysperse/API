import { prisma } from "../../../../lib/prismaClient";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.listItem.create({
    data: {
      name:
        CryptoJS.AES.encrypt(
          req.query.name,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
      details:
        CryptoJS.AES.encrypt(
          req.query.details,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
      pinned: req.query.pinned == "true" ? true : false,
      list: {
        connect: { id: parseInt(req.query.list) },
      },
    },
    include: {
      list: true,
    },
  });
  res.json({
    ...data,
    name: CryptoJS.AES.decrypt(
      data.name,
      process.env.LIST_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8),
    details: CryptoJS.AES.decrypt(
      data.details,
      process.env.LIST_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8),
  });
};
export default handler;
