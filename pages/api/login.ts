import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
	interface IronSessionData {
		user?: any;
	}
}

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
		const demoToken =
			"2d8a0db9ca24b84453d7e12368cb9d18c5397b1cf6d96a8d2381dcf448ca60caf9cc28e8f0d41c559cb9df0daf16f37e5440ceed52203b860e9b4950d42d5c90f8a84474b8f5fd4b0599a2fe66d2fc4f86ceaad7e6ef44b503e10d28eb0b60af8fc86168154cb58cdcad0f893c2f61cc21030036217e702250cd6cfd66060e58349c1c8b79dd5427f62808e8e978533b73159c27b72d0692218b54b7eca9dd63fd266505d29d634e938528ac1118d3616ce47ce4b458d1747482e36d682b4f30dcf2c00ee59b772aff0ad4d77130778f1e9da25cc5b2cb8ec8a4840ca3e3c558db5ac0e87187d167e32eed1dfd49d27b4a0b9a59e3d40edf67b35bf2e6633038e770837e702ac2b73c0ae0e5109f4738ebf0f45741d05dd3866cfbbdfd6a33447c15bdf5f38d3b181315b5f8";
		let info: any = await fetch("https://api.smartlist.tech/v2/account/info/", {
			method: "POST",
			body: new URLSearchParams({
				token: demoToken
			})
		});
		info = await info.json();
		// get user from database then:
		req.session.user = {
			valid: true,
			accessToken: demoToken,
			user: info.data
		};
		await req.session.save();
		res.send(JSON.stringify({ success: true }, null, 2));
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
