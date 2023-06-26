import { validateCaptcha } from "@/lib/server/captcha";
import { prisma } from "@/lib/server/prisma";

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
    select: { id: true },
  });

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { id } = user;

  // Send an email with a link to reset the password
  const token = await prisma.passwordResetToken.create({
    data: { user: { connect: { id } } },
  });

  const url = `https://my.dysperse.com/auth/reset-password/${token.token}`;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    service_id: "service_bhq01y6",
    template_id: "template_evbixeg",
    user_id: "6Q4BZ_DN9bCSJFZYM",
    accessToken: process.env.EMAILJS_ACCESS_TOKEN,
    template_params: {
      to: email,
      link: url,
    },
  });

  const requestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const emailRes = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    requestOptions
  ).then((res) => res.text());
  console.log(emailRes);
  res.json({ success: true });
}
