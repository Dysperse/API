import { DispatchNotification } from "../../lib/notification";

export async function handler(req, res) {
  await DispatchNotification({
    subscription: JSON.stringify(req.body.subscription),
    title: "Swoosh!",
    body: "Notificiations are working!",
  });
  res.status(200).json({ success: true });
}
