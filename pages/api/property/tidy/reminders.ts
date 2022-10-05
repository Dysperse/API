import { prisma } from "../../../../lib/client";
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
  // Query the database for all MaintenanceReminders
  const data = await prisma.maintenanceReminder.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
  });
  // Return the data
  res.json(data);
};

export default handler;
