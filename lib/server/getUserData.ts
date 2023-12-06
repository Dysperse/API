import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";

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
          tabs: true,
          settings: true,
          notifications: true,
          Profile: { select: { picture: true } },
          selectedProperty: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    return { user: false };
  }

  try {
    await prisma.user.update({
      where: {
        identifier: session.user.identifier,
      },
      data: {
        lastActive: dayjs().tz(session.user.timeZone).toDate(),
      },
    });
  } catch (e) {}

  const { ip, timestamp, user, ...restSession } = session;

  const updatedSession = {
    ...restSession,
    current: {
      token,
      ip,
      timestamp,
    },
    userId: undefined,
    id: undefined,
    ip: undefined,
    timestamp: undefined,
    space: {
      access: user.selectedProperty?.members.find((d) => d.userId === user.id),
      info: { ...user.selectedProperty, members: undefined },
    },
    user: {
      ...user,
      lastActive: undefined,
      password: undefined,
      id: undefined,
      selectedProperty: undefined,
    },
  };

  return updatedSession;
};
