import { redirect } from "next/navigation";

export function GET() {
  const scope = "user-read-currently-playing";

  redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        scope: scope,
        redirect_uri: `https://my.dysperse.com/api/user/spotify/auth`,
      })
  );
}
