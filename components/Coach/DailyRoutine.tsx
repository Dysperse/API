import {
  AppBar,
  Box,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { mutate } from "swr";
import { useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { CircularProgressWithLabel, Task } from "../../pages/coach";

export function DailyRoutine() {
  const { data, url } = useApi("user/routines");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  const timeColors = {
    afternoon: ["6198ff", "4385ff", "2071ff", "0061f1", "0056d6", "004cbb"],
    morning: ["7dc4a4", "6cab8e", "5d947b", "578a73", "477862", "3b6351"],
    evening: ["ff007b", "db0d71", "bd045e", "a60855", "94044a", "7a053e"],
    night: ["080f14", "0e1820", "141f29", "15222e", "1e303f", "283e52"],
  };

  const time = new Date().getHours();
  let bannerColors;
  if (time < 10) {
    bannerColors = timeColors.morning;
  } else if (time < 17) {
    bannerColors = timeColors.afternoon;
  } else if (time < 20) {
    bannerColors = timeColors.evening;
  } else {
    bannerColors = timeColors.night;
  }

  useEffect(() => {
    if (window.location.hash == "#daily-routine") setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)
      ?.setAttribute(
        "content",
        open
          ? `#${bannerColors[0]}`
          : global.user.darkMode
          ? "hsl(240,11%,10%)"
          : "#fff"
      );
  });

  const doneTasks = !data
    ? []
    : data.filter(
        (task) => task.lastCompleted === dayjs().format("YYYY-MM-DD")
      );

  const tasksRemaining = !data
    ? []
    : data.filter(
        (task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD")
      );

  // If the data is available, the data returns an array of objects. Sort the array of objects by the `time` key, which can be a string containing the values: "morning", "afternoon", "evening", "night", "any". Sort them in the order: morning, any, afternoon, evening, night. This will ensure that the tasks are displayed in the correct order.
  const sortedTasks = !data
    ? []
    : data.sort((a, b) => {
        return (
          ["morning", "any", "afternoon", "evening", "night"].indexOf(a.time) -
          ["morning", "any", "afternoon", "evening", "night"].indexOf(b.time)
        );
      });

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => {
          mutate(url);
          setOpen(false);
        }}
        onOpen={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: "600px",
            width: "100vw",
            ...(global.user.darkMode && {
              backgroundColor: "hsl(240, 11%, 5%)",
            }),
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 1,
            color: "#fff",
            background: "linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <Icon>west</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>
              Today&apos;s routine
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              sx={{ opacity: 0, pointerEvents: "none" }}
            >
              <Icon>more_horiz</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: "-70px",
            backgroundImage: `url("data:image/svg+xml,%0A%3Csvg id='visual' viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Cpath d='M0 217L75 204C150 191 300 165 450 153C600 141 750 143 825 144L900 145L900 0L825 0C750 0 600 0 450 0C300 0 150 0 75 0L0 0Z' fill='%23${bannerColors[0]}'%3E%3C/path%3E%3Cpath d='M0 271L75 266C150 261 300 251 450 246C600 241 750 241 825 241L900 241L900 143L825 142C750 141 600 139 450 151C300 163 150 189 75 202L0 215Z' fill='%23${bannerColors[1]}'%3E%3C/path%3E%3Cpath d='M0 379L75 383C150 387 300 395 450 392C600 389 750 375 825 368L900 361L900 239L825 239C750 239 600 239 450 244C300 249 150 259 75 264L0 269Z' fill='%23${bannerColors[2]}'%3E%3C/path%3E%3Cpath d='M0 439L75 442C150 445 300 451 450 451C600 451 750 445 825 442L900 439L900 359L825 366C750 373 600 387 450 390C300 393 150 385 75 381L0 377Z' fill='%23${bannerColors[3]}'%3E%3C/path%3E%3Cpath d='M0 517L75 519C150 521 300 525 450 521C600 517 750 505 825 499L900 493L900 437L825 440C750 443 600 449 450 449C300 449 150 443 75 440L0 437Z' fill='%23${bannerColors[4]}'%3E%3C/path%3E%3Cpath d='M0 601L75 601C150 601 300 601 450 601C600 601 750 601 825 601L900 601L900 491L825 497C750 503 600 515 450 519C300 523 150 519 75 517L0 515Z' fill='%23${bannerColors[5]}'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            display: "flex",
            p: 3,
            color: "#fff",
            minHeight: "300px",
          }}
        >
          <Box sx={{ mt: "auto" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "600" }}
              gutterBottom
              className="underline"
            >
              Today&apos;s routine
            </Typography>
            <Typography variant="body2">
              You have {tasksRemaining.length} tasks remaining today
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 4 }}>
          {sortedTasks.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </Box>
      </SwipeableDrawer>
      <Box
        id="routineTrigger"
        className="shadow-md"
        onClick={() => setOpen(true)}
        sx={{
          ...(!data && {
            filter: "blur(5px)",
            pointerEvents: "none",
            minWidth: { xs: "90%", sm: "unset" },
          }),
          ml: { sm: "auto" },
          p: 2,
          px: 3,
          cursor: "pointer",
          transition: "blur .2s, transform 0.2s",
          "&:active": {
            transform: "scale(0.98)",
            transitionDuration: "0s",
          },
          userSelect: "none",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          background: global.user.darkMode
            ? "hsl(240,11%,16%)"
            : colors[themeColor][50],
          border:
            "1px solid " +
            (global.user.darkMode
              ? "hsl(240,11%,16%)"
              : colors[themeColor][100]),
          gap: 5,
        }}
      >
        <Box sx={{ mr: "auto" }}>
          <Typography sx={{ fontWeight: "900" }}>Daily routine</Typography>
          <Typography>
            {data ? (
              <>
                {tasksRemaining.length == 0 ? (
                  <>Hurray! You worked towards all of your goals today!</>
                ) : (
                  <>
                    {tasksRemaining.length + " tasks remaining"} &bull; Click to{" "}
                    {doneTasks === 0
                      ? "start"
                      : tasksRemaining === 0
                      ? "view"
                      : "resume"}
                  </>
                )}
              </>
            ) : (
              "Loading..."
            )}
          </Typography>
        </Box>
        <CircularProgressWithLabel
          value={data ? (doneTasks.length / data.length) * 100 : 0}
        />
      </Box>
    </>
  );
}
