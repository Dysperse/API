import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

async function getSong(access_token) {
  return await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
}

export async function getCurrentlyListening(
  email,
  access_token,
  refresh_token
) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  let response = await getSong(access_token);

  if ((response.error && refresh_token) || true) {
    const refreshResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    ).then((res) => res.json());

    if (refresh_token && refreshResponse.access_token)
      await prisma.profile.updateMany({
        where: { user: { email: email } },
        data: { spotify: { ...refreshResponse, refresh_token } },
      });

    response = await getSong(refreshResponse.access_token);
  }

  return response;
}

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["email"]);
    const { access_token, refresh_token } = JSON.parse(req.query.spotify);

    const response = await getCurrentlyListening(
      req.query.email,
      access_token,
      refresh_token
    );

    return Response.json(response);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}
