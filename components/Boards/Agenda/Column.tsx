import { Box, Divider, Icon, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import Image from "next/image";
import { memo, useEffect } from "react";
import { colors } from "../../../lib/colors";
import { useSession } from "../../../pages/_app";
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

  const session = useSession();

  return (
    <Box
      className="snap-center"
      {...(isToday && { id: "activeHighlight" })}
      sx={{
        borderRight: "1px solid",
        borderColor: session?.user?.darkMode
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
        ...(!data && {
          pointerEvents: "none",
        }),
      }}
    >
      <Box
        sx={{
          color: session?.user?.darkMode ? "#fff" : "#000",
          py: 3.5,
          px: 4,
          background: session?.user?.darkMode
            ? "hsla(240,11%,16%, 0.2)"
            : "rgba(200,200,200,.05)",
          borderBottom: "1px solid",
          borderColor: session?.user?.darkMode
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
                colors[session?.themeColor || "grey"][
                  session?.user?.darkMode ? "A200" : "A100"
                ],
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
          {view === "week"
            ? dayjs(day.unchanged).format(day.heading).padStart(2, "0")
            : dayjs(day.unchanged).format(day.heading)}
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
                    color: green[session?.user?.darkMode ? "A700" : "800"],
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
      <Box
        sx={{
          px: { xs: 0, sm: 2 },
          pt: { xs: 0, sm: 3 },
          pb: { xs: 15, sm: 0 },
        }}
      >
        <Box sx={{ my: 0.5 }}>
          {tasksWithinTimeRange.filter((task) => !task.completed).length ===
          0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mx: "auto",
                py: { sm: 2 },
                alignItems: { xs: "center", sm: "start" },
                textAlign: { xs: "center", sm: "left" },
                flexDirection: "column",
                "& img": {
                  display: { sm: "none" },
                },
              }}
            >
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  ...(session?.user?.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />

              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  {tasksWithinTimeRange == 0
                    ? "Nothing much here..."
                    : "Let's go!"}
                </Typography>
                <Typography gutterBottom>
                  {tasksWithinTimeRange == 0
                    ? "You haven't added any list items to this column"
                    : "You finished all your goals for this time range!"}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mt: 1 }}>
                <CreateTask
                  column={{ id: "-1", name: "" }}
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
                {tasksWithinTimeRange == 0 ? (
                  <></>
                ) : (
                  <Divider sx={{ mt: 2, mb: -1 }} />
                )}
              </Box>
            </Box>
          ) : (
            <CreateTask
              column={{ id: "-1", name: "" }}
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
          )}
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
