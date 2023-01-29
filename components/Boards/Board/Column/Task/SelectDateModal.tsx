import { Calendar } from "@mantine/dates";
import { Box, Button, Icon, SwipeableDrawer, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import { colors } from "../../../../../lib/colors";
import { Puller } from "../../../../Puller";
import { formatDate } from "./formatDate";

export const SelectDateModal: any = React.memo(function SelectDateModal({
  ref,
  styles,
  date,
  setDate,
}: any) {
  const [open, setOpen] = useState(false);
  const today = formatDate(new Date());

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            maxWidth: { sm: "350px" },
            mb: { sm: 10 },
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Box
          sx={{
            display: { sm: "none" },
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Calendar
            value={date}
            firstDayOfWeek="sunday"
            onChange={(e) => {
              setDate(e);
              setOpen(false);
            }}
            fullWidth
            styles={(theme) => ({
              // Weekend color
              day: {
                borderRadius: 19,
                transition: "border-radius .2s",
                "&:hover": {
                  background: colors[themeColor][100],
                },
                color: colors[themeColor][500],
                "&[data-outside]": {
                  color: `${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.gray[5]
                  }!important`,
                },
                "&[data-selected]": {
                  backgroundColor: colors[themeColor][900],
                  color: "#fff!important",
                  borderRadius: 9,
                  position: "relative",
                },

                "&[data-weekend]": {
                  color: colors[themeColor][500],
                },
              },
            })}
          />
          <Box
            sx={{
              mt: 1,
              gap: 1,
              display: "flex",
              width: "100%",
            }}
          >
            <Button
              fullWidth
              sx={{ borderRadius: 9 }}
              variant="outlined"
              onClick={() => {
                setDate(null);
                setOpen(false);
              }}
            >
              Clear date
            </Button>
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
        </Box>
      </SwipeableDrawer>
      <Tooltip title="Select date (ALT + S)" placement="top">
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
            color: colors[themeColor][global.user.darkMode ? 50 : 900],
            ...(!date && {
              gap: 0,
              minWidth: "auto",
            }),
            px: 2,
            "&:active": {
              transition: "none",
              opacity: ".6!important",
            },
            ...(date && {
              background: `${colors[themeColor][200]}!important`,
              color: `${colors[themeColor][900]}!important`,
            }),
          }}
          onClick={() => setOpen(!open)}
        >
          <Icon>today</Icon>
          <span style={{ fontSize: "15px" }}>
            {today === formatDate(date) && "Today"}
            {dayjs(today).add(1, "day").format("MM-DD-YYYY") ===
              formatDate(date) && "Tomorrow"}

            {dayjs(date).format("MMM D") === "Invalid Date"
              ? ""
              : today !== formatDate(date) &&
                dayjs(today).add(1, "day").format("MM-DD-YYYY") !==
                  formatDate(date) &&
                dayjs(date).format("MMM D")}
          </span>
        </Button>
      </Tooltip>
    </>
  );
});
