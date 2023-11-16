"use client";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, SwipeableDrawer, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { Time } from "../page";

export function TodaysDate() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Time />
      </SwipeableDrawer>
      <Box
        onClick={() => setOpen(true)}
        className="card"
        sx={{
          p: 2,
          height: "130px",
          "& .MuiTypography-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Icon sx={{ fontSize: "40px!important" }} className="outlined">
          calendar_today
        </Icon>
        <Typography sx={{ ml: 0.2 }} variant="h5">
          {dayjs().format("dddd")}
        </Typography>
        <Typography sx={{ ml: 0.2 }} variant="body2">
          {dayjs().format("MMM Do")}
        </Typography>
      </Box>
    </>
  );
}
