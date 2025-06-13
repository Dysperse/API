import { prisma } from "@/lib/prisma"; // assuming this exists
import { verifyIdToken } from "apple-signin-auth";

const APPLE_CLIENT_ID =
  process.env.NODE_ENV === "development"
    ? "com.dysperse.development"
    : "com.dysperse.go";

export async function POST(req: Request) {
  try {
    const { identityToken } = await req.json();

    if (!identityToken) {
      return new Response("Missing token", { status: 400 });
    }

    const appleUser = await verifyIdToken(identityToken, {
      audience: APPLE_CLIENT_ID,
    });

    const { email, email_verified, sub } = appleUser;

    if (!email_verified)
      return new Response("Email not verified", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const session = await prisma.session.create({
        data: { userId: user.id },
      });

      return Response.json({ sessionId: session.id });
    } else {
      return Response.json({
        isNew: true,
        email,
        userId: sub,
      });
    }
  } catch (err) {
    console.error("Apple auth error:", err);
    return new Response("Invalid token", { status: 401 });
  }
}
