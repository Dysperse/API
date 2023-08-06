import { prisma } from "@/lib/server/prisma";
import { sessionData } from "../../session";
import { googleClient } from "./redirect";
const url = require("url");

export default async function handler(req, res) {
  const session = await sessionData(req.cookies.token);

  const oauth2Client = googleClient(req);

  // Handle the OAuth 2.0 server response
  let q = url.parse(req.url, true).query;

  // Get access and refresh tokens (if access_type is offline)
  let { tokens } = await oauth2Client.getToken(q.code);
  oauth2Client.setCredentials(tokens);

  await prisma?.profile.update({
    where: {
      userId: session.user.identifier,
    },
    data: { google: tokens as any },
  });

  res.redirect(`/users/${session.user.username || session.user.email}?override`);
}
