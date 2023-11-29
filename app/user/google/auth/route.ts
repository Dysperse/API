import { sessionData } from "@/app/session/route";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { googleClient } from "../redirect/route";
const url = require("url");

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const session = await sessionData(token);

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

  redirect(`/users/${session.user.username || session.user.email}?override`);
}
