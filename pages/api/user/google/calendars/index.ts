import { sessionData } from "@/app/api//session/route";
import { prisma } from "@/lib/server/prisma";
import { googleClient } from "../redirect";

export default async function handler(req, res) {
  const session = await sessionData(req.cookies.token);

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
        res.json(err);
        return;
      } else {
        await prisma.profile.update({
          where: {
            userId: req.query.userIdentifier,
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

  res.json(calendars);
}
