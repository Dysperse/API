import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data: any | null = await prisma.propertyInvite.create({
    where: {
      propertyId: req.query.property,
    },
    select: {
      id: true,
      permission: true,
      property: {
        connect: { id: req.query.property },
      },
      user: {
        connect: { email: req.query.email },
      },
      accepted: false,
    },
  });
  res.json(data);
};
export default handler;
