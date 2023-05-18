import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.notificationSettings.findUnique({
    where: { userId: req.query.userIdentifier || "null" },
  });
  res.json(data || {});
}
