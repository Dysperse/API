import { prisma } from "@/lib/prisma";
import { Profile, Session, Space, SpaceInvite, User } from "@prisma/client";

interface DysperseSession {
  session: Session;
  user: User & { profile: Profile };
  space: SpaceInvite & { space: Space };
}

export async function getSessionData(
  sessionId: string
): Promise<DysperseSession> {
  // throw error if session not found
  const session = await prisma.session.findFirstOrThrow({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        include: {
          profile: true,
          spaces: {
            include: {
              space: {
                include: {
                  _count: {
                    select: {
                      integrations: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  prisma.profile.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      lastActive: new Date(),
      name: "Untitled Profile",
    },
    update: {
      lastActive: new Date(),
    },
  });
  if (!session) {
    throw new Error("Session not found");
  }
  const _session = {
    session: {
      ...session,
      user: undefined,
    },
    user: {
      ...session.user,
      profile: {
        ...session.user.profile,
        lastActive: null,
      },
      spaces: undefined,
    },
    space: session.user.spaces.find((s) => s.selected),
  };
  console.log("asdfasdfasdf");
  return _session as any;
}
