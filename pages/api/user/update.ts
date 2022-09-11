// Update user settings
import { prisma } from "../../../lib/client";

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
    console.log(req.query.token);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = session.user.id;
  console.log(req.query.color);
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: req.query.name || undefined,
      email: req.query.email || undefined,
      avatar: req.query.avatar || undefined,
      darkMode: req.query.darkMode || undefined,
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
