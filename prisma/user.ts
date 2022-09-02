import prisma from "./prisma";

export const getSessions = async () => {
  const sessions = await prisma.session.findMany({});
  return sessions;
};
