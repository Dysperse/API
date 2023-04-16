import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { prisma } from "../../../../lib/server/prisma";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req: any, res: any) {
  // Get/create streak data
  const streakData = await prisma.coachData.upsert({
    where: {
      userId: req.query.userIdentifier,
    },
    update: {},
    create: {
      userId: req.query.userIdentifier,
      streakCount: 1,
    },
    select: {
      id: true,
      lastStreakDate: true,
      streakCount: true,
      userId: true,
      user: {
        select: {
          timeZone: true,
        },
      },
    },
  });

  /* This code is getting the current date and time in the timezone of the user specified in the
  `streakData` object. It is using the `dayjs` library to convert the current date and time to the
  user's timezone using the `tz` method and passing in the user's timezone as an argument. It then
  sets the time to the start of the day using the `startOf` method with the argument "day". Finally,
  it converts the resulting `dayjs` object to a JavaScript `Date` object using the `toDate` method
  and assigns it to the `currentTimeInUserTz` variable. */
  const currentTimeInUserTz = dayjs()
    .tz(streakData.user.timeZone)
    .startOf("day")
    .toDate();

  /* This code is getting the `lastStreakDate` value from the `streakData` object and converting it to
  the timezone of the user specified in the `streakData` object using the `dayjs` library. It is
  using the `tz` method to convert the date to the user's timezone and passing in the user's
  timezone as an argument. It then sets the time to the start of the day using the `startOf` method
  with the argument "day". Finally, it converts the resulting `dayjs` object to a JavaScript `Date`
  object using the `toDate` method and assigns it to the `lastStreakDateInUserTz` variable. This is
  useful for comparing the `lastStreakDate` value with the `currentTimeInUserTz` value to determine
  if the user has completed a streak for the current day. */
  const lastStreakDateInUserTz = dayjs(streakData.lastStreakDate)
    .tz(streakData.user.timeZone)
    .startOf("day")
    .toDate();

  if (lastStreakDateInUserTz.getTime() !== currentTimeInUserTz.getTime()) {
    const differenceInDays = dayjs(currentTimeInUserTz).diff(
      dayjs(lastStreakDateInUserTz),
      "day"
    );

    await prisma.coachData.update({
      where: {
        id: streakData.id,
      },
      data: {
        streakCount:
          differenceInDays == 1
            ? {
                increment: 1,
              }
            : 1,
        lastStreakDate: currentTimeInUserTz,
      },
    });
  }

  const data = await prisma.routineItem.update({
    data: {
      progress: parseInt(req.query.progress),
      lastCompleted: req.query.date,
    },
    where: {
      id: req.query.id,
    },
  });
  res.json(data);
}
