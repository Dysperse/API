import prisma from "./prisma";

// READ
export const getAllUsers = async () => {
  const users = await prisma.session.findMany({});
  return users;
};
