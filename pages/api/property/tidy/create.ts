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

  //   Create maintenance reminder
  const data = await prisma.maintenanceReminder.create({
    data: {
      name: req.query.name,
      note: "",
      frequency: req.query.frequency,
      on: req.query.on,
      lastDone: new Date(req.query.lastDone),
      property: {
        connect: {
          id: req.query.property,
        },
      },
    },
  });
  res.json(data);
};

export default handler;
