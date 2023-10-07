// new design for settings. `edit.ts` edits the `User` table, while this edits the new `Settings` table

// Update user settings
import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  const session = await prisma.session.findFirstOrThrow({
    where: {
      id: req.query.token,
    },
    select: {
      user: {
        select: { identifier: true },
      },
    },
  });

  const temp = {
    ...(req.query.hiddenPerspectives && {
      hiddenPerspectives: {
        set: JSON.parse(req.query.hiddenPerspectives),
      },
    }),
    user: {
      connect: {
        identifier: session.user.identifier,
      },
    },
  };

  const user = await prisma.settings.upsert({
    where: {
      userId: session.user.identifier,
    },
    create: temp,
    update: temp,
  });

  res.json(user);
};
export default handler;
