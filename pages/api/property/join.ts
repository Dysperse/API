import { prisma } from "../../../lib/client";
import { validatePermissions } from "../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  //   Set selected to false for all other properties of the user email
  const e: any | null = await prisma.propertyInvite.updateMany({
    where: {
      user: {
        email: req.query.email,
      },
      selected: true,
    },
    data: {
      selected: false,
    },
  });

  const data: any | null = await prisma.propertyInvite.update({
    where: {
      accessToken: req.query.accessToken,
    },
    data: {
      selected: true,
      accepted: true,
    },
  });

  res.json(data);
};
export default handler;
