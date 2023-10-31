// Update user settings
import { prisma } from "@/lib/server/prisma";

export async function GET(req: NextRequest) {
  const user = await prisma.notificationSettings.upsert({
    where: {
      userId: req.query.userIdentifier,
    },

    update: {
      [req.query.name]: req.query.value === "true",
    },
    create: {
      user: {
        connect: {
          identifier: req.query.userIdentifier,
        },
      },
      [req.query.name]: req.query.value === "true",
    },
  });
  return Response.json(user);
}
