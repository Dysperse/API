import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = await getApiParam(req, "email", true);
    const token = await getApiParam(req, "token", true);
    const property = await getApiParam(req, "property", true);

    // Find email from `user` table
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User not found" });
    }
    // Delete invite link
    await prisma.propertyLinkInvite.delete({
      where: { token },
    });

    // Get user id
    const userId = user.id || "-1";

    await prisma.propertyInvite.updateMany({
      data: { selected: false },
      where: { userId },
    });

    const data = await prisma.propertyInvite.create({
      data: {
        profile: {
          connect: { id: property },
        },
        user: {
          connect: { id: userId },
        },
        accepted: false,
        selected: true,
        permission: "member",
      },
      include: { profile: true },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
