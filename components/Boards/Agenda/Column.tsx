import { Box, Divider, Icon, Tooltip, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import Image from "next/image";
import { memo, useEffect, useMemo } from "react";
import { colors } from "../../../lib/colors";
import { useSession } from "../../../pages/_app";
import { capitalizeFirstLetter } from "../../ItemPopup";
import { Task } from "../Board/Column/Task";
import { CreateTask } from "../Board/Column/Task/Create";

interface AgendaColumnProps {
  mutationUrl: string;
  view: string;
  day: any;
  data: any;
  navigation: number;
}

export const Column: any = memo(function Column({
  mutationUrl,
  view,
  day,
  data,
  navigation,
}: AgendaColumnProps) {
  const session = useSession();
  const subheading = view === "week" ? "dddd" : view === "month" ? "YYYY" : "-";
  const startOf = view === "week" ? "day" : view === "month" ? "month" : "year";
  const startOfRange = dayjs().startOf(startOf);

  const endTime = dayjs(day.unchanged).endOf(startOf).toDate();
  const startTime = dayjs(day.unchanged).startOf(startOf).toDate();

  data = useMemo(
    () =>
      (data || []).filter((task) => {
        const dueDate = new Date(task.due);
        return dueDate >= startTime && dueDate <= endTime;
      }),
    [data, startTime, endTime]
  );

  const isPast =
    dayjs(day.unchanged).isBefore(startOfRange) &&
    day.date !== startOfRange.format(day.heading);

  const placeholder = useMemo(() => {
    let e = dayjs(day.unchanged).from(startOfRange);
    if ("a few seconds ago" === e) {
      if ("month" === view) return "this month";
      if ("year" === view) return "this year";
      if ("week" === view) return "today";
    }
    return e;
  }, [view, day.unchanged, startOfRange]);

  const isToday =
    day.date == startOfRange.format(day.heading) && navigation == 0;

  useEffect(() => {
    const activeHighlight = document.getElementById("activeHighlight");
    if (activeHighlight) {
      activeHighlight.scrollIntoView({
        block: "nearest",
        inline: "start",
        behavior: "smooth",
      });
    }
    window.scrollTo(0, 0);
  }, []);

  /**
   * Sort the tasks in a "[pinned, incompleted, completed]" order
   */
  const sortedTasks = useMemo(
    () =>
      data.sort((e, d) =>
        e.completed && !d.completed
          ? 1
          : (!e.completed && d.completed) || (e.pinned && !d.pinned)
          ? -1
          : !e.pinned && d.pinned
          ? 1
          : 0
      ),
    [data]
  );

  const completedTasks = sortedTasks.filter((task) => task.completed);
  const tasksLeft = sortedTasks.length - completedTasks.length;

  return (
    <Box
      className="snap-center"
      {...(isToday && { id: "activeHighlight" })}
      sx={{
        borderRight: "1px solid",
        borderColor: `hsl(240,11%,${session.user.darkMode ? 16 : 95}%)`,
        zIndex: 1,
        flexGrow: 1,
        flexBasis: 0,
        minHeight: { sm: "100vh" },
        overflowY: "scroll",
        minWidth: { xs: "100vw", sm: "320px" },
        transition: "filter .2s",
      }}
    >
      <Box
        sx={{
          color: session.user.darkMode ? "#fff" : "#000",
          py: 3.5,
          px: 4,
          background: "transparent",
          borderBottom: "1px solid",
          borderColor: `hsl(240,11%,${session.user.darkMode ? 16 : 95}%)`,
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
                colors[session.themeColor || "grey"][
                  session.user.darkMode ? "A200" : "A100"
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
            ...(isPast && { opacity: 0.5 }),
            mb: 0.7,
          }}
        >
          {view === "week"
            ? dayjs(day.unchanged).format(day.heading).padStart(2, "0")
            : dayjs(day.unchanged).format(day.heading)}
        </Typography>
        {subheading !== "-" && (
          <Tooltip
            placement="left"
            title={
              <Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {isToday
                    ? "Today"
                    : capitalizeFirstLetter(dayjs(day.unchanged).fromNow())}
                </Typography>
                <Typography variant="body2">
                  {dayjs(day.unchanged).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Typography>
            }
          >
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
                    ...(isPast && { opacity: 0.5 }),
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
                  opacity: data.length == 0 ? 0 : tasksLeft === 0 ? 1 : 0.6,
                }}
              >
                {tasksLeft !== 0 ? (
                  <>
                    {tasksLeft} {isPast ? "unfinished" : "left"}
                  </>
                ) : (
                  <Icon
                    sx={{
                      color: green[session.user.darkMode ? "A700" : "800"],
                    }}
                    className="outlined"
                  >
                    check_circle
                  </Icon>
                )}
              </Typography>
            </Typography>
          </Tooltip>
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
          {data.filter((task) => !task.completed).length === 0 ? (
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
                  ...(session.user.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />

              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  {data.length == 0 ? "Nothing much here..." : "Let's go!"}
                </Typography>
                <Typography gutterBottom>
                  {data.length == 0
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
                  mutationUrl={mutationUrl}
                  boardId={1}
                />
                {data.length == 0 ? <></> : <Divider sx={{ mt: 2, mb: -1 }} />}
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
              mutationUrl={mutationUrl}
              boardId={1}
            />
          )}
        </Box>
        {sortedTasks.map((task) => (
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
