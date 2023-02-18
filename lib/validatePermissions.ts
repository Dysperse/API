import cacheData from "memory-cache";
import { prisma } from "./prismaClient";
const hours = 69;

/**
 * Fetches the permissions of a user
 */
export const validatePermissions = async (
  property: string,
  accessToken: string
) => {
  console.time("🔑 User permission validation took");
  // If property or access token isn't defined
  if (!property || !accessToken) return false;
  const key = `perms-${property}-${accessToken}`;
  const cache = cacheData.get(key);
  if (cache) {
    console.timeEnd("🔑 User permission validation took");
    return cache;
  } else {
    const permissions = await prisma.propertyInvite.findFirst({
      where: {
        propertyId: property,
        accessToken: accessToken,
      },
      select: {
        permission: true,
      },
    });
    cacheData.put(
      key,
      permissions ? permissions.permission : false,
      hours * 1000 * 60 * 60
    );
    console.timeEnd("Duration");

    return permissions ? permissions.permission : false;
  }
};
