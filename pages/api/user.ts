import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
}

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send(JSON.stringify({ ...req.session.user }, null, 2));
  },
  {
    cookieName: "session",
    password: `${process.env.SECRET_COOKIE_PASSWORD}`,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
