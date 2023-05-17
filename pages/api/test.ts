import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    validateParams(req.query, ["id"]);

    const data = await prisma.propertyLinkInvite.deleteMany({
      where: { id: { equals: req.query.id } },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
