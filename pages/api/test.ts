import { getAllUsers } from "../../prisma/user";

const handler = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};
