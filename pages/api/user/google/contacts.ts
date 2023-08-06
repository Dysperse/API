import { prisma } from "@/lib/server/prisma";
import { shuffle } from "../profile/friends";
import { googleClient } from "./redirect";

export default async function handler(req, res) {
  const oauth2Client = googleClient(req);
  const tokenObj = req.query.tokenObj as string;

  // Get contact list from Google
  oauth2Client.setCredentials(JSON.parse(tokenObj));

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
