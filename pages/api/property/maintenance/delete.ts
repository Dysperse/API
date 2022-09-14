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
  // Delete maintenance reminder
  const data: any | null = await prisma.maintenanceReminder.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  res.json(data);
};
export default handler;
