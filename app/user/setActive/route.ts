import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);
    const timeZone = await getApiParam(req, "timeZone", true);

    await prisma.user.update({
      where: {
        identifier: userIdentifier,
      },
      data: {
        lastActive: dayjs().tz(timeZone).toDate(),
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
