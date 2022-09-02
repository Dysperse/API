import { prisma } from "../../../prisma/client";

// Query returns User or null
export const getUserData = async (token: string) => {
  const session: any | null = await prisma.session.findUnique({
    where: {
      id: token,
    },
    select: {
      user: {
        select: {
          avatar: true,
          budgetDaily: true,
          budgetMonthly: true,
          budgetWeekly: true,
          color: true,
          financePlan: true,
          name: true,
          currency: true,
          darkMode: true,
          email: true,
          financeToken: true,
          onboardingComplete: true,
          verifiedEmail: true,
          properties: true,
        },
      },
    },
  });
  return session;
};

const handler = async (req, res) => {
  const session = await getUserData(req.query.token);

  if (session) {
    res[process.env.NODE_ENV == "production" ? "json" : "send"](
      process.env.NODE_ENV == "production"
        ? session.user
        : JSON.stringify(session.user, null, 2)
    );
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};
export default handler;
