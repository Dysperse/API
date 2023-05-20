// Update user settings
import { prisma } from "@/lib/server/prisma";
import cacheData from "memory-cache";

const handler = async (req, res) => {
  const session = await prisma.session.findUnique({
    where: {
      id: req.query.token,
    },
    select: {
      user: {
        select: { id: true },
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
      lastReleaseVersionViewed:
        parseInt(req.query.lastReleaseVersionViewed) || undefined,
      email: req.query.email || undefined,
      twoFactorSecret: req.query.twoFactorSecret === "" ? "" : undefined,
      zenCardOrder: req.query.zenCardOrder || undefined,
      notificationSubscription:
        req.query.notificationSubscription === ""
          ? ""
          : req.query.notificationSubscription || undefined,
      ...(req.query.darkMode && {
        darkMode: req.query.darkMode === "true" ?? undefined,
      }),
      color: req.query.color || undefined,
      onboardingComplete:
        (req.query.onboardingComplete &&
          req.query.onboardingComplete === "true") ||
        undefined,
    },
  });
  cacheData.clear();
  res.json(user);
};
export default handler;