import { DispatchNotification } from "../../lib/notification";

export default async function handler(req, res) {
  console.log(req.query.subscription);
  await DispatchNotification({
    subscription: req.query.subscription,
    title: "Swoosh!",
    body: "Notificiations are working!",
  });

  res.status(200).json({ success: true });
}
