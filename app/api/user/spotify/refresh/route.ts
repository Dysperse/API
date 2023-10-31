import { sessionData } from "@/app/api/session/route";
import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const session = await sessionData(token);

    // const code = getApiParam(req, "code", true);
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const data = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: session.user.spotify.refresh_token,
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

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
