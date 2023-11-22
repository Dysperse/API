"use client";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function Time() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Puller />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontSize: "25px",
          p: 3,
          "& .MuiTypography-root": {
            px: 2,
            py: 1,
            display: "block",
            background: palette[3],
            borderRadius: 5,
          },
        }}
      >
        <Typography variant="h5">{dayjs(time).format("hh")}</Typography>:
        <Typography variant="h5">{dayjs(time).minute()}</Typography>:
        <Typography variant="h5">{dayjs(time).format("ss")}</Typography>
        <Typography variant="h5" sx={{ ml: 2 }}>
          {dayjs(time).format("A")}
        </Typography>
      </Box>
    </Box>
  );
}
