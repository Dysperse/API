import { Box, Icon, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { memo, useEffect } from "react";
import { colors } from "../../../lib/colors";
import { Task } from "../Board/Column/Task";
import { CreateTask } from "../Board/Column/Task/Create";

export const Column: any = memo(function Column({
  mutationUrl,
  view,
  day,
  data,
}: any) {
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

  const tasksLeft =
    tasksWithinTimeRange.length -
    tasksWithinTimeRange.filter((task) => task.completed).length;

  return (
    <Box
      className="snap-center"
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
        minHeight: { sm: "100vh" },
        overflowY: "scroll",
        minWidth: { xs: "100vw", sm: "320px" },
        transition: "filter .2s",
        filter: data ? "" : "blur(10px)",
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
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            <span
              style={{
                ...(isPast && {
                  textDecoration: "line-through",
                  ...(isPast && {
                    opacity: 0.5,
                  }),
                }),
              }}
            >
              {view === "month" &&
              dayjs(day.unchanged).format("M") !== dayjs().format("M")
                ? dayjs(day.unchanged).fromNow()
                : dayjs(day.unchanged).format(subheading)}
            </span>
            <Typography
              variant="body2"
              sx={{
                ml: "auto",
                opacity:
                  tasksWithinTimeRange.length == 0
                    ? 0
                    : tasksLeft === 0
                    ? 1
                    : 0.6,
              }}
            >
              {tasksLeft !== 0 ? (
                <>
                  {tasksLeft} {isPast ? "unfinished" : "left"}
                </>
              ) : (
                <Icon
                  sx={{
                    color: green[global.user.darkMode ? "A700" : "800"],
                  }}
                  className="outlined"
                >
                  check_circle
                </Icon>
              )}
            </Typography>
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 3.5, py: 2, pb: { xs: 15, sm: 0 } }}>
        <Box sx={{ my: 0.5 }}>
          <CreateTask
            column={{ id: "-1", name: "" }}
            tasks={[]}
            defaultDate={day.unchanged}
            label="Set a goal"
            placeholder={
              "Set a goal to be achieved " +
              placeholder.replace("in a day", "tomorrow")
            }
            checkList={false}
            mutationUrl={mutationUrl}
            boardId={1}
          />
        </Box>
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
        <Box sx={{ mb: 5 }} />
      </Box>
    </Box>
  );
});
