import { sessionData } from "@/app/api/session/route";
import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const session = await sessionData(token);

    const code = getApiParam(req, "code", true);

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const data = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        code: code,
        redirect_uri: `https://${req.headers["x-forwarded-host"]}/api/user/spotify/auth`,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    }).then((res) => res.json());

    await prisma?.profile.update({
      where: {
        userId: session.user.identifier,
      },
      data: { spotify: data },
    });

    redirect(`/users/${session.user.username || session.user.email}`);
  } catch (e) {
    return handleApiError(e);
  }
}
