import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import { shuffle } from "../../friends/route";
import { googleClient } from "../redirect/route";

export async function GET(req: NextRequest) {
  const oauth2Client = googleClient(req);

  let tokenObj = await getApiParam(req, "tokenObj", true);
  let email = await getApiParam(req, "email", true);
  const sessionToken = getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  tokenObj = JSON.parse(tokenObj);

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

  const contacts = await fetch(
    "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&pageSize=1000",
    {
      headers: {
        Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
      },
    }
  ).then((res) => res.json());

  //   Get list of email addresses
  const emails = contacts.connections
    .filter((c) => c.emailAddresses)
    .map((c) => c.emailAddresses[0].value);

  //   Get list of users with those email addresses
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { email: { in: emails } },
        {
          NOT: {
            followers: { some: { follower: { email } } },
          },
        },
      ],
    },
    select: {
      email: true,
      name: true,
      username: true,
      Profile: {
        select: {
          picture: true,
        },
      },
    },
  });

  return Response.json(shuffle(users));
}
