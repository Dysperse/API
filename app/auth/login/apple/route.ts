import { handleApiError } from "@/lib/handleApiError";
import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { verifyIdToken } from "apple-signin-auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const APPLE_CLIENT_ID =
  process.env.NODE_ENV === "development"
    ? "com.dysperse.development"
    : "com.dysperse.go";

export async function POST(req: NextRequest) {
  let session = "";
  let newAccount: any = null;

  try {
    const formData = await req.formData();
    const identityToken = formData.get("id_token")?.toString();
    const userStr = formData.get("user")?.toString();

    if (!identityToken) throw new Error("No identity token provided");

    const appleUser = await verifyIdToken(identityToken, {
      audience: APPLE_CLIENT_ID,
    });

    const email = appleUser.email;
    if (!email) throw new Error("No email in Apple ID token");

    const acc = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
      },
    });

    if (acc) {
      const s = await prisma.session.create({
        data: {
          userId: acc.id,
        },
      });

      new Notification("FORCE", {
        title: "New login detected! 🚨🫵",
        body: "If this wasn't you, please remove this device from your account settings immediately!",
        data: {},
      }).dispatch(acc.id);

      session = s.id;
    } else {
      let parsedUser = {};
      try {
        parsedUser = userStr ? JSON.parse(userStr) : {};
      } catch {}

      newAccount = {
        isNew: true,
        email,
        name: parsedUser?.name?.firstName || "",
        picture: "", // Apple doesn't provide photo
      };
    }
  } catch (e) {
    return handleApiError(e);
  }

  if (session)
    redirect(
      `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081"
          : "https://go.dysperse.com"
      }/auth/apple?session=${session}`
    );
  else if (newAccount)
    redirect(
      `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081"
          : "https://go.dysperse.com"
      }/auth/apple?${new URLSearchParams(newAccount)}`
    );
  else
    return new Response("Something went wrong", {
      status: 500,
    });
}
