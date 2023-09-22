import { prisma } from "@/lib/server/prisma";

/**
 * Get user data from sessions table using accessToken
 * @param {string} token
 * @returns {any}
 */
export const getUserData = async (token: string) => {
  const session = await prisma.session.findUnique({
    where: { id: token },
    include: {
      user: {
        include: {
          Profile: { select: { picture: true } },
          properties: {
            select: {
              propertyId: true,
              accessToken: true,
              selected: true,
              accepted: true,
              permission: true,
              profile: true,
            },
          },
        },
      },
    },
  });
  if (!session) {
    return { user: false };
  }

  const { ip, timestamp, user, ...restSession } = session;
  const updatedSession = {
    current: {
      token,
      ip,
      timestamp,
    },
    properties: session.user.properties,
    ...restSession,
    userId: undefined,
    id: undefined,
    ip: undefined,
    timestamp: undefined,
    user: {
      ...user,
      properties: undefined,
      password: undefined,
      id: undefined,
    },
  };

  return updatedSession;
};
