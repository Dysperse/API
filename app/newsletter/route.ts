import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "development") throw new Error("Not found");

    const data = await prisma.user.findMany({
      select: {
        email: true,
        profile: {
          select: {
            name: true,
          },
        },
      },
      where: {
        profile: { isNot: null },
      },
    });

    const t = data.map((i) => {
      const nameParts = i.profile?.name.split(" ");
      const firstName = nameParts?.[0] || "";
      const lastName = nameParts?.[1] || "";

      return {
        email: i.email,
        firstName,
        lastName,
      };
    });
    return new Response(
      "email,firstName,lastName\n" +
        t.map((i) => `${i.email},${i.firstName},${i.lastName}`).join("\n"),
      {
        headers: {
          "Content-Type": "text/csv",
        },
      }
    );
  } catch (e) {
    return handleApiError(e);
  }
}
