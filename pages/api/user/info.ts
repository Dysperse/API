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
          email: true,
          name: true,
          password: false,
          avatar: true,
          darkMode: true,
          color: true,
          currency: true,
          financePlan: true,
          budgetDaily: true,
          budgetWeekly: true,
          budgetMonthly: true,
          onboardingComplete: true,
          verifiedEmail: true,
          financeToken: true,
          properties: true,
        },
      },
    },
  });
  return session;
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
