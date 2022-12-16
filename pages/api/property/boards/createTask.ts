import { prisma } from "../../../../lib/prismaClient";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";
import type { Item } from "@prisma/client";
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
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.task.create({
    data: {
      name: req.query.title,
      column: {
        connect: {
          id: parseInt(req.query.columnId),
        },
      },
      completed: false,
      ...req.query.image && { image: req.query.image },
      pinned: req.query.pinned === "true",
      due: req.query.due !== "false" ? new Date(req.query.due) : null,
      description: req.query.description,
    },
  });
  res.json(data);
};

export default handler;
