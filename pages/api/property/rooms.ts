import { prisma } from "../../../lib/client";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.customRoom.findMany({
    where: {
      propertyId: req.query.propertyId,
      property: {
        id: req.query.propertyId,
        accessToken: req.query.accessToken,
      },
    },
  });
  res.json(data);
};
export default handler;
