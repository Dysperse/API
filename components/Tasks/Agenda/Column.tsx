import { exportAsImage } from "@/components/Coach/Goal/Options";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDelayedMount } from "@/lib/client/useDelayedMount";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import React, {
  cloneElement,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

function ShareProgress({ day, children, data, tasksLeft }) {
  const ref = useRef();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const trigger = cloneElement(children, {
    onClick: (e) => {
      e.stopPropagation();
      setOpen(true);
    },
  });

  const handleExport = () => {
    exportAsImage(ref.current, "progress.png");
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        sx={{ zIndex: 9999999 }}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Puller showOnDesktop />
        <Box
          sx={{
            background: palette[9],
            p: 3,
            position: "relative",
            color: palette[1],
          }}
          ref={ref}
        >
          <picture>
            <img
              src="/logo.svg"
              alt="Logo"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "40px",
                height: "40px",
              }}
            />
          </picture>

          <Typography sx={{ opacity: 0.7, mt: 10 }}>
            {dayjs(day.unchanged).format("MMMM D, YYYY")}
          </Typography>
          <Typography variant="h3" className="font-heading" sx={{ mt: 1 }}>
            I finished {data.length - tasksLeft} tasks today!
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ opacity: 0.8 }}>
            {tasksLeft === 0
              ? "Conquered my entire to-do list like a boss."
              : `Only ${tasksLeft} task${
                  tasksLeft === 1 ? "" : "s"
                } left to conquer.`}
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            onClick={handleExport}
            variant="outlined"
            size="large"
            fullWidth
            sx={{ borderWidth: "2px!important" }}
          >
            <Icon>download</Icon>Save to gallery
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
const ColumnMenu = React.memo(function ColumnMenu({
  day,
  tasksLeft,
  data,
}: any) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const selection = useContext(SelectionContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          ml: "auto",
          color: palette[6],
          mr: -1,
          ...(selection.values.length > 0 && { opacity: 0 }),
        }}
      >
        <Icon className="outlined">more_horiz</Icon>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            selection.set([...new Set([...selection.values, "-1"])]);
          }}
        >
          <Icon>select</Icon>
          Select
        </MenuItem>

        <ShareProgress data={data} tasksLeft={tasksLeft} day={day}>
          <MenuItem disabled={data.length == 0 || data.length === tasksLeft}>
            <Icon>ios_share</Icon>
            Share progress
          </MenuItem>
        </ShareProgress>
      </Menu>
    </>
  );
});

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
    [data, startTime, endTime],
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
          : 0,
      ),
    [data],
  );

  const ref: any = useRef();

  const [loading, setLoading] = useState(false);
  const scrollIntoView = async (load = true) => {
    if (window.innerWidth > 600) {
      if (load) {
        document.body.scrollTop = 0;
        ref.current?.scrollTo({ top: 0, behavior: "smooth" });
      }

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

    if (!load) return;

    setLoading(true);
    try {
      await mutate(mutationUrl);
      await new Promise((r) => setTimeout(() => r(""), 500));
    } catch (e) {
      toast.error(
        "Yikes! We couldn't get your tasks. Please try again later",
        toastStyles,
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
      onClick={() => scrollIntoView(false)}
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
          onClick={() => scrollIntoView(true)}
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

            <ColumnMenu tasksLeft={tasksLeft} data={data} day={day} />
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
