import { prisma } from "./client";

export const validatePermissions = async (
  property: string,
  accessToken: string
) => {
  //   Select from property where id = property and accessToken = accessToken
  const permissions: any | null = await prisma.property.findFirst({
    where: {
      id: { endsWith: property },
      accessToken: { endsWith: accessToken },
    },
    select: {
      permissions: true,
    },
  });
  return permissions.permissions;
};
