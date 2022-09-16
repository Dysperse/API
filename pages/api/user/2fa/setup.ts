// Update user settings
import { prisma } from "../../../../lib/client";
const twofactor = require("node-2fa");

const handler = async (req: any, res: any) => {
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
  console.log(req.query);
  const newToken = twofactor.generateToken(req.query.secret);

  const login = twofactor.verifyToken(req.query.secret, req.query.code);
  console.log(login);

  if (login.delta !== 0) {
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

  res.json(user);
};
export default handler;
