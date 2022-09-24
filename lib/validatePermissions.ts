import { prisma } from "./client";

/**
 * Fetches the permissions of a user
 */
export const validatePermissions = async (
  property: string,
  accessToken: string
) => {
  if (!property || !accessToken) return false;
  // Select permissions from `propertyInvite` where `propertyId` is the property ID and `accessToken` is the access token
  const permissions = await prisma.propertyInvite.findFirst({
    where: {
      propertyId: property,
      accessToken: accessToken,
    },
    select: {
      permission: true,
    },
  });

  return permissions ? permissions.permission : false;
};
