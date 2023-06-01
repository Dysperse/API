import { prisma } from "@/lib/server/prisma";
import { sessionData } from "../../session";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    let info;

    if (req.cookies.token) {
      info = await sessionData(req.cookies.token);
      if (info.user === false) {
        res.redirect("/auth");
        throw new Error("Not logged in");
      }
    } else {
      res.redirect("/auth");
      throw new Error("Not logged in");
    }

    const { identifier } = info.user;

    if (!identifier) {
      throw new Error("No identifier");
    }

    const data = await prisma.qrToken.findFirst({
      where: { token: req.query.token },
    });

    if (!data) {
      throw new Error("Invalid token");
    }

    if (new Date() > new Date(data.expires)) {
      throw new Error("Expired token");
    }

    await prisma.qrToken.update({
      where: { token: req.query.token },
      data: { user: { connect: { identifier } } },
    });

    res.json(data);
  } catch (e: any) {
    res.status(401).json({ success: false, error: e.message });
  }
}
