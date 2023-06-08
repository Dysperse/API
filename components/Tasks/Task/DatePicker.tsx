import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Box,
  Button,
  Icon,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import DatePicker from "react-calendar";
import { formatDate } from "./formatDate";

export const SelectDateModal: any = React.memo(function SelectDateModal({
  ref,
  styles,
  date,
  setDate,
}: any) {
  const [open, setOpen] = useState<boolean>(false);
  const today = formatDate(new Date());
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: { sm: "350px" },
            mb: { sm: 10 },
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Puller sx={{ mb: -1 }} showOnDesktop />
        <DatePicker
          value={new Date(date)}
          onChange={(e: any) => {
            setDate(e);
            setOpen(false);
          }}
        />
        <Box
          sx={{
            mt: -1,
            gap: 1,
            display: "flex",
            p: 2,
            width: "100%",
          }}
        >
          <Button
            fullWidth
            sx={{ borderRadius: 9 }}
            variant="contained"
            onClick={() => {
              setDate(today);
              setOpen(false);
            }}
          >
            Today
          </Button>
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Select date (alt • f)" placement="top">
        <Button
          id="dateModal"
          ref={ref}
          disableRipple
          sx={{
            ...styles,
            gap: 1,
            background: "transparent!important",
            borderRadius: 9999,
            transition: "all .2s",
            color:
              colors[session?.themeColor || "grey"][
                session.user.darkMode ? 50 : 900
              ],
            ...(!date && {
              gap: 0,
              minWidth: "auto",
            }),
            px: 2,
            ...(date && {
              background: `hsl(240,11%,${
                session.user.darkMode ? 17 : 95
              }%)!important`,
              "&:hover": {
                background: `hsl(240,11%,${
                  session.user.darkMode ? 15 : 93
                }%)!important`,
              },
              color: `hsl(240,11%,${
                !session.user.darkMode ? 17 : 95
              }%)!important`,
            }),
          }}
          onClick={() => setOpen(!open)}
        >
          <Icon>today</Icon>
          <Typography
            sx={{
              fontSize: "15px",
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            {today === formatDate(date) && "Today"}
            {dayjs(today).add(1, "day").format("MM-DD-YYYY") ===
              formatDate(date) && "Tomorrow"}

            {dayjs(date).format("MMM D") === "Invalid Date"
              ? ""
              : today !== formatDate(date) &&
                dayjs(today).add(1, "day").format("MM-DD-YYYY") !==
                  formatDate(date) &&
                dayjs(date).format("MMM D")}
          </Typography>
        </Button>
      </Tooltip>
    </>
  );
});
