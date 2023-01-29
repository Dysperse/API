import { prisma } from "../../../lib/prismaClient";

/**
 * Get user data from sessions table using accessToken
 * @param {string} token
 * @returns {any}
 */
export const getUserData = async (token: string) => {
  const session = await prisma.session.findUnique({
    where: {
      id: token,
    },
    select: {
      user: {
        select: {
          id: false,
          identifier: true,
          name: true,
          email: true,
          twoFactorSecret: true,
          darkMode: true,
          trophies: true,
          color: true,
          password: false,
          onboardingComplete: true,
          verifiedEmail: true,
          notificationSubscription: true,
          properties: {
            where: {
              selected: true,
            },
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

  let _session: any = session;
  _session.user.token = token;
  return session;
};

/**
 * API handler for the /api/user/info endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  try {
    const session = await getUserData(req.query.token);
    if (session) {
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
