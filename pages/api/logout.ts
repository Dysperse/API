import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
}

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    req.session.user = {};
    await req.session.save();
    res.redirect("/");
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
