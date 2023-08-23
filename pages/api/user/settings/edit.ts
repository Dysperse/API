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
      ...(req.query.username && {
        username:
          req.query.username
            .replace(/\s+/g, "_")
            .toLowerCase()
            .replace(/[^a-z0-9_.]/g, "") || undefined,
      }),
      lastReleaseVersionViewed:
        parseInt(req.query.lastReleaseVersionViewed) || undefined,
      email: req.query.email || undefined,
      twoFactorSecret: req.query.twoFactorSecret === "" ? "" : undefined,
      zenCardOrder: req.query.zenCardOrder || undefined,
      notificationSubscription:
        req.query.notificationSubscription === ""
          ? ""
          : req.query.notificationSubscription || undefined,
      ...(req.query.darkMode && { darkMode: req.query.darkMode }),
      color: req.query.color || undefined,
      ...(req.query.onboardingComplete && { onboardingComplete: req.query.onboardingComplete === "true" }),
    },
  });
  cacheData.clear();
  cacheData.clear();
  cacheData.clear();
  cacheData.clear();
  cacheData.clear();
  res.json(user);
};
export default handler;
