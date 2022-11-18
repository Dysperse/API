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

  // Delete all tasks in column
  await prisma.task.deleteMany({
    where: {
      column: {
        id: req.query.id,
      },
    },
  });

  // Delete column, and all tasks in it
  const data = await prisma.column.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};

export default handler;
