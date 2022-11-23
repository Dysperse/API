import argon2 from "argon2";
import { prisma } from "../../lib/prismaClient";
import { createSession } from "./login";

/**
 * API handler for the /api/signup endpoint
 * @param {any} req
 * @param {any} res
 */
export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  if (body.password !== body.confirmPassword) {
    return res.status(401).json({ message: "Passwords do not match" });
  }
  //  Find if email is already in use
  const emailInUse = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (emailInUse) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }
  // Get the user's email and password from the request body
  const { name, email, password } = body;

  // Hash the password
  const hashedPassword = await argon2.hash(password);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  //   Get user id from user
  const id = user.id;
  // Create a session token in the session table
  const session = createSession(id, res);

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
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

  res.status(200).json({ message: "Success", session });
}
