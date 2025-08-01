import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { LexoRank } from "lexorank";
import { NextRequest } from "next/server";
const argon2 = require("argon2");

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

/**
 * Example data
 * {
  "name": "new@dysperse.com",
  "email": "new@dysperse.com",
  "picture": "https://i.ibb.co/Xk4zMxS/smartmockups-ltibmbmp.jpg",
  "password": "",
  "confirmPassword": "",
  "theme": "orange",
  "methods": ["POMODORO", "EISENHOWER", "KANBAN", "PLANNER", "CHECKLIST"],
  "birthday": [3, 19], -> march 19
  "tasks": ["t1", "t2", "t3"],
  "bio": "hi there",
  "captchaToken": "0.FOAJfbLRS33vhAbFiRJBTT6ySMXEKZmWlPqejrj8OPQzZ9ZUsvgFhnMabDoh-Kn8f_yqv-JzBYouEFhN1xPPJhZilnlewXKcU8__jhDhPe_u17dmeC2m62hujGI04mSx9ppfs_a7LRywipJkagoPr8n0yVCRFlEDrLCRfak77eE6_XtjHG3c1k8UhrMqDN4jZcOyaOa9399Nh-pbWpg9pc_eCxTFP2yvnuhffSrrjpnlFsayX0O6j_XTjDexK6H9I7SJDnz5w5gqE7GJjRNsyo9BWmhQSAXl6G602eHBGnXLCbbmt_RrsdOTx7lsBo2_kmwuAzR_xJqIwmzJkPubRI0QHJuElSc18D9VbqlHjuM5Ij7MK6sTcs5tXaMXQXs3tBHc6bnPlU4YkrC0fYPXsZ3p2Ai6BG0xiQNsg4cXESs.bDiatA9s7AhL2EorhpnGFA.9b6b264a8d3cb4d69023aeb8e8d8c20038eae89f45b5682364c3e451a87a4c69"
}
 */

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "name", required: false },
        { name: "email", required: true },
        { name: "timeZone", required: true },
        { name: "password", required: true },
        { name: "confirmPassword", required: true },
        { name: "theme", required: true },
        { name: "methods", required: false },
        { name: "birthday", required: true },
        { name: "tasks", required: true },
        { name: "bio", required: false },
        { name: "captchaToken", required: true },
      ],
      { type: "BODY" }
    );

    // Validate password
    if (
      params.password !== params.confirmPassword ||
      params.password.length < 8
    ) {
      throw new Error("Password error");
    }
    const hash = await argon2.hash(params.password);

    // Check user existence
    const userExists = await prisma.user.findFirst({
      where: { email: params.email },
    });
    if (userExists) throw new Error("User already exists");

    // Create user
    const user = await prisma.user.create({
      data: {
        email: params.email,
        password: hash,
        timeZone: params.timeZone,
        referredBy: params.referredById
          ? { connect: { id: params.referredById } }
          : undefined,
        profile: {
          create: {
            name: params.name,
            lastPlanned: dayjs().subtract(1, "day").toDate(),
            theme: params.theme,
            birthday: new Date(
              new Date().getFullYear(),
              params.birthday[0],
              params.birthday[1]
            ),
            bio: params.bio,
          },
        },
      },
    });

    if (params.allowMarketingEmails) {
      fetch("https://www.bestregards.me/api/v1/subscribers", {
        method: "POST",
        body: JSON.stringify({
          __autoConfirm: true,
          firstName: params.name?.split(" ")?.[0],
          lastName: params.name?.split(" ")?.[1] || "",
          sources: [
            {
              type: "TAG",
              id: "tag_32lntt75p9",
            },
          ],
          email: params.email,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.BESTREGARDS_API_KEY,
        },
      }).then((res) => res.json());
    }

    // Create space
    const space = await prisma.space.create({
      data: {
        name: "Personal",
        entities: {
          createMany: {
            data: params.tasks
              .map((task) => ({
                name: task,
                type: "TASK",
              }))
              .filter((t) => t.name.trim()),
          },
        },
      },
    });

    const access = await prisma.spaceInvite.create({
      data: {
        selected: true,
        access: "ADMIN",
        space: { connect: { id: space.id } },
        user: { connect: { id: user.id } },
      },
    });

    // Create insights profile
    await prisma.userInsight.create({
      data: {
        year: new Date().getFullYear(),
        user: { connect: { id: user.id } },
      },
    });

    // Create tabs based on methods
    await prisma.tab.create({
      data: {
        slug: `/[tab]/welcome`,
        user: { connect: { id: user.id } },
        params: {},
      },
    });

    for (const method of params.methods) {
      if (method === "POMODORO") {
        await prisma.widget.create({
          data: {
            userId: user.id,
            order: LexoRank.middle().toString(),
            type: "clock",
            params: { clockType: "pomodoro" },
          },
        });
      } else {
        await prisma.tab.create({
          data: {
            slug: `/[tab]/collections/[id]/[type]`,
            user: { connect: { id: user.id } },
            params: {
              type: {
                PLANNER: "planner",
                KANBAN: "kanban",
                EISENHOWER: "stream",
                CHECKLIST: "matrix",
              }[method],
              id: "all",
            },
          },
        });
      }
    }

    // Create a session
    const session = await prisma.session.create({
      data: {
        user: { connect: { id: user.id } },
      },
    });

    return Response.json(session);
  } catch (e) {
    return handleApiError(e);
  }
}
