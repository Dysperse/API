import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
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
  const [mood, setMood] = useState<string | null>(null);
  const today = dayjs().startOf("day");
  const { data, url: mutationUrl } = useApi("user/checkIns", {
    date: today,
  });

  useEffect(() => setMood(data?.[0]?.mood ?? null), [data, mood, setMood]);

  const session = useSession();

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
    </Box>
  );
}
