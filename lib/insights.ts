import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const incrementUserInsight = async (
  userId: string,
  key: Prisma.UserInsightScalarFieldEnum
): Promise<Prisma.Prisma__UserInsightClient<any>> => {
  const year = new Date().getFullYear();

  return await prisma.userInsight.upsert({
    where: {
      userId_year: { userId: userId, year },
    },
    create: { year, [key]: 1, userId },
    update: { [key]: { increment: 1 } },
  });
};
