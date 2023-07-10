import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DailyCheckInDrawer } from "./DailyCheckInDrawer";
import { Emoji } from "./Reflect/Emoji";

export const moodOptions = ["1f601", "1f600", "1f610", "1f614", "1f62d"];

export const reasons = [
  { icon: "favorite", name: "Relationships" },
  { icon: "work", name: "Work" },
  { icon: "school", name: "School" },
  { icon: "sports_basketball", name: "Hobbies" },
  { icon: "ecg_heart", name: "Health" },
  { icon: "newspaper", name: "Current events" },
  { icon: "group", name: "Family/Friends" },
  { icon: "payments", name: "Finances" },
  { icon: "pending", name: "Something else", w: 12 },
];

export function DailyCheckIn() {
  const session = useSession();

  const [mood, setMood] = useState<string | null>(null);
  const today = dayjs().startOf("day");

  const { data, url: mutationUrl } = useApi("user/checkIns", { date: today });
  useEffect(() => setMood(data?.[0]?.mood ?? null), [data, mood, setMood]);
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: palette[3],
        background: palette[2],
        borderRadius: 5,
        ...(mood && { order: 1 }),
      }}
    >
      <DailyCheckInDrawer mood={mood} />
      {dayjs().hour() >= 13 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 0.5,
            mb: -1,
            gap: 0.5,
            p: 3,
            pt: 0,
          }}
        >
          {moodOptions.map((emoji) => (
            <Emoji
              mutationUrl={mutationUrl}
              defaultData={data?.[0]}
              key={emoji}
              emoji={emoji}
            />
          ))}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}
