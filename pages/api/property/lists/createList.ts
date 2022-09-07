import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data: any | null = await prisma.list.create({
    data: {
      name:
        CryptoJS.AES.encrypt(
          req.query.name,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
      description:
        CryptoJS.AES.encrypt(
          req.query.description,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
      property: {
        connect: { id: req.query.property },
      },
    },
    include: {
      property: true,
    },
  });
  console.log(data);
  res.json(data);
};
export default handler;
