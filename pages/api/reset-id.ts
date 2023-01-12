import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prismaClient";

/**
 * Creates a session and stores it in the database
 * @param {number} id
 * @param {any} res
 * @returns {any}
 */
export async function createSession(id: number, res) {
  // Create a session token in the session table
  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

  const token = session.id;

  const encoded = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 4 * 12, // 1 year
      accessToken: token,
    },
    process.env.SECRET_COOKIE_PASSWORD
  );
  const now = new Date();
  now.setDate(now.getDate() * 7 * 4);
  res.setHeader(
    "Set-Cookie",
    serialize("token", encoded, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 4, // 1 month
      expires: now,
    })
  );
  return encoded;
}

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  // Get the user's email and password from the request body
  const { email } = JSON.parse(req.body);
  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      password: true,
      twoFactorSecret: true,
    },
  });
  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const id: any = user.id;

  //   Send an email with a link to reset the password
  const token = await prisma.passwordResetToken.create({
    data: {
      user: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });

  const url = `https://my.smartlist.tech/auth/reset-password/${token.token}`;

  console.log(url);

  // const templateParams = {
  //   to: email,
  //   link: url,
  // };

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

  await fetch("https://api.emailjs.com/api/v1.0/email/send", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  res.json({ success: true });
}
