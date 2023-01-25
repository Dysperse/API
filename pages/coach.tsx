import { CircularProgressProps } from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { MyGoals } from "../components/Coach/MyGoals";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { colors } from "../lib/colors";

import {
  AppBar,
  Box,
  Checkbox,
  CircularProgress,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { toastStyles } from "../lib/useCustomTheme";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
            color: global.user.darkMode ? "#fff" : "#000",
            transition: "all .2s",
            strokeWidth: props.value === 100 ? 1 : 2,
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className={
            props.value === 100
              ? "material-symbols-rounded"
              : "material-symbols-outlined"
          }
        >
          {props.value === 100 ? "celebration" : "play_arrow"}
        </span>
      </Box>
    </Box>
  );
}

const Task: any = React.memo(function Task({ task }: any) {
  const [checked, setChecked] = React.useState(
    task.lastCompleted === dayjs().format("YYYY-MM-DD")
  );
  const [loading, setLoading] = React.useState(false);

  return (
    <Box className="flex items-center" sx={{ mb: 2, gap: 1 }}>
      <Box
        sx={{
          alignSelf: "flex-start",
        }}
      >
        <Box className="relative">
          <Box
            sx={{
              opacity: loading ? 1 : 0,
              visibility: loading ? "visible" : "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <CircularProgress
              disableShrink
              sx={{
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                  strokeWidth: 1,
                  // Gradient
                },
                animationDuration: "550ms",
              }}
            />
          </Box>
          <Checkbox
            disabled={checked}
            onClick={() => {
              setLoading(true);
              fetchApiWithoutHook("user/routines/markAsDone", {
                date: dayjs().format("YYYY-MM-DD"),
                progress:
                  task.progress && parseInt(task.progress)
                    ? task.progress + 1 > task.durationDays
                      ? task.durationDays
                      : task.progress + 1
                    : 1,
                id: task.id,
              })
                .then(() => {
                  setChecked(true);
                  setLoading(false);
                })
                .catch(() => {
                  setLoading(false);
                  toast.error(
                    "Something went wrong while trying to mark your routine as done.",
                    toastStyles
                  );
                });
            }}
            checked={checked}
            sx={{
              ...(loading && { opacity: 0.2, filter: "blur(1px)" }),
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 0.3,
          textDecoration: checked ? "line-through" : "none",
          opacity: checked ? 0.5 : 1,
        }}
      >
        <Typography variant="h6">{task.stepName}</Typography>
        <Typography variant="body2">
          {task.name} &bull;{" "}
          {Math.round((task.progress / task.durationDays) * 100) || 0}% complete
          &bull;{" "}
          {task.time === "any"
            ? "Daily"
            : task.time === "morning"
            ? "Every morning"
            : task.time === "afternoon"
            ? "Every afternoon"
            : task.time === "evening"
            ? "Every evening"
            : "Nighly"}
        </Typography>
      </Box>
    </Box>
  );
});

function DailyRoutine() {
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
                  <>✔️ Complete!</>
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

export default function Render() {
  const time = new Date().getHours();
  let greeting;
  if (time < 10) {
    greeting = "Morning, ";
  } else if (time < 14) {
    greeting = "Good afternoon, ";
  } else if (time < 18) {
    greeting = "Good evening, ";
  } else {
    greeting = "Good night, ";
  }

  const [hideRoutine, setHideRoutine] = useState(false);
  return (
    <Box sx={{ position: "relative" }}>
      <Head>
        <title>Coach &bull; Dysperse</title>
      </Head>
      <Box
        className="mt-5 sm:mt-10 "
        sx={{
          pb: 3,
        }}
      >
        <Box className="p-3 max-w-[100vw] flex-col sm:flex-row gap-5 flex items-center px-8">
          {!hideRoutine && (
            <Typography
              className="font-heading"
              sx={{
                fontSize: {
                  xs: "25px",
                  sm: "35px",
                },
                textDecoration: "underline",
              }}
              variant="h5"
            >
              {greeting}
              {global.user.name}!
            </Typography>
          )}
          {!hideRoutine && <DailyRoutine />}
        </Box>
        <Box className="p-3 px-8 pt-0 max-w-[100vw]">
          <MyGoals setHideRoutine={setHideRoutine} />
        </Box>
      </Box>
    </Box>
  );
}
