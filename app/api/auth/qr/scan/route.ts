import { sessionData } from "@/app/api/session/route";
import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function GET(req: NextRequest) {
  try {
    let info;
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (token) {
      info = await sessionData(token.value);
      if (info.user === false) {
        redirect("/auth");
        return;
      }
    } else {
      redirect("/auth");
    }

    const { identifier } = info.user;

    if (!identifier) {
      throw new Error("No identifier");
    }

    const data = await prisma.qrToken.findFirst({
      where: { token: token.value },
    });

    if (!data) {
      throw new Error("Invalid token");
    }

    if (new Date() > new Date(data.expires)) {
      throw new Error("Expired token");
    }

    await prisma.qrToken.update({
      where: { token: token.value },
      data: { user: { connect: { identifier } } },
    });

    redirect("/auth/qr-success");
  } catch (e) {
    return handleApiError(e);
  }
}
