import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDelayedMount } from "@/lib/client/useDelayedMount";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { SelectionContext } from "../Layout";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";

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
  const isDark = useDarkMode(session.darkMode);
  const selection = useContext(SelectionContext);

  const palette = useColor(session.themeColor, isDark);

  const subheading =
    view === "week"
      ? "MMMM D"
      : view === "month"
      ? "YYYY"
      : view === "day"
      ? "MMMM"
      : "-";
  const startOf =
    view === "week" || view === "day"
      ? "day"
      : view === "month"
      ? "month"
      : "year";
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
    if (e === "a few seconds ago") {
      if (view == "month") return "this month";
      if (view == "year") return "this year";
      if (view == "week") return "today";
    }
    return e;
  }, [view, day.unchanged, startOfRange]);

  const isToday =
    day.date === startOfRange.format(day.heading) && navigation === 0;

  const [alreadyScrolled, setAlreadyScrolled] = useState(false);
  useEffect(() => {
    const activeHighlight = document.getElementById("activeHighlight");
    if (activeHighlight && !alreadyScrolled) {
      setAlreadyScrolled(true);
      activeHighlight.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
    }
    window.scrollTo(0, 0);
  }, [alreadyScrolled]);

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

  const ref: any = useRef();

  const [loading, setLoading] = useState(false);
  const scrollIntoView = async () => {
    if (window.innerWidth > 600) {
      document.body.scrollTop = 0;
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        ref.current?.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setLoading(true);
    try {
      await mutate(mutationUrl);
      await new Promise((r) => setTimeout(() => r(""), 500));
    } catch (e) {
      toast.error(
        "Yikes! We couldn't get your tasks. Please try again later",
        toastStyles
      );
    }
    setLoading(false);
  };

  const completedTasks = sortedTasks.filter((task) => task.completed);
  const tasksLeft = sortedTasks.length - completedTasks.length;

  const mount = useDelayedMount(loading, 1000);

  return (
    <Box
      ref={ref}
      {...(isToday && { id: "activeHighlight" })}
      sx={{
        scrollSnapAlign: "center",
        borderRight: { sm: "1px solid" },
        borderColor: { sm: addHslAlpha(palette[4], 0.7) },
        zIndex: 1,
        flexGrow: 1,
        flexBasis: 0,
        minHeight: { sm: "100vh" },
        overflowY: "scroll",
        minWidth: { xs: "100vw", sm: "320px" },
        position: "relative",
        transition: "filter .2s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Collapse
          in={loading}
          orientation="vertical"
          sx={{
            px: { xs: 2, sm: 0 },
            borderRadius: { xs: 5, sm: 0 },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: { xs: 5, sm: 0 },
              width: "100%",
              height: "100px",
              mt: { xs: 2, sm: 0 },
              background: palette[3],
            }}
          >
            {mount && <CircularProgress />}
          </Box>
        </Collapse>

        <Box
          onClick={scrollIntoView}
          sx={{
            color: isDark ? "#fff" : "#000",
            py: 3.5,
            px: 4,
            background: "transparent",
            borderBottom: { sm: "1px solid" },
            userSelect: "none",
            borderColor: { sm: addHslAlpha(palette[4], 0.7) },
            zIndex: 9,
            "&:hover": {
              background: {
                sm: addHslAlpha(palette[2], 0.4),
              },
            },
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              className="font-heading"
              sx={{
                fontSize: {
                  xs: "55px",
                  sm: "35px",
                },
                ...(isToday && {
                  color: "#000!important",
                  background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                  px: 0.5,
                  ml: -0.5,
                }),
                borderRadius: 1,
                width: "auto",
                height: { xs: 65, sm: 45 },
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                ...(isPast && { opacity: 0.5 }),
                mb: 0.7,
              }}
            >
              {dayjs(day.unchanged).format(day.heading)}
            </Typography>

            <IconButton
              size="small"
              sx={{
                ml: "auto",
                color: palette[6],
                mr: -1,
                ...(selection.values.length > 0 && { opacity: 0 }),
              }}
              onClick={(e) => {
                e.stopPropagation();
                selection.set([...new Set([...selection.values, "-1"])]);
              }}
            >
              <Icon className="outlined">edit</Icon>
            </IconButton>
          </Box>
          {subheading !== "-" && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
              }}
            >
              <Tooltip
                placement="bottom-start"
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
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  ml: "auto",
                  opacity: data.length === 0 ? 0 : tasksLeft === 0 ? 1 : 0.6,
                }}
              >
                {tasksLeft !== 0 ? (
                  <>
                    {tasksLeft} {isPast ? "unfinished" : "left"}
                  </>
                ) : (
                  <Icon
                    sx={{
                      color: green[isDark ? "A700" : "800"],
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
            <CreateTask
              column={{ id: "-1", name: "" }}
              defaultDate={day.unchanged}
              label="New task"
              placeholder="Create a task..."
              mutationUrl={mutationUrl}
              boardId={1}
            />
            {data.filter((task) => !task.completed).length === 0 && (
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
                    ...(isDark && {
                      filter: "invert(100%)",
                    }),
                  }}
                  alt="No items found"
                />

                <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                  <Typography variant="h6" gutterBottom>
                    {data.length === 0 ? "No tasks (yet!)" : "Let's go!"}
                  </Typography>
                  <Typography gutterBottom sx={{ fontWeight: 300 }}>
                    {data.length === 0
                      ? "Nothing planned for this time!"
                      : "You have no tasks remaining!"}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", mt: 1 }}>
                  {data.length !== 0 && <Divider sx={{ mt: 2, mb: -1 }} />}
                </Box>
              </Box>
            )}
          </Box>
          {sortedTasks.map((task) => (
            <Task
              isAgenda={true}
              isDateDependent={true}
              key={task.id}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutationUrl={mutationUrl}
              task={task}
            />
          ))}
          {dayjs(day.unchanged).diff(dayjs(), "day") <= -15 &&
            session?.property?.profile?.vanishingTasks && (
              <Alert severity="info" sx={{ my: 1 }}>
                <b>Vanishing tasks turned on</b> Completed tasks will be deleted
                after 14 days.
              </Alert>
            )}
          <Box sx={{ mb: 5 }} />
        </Box>
      </motion.div>
    </Box>
  );
});
