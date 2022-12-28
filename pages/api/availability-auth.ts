import prisma from "../../prisma/prisma";

export default async function handler(req, res) {
  const { secret, accessToken } = req.query;
  if (secret !== process.env.AVAILABILITY_OAUTH_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }
  const user = await prisma.oAuthToken.findUnique({
    where: {
      accessToken: accessToken,
    },
    select: {
      user: true,
    },
  });

  await prisma.oAuthToken.delete({
    where: {
      accessToken: accessToken,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid access token" });
  }
  res.json({ success: true, user: user.user });
}
