import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export const handleApiError = (error: any) => {
  console.error(error);
  return Response.json({
    error: error?.message,
    status: 500,
  });
};

export const getSessionToken = () => {
  const token = headers().get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing `Authorization` header");
  return token;
};

export const getApiParam = (req: NextRequest, key, required = false): any => {
  const value = req.nextUrl.searchParams.get(key);
  if (required && (value === null || value === "" || !value))
    throw new Error(`Missing value: \`${key}\``);
  return value ? decodeURIComponent(value) : null;
};

export const getIdentifiers = async (id) => {
  const data = await prisma.session.findFirstOrThrow({
    where: { id },
    select: {
      id: true,
      user: {
        select: {
          identifier: true,
          selectedProperty: {
            select: { id: true },
          },
        },
      },
    },
  });

  return {
    sessionId: id || "-1",
    userIdentifier: data.user.identifier || "-1",
    spaceId: data.user.selectedProperty?.id || "-1",
  };
};
