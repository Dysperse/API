import { prisma } from "../../../lib/prismaClient";

export default async function handler(req, res) {
  const { secret, accessToken } = req.query;
  if (secret !== process.env.AVAILABILITY_OAUTH_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }
  const user = await prisma.oAuthToken.findUnique({
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      accessToken: accessToken,
    },
    select: {
      user: {
        select: {
          email: true,
          verifiedEmail: true,
          name: true,
          color: true,
        },
      },
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid access token" });
  }
  await prisma.oAuthToken.delete({
    where: {
      accessToken: accessToken,
    },
  });

  res.json({ success: true, user: user.user });
}
