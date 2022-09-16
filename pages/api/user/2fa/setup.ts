// Update user settings
import { prisma } from "../../../../lib/client";
let notp = require("notp");

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
  const userId = session.id;

  const login = notp.totp.verify(req.query.code, req.query.secret);
  if (!login) {
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
