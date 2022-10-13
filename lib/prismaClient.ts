import { PrismaClient } from "@prisma/client";

// Avoid instantiating too many instances of Prisma in development
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem

let prisma: PrismaClient;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
