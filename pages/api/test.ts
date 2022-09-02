import { getAllUsers } from "../../prisma/user";

const handler = async (req: any, res: any) => {
  const users = await getAllUsers();
  res.json(users);
};

export default handler;
