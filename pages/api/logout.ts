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
    cookieName: "session",
    password: `${process.env.SECRET_COOKIE_PASSWORD}`,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
