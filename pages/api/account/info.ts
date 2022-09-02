import { PrismaClient } from "@prisma/client";
const prisma: any = new PrismaClient();

function exclude(user: any, ...keys: any[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

// Query returns User or null
export const getUser = async (token: string) => {
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
  const session = await getUser(req.query.token);

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
