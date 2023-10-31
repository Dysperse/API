import { sessionData } from "@/app/api/session/route";
import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const session = await sessionData(req.cookies.token);
    const { code } = req.query;
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

    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
}
