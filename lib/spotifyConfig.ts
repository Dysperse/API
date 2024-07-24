export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://api.dysperse.com"
  }/user/currently-playing/finish`,
};
