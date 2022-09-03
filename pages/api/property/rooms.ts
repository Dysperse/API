import { prisma } from "../../../lib/client";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.customRoom.findMany({
    where: {
      propertyId: req.query.propertyId,
    },
  });
  res.json(data);
};
export default handler;
