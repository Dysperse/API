import { prisma } from "../../../../lib/client";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.maintenanceReminder.findMany({
    where: {
      property: req.query.property,
      property: {
        id: req.query.property,
        accessToken: req.query.accessToken,
      },
    },
  });
  res.json(data);
};
export default handler;
