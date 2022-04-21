import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
	try {
		const user = {
			image:
				"https://i.ibb.co/PrqtZZ3/2232ae71-edbe-4035-8c89-9cb9039fa06d.jpg",
			isLoggedIn: true
		};
		req.session.user = user;
		await req.session.save();
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
}
export default withIronSessionApiRoute(loginRoute, sessionOptions);
