import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import integrations from "../integrations.json";
const { google } = require("googleapis");

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export const googleClient = ({ name }) =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${
      process.env.NODE_ENV === "production"
        ? "https://api.dysperse.com"
        : "http://localhost:3000"
    }/space/integrations/authorize?integration=${name}`
  );

export async function GET(req: NextRequest) {
  let authorizationUrl = null;
  try {
    /**
     * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
     * from the client_secret.json file. To get these credentials for your application, visit
     * https://console.cloud.google.com/apis/credentials.
     */
    const params = await getApiParams<{
      id: (typeof integrations)[0]["slug"];
      session: string;
    }>(req, [
      { name: "id", required: true },
      { name: "session", required: true },
    ]);
    cookies().set("session", params.session);
    const oauth2Client = googleClient({
      name: params.id,
    });

    if (params.id === "gmail" || params.id === "google-calendar") {
      // Access scopes for read-only access to contacts and profile info
      const scopes = [
        // For Google Calendar integration
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events.readonly",
      ];

      // Generate a url that asks permissions for the Drive activity scope
      authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: "offline",
        prompt: "consent",
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
      });
    } else {
      return handleApiError(new Error("Invalid integration"));
    }
  } catch (error) {
    return handleApiError(error);
  } finally {
    if (authorizationUrl) {
      redirect(authorizationUrl);
    }
  }
}
