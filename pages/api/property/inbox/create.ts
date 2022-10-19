import { prisma } from "../../../../lib/prismaClient";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export const createInboxNotification = async (
  who: string,
  what: string,
  when: Date,
  propertyId: string,
  accessToken: string
) => {
  const permissions = await validatePermissions(propertyId, accessToken);
  if (!permissions || permissions === "read-only") {
    return false;
  }

  const data = await prisma.inboxItem.create({
    data: {
      who: who,
      what: what,
      when: when,

      property: {
        connect: { id: propertyId },
      },
    },
    include: {
      property: true,
    },
  });

  return data;
};

export default function (req, res) {
  res.status(403).json({
    message: "Forbidden",
  });
}
