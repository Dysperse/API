import {
  Box,
  Button,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import Stories from "react-insta-stories";
import useWindowSize from "react-use/lib/useWindowSize";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";
import { CircularProgressWithLabel } from "../../pages/coach";
import { useSession } from "../../pages/_app";

function Task({ task, mutationUrl, currentIndex, setCurrentIndex }) {
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
        mutate(mutationUrl);
      })
      .catch(() => {
        toast.error(
          "Something went wrong while trying to mark your routine as done.",
          toastStyles
        );
      });
  }, [task.durationDays, task.id, task.progress, mutationUrl, setCurrentIndex]);

  return (
    <Box sx={{ p: 4 }}>
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
          },
        }}
      >
        <Chip label={task.category} size="small" />
        <Chip
          size="small"
          label={~~((task.progress / task.durationDays) * 100) + "% complete"}
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
            color: "#fff",
          }}
          size="large"
          onClick={handleClick}
        >
          {task.lastCompleted === dayjs().format("YYYY-MM-DD") ? (
            <>
              <span>🔥</span> You worked on this goal today!
            </>
          ) : (
            <>
              <span>🎯</span> I worked towards it!
            </>
          )}
        </Button>
        <Button
          sx={{ opacity: 0.6, color: "#fff" }}
          size="large"
          onClick={() => setCurrentIndex((i) => currentIndex + 1)}
        >
          {task.lastCompleted === dayjs().format("YYYY-MM-DD") ? (
            <>
              <span>👀</span> Onwards! &rarr;
            </>
          ) : (
            <>
              <span>✍</span> Skip for now
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}

export function DailyRoutine({ zen = false, editMode = false }: any) {
  const { data, url } = useApi("user/routines");
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();
  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  useEffect(() => {
    if (window.location.hash == "#daily-routine") setOpen(true);
  }, [setOpen]);

  const { width, height } = useWindowSize();

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
  const trigger = zen ? (
    <>
      <ListItemButton
        sx={{
          px: "15px !important",
          gap: 2,
          background: session?.user?.darkMode ? "hsl(240, 11%, 10%)" : "#fff",
          border: "1px solid",
          borderColor: session?.user?.darkMode
            ? "hsl(240, 11%, 20%)"
            : "rgba(200, 200, 200, 0.3)",
        }}
        className="shadow-sm"
        disableRipple={editMode}
        onClick={() => {
          if (sortedTasks.length == 0) {
            router.push("/coach");
          } else {
            setOpen(true);
          }
        }}
      >
        <CircularProgressWithLabel
          value={
            data
              ? (doneTasks.length /
                  data.filter((task) => task.durationDays - task.progress > 0)
                    .length) *
                100
              : 0
          }
        />
        <ListItemText
          primary={
            <b>
              {sortedTasks.length == 0
                ? "You don't have any goals set"
                : "Daily routine"}
            </b>
          }
          secondary={
            editMode ? (
              <></>
            ) : data ? (
              sortedTasks.length == 0 ? (
                "Tap to set a goal"
              ) : (
                <>
                  {tasksRemaining.length == 0 ? (
                    <>Hurray! You worked towards all of your goals today!</>
                  ) : (
                    <>
                      {tasksRemaining.length +
                        " task" +
                        (tasksRemaining.length == 1 ? "" : "s") +
                        " remaining"}{" "}
                      &bull; Click to{" "}
                      {doneTasks === 0
                        ? "start"
                        : tasksRemaining === 0
                        ? "view"
                        : "resume"}
                    </>
                  )}
                </>
              )
            ) : (
              "Loading..."
            )
          }
        />
        {tasksRemaining.length == 0 && sortedTasks.length !== 0 && (
          <Icon
            sx={{
              color: colors.green[session?.user?.darkMode ? "A400" : "A700"],
              fontSize: "30px!important",
            }}
          >
            check_circle
          </Icon>
        )}
      </ListItemButton>
    </>
  ) : (
    <Box
      id="routineTrigger"
      className="shadow-sm hover:shadow-md"
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
        transition: "blur .2s, transform 0.2s",
        "&:active": {
          transform: "scale(0.98)",
          transitionDuration: "0s",
        },
        userSelect: "none",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        background: session?.user?.darkMode
          ? "hsl(240,11%,16%)"
          : "hsl(240,11%,97%)",
        "&:hover": {
          background: session?.user?.darkMode
            ? "hsl(240,11%,16%)"
            : "hsl(240,11%,95%)",
        },

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
                  {tasksRemaining.length +
                    " task" +
                    (tasksRemaining.length == 1 ? "" : "s") +
                    " remaining"}{" "}
                  &bull; Click to{" "}
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
        value={
          data
            ? (doneTasks.length /
                data.filter((task) => task.durationDays - task.progress > 0)
                  .length) *
              100
            : 0
        }
      />
    </Box>
  );

  const stories = [
    ...sortedTasks.map((task) => {
      return {
        content: (props) => (
          <Task
            task={task}
            mutationUrl={url}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ),
      };
    }),
    {
      content: (props) => (
        <div style={{ padding: 20, textAlign: "center", width: "100%" }}>
          {tasksRemaining == 0 ? (
            <>
              <Confetti
                width={width > 600 ? 600 : width}
                height={height}
                style={{ zIndex: 1 }}
              />
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
                <br /> all of your goals today!
              </Typography>
              <Button
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                sx={{
                  mt: 1,
                  "&, &:hover": {
                    background: "hsl(240,11%,20%)!important",
                    color: "#fff!important",
                  },
                }}
                variant="contained"
              >
                <span>🎯</span> Exit &rarr;
              </Button>
            </>
          )}
        </div>
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

  return (
    <>
      <SwipeableDrawer
        transitionDuration={250}
        disableSwipeToOpen
        anchor="bottom"
        open={open}
        onOpen={() => {}}
        onClose={() => {
          mutate(url);
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
