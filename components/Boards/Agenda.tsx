import {
  Box,
  Button,
  Icon,
  IconButton,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { Task } from "./Board/Column/Task";
import { CreateTask } from "./Board/Column/Task/Create";

function Column({ mutationUrl, view, day, data }) {
  const subheading = view === "week" ? "dddd" : view === "month" ? "YYYY" : "-";
  const startOf = view === "week" ? "day" : view === "month" ? "month" : "year";

  const isPast =
    dayjs(day.unchanged).isBefore(dayjs().startOf(startOf)) &&
    day.date !== dayjs().startOf(startOf).format(day.heading);

  let placeholder = dayjs(day.unchanged).from(dayjs().startOf(startOf));
  if (placeholder === "a few seconds ago" && view === "month") {
    placeholder = "this month";
  } else if (placeholder === "a few seconds ago" && view === "year") {
    placeholder = "this year";
  } else if (placeholder === "a few seconds ago" && view === "week") {
    placeholder = "today";
  }

  const isToday = day.date == dayjs().startOf(startOf).format(day.heading);

  useEffect(() => {
    const activeHighlight = document.getElementById("activeHighlight");
    if (activeHighlight)
      activeHighlight.scrollIntoView({
        block: "nearest",
        inline: "start",
      });
    window.scrollTo(0, 0);
  }, []);

  const startTime = dayjs(day.unchanged).startOf(startOf).toDate();
  const endTime = dayjs(day.unchanged).endOf(startOf).toDate();

  const tasksWithinTimeRange = (data || []).filter((task) => {
    const dueDate = new Date(task.due);
    return dueDate >= startTime && dueDate <= endTime;
  });

  return (
    <Box
      {...(isToday && { id: "activeHighlight" })}
      sx={{
        scrollMarginRight: "25px",
        borderRight: "1px solid",
        borderColor: global.user.darkMode
          ? "hsl(240,11%,16%)"
          : "rgba(200,200,200,.2)",
        zIndex: 1,
        flexGrow: 1,
        flexBasis: 0,
        minHeight: "100vh",
        overflowY: "scroll",
        minWidth: { xs: "80vw", sm: "320px" },
        ...(!data && {
          filter: "blur(10px)",
        }),
      }}
    >
      <Box
        sx={{
          color: global.user.darkMode ? "#fff" : "#000",
          p: 3,
          px: 5,
          background: global.user.darkMode
            ? "hsla(240,11%,16%, 0.2)"
            : "rgba(200,200,200,.05)",
          borderBottom: "1px solid",
          borderColor: global.user.darkMode
            ? "hsla(240,11%,18%, 0.2)"
            : "rgba(200,200,200,.3)",
          userSelect: "none",
          zIndex: 9,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
        }}
      >
        <Typography
          variant="h4"
          className="font-heading"
          sx={{
            fontSize: "35px",
            ...(isToday && {
              color: "hsl(240,11%,10%)",
              background:
                colors[themeColor][global.user.darkMode ? "A200" : "A100"],
              px: 0.5,
              ml: -0.5,
            }),
            borderRadius: 1,
            width: "auto",
            height: 45,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...(isPast && {
              opacity: 0.5,
            }),
            mb: 0.7,
          }}
        >
          {dayjs(day.unchanged).format(day.heading)}
        </Typography>
        {subheading !== "-" && (
          <Typography
            sx={{
              fontSize: "20px",
              ...(isPast && {
                opacity: 0.5,
                textDecoration: "line-through",
              }),
            }}
          >
            {view === "month" &&
            dayjs(day.unchanged).format("M") !== dayjs().format("M")
              ? dayjs(day.unchanged).fromNow()
              : dayjs(day.unchanged).format(subheading)}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 3.5, py: 2, pb: { xs: 15, sm: 0 } }}>
        {[
          ...tasksWithinTimeRange.filter(
            (task) => !task.completed && task.pinned
          ),
          ...tasksWithinTimeRange.filter(
            (task) => !task.completed && !task.pinned
          ),
          ...tasksWithinTimeRange.filter((task) => task.completed),
        ].map((task) => (
          <Task
            key={task.id}
            board={task.board || false}
            columnId={task.column ? task.column.id : -1}
            isAgenda
            mutationUrl={mutationUrl}
            task={task}
          />
        ))}
        <Box sx={{ mt: 1.5 }}>
          <CreateTask
            isHovered={false}
            column={{ id: "-1", name: "" }}
            tasks={[]}
            defaultDate={day.unchanged}
            label="Set a goal"
            placeholder={"Set a goal to be achieved " + placeholder}
            checkList={false}
            mutationUrl={mutationUrl}
            boardId={1}
          />
        </Box>
      </Box>
    </Box>
  );
}

export function Agenda({
  setDrawerOpen,
  view,
}: {
  setDrawerOpen: any;
  view: "week" | "month" | "year";
}) {
  const [navigation, setNavigation] = useState(0);
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });
  const e = view === "week" ? "day" : view === "month" ? "month" : "year";

  let startOfWeek = dayjs().add(navigation, view).startOf(view);
  let endOfWeek = dayjs().add(navigation, view).endOf(view);

  switch (view) {
    case "month":
      endOfWeek = endOfWeek.add(2, "month");
      break;
    case "year":
      endOfWeek = endOfWeek.add(3, "year");
      break;
  }

  const days: any = [];

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, e); i++) {
    const currentDay = startOfWeek.add(i, e);

    const heading = view === "week" ? "D" : view === "month" ? "MMMM" : "YYYY";
    days.push({
      unchanged: currentDay,
      heading,
      date: currentDay.format(heading),
      day: currentDay.format("dddd"),
    });
  }

  const { data, url, error } = useApi("property/boards/agenda", {
    startTime: startOfWeek.toISOString(),
    endTime: endOfWeek.toISOString(),
  });

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: 0,
          height: "55px",
          width: "100%",
          top: "var(--navbar-height)",
          borderBottom: {
            xs: global.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
            sm: "unset",
          },
          background: {
            xs: global.user.darkMode
              ? "hsla(240,11%,10%, .7)"
              : "rgba(255,255,255,.7)",
            sm: "transparent",
          },
          zIndex: 9,
          maxWidth: "100vw",
          p: 1,
          px: 3,
          backdropFilter: {
            xs: "blur(10px)",
            sm: "none",
          },
          alignItems: "center",
          display: { xs: "flex", sm: "none" },
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={() => setDrawerOpen(true)}
          sx={{
            fontWeight: "700",
            display: { sm: "none" },
            fontSize: "15px",
            textTransform: "capitalize",
          }}
        >
          Agenda
          <Icon>expand_more</Icon>
        </Button>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: {
            xs: trigger ? "10px" : "70px",
            sm: "30px",
          },
          mr: {
            xs: 2,
            sm: 3,
          },
          zIndex: 9,
          background: global.user.darkMode
            ? "hsla(240,11%,14%,0.5)"
            : "rgba(255,255,255,.5)",
          border: "1px solid",
          transition: "bottom .3s",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          borderRadius: 999,
          borderColor: global.user.darkMode
            ? "hsla(240,11%,25%, 0.5)"
            : "rgba(200,200,200, 0.5)",
          right: 0,
          color: global.user.darkMode ? "#fff" : "#000",
          display: "flex",
          alignItems: "center",
          p: 1,
          py: 0.5,
        }}
      >
        <IconButton
          onClick={() => {
            setNavigation(navigation - 1);
            document.getElementById("agendaContainer")?.scrollTo(0, 0);
          }}
          disabled={navigation === 0 && view == "month"}
        >
          <Icon>west</Icon>
        </IconButton>
        <Button
          onClick={() => {
            setNavigation(0);
            setTimeout(() => {
              const activeHighlight =
                document.getElementById("activeHighlight");
              if (activeHighlight)
                activeHighlight.scrollIntoView({
                  block: "nearest",
                  inline: "center",
                });
              window.scrollTo(0, 0);
            }, 1);
          }}
          disabled={navigation === 0}
          disableRipple
          sx={{
            "&:active": {
              background: `${
                global.user.darkMode
                  ? "hsla(240,11%,25%, 0.3)"
                  : "rgba(0,0,0,0.1)"
              }`,
            },
            py: 1,
            color: global.user.darkMode ? "#fff" : "#000",
            px: 1.7,
          }}
          color="inherit"
        >
          Today
        </Button>
        <IconButton
          onClick={() => {
            setNavigation(navigation + 1);
            document.getElementById("agendaContainer")?.scrollTo(0, 0);
          }}
        >
          <Icon>east</Icon>
        </IconButton>
      </Box>

      <Box
        id="agendaContainer"
        sx={{
          display: "flex",
          maxWidth: "100vw",
          overflowX: "scroll",
          mt: { xs: 4, sm: 0 },
          height: { sm: "100vh" },
        }}
      >
        {days.map((day) => (
          <Column
            key={day.day}
            day={day}
            view={view}
            data={data}
            mutationUrl={url}
          />
        ))}
      </Box>
    </>
  );
}
