import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  // Validate permissions
  const permissions: null | string = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Update note

  const data = await prisma.maintenanceReminder.update({
    where: {
      id: req.query.id,
    },
    data: {
      note: req.query.note,
    },
  });

  res.json(data);
};
export default handler;
