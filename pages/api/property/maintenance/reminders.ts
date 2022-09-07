import { prisma } from "../../../../lib/client";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.maintenanceReminder.findMany({
    where: {
      propertyId: req.query.propertyId,
      property: {
        id: req.query.property,
        accessToken: req.query.accessToken,
      },
    },
  });
  res.json(data);
};
export default handler;
