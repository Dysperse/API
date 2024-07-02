import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const entitiesSelection: Prisma.Collection$entitiesArgs<DefaultArgs> = {
  include: {
    completionInstances: true,
    label: true,
    integration: true,
  },
  where: {
    trash: false,
  },
};
