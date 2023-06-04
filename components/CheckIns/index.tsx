import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { Box, Typography } from "@mui/material";
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

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        borderRadius: 5,
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
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            <i>
              You can reflect on your day {dayjs().set("hour", 13).fromNow()}
            </i>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
