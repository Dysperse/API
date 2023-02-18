import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

// Avoid instantiating too many instances of Prisma in development
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem

let prisma: any;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient().$extends(useAccelerate);
} else {
  if (!global.prisma) {
    const e: any = new PrismaClient().$extends(useAccelerate);
    global.prisma = e;
  }
  prisma = global.prisma;
}

export { prisma };
