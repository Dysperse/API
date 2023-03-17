import cacheData from "memory-cache";
import { prisma } from "../prismaClient";
const hours = 69;

/**
 * Fetches the permissions of a user
 */
export const validatePermissions = async (
  res: any,
  config: {
    minimum: "read-only" | "member" | "owner";
    credentials: [string, string];
  }
) => {
  const invalidate = (error) => {
    res.status(401).json({ error });
    return error;
  };

  const hierarchy = ["read-only", "member", "owner"];

  const [property, accessToken] = config.credentials;

  if (!property || !accessToken)
    return invalidate("You didn't pass either an access or property token");

  console.time("🔑 User permission validation took");

  // Cache keys
  const key = `permissions-${property}-${accessToken}`;
  const cache = cacheData.get(key);

  // If cache exists, just return the cached value
  if (cache) {
    const foundPermissionsInteger = hierarchy.indexOf(cache);
    const minimumPermissionsInteger = hierarchy.indexOf(config.minimum);

    if (foundPermissionsInteger < minimumPermissionsInteger)
      return invalidate({
        message: "Insufficient permissions",
        found: `${cache}, ${foundPermissionsInteger}`,
        minimum: `${config.minimum}, ${minimumPermissionsInteger}`,
      });

    console.timeEnd("🔑 User permission validation took");

    // 🎉 User meets the minimum required permissions!
    return { authorized: true };
  }

  // If cache does not exist, query the database and match up the permissions
  else {
    const permissions: any = await prisma.propertyInvite.findFirst({
      where: {
        AND: [{ propertyId: property }, { accessToken }],
      },
      select: { permission: true },
    });

    const foundPermissionsInteger = hierarchy.indexOf(permissions.permission);
    const minimumPermissionsInteger = hierarchy.indexOf(config.minimum);

    if (foundPermissionsInteger < minimumPermissionsInteger)
      return invalidate({
        message: "Insufficient permissions",
        found: `${permissions.permission}, ${foundPermissionsInteger}`,
        minimum: `${config.minimum}, ${minimumPermissionsInteger}`,
      });

    cacheData.put(
      // Key
      key,
      // Value (if there's no permission defined, make the minimum permission "owner" for maximum security)
      permissions ? permissions.permission : "owner",
      // Hours to store it
      hours * 1000 * 60 * 60
    );
    // 🎉 User meets the minimum required permissions!
    return { authorized: true };
  }
};
