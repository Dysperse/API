import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { google } from "googleapis";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const googleLoginClient = ({ name }) =>
  new google.auth.OAuth2(
    process.env.LOGIN_GOOGLE_CLIENT_ID,
    process.env.LOGIN_GOOGLE_CLIENT_SECRET,
    `${
      process.env.NODE_ENV === "production"
        ? "https://api.dysperse.com"
        : "http://localhost:3000"
    }/space/integrations/settings/google-calendar/auth`
  );

export async function GET(req: NextRequest) {
  let account: any = null;
  let tokens: any = null;

  try {
    const params = await getApiParams<{
      error?: string;
      code?: string;
      scope?: string;
      returnSessionId?: string;
    }>(req, [
      { name: "error", required: false },
      { name: "code", required: false },
      { name: "scope", required: false },
      { name: "returnSessionId", required: false },
    ]);
    // Get email from google api
    const oauth2Client = googleLoginClient({
      name: "google",
    });
    const { tokens: _tokens } = await oauth2Client.getToken(
      params.code as string
    );
    if (!_tokens) throw new Error("No tokens found");

    oauth2Client.setCredentials(_tokens);

    const { data } = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });

    account = data;
    tokens = JSON.stringify(_tokens);
  } catch (e) {
    return handleApiError(e);
  }

  redirect(
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081"
        : "https://go.dysperse.com"
    }/auth/google?account=${JSON.stringify(account)}&tokens=${tokens}`
  );
}
