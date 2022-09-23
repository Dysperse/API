// Update user settings
import { prisma } from "../../../../lib/client";
import * as twofactor from "node-2fa";

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
          twoFactorSecret: true,
        },
      },
    },
  });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const twoFactorSecret = session.user.twoFactorSecret;
  twofactor.generateToken(twoFactorSecret);
  const login: any = twofactor.verifyToken(twoFactorSecret, req.query.code);

  res.json({
    success: login && login.delta === 0,
  });
};
export default handler;
