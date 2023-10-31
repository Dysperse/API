import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { DispatchNotification } from "@/lib/server/notification";
import { NextRequest } from "next/server";

export default async function handler(req: NextRequest) {
  try {
    const subscription = await getApiParam(req, "subscription", true);
    await DispatchNotification({
      subscription,
      title: "Swoosh!",
      body: "Notificiations are working!",
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
