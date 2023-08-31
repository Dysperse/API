import { prisma } from "@/lib/server/prisma";
import { shuffle } from "../profile/friends";
import { googleClient } from "./redirect";

export default async function handler(req, res) {
  const oauth2Client = googleClient(req);
  let tokenObj = req.query.tokenObj;

  tokenObj = JSON.parse(tokenObj);

  // Get contact list from Google
  oauth2Client.setCredentials(tokenObj);

  if (!tokenObj) throw new Error("Token not found");
  if (tokenObj.expiry_date < Date.now()) {
    console.log(tokenObj);
    // Refresh the access token
    oauth2Client.refreshAccessToken(async function (err, newAccessToken) {
      console.log(err, newAccessToken);

      if (err) {
        console.log(err);
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
            followers: { some: { follower: { email: req.query.email } } },
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

  res.json(shuffle(users));
}
