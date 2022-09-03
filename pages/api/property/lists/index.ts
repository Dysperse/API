import { prisma } from "../../../../lib/client";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.list.findMany({
    where: {
      propertyId: req.query.propertyId,
      Property: {
        id: req.query.propertyId,
        accessToken: req.query.accessToken,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      items: true,
    },
  });
  res.json(data);
};
export default handler;
