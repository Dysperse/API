import { prisma } from "../../../../lib/client";
const ics = require("ics");

let alarms: any = [];

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.maintenanceReminder.findMany({
    where: {
      property: {
        id: req.query.property ?? "false",
      },
    },
  });
  // Set header to .ics
  const d = await new Promise((resolve, reject) => {
    ics.createEvents(
      data.map((reminder) => {
        alarms.push({
          action: "audio",
          description: "Reminder: " + reminder.name,
          trigger: { hours: 2, minutes: 30, before: true },
          repeat: 2,
          attachType: "VALUE=URI",
          // attach: "Glass",
        });
        // convert reminder.lastDone to array ([2018, 1, 15, 12, 15])
        const arrayDate = [
          reminder.lastDone.getFullYear(),
          reminder.lastDone.getMonth() + 1,
          reminder.lastDone.getDate(),
          reminder.lastDone.getHours(),
          reminder.lastDone.getMinutes(),
        ];

        return {
          title: reminder.name,
          description: reminder.note || "(No note added)",
          start: arrayDate,
          duration: { minutes: 50 },
          url: "https://my.smartlist.tech/maintenance",
          categories: ["Home maintenance"],
          calName: "Home maintenance (Carbon)",
          uid:
            reminder.id +
            "@reminders." +
            req.query.property +
            ".my.smartlist.tech",
          alarms: alarms,
        };
      }),
      (error, value) => {
        if (error) {
          console.log(error);
        }

        resolve(value);
      }
    );
  });
  res.setHeader("Content-type", "text/calendar; charset=utf-8");
  res.send(d);
};
export default handler;
