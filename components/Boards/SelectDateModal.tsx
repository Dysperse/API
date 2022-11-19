import { Calendar } from "@mantine/dates";
import { SwipeableDrawer } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { useState } from "react";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { formatDate } from "./formatDate";

export function SelectDateModal({ styles, date, setDate }) {
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
          elevation: 0,
          sx: {
            maxWidth: { sm: "350px" },
            mb: { sm: 10 },
            mx: "auto",
            background: colors[themeColor][50],
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
                  color:
                    (theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.gray[5]) + "!important",
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
          <Button onClick={() => setDate(today)}>Today</Button>
          <Button onClick={() => setDate(null)}>Clear date</Button>
        </Box>
      </SwipeableDrawer>
      <Button
        sx={{
          ...styles,
          gap: 1,
          borderRadius: 9999,
          transition: "all .2s",
          ...(!date && {
            gap: 0,
          }),
          ...(date && {
            animation: "dateIntro .2s forwards",
            background: colors[themeColor][100] + "!important",
          }),
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span className="material-symbols-rounded">today</span>
        <span style={{ fontSize: "15px" }}>
          {today === formatDate(date) && "Today"}
          {dayjs(date).format("MMM D") === "Invalid Date"
            ? ""
            : today !== formatDate(date) && dayjs(date).format("MMM D")}
        </span>
      </Button>
    </>
  );
}
