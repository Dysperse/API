import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    // do not validate session token because it's used for signup process
    // get body
    const params = await getApiParams(req, [
      { name: "email", required: false },
      { name: "basic", required: false },
      { name: "many", required: false },
      { name: "query", required: false },
    ]);
    if (params.many) {
      if (!params.query.trim()) return Response.json([]);
      const data = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: params.query, mode: "insensitive" } },
            { username: { contains: params.query, mode: "insensitive" } },
            {
              profile: {
                name: { contains: params.query, mode: "insensitive" },
              },
            },
            {
              profile: {
                bio: { contains: params.query, mode: "insensitive" },
              },
            },
          ],
        },
        select: {
          timeZone: true,
          username: true,
          email: true,
          followers: true,
          following: true,
          profile: true,
        },
        take: 10,
      });

      return Response.json(data);
    } else {
      if (!params.email) throw new Error("Email is required");
      const data = await prisma.user.findFirstOrThrow({
        where: {
          OR: [{ email: params.email }, { username: params.email }],
        },
        select: params.basic
          ? { id: true }
          : {
              timeZone: true,
              username: true,
              email: true,
              followers: true,
              following: true,
              profile: true,
            },
      });
      return Response.json(data);
    }
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    // get body
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "color", required: false },
        { name: "name", required: false },
        { name: "bio", required: false },
        { name: "darkMode", required: false },
        { name: "picture", required: false },
        { name: "pattern", required: false },
        { name: "pattern", required: false },
        { name: "spotifyAuthTokens", required: false },
      ],
      { type: "BODY" }
    );
    const data = await prisma.profile.updateMany({
      where: {
        user: { id: userId },
      },
      data: {
        name: params.name || undefined,
        bio: params.bio || undefined,
        theme: params.color || undefined,
        picture: params.picture || undefined,
        darkMode: params.darkMode ?? undefined,
        pattern: params.pattern ?? undefined,
        lastPlanned: params.lastPlanned || undefined,
        spotifyAuthTokens: params.spotifyAuthTokens
          ? Prisma.JsonNull
          : undefined,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
