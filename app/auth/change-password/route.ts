import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import argon2 from "argon2";
import { NextRequest } from "next/server";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function POST(req: NextRequest) {
  try {
    const { password, token } = await req.json();

    //  Find passwordResetToken in database and get user id from it
    const passwordResetToken: any = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    const userId = passwordResetToken.userId;

    //   Create Argon2 hash of password
    const hashedPassword = await argon2.hash(password);

    //   Update user password
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    //   Delete passwordResetToken
    await prisma.passwordResetToken.delete({
      where: {
        token: token,
      },
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
