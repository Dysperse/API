import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  // Validate permissions
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions !== "owner") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let nextDue = new Date(req.query.nextDue);

  switch (req.query.frequency) {
    case "weekly":
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case "monthly":
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case "annually":
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      break;
  }

  
  // Create a new maintenance reminder
  const data: any | null = await prisma.maintenanceReminder.create({
    data: {
      property: {
        connect: {
          id: req.query.property,
        },
      },
      name: req.query.name,
      frequency: req.query.frequency,
      lastDone: new Date(req.query.lastCompleted) || new Date(),
      nextDue: new Date(nextDue),
      note: req.query.note,
    },
  });
  res.json(data);
};
export default handler;
