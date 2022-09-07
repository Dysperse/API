import { prisma } from "./client";

export const validatePermissions = async (
  property: string,
  accessToken: string
) => {
  if (!property || !accessToken) return false;
  console.log(property, accessToken);
  // Select permissions from `propertyInvite` where `propertyId` is the property ID and `accessToken` is the access token
  const permissions: any | null = await prisma.propertyInvite.findFirst({
    where: {
      propertyId: property,
      accessToken: accessToken,
    },
    select: {
      permission: true,
    },
  });

  console.log(permissions);
  return permissions ? permissions.permission : false;
};
