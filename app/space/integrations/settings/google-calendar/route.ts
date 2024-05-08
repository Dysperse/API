import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { googleClient } from "../../redirect/route";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export function refreshGoogleAuthTokens(
  tokenObj: any,
  oauth2Client: any,
  integrationId: any
) {
  if (!tokenObj) throw new Error("Token not found");
  if (tokenObj.expiry_date < Date.now()) {
    oauth2Client.refreshAccessToken(async function (err, t) {
      if (err) {
        return;
      } else {
        await prisma.integration.update({
          where: { id: integrationId },
          data: { params: t },
        });
        oauth2Client.setCredentials(t.tokens);
      }
    });
  }
}

export async function GET(req: NextRequest) {
  const { userId } = await getIdentifiers();
  const params = await getApiParams(req, [{ name: "id", required: true }]);

  const data = await prisma.integration.findFirstOrThrow({
    where: {
      AND: [{ userId }, { name: "google-calendar" }, { id: params.id }],
    },
  });

  const oauth2Client = googleClient({
    name: "google-calendar",
  });

  oauth2Client.setCredentials(data.params);
  refreshGoogleAuthTokens(data.params, oauth2Client, data.id);

  const calendars = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
      },
    }
  ).then((res) => res.json());

  console.log(oauth2Client.credentials.access_token);

  return Response.json(calendars);
}
