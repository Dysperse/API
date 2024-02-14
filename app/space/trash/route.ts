import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { entitiesSelection } from "../collections/collection/route";

// export async function DELETE(req: NextRequest) {
//   try {
//     const { spaceId } = await getIdentifiers();
//     const response = await prisma.entity.deleteMany({
//       where: {
//         AND: [{ spaceId }, { trash: true }],
//       },
//     });
//     return Response.json(response, { status: 200 })
//   } catch (e) {
//     return handleApiError(e);
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();
    const response = await prisma.entity.findMany({
      where: {
        AND: [{ trash: true }, { spaceId }],
      },
      include: entitiesSelection.include,
    });
    return Response.json(response);
  } catch (e) {
    return handleApiError(e);
  }
}
