// Update user settings
import { prisma } from "@/lib/server/prisma";
import cacheData from "memory-cache";
import * as twofactor from "node-2fa";

const handler = async (req, res) => {
  // Get user info from sessions table using accessToken
  const session = await prisma.session.findUnique({
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
  twofactor.generateToken(req.query.secret);
  const login = twofactor.verifyToken(req.query.secret, req.query.code);

  if (!login || login.delta !== 0) {
    res.status(401).json({ error: "Invalid code" });
    return;
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorSecret: req.query.secret || undefined,
    },
  });
  cacheData.clear();

  res.json(user);
};
export default handler;
