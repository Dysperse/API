import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req: any, res: any) => {
  // Validate permissions
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const lastCompleted = new Date(req.query.lastCompleted);
  let nextDue = new Date();

  switch (req.query.frequency) {
    case "weekly":
      lastCompleted.setDate(lastCompleted.getDate() + 7);
      nextDue = new Date(lastCompleted);
      break;
    case "monthly":
      lastCompleted.setMonth(lastCompleted.getMonth() + 1);
      nextDue = new Date(lastCompleted);
      break;
    case "annually":
      lastCompleted.setFullYear(lastCompleted.getFullYear() + 1);
      nextDue = new Date(lastCompleted);
      break;
  }

  // Mark lastCompleted req.query.date
  const data = await prisma.maintenanceReminder.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      lastDone: new Date(req.query.lastCompleted),
      nextDue: nextDue,
    },
  });

  res.json(data);
};
export default handler;
