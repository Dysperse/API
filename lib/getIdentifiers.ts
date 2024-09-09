import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export interface Identifiers {
  sessionId?: string;
  userId: string;
  spaceId: string;
}

export const getIdentifiers = async (
  id?: string,
  bypass?: boolean
): Promise<Identifiers> => {
  if (bypass)
    return { userId: "bypass", spaceId: "bypass", sessionId: "bypass" };

  const sessionId =
    id || headers()?.get("authorization")?.replace("Bearer ", "");

  if (!sessionId) {
    throw new Error("Missing authorization header");
  }

  const info = await prisma.session.findUniqueOrThrow({
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

  const { user } = info;
  const space = user?.spaces[0];

  if (!space?.spaceId || !user?.id) {
    throw new Error("Invalid session");
  }
  return { sessionId, userId: user.id, spaceId: space.spaceId };
};
