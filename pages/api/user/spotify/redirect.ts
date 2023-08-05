const client_id = "27b1c11438204ca6acc88ca514c22665";
const redirect_uri =
  "https://manuthecoder-crispy-garbanzo-w495gwjj6q4h5pp-3000.app.github.dev/api/user/spotify/auth";

export default function handler(req, res) {
  // var state = generateRandomString(16);
  const scope = "user-read-currently-playing";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        //   state: state,
      })
  );
}
