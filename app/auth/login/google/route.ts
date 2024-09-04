import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
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
    }/auth/login/google`
  );

export async function GET(req: NextRequest) {
  let session = "";
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
    const { tokens } = await oauth2Client.getToken(params.code as string);
    if (!tokens) throw new Error("No tokens found");

    oauth2Client.setCredentials(tokens);
    const { data } = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });

    const acc = await prisma.user.findFirstOrThrow({
      where: {
        email: data.email || "-1",
      },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
      },
    });

    const s = await prisma.session.create({
      data: {
        userId: acc.id,
      },
    });

    new Notification("FORCE", {
      title: "New login detected! 🚨🫵",
      body: "If this wasn't you, please remove this device from your account settings immediately!",
      data: {},
    }).dispatch(acc.id);

    session = s.id;

    if (params.returnSessionId && session) {
      return Response.json({ session });
    }
  } catch (e) {
    return handleApiError(e);
  }

  if (session)
    redirect(
      `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081"
          : "https://app.dysperse.com"
      }/auth/google?session=${session}`
    );
  else return handleApiError(new Error("No session found"));
}
