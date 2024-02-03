import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { googleClient } from "../redirect/route";

export async function GET(req: NextRequest) {
  let name = "";
  let id = "";
  try {
    const session = cookies().get("session")?.value;
    if (!session) throw new Error("Session not found");

    const params = await getApiParams<{
      integration: string;
      error?: string;
      code?: string;
      scope?: string;
    }>(req, [
      { name: "integration", required: true },
      { name: "error", required: false },
      { name: "code", required: false },
      { name: "scope", required: false },
    ]);
    name = params.integration;
    if (params.error) {
      return handleApiError(new Error(params.error));
    }
    switch (params.integration) {
      case "google-calendar":
      case "gmail":
        const oauth2Client = googleClient({
          name: params.integration,
        });
        const { tokens } = await oauth2Client.getToken(params.code);
        if (!tokens) throw new Error("No tokens found");
        const { userId, spaceId } = await getIdentifiers(session);

        const integration = await prisma.integration.create({
          data: {
            userId,
            spaceId,
            params: tokens,
            name: params.integration,
          },
        });

        id = integration.id;

        break;
      default:
        throw new Error("Invalid integration");
    }
  } catch (e) {
    return handleApiError(e);
  }

  redirect(
    `https://app.dysperse.com/settings/space/integrations/${name}/${id}`
  );
}
