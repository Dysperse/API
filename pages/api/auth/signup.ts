import { WelcomeEmail } from "@/emails/welcome";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { validateCaptcha } from "@/lib/server/captcha";
import { prisma } from "@/lib/server/prisma";
import argon2 from "argon2";
import { Resend } from "resend";
import { createSession } from "./login";

export async function sendEmail(name, email) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.sendEmail({
    from: "Dysperse <hello@dysperse.com>",
    to: email,
    subject: "Welcome to the #dysperse family 👋",
    react: WelcomeEmail({ name, email }),
  });
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * API handler for the /api/signup endpoint
 * @param {any} req
 * @param {any} res
 */
export default async function handler(req, res) {
  const body = JSON.parse(req.body);

  try {
    // Validate captcha
    const data = await validateCaptcha(body.captchaToken);
    if (!data.success) {
      return res.status(401).json({ error: true, message: "Invalid Captcha" });
    }
  } catch (e) {
    return res.status(401).json({ error: true, message: "Invalid Captcha" });
  }

  if (!validateEmail(body.email.toLowerCase())) {
    return res
      .status(401)
      .json({ error: true, message: "Please type in a valid email address" });
  }
  if (body.password !== body.confirmPassword) {
    return res
      .status(401)
      .json({ error: true, message: "Passwords do not match" });
  }
  //  Find if email is already in use
  const emailInUse = await prisma.user.findUnique({
    where: {
      email: body.email.toLowerCase(),
    },
  });

  if (emailInUse) {
    res.status(401).json({ error: true, message: "Email already in use" });
    return;
  }
  // Get the user's email and password from the request body
  const { name, email, password } = body;

  // Hash the password
  const hashedPassword = await argon2.hash(password);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      Profile: {
        create: {},
      },
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });
  //   Get user id from user
  const id = user.id;
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";

  // Create a session token in the session table
  const session = createSession(id, res, ip);

  //   Create a property
  const property = await prisma.property.create({
    data: {
      name: "My home",
      color: "cyan",
    },
  });
  //   Get property id from property
  const propertyId = property.id;

  //   Create a property invite
  await prisma.propertyInvite.create({
    data: {
      selected: true,
      accepted: true,
      permission: "owner",
      profile: {
        connect: {
          id: propertyId,
        },
      },
      user: { connect: { id: id } },
    },
  });

  try {
    await sendEmail(capitalizeFirstLetter(name), email.toLowerCase());
  } catch (e) {
    console.error("Something happened when trying to send the email", e);
  }
  res.status(200).json({ message: "Success", session });
}
