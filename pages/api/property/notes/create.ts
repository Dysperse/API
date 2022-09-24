import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const note = await prisma.note.create({
    data: {
      property: {
        connect: {
          id: req.query.property,
        },
      },
      name: req.query.title,
      color: req.query.color ?? "orange",
      content: req.query.content,
      pinned: req.query.pinned === "true",
    },
  });

  res.json(note);
};

export default handler;
