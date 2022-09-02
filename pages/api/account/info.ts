import { prisma } from "../../../lib/client";

// Query returns User or null
export const getUserData = async (token: string) => {
  const session: any | null = await prisma.session.findUnique({
    where: {
      id: token,
    },
    select: {
      user: {
        select: true,
      },
    },
  });
  return session;
};

const handler = async (req: any, res: any) => {
  try {
    const session = await getUserData(req.query.token);
    if (session) {
      res.json(session);
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
export default handler;
