import { Box, Button, Icon, SwipeableDrawer, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import DatePicker from "react-calendar";
import { colors } from "../../../../../lib/colors";
import { useSession } from "../../../../../pages/_app";
import { Puller } from "../../../../Puller";
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
        <DatePicker
          value={new Date(date)}
          onChange={(e) => {
            setDate(e);
            setOpen(false);
          }}
        />
        <Box
          sx={{
            mt: 1,
            gap: 1,
            display: "flex",
            p: 2,
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
              background: `${
                colors[session?.themeColor || "grey"][
                  session.user.darkMode ? 900 : 50
                ]
              }!important`,
              color: `${
                colors[session?.themeColor || "grey"][
                  session.user.darkMode ? 50 : 900
                ]
              }!important`,
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
