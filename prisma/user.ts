import prisma from "./prisma";

export const getAllUsers = async () => {
  const users = await prisma.session.findMany({});
  return users;
};
