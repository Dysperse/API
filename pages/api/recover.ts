import { prisma } from "@/lib/server/prisma";

export default async function handler(req: any, res: any) {
  const data = await prisma.customRoom.findMany({
    distinct: ["propertyId"],
  });

  data.forEach(async (d) => {
    const f = await prisma.propertyInvite.create({
      data: {
        profile: { connect: { id: d.propertyId } },
        accepted: true,
        permission: "owner",
        selected: true,
        user: { connect: { identifier: d.userIdentifier } },
      },
    });

    console.log(f);
  });

  res.json(data);
}
