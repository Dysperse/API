import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler for the /api/property/notes/edit endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions: null | string = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const note = await prisma.note.update({
    data: {
      name: req.query.title,
      color: req.query.color ?? "orange",
      content: req.query.content,
      pinned: req.query.pinned === "true",
    },
    where: {
      id: req.query.id,
    },
  });

  res.json(note);
};

export default handler;
