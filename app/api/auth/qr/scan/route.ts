import { sessionData } from "@/app/api/session/route";
import { getApiParam, handleApiError } from "@/lib/server/helpers";
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
    const sessionToken = cookieStore.get("token");
    const token = await getApiParam(req, "token", true);

    if (sessionToken) {
      info = await sessionData(sessionToken.value);
      if (info.user === false) {
        redirect("/auth");
      }
    } else {
      redirect("/auth");
    }

    const { identifier } = info.user;

    if (!identifier) {
      throw new Error("No identifier");
    }

    const data = await prisma.qrToken.findFirstOrThrow({
      where: { AND: [{ token }, { expires: { gt: new Date() } }] },
    });

    if (!data) {
      throw new Error("Invalid token");
    }

    await prisma.qrToken.update({
      where: { token },
      data: { user: { connect: { identifier } } },
    });

    redirect("/auth/qr-success");
  } catch (e) {
    return handleApiError(e);
  }
}
