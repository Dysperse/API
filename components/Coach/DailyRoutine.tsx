import {
  Box,
  Button,
  Chip,
  Icon,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { lime } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Stories from "react-insta-stories";
import { useWindowSize } from "react-use";
import { mutate as mutateSWR } from "swr";
import { fetchApiWithoutHook, useApi } from "../../lib/client/useApi";
import { useBackButton } from "../../lib/client/useBackButton";
import { toastStyles } from "../../lib/client/useTheme";
import { useSession } from "../../pages/_app";

export function RoutineEnd({
  setCurrentIndex,
  sortedTasks,
  tasksRemaining,
  handleClose,
}) {
  const { width, height } = useWindowSize();

  return (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onClick={() => setCurrentIndex((i) => (i == 0 ? 0 : i - 1))}
      />
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={handleClose}
      />
      {tasksRemaining == 0 ? (
        <>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <picture>
              <img
                src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f389.png"
                alt="Tada"
              />
            </picture>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            You worked towards
            <br /> {sortedTasks.length} goal{sortedTasks.length !== 1 && "s"}!
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              mt: 1,
              "&, &:hover": {
                background: "hsl(240,11%,20%)!important",
                color: "#fff!important",
              },
            }}
            variant="contained"
          >
            <span>✌</span> Let&apos;s go &rarr;
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h1" gutterBottom>
            👉
          </Typography>
          <Typography variant="h6">
            You have {tasksRemaining.length} goal
            {tasksRemaining.length !== 1 && "s"} left to finish
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              mt: 1,
              "&, &:hover": {
                background: "hsl(240,11%,20%)!important",
                color: "#fff!important",
              },
            }}
            variant="contained"
          >
            <span>🎯</span> Gotcha &rarr;
          </Button>
        </>
      )}
    </div>
  );
}

export function Task({ task, mutate, currentIndex, setCurrentIndex }) {
  const handleClick = React.useCallback(() => {
    setCurrentIndex((index) => index + 1);
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
        mutate();
      })
      .catch(() => {
        toast.error(
          "Something went wrong while trying to mark your routine as done.",
          toastStyles
        );
      });
  }, [task.durationDays, task.id, task.progress, mutate, setCurrentIndex]);

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onClick={() =>
          setCurrentIndex((i) => (currentIndex == 0 ? 0 : currentIndex - 1))
        }
      />
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => setCurrentIndex((i) => currentIndex + 1)}
      />
      <Typography variant="h2" className="font-heading" gutterBottom>
        {task.stepName}
      </Typography>
      <Typography>
        <i>{task.name}</i>
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          my: 2,
          "& .MuiChip-root": {
            background: "hsl(240,11%,20%)!important",
            color: "hsl(240,11%,90%)!important",
          },
        }}
      >
        <Chip label={task.category} size="small" />
        <Chip
          size="small"
          label={`${~~((task.progress / task.durationDays) * 100)}% complete`}
        />
        <Chip
          size="small"
          label={
            task.time === "any"
              ? "Daily"
              : task.time === "morning"
              ? "Every morning"
              : task.time === "afternoon"
              ? "Every afternoon"
              : task.time === "evening"
              ? "Every evening"
              : "Nightly"
          }
        />
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          left: 0,
          gap: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
          pb: 2,
        }}
      >
        <Button
          disabled={task.lastCompleted === dayjs().format("YYYY-MM-DD")}
          variant="contained"
          fullWidth
          sx={{
            "&,&:hover": { background: "hsl(240,11%,14%)!important" },
            color: "#fff!important",
          }}
          size="large"
          onClick={handleClick}
        >
          {task.lastCompleted === dayjs().format("YYYY-MM-DD") ? (
            <>
              <span>🔥</span> Completed for today!
            </>
          ) : (
            <>
              <span>🎯</span> I worked towards it!
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}

export function DailyRoutine() {
  const { data, url } = useApi("user/routines");
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();
  useBackButton(() => setOpen(false));

  useEffect(() => {
    if (window.location.hash == "#daily-routine") setOpen(true);
  }, [setOpen]);

  const doneTasks = !data
    ? []
    : data
        .filter((task) => task.durationDays - task.progress > 0)
        .filter((task) => task.lastCompleted === dayjs().format("YYYY-MM-DD"));

  const tasksRemaining = !data
    ? []
    : data
        .filter((task) => task.durationDays - task.progress > 0)
        .filter((task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD"));

  // If the data is available, the data returns an array of objects. Sort the array of objects by the `time` key, which can be a string containing the values: "morning", "afternoon", "evening", "night", "any". Sort them in the order: morning, any, afternoon, evening, night. This will ensure that the tasks are displayed in the correct order.
  const sortedTasks = !data
    ? []
    : data
        .filter((task) => task.durationDays - task.progress > 0)
        .sort((a, b) => {
          return (
            ["morning", "any", "afternoon", "evening", "night"].indexOf(
              a.time
            ) -
            ["morning", "any", "afternoon", "evening", "night"].indexOf(b.time)
          );
        });

  const router = useRouter();
  const trigger = (
    <Box
      onClick={() => {
        navigator.vibrate(50);
        if (sortedTasks.length == 0) {
          router.push("/coach");
        } else {
          setOpen(true);
        }
      }}
      sx={{
        flexShrink: 0,
        borderRadius: 5,
        flex: "0 0 70px",
        gap: 0.4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        userSelect: "none",
        p: 1,
        transition: "transform .2s",
        "&:hover": {
          background: `hsl(240, 11%, ${session?.user?.darkMode ? 10 : 95}%)`,
        },
        "&:active": {
          transition: "none",
          transform: "scale(.95)",
        },
      }}
    >
      <Box
        sx={{
          borderRadius: 9999,
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid transparent",
          background: "rgba(200,200,200,.2)",
          position: "relative",
          ...(data &&
            tasksRemaining &&
            tasksRemaining.length === 0 && {
              borderColor: lime[session?.user?.darkMode ? "A400" : 800],
              background: session?.user?.darkMode
                ? "hsl(240,11%,10%)"
                : lime[50],
            }),
        }}
      >
        {data && tasksRemaining && tasksRemaining.length === 0 && (
          <Icon
            sx={{
              color: lime[session?.user?.darkMode ? "A400" : 800],
              background: session?.user?.darkMode
                ? "hsl(240,11%,10%)"
                : lime[50],
              borderRadius: "999px",
              transition: "opacity .2s",
              position: "absolute",
              bottom: -5,
              right: -5,
            }}
          >
            check_circle
          </Icon>
        )}
        <picture>
          <img
            src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4ab.png"
            alt="Tada"
            width="35px"
            height="35px"
          />
        </picture>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            textAlign: "center",
            textOverflow: "ellipsis",
            fontSize: "13px",
            overflow: "hidden",
          }}
        >
          All tasks
        </Typography>
      </Box>
    </Box>
  );

  const stories = [
    ...sortedTasks.map((task) => {
      return {
        content: () => (
          <Task
            task={task}
            mutate={() => mutateSWR(url)}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ),
      };
    }),
    {
      content: () => (
        <RoutineEnd
          handleClose={() => setOpen(false)}
          tasksRemaining={tasksRemaining}
          setCurrentIndex={setCurrentIndex}
          sortedTasks={sortedTasks}
        />
      ),
    },
  ];

  const indexWhereUserLeftOff = sortedTasks
    ? sortedTasks.findIndex(
        (task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD")
      )
    : 0;

  const [currentIndex, setCurrentIndex] = useState(indexWhereUserLeftOff);

  useEffect(() => {
    setCurrentIndex(
      indexWhereUserLeftOff === -1 ? sortedTasks.length : indexWhereUserLeftOff
    );
  }, [indexWhereUserLeftOff, sortedTasks.length]);

  useEffect(() => {
    if (!session?.user?.darkMode)
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", open ? "hsl(240,11%,10%)" : "#fff");
  }, [session, open]);

  return (
    <>
      <SwipeableDrawer
        transitionDuration={250}
        disableSwipeToOpen
        anchor="bottom"
        open={open}
        onOpen={() => {}}
        onClose={() => {
          mutateSWR(url);
          setOpen(false);
          setTimeout(() => {
            setCurrentIndex(
              indexWhereUserLeftOff === -1
                ? sortedTasks.length
                : indexWhereUserLeftOff
            );
          }, 300);
        }}
        PaperProps={{
          sx: {
            border: 0,
            borderRadius: 0,
            overflow: "visible",
            maxWidth: "600px",
            width: "100vw",
            "& *": {
              color: "hsl(240, 11%, 80%)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: open ? "-17px" : "0px",
            transition: "all .2s",
            left: "0px",
            width: "100%",
            height: "17px",
            borderRadius: "50px 50px 0 0",
            background: "hsl(240, 11%, 10%)",
            zIndex: 999,
          }}
        ></Box>
        <Stories
          storyContainerStyles={{
            background: "hsl(240, 11%, 10%)",
            color: "hsl(240, 11%, 80%)",
          }}
          stories={stories}
          // idk why the story doesnt pause in production but the line below works, OK?
          defaultInterval={69696969696969696969696969696969}
          width={"100%"}
          isPaused
          onStoryEnd={() => {}}
          preventDefault
          currentIndex={currentIndex}
          height={"100vh"}
        />
      </SwipeableDrawer>
      {trigger}
    </>
  );
}
