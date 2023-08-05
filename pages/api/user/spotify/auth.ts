import { sessionData } from "../../session";

export default async function handler(req, res) {
  try {
    const session = await sessionData(req.cookies.token);
    const { code } = req.query;
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

    res.redirect(`/users/${session.user.username || session.user.email}`);
  } catch (e: any) {
    res.json({ success: false, error: e.message });
  }
}
