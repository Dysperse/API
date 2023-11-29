import { sessionData } from "@/app//session/route";
import { getIdentifiers, getSessionToken } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { googleClient } from "../redirect/route";

export default async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const session = await sessionData(token);
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const data = await prisma.profile.findFirstOrThrow({
    where: {
      user: { identifier: session.user.identifier },
    },
    select: { google: true },
  });

  const oauth2Client = googleClient(req);
  const tokenObj: any = data.google;

  // Get contact list from Google
  oauth2Client.setCredentials(tokenObj);
  if (!tokenObj) throw new Error("Token not found");
  if (tokenObj.expiry_date < Date.now()) {
    // Refresh the access token
    oauth2Client.refreshAccessToken(async function (err, newAccessToken) {
      if (err) {
        return;
      } else {
        await prisma.profile.update({
          where: {
            userId: userIdentifier,
          },
          data: {
            google: newAccessToken,
          },
        });
        oauth2Client.setCredentials(newAccessToken);
      }
    });
  }

  const calendars = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
      },
    }
  ).then((res) => res.json());

  return Response.json(calendars);
}
