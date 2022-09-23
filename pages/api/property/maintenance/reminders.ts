import { prisma } from "../../../../lib/client";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const data: any | null = await prisma.maintenanceReminder.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
  });
  res.json(data);
};
export default handler;
