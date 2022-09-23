// Update user settings
import { prisma } from "../../../lib/client";

/**
 * API handler for the /api/user/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req: any, res) => {
  // Get user info from sessions table using accessToken
  const session: any | null = await prisma.session.findUnique({
    where: {
      id: req.query.token,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = session.user.id;
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: req.query.name || undefined,
      email: req.query.email || undefined,
      avatar: req.query.avatar || undefined,
      twoFactorSecret: req.query.twoFactorSecret == "" ? "" : undefined,
      darkMode: req.query.darkMode === "true" ?? undefined,
      color: req.query.color || undefined,
      onboardingComplete:
        (req.query.onboardingComplete &&
          req.query.onboardingComplete === "true") ||
        undefined,
    },
  });
  res.json(user);
};
export default handler;
