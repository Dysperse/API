import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi, useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";
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

  useEffect(() => {
    if (data && data[0] && data[0].mood) {
      setMood(data[0].mood);
    } else {
      setMood(null);
    }
  }, [data, mood, setMood]);

  const handleMoodChange: any = useCallback(
    async (emoji: string, reason: string, stress: number) => {
      try {
        await fetchRawApi("user/checkIns/setMood", {
          date: today,
          mood: emoji,
          reason,
          stress,
        });
        await mutate(mutationUrl);
      } catch (e) {
        toast.error(
          "Oh no! Something went wrong while trying to save your mood!",
          toastStyles
        );
      }
    },
    [today, mutationUrl]
  );
  const session = useSession();

  return (
    <Box
      sx={{
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        border: "1px solid",
        borderColor: session.user.darkMode
          ? "hsl(240, 11%, 20%)"
          : "rgba(200, 200, 200, 0.3)",
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
            defaultStress={data && data[0] ? data[0].stress : 10}
            key={emoji}
            emoji={emoji}
            handleMoodChange={handleMoodChange}
            mood={mood}
            data={data}
          />
        ))}
      </Box>
    </Box>
  );
}
