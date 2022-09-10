import { prisma } from "../../../lib/client";

// Query returns User or null
export const getUserData = async (token: string) => {
  const session: any | null = await prisma.session.findUnique({
    where: {
      id: token,
    },
    select: {
      user: {
        select: {
          id: false,
          name: true,
          email: true,
          avatar: true,
          darkMode: true,
          color: true,
          password: false,
          onboardingComplete: true,
          verifiedEmail: true,
          properties: {
            select: {
              propertyId: true,
              accessToken: true,
              selected: true,
              accepted: true,
              permission: true,
              profile: true,
            },
          },
        },
      },
    },
  });
  return {
    ...session,
    user: {
      ...session.user,
      token: token,
    },
  };
};

const handler = async (req: any, res: any) => {
  try {
    const session = await getUserData(req.query.token);
    if (session) {
      res.send(JSON.stringify(session, null, 2));
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
export default handler;
