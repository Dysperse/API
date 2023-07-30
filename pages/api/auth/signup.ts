import { validateCaptcha } from "@/lib/server/captcha";
import { prisma } from "@/lib/server/prisma";
import argon2 from "argon2";
import { createSession } from "./login";

async function sendEmail(email) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    service_id: "service_bhq01y6",
    template_id: "template_mlzdt43",
    user_id: "6Q4BZ_DN9bCSJFZYM",
    accessToken: process.env.EMAILJS_ACCESS_TOKEN,
    template_params: { to: email },
  });

  const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  }).then((res) => res.text());

  console.log(emailRes);
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
    await sendEmail(body.email);
  } catch (e) {
    console.error("Something happened when trying to send the email", e);
  }
  res.status(200).json({ message: "Success", session });
}
