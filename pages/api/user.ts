// pages/api/user.ts

import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
	function userRoute(req, res) {
		res.send({ user: req.session.user });
	},
	{
		cookieName: "myapp_cookiename",
		password: "complex_password_at_least_32_characters_long",
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production"
		}
	}
);
