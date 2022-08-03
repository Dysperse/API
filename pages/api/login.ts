import { withIronSessionApiRoute } from "iron-session/next";
import { getInfo } from "./account/info";

declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
}

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const token = req.query.token ?? "false";
    const info = await getInfo(token);

    req.session.user = {
      valid: true,
      ...info,
    };
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
