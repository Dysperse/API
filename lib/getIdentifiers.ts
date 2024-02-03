import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const getIdentifiers = async (id?: string) => {
  let sessionId = id;
  if (!id) {
    const headersList = headers();
    const authorization = headersList.get("authorization");
    if (!authorization && !authorization?.startsWith("Bearer "))
      throw new Error("Missing authorization header");

    sessionId = authorization.replace("Bearer ", "");
  }

  const info = await prisma.session.findFirstOrThrow({
    where: { id: sessionId },
    select: {
      user: {
        select: {
          id: true,
          spaces: {
            select: { spaceId: true },
            where: { selected: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!info.user.spaces[0]?.spaceId || !info.user.id)
    throw new Error("Invalid session");

  return {
    sessionId,
    userId: info.user.id,
    spaceId: info.user.spaces[0].spaceId,
  };
};
