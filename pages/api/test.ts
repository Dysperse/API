import { getAllUsers } from "../../prisma/user";

export default async function handle(req, res) {
  const users = await getAllUsers();
  return res.json(users);
}
