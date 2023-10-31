import BoardEmail from "@/emails/board";
import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  try {
    const board = await getApiParam(req, "board", true);
    const data = await prisma.shareToken.findMany({
      where: {
        board: { id: board },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { spaceId } = await getIdentifiers(sessionToken);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const expiresAt = await getApiParam(req, "expiresAt", true);
  const readOnly = await getApiParam(req, "readOnly", true);
  const board = await getApiParam(req, "board", false);
  const email = await getApiParam(req, "email", false);
  const name = await getApiParam(req, "name", false);

  try {
    const data = await prisma.shareToken.create({
      data: {
        expiresAt: new Date(expiresAt),
        readOnly: readOnly === "true",
        property: { connect: { id: spaceId } },
        ...(board && { board: { connect: { id: board } } }),
        user: { connect: { email } },
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
      to: email,
      subject: "You've been invited to collaborate on a board!",
      react: BoardEmail({
        boardId: board,
        boardName: data.board?.name,
        toName: data.user.name,
        fromName: name,
      }),
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getApiParam(req, "token", true);

  try {
    const data = await prisma.shareToken.delete({
      where: { token },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
