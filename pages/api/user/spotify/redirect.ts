export default function handler(req, res) {
  const scope = "user-read-currently-playing";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID as string,
        scope: scope,
        redirect_uri: `https://${req.headers["x-forwarded-host"]}/api/user/spotify/auth`,
      })
  );
}
