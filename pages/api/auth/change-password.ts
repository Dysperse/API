import argon2 from "argon2";
import { prisma } from "../../lib/prismaClient";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  // Get the user's email and password from the request body
  const { password, token } = JSON.parse(req.body);

  //  Find passwordResetToken in database and get user id from it
  const passwordResetToken: any = await prisma.passwordResetToken.findUnique({
    where: {
      token: token,
    },
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

  res.json({ success: true });
}
