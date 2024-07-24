import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { SPOTIFY_CONFIG } from "@/lib/spotifyConfig";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(req: NextRequest) {
  const spotifyApi = new SpotifyWebApi(SPOTIFY_CONFIG);

  try {
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) throw new Error("No session token found");

    const params = await getApiParams(req, [
      { name: "code", required: true },
      { name: "state", required: true },
    ]);

    if (params.state !== sessionToken) throw new Error("Invalid state");

    const user = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: { userId: true },
    });

    const userId = user.userId;
    let profile: any = null;

    await spotifyApi.authorizationCodeGrant(params.code).then(
      async function (data) {
        console.log("The token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        console.log("The refresh token is " + data.body["refresh_token"]);

        profile = await prisma.profile.update({
          where: { userId },
          data: { spotifyAuthTokens: (data.body as any) || null },
          select: { spotifyAuthTokens: true },
        });

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  } catch (e) {
    return handleApiError(e);
  }

  return redirect(
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:8081"
        : "https://app.dysperse.com"
    }/settings/account/integrations`
  );
}
