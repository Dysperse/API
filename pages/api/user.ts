import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
}

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.json(req.session.user);
  },
  {
    cookieName: "session",
    password: `${process.env.SECRET_COOKIE_PASSWORD}`,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
