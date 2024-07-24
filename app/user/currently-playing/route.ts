import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { SPOTIFY_CONFIG } from "@/lib/spotifyConfig";
import { NextRequest } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

async function getCurrentlyPlayingTrack(spotifyApi: SpotifyWebApi) {
  return spotifyApi.getMyCurrentPlayingTrack().then((r) => r.body);
}

async function refreshAuthToken(userId: string, refreshToken: string) {
  const newTokens = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  }).then((r) => r.json());

  await prisma.profile.update({
    where: { userId },
    data: {
      spotifyAuthTokens: {
        ...newTokens,
        refresh_token: refreshToken,
      },
    },
  });

  return newTokens;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const data = await prisma.profile.findFirstOrThrow({
      where: { userId },
      select: { spotifyAuthTokens: true },
    });

    if (!data.spotifyAuthTokens || typeof data.spotifyAuthTokens !== "object")
      throw new Error("AUTHORIZATION_REQUIRED");

    let spotifyApi = new SpotifyWebApi({
      ...SPOTIFY_CONFIG,
      accessToken: (data.spotifyAuthTokens as any).access_token,
      refreshToken: (data.spotifyAuthTokens as any).refresh_token,
    });

    try {
      const currentlyPlaying = await getCurrentlyPlayingTrack(spotifyApi);
      console.log(currentlyPlaying);
      return Response.json(currentlyPlaying);
    } catch (e: any) {
      if (e.statusCode === 401) {
        // Token has expired, refresh it and retry
        const newTokens = await refreshAuthToken(
          userId,
          (data.spotifyAuthTokens as any).refresh_token
        );

        spotifyApi.setAccessToken(newTokens.access_token);

        const currentlyPlaying = await getCurrentlyPlayingTrack(spotifyApi);
        console.log(currentlyPlaying);
        return Response.json(currentlyPlaying);
      } else {
        throw e;
      }
    }
  } catch (e) {
    return handleApiError(e);
  }
}
