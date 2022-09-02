import { getSessions } from "../../prisma/user";

const handler = async (req: any, res: any) => {
  const users = await getSessions();
  res.json(users);
};

export default handler;
