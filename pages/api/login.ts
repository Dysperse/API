// pages/api/login.ts

import { withIronSessionApiRoute } from "iron-session/next";
// hi
export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		// get user from database then:
		req.session.user = {
			email: "manuthecoder@protonmail.com",
			name: "Manu G",
			financePlan: "medium-term",
			image:
				"https://i.ibb.co/PrqtZZ3/2232ae71-edbe-4035-8c89-9cb9039fa06d.jpg",
			notificationMin: 7,
			budget: 185,
			onboarding: 1,
			verifiedEmail: 1,
			purpose: "personal",
			defaultPage: "finances",
			studentMode: "on",
			financeToken: "test_token_ianli4n7hb7q2",
			familyCount: 9,
			houseName: "My awesome company",
			currency: "dollar",
			theme: {
				dark: [74, 20, 140],
				original: [106, 27, 154],
				light: [123, 31, 162],
				tint: [243, 229, 245]
			},
			isLoggedIn: true
		};
		await req.session.save();
		res.send(req.session);
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
