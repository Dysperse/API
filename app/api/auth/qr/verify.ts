import { handleApiError } from "@/lib/server/helpers";
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { createSession } from "../login/route";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    const data = await prisma.qrToken.findFirstOrThrow({
      where: {
        AND: [{ token: req.query.token }, { expires: { gt: new Date() } }],
      },
      include: {
        user: {
          include: { notifications: { select: { pushSubscription: true } } },
        },
      },
    });

    if (!data?.userId || !data.user) {
      throw new Error("Unauthenticated");
    }

    await DispatchNotification({
      subscription: data.user.notifications?.pushSubscription as string,
      title: "Account activity alert",
      body: "Someone (hopefully you) has successfully logged in via a QR code",
      actions: [],
    });

    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";

    const encoded = await createSession(data.user.id, ip);

    await prisma.qrToken.delete({ where: { token: req.query.token } });
    return Response.json({ success: true, key: encoded });
  } catch (e) {
    return handleApiError(e);
  }
}
