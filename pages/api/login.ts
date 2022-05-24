import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: any;
  }
}

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const token = req.query.token ?? "false";
    let info: any = await fetch("https://api.smartlist.tech/v2/account/info/", {
      method: "POST",
      body: new URLSearchParams({
        token: token.toString(),
      }),
    });
    info = await info.json();
    // get user from database then:
    if (!info.success) {
      res.send(
        JSON.stringify({ success: false, message: "Invalid token" }, null, 2)
      );
      return;
    }
    req.session.user = {
      valid: true,
      accessToken: token,
      user: info.data,
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
