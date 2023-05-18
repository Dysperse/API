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

const handler = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=86400");

  try {
    const session = await getUserData(req.query.token);
    if (session && session?.user !== false) {
      res.send(JSON.stringify(session, null, 2));
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.log(err);
    res.send({
      error: "An unexpected error occurred",
    });
  }
};
export default handler;
