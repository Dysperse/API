import { BoardEmail } from "@/emails/board";
import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { Resend } from "resend";

const handler = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.shareToken.create({
      data: {
        expiresAt: new Date(req.query.expiresAt),
        readOnly: req.query.readOnly === "true",
        property: { connect: { id: req.query.boardProperty } },
        ...(req.query.board && { board: { connect: { id: req.query.board } } }),
        user: { connect: { email: req.query.email } },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        board: {
          select: {
            name: true,
          },
        },
      },
    });

    resend.sendEmail({
      from: "Dysperse <hello@dysperse.com>",
      to: req.query.email,
      subject: "You've been invited to collaborate on a board!",
      react: BoardEmail({
        boardId: req.query.board,
        boardName: data.board?.name,
        toName: data.user.name,
        fromName: req.query.name,
      }),
    });
    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
