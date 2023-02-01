import { prisma } from "./prismaClient";

/**
 * Fetches the permissions of a user
 */
export const validatePermissions = async (
  property: string,
  accessToken: string
) => {
  // If property or access token isn't defined
  if (!property || !accessToken) return false;

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
