import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
import { createInboxNotification } from "../inbox/create";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "owner",
    credentials: [req.query.property, req.query.accessToken],
  });

  await createInboxNotification(
    req.query.removerName,
    `removed ${req.query.removeeName}`,
    new Date(req.query.timestamp),
    req.query.property,
    req.query.accessToken
  );
  //   Delete user from `propertyInvite` table
  const data = await prisma.propertyInvite.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};
export default handler;
