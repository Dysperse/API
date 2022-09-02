import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function exclude(user: any, ...keys: any[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

// Query returns User or null
const handler = async (req: any, res: any) => {
  const getUser: any | null = await prisma.userTokens.findUnique({
    where: {
      id: 1,
    },
  });
  res.json(exclude(getUser));
};
export default handler;
