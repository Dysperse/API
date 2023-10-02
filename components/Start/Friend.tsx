import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Badge,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { memo } from "react";
import { Emoji } from "../Emoji";

function calculatePercentage(startDate, endDate) {
  // Convert the dates to timestamps (milliseconds since January 1, 1970)
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  // Get the current date and time
  const currentTime = new Date().getTime();

  // Calculate the time difference between the two dates
  const totalTime = endTime - startTime;

  // Calculate the time difference between the start date and the current date
  const elapsedTime = currentTime - startTime;

  // Calculate the percentage of time that has passed
  const percentage = (elapsedTime / totalTime) * 100;

  // Ensure the percentage is within the 0-100 range
  return Math.min(100, Math.max(0, percentage));
}

export const Friend = memo(function Friend({ mutate, friend }: any) {
  const { session } = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const userPalette = useColor(session.themeColor, isDark);

  const status = friend.Status
    ? dayjs(friend?.Status?.until).isAfter(dayjs())
      ? friend.Status
      : null
    : null;

  // refactor later...
  const redPalette = useColor("red", useDarkMode(session.darkMode));
  const grayPalette = useColor("gray", useDarkMode(session.darkMode));
  const greenPalette = useColor("green", useDarkMode(session.darkMode));
  const orangePalette = useColor("orange", useDarkMode(session.darkMode));

  const chipPalette =
    status?.status === "available"
      ? greenPalette
      : status?.status === "busy"
      ? redPalette
      : status?.status === "away"
      ? orangePalette
      : grayPalette;
  // end refactor later

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card
        onClick={() => {
          router.push("/users/" + (friend.username || friend.email));
        }}
        sx={{
          background: userPalette[2],
          borderRadius: 5,
          mb: 2,
        }}
      >
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Badge
            variant="dot"
            badgeContent={1}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            sx={{
              "& .MuiBadge-badge": {
                background: chipPalette[9],
                border: `4px solid ${userPalette[2]}`,
                width: 20,
                height: 20,
                borderRadius: 99,
                transform: "translate(3px, 3px)",
              },
            }}
          >
            <ProfilePicture data={friend} size={50} sx={{ flexShrink: 0 }} />
          </Badge>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{friend.name.split(" ")?.[0]}</Typography>
            {status && (
              <>
                <Typography sx={{ display: "flex", gap: 2 }}>
                  <Emoji
                    emoji={status.emoji}
                    size={24}
                    style={{ marginTop: "4px" }}
                  />
                  {status.text}
                </Typography>
                <LinearProgress
                  sx={{ width: "100%", mt: 2, borderRadius: 99 }}
                  variant="determinate"
                  value={calculatePercentage(
                    new Date(status.started),
                    new Date(status.until)
                  )}
                />
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});
