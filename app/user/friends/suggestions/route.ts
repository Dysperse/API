import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const { contactEmails } = await getApiParams(
      req,
      [{ name: "contactEmails", required: false }],
      { type: "BODY" }
    );
    // get body
    const data = await prisma.follows.findMany({
      where: {
        OR: [{ followerId: userId }, { followingId: userId }],
      },
      select: {
        accepted: true,
        followerId: true,
        followingId: true,
        follower: {
          select: {
            id: true,
            email: true,
            username: true,
            profile: {
              select: { name: true, lastActive: true, picture: true },
            },
          },
        },
        following: {
          select: {
            id: true,
            email: true,
            username: true,
            profile: {
              select: { name: true, lastActive: true, picture: true },
            },
          },
        },
      },
    });
    // make
    data.map((user) => {
      if (user.follower.id === userId) {
        user.follower = undefined as any;
        user["user"] = user.following;
        user.following = undefined as any;
      } else if (user.following.id === userId) {
        user.following = undefined as any;
        user["user"] = user.follower;
        user.follower = undefined as any;
      }
    });

    const friends = (data as any)
      .filter((user) => user?.user?.profile)
      .filter(
        (user, index, self) =>
          index === self.findIndex((t) => t.user.email === user.user.email)
      )
      .sort((a, b) => {
        // sort by profile.lastActive
        return (
          new Date(b.user.profile.lastActive).getTime() -
          new Date(a.user.profile.lastActive).getTime()
        );
      });

    // Iterate through contactEmails and find users in the database, remove if they are already friends
    const contactEmailsArray = contactEmails
      .map((c) => c.emails?.map((email) => email.email))
      .flat()
      .filter(Boolean)
      .filter(
        (email) =>
          !friends.some(
            (friend) => friend.user.email.toLowerCase() === email.toLowerCase()
          )
      );

    let contactsUsingDysperse = await prisma.user.findMany({
      where: {
        email: {
          in: contactEmailsArray,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile: {
          select: { name: true, lastActive: true, picture: true },
        },
      },
    });

    contactsUsingDysperse = contactsUsingDysperse.map((user) => ({
      ...user,
      contactImage: contactEmails.find((u) =>
        u.emails?.some((email) => email.email === user.email)
      )?.image?.uri,
    }));

    return Response.json({
      friends,
      contactsUsingDysperse,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
