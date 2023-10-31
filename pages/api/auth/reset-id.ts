import ForgotPasswordEmail from "@/emails/forgot-password";
import { validateCaptcha } from "@/lib/server/captcha";
import { prisma } from "@/lib/server/prisma";
import { Resend } from "resend";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  const { captchaToken, email } = JSON.parse(req.body);

  try {
    // Validate captcha
    const data = await validateCaptcha(captchaToken);
    if (!data.success) {
      return res.status(401).json({ message: "Invalid Captcha" });
    }
  } catch (e) {
    return res.status(401).json({ message: "Invalid Captcha" });
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, id: true },
  });

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { id, name } = user;

  // Send an email with a link to reset the password
  const token = await prisma.passwordResetToken.create({
    data: { user: { connect: { id } } },
  });

  const url = `https://my.dysperse.com/auth/reset-password/${token.token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.sendEmail({
    from: "Dysperse <hello@dysperse.com>",
    to: email,
    subject: "Forgot your password?",
    react: ForgotPasswordEmail({ name, email, link: url }),
  });
  return Response.json({ success: true });
}
