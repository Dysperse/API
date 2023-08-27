import { sessionData } from "../../session";

export default async function handler(req, res) {
  const session = await sessionData(req.cookies.token);
  console.log(session);
  res.json({});
}
