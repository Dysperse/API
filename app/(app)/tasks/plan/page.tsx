"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Emoji } from "@/components/Emoji";
import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  LinearProgress,
  Skeleton,
  SwipeableDrawer,
  SxProps,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import randomQuotes from "random-quotes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { CreateTask } from "../Task/Create";
import { TaskDrawer } from "../Task/Drawer";

function PlanNavbar({ subtitle }: { subtitle?: string }) {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <ConfirmationModal
        callback={() => {
          if (isMobile) router.push("/tasks/home");
        }}
        title="Stop planning?"
        question="Changes have been saved, but you'll have to go through everything again"
        disabled={!isMobile}
      >
        <IconButton sx={{ background: palette[3], color: palette[11] }}>
          <Icon className="outlined">
            {isMobile ? "close" : "emoji_objects"}
          </Icon>
        </IconButton>
      </ConfirmationModal>
      <Box
        sx={{
          mx: { xs: "auto", sm: "unset" },
          pr: "80px",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: "16px", sm: "20px" },
          }}
        >
          Plan
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              textTransform: "uppercase",
              fontWeight: { sm: 900 },
              fontSize: { xs: "12.5px", sm: "15px" },
              mt: -0.4,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function PostponeModal({ task, open, setOpen, handlePostpone }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <SwipeableDrawer
      open={open}
      onClose={() => setOpen(false)}
      anchor="bottom"
      PaperProps={{
        sx: {
          background: palette[2],
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            opacity: "0!important",
          },
        },
      }}
    >
      <Puller showOnDesktop />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "scroll",
          px: 5,
          py: 2,
          pt: 0,
        }}
      >
        {[
          { days: 1, label: "Tomorrow" },
          { days: 2, label: `Day after` },
          { days: 3, label: `This ${dayjs().add(3, "day").format("dddd")}` },
          {
            days: dayjs().endOf("week").diff(dayjs(), "day"),
            label: `This weekend`,
          },
          { days: 3, label: `Next ${dayjs().add(7, "day").format("dddd")}` },
          { days: 5, label: `This ${dayjs().add(5, "day").format("dddd")}` },
          {
            days: dayjs().daysInMonth(),
            label: `In ${dayjs().daysInMonth()} days`,
          },
        ].map((chip) => (
          <Chip
            onClick={() => handlePostpone(chip.days)}
            key={chip.days}
            label={chip.label}
          />
        ))}
      </Box>
    </SwipeableDrawer>
  );
}

function Loader() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={350}
        width="700px"
        sx={{
          maxWidth: "100%",
        }}
      />
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Skeleton variant="circular" animation="wave" height={60} width={60} />
        <Skeleton variant="circular" animation="wave" height={60} width={60} />
      </Box>
    </>
  );
}

function Slides({ setNavbarText, data }) {
  const { session } = useSession();
  const quote = randomQuotes();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const orangePalette = useColor("orange", isDark);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const maxLength = data.length;
  const [progress, setProgress] = useState(
    dayjs(session.user.lastPlannedTasks).isAfter(dayjs().startOf("day"))
      ? maxLength - 1
      : 0
  );
  const slide = data[progress];

  const styles: SxProps = {
    width: "100%",
    px: { xs: 2, sm: 5 },
    py: { xs: 2, sm: 3 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    textDecoration: "uppercase",
    fontSize: "13px",
    color: palette[11],
    borderRadius: 5,
    "& .MuiIcon-root": {
      background: palette[3],
      borderRadius: 99,
      color: palette[9],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      fontSize: "30px",
    },
    "&:hover": {
      background: { sm: palette[2] },
    },
    "&:active": {
      background: palette[3],
      "& .MuiIcon-root": {
        background: palette[4],
      },
    },
  };

  const [postponeOpen, setPostponeOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [isPostponed, setIsPostponed] = useState(false);

  useEffect(() => {
    setNavbarText(
      `${Math.abs(~~(((progress + 1) / maxLength) * 100))}% • ${
        maxLength - progress - 1
      } left`
    );
  }, [setNavbarText, progress, maxLength]);

  const handleBack = useCallback(
    () => setProgress((p) => (p === 0 ? 0 : p - 1)),
    [setProgress]
  );
  const handleNext = useCallback(
    () => setProgress((p) => p + 1),
    [setProgress]
  );

  const finishPlanning = useCallback(async () => {
    fetchRawApi(session, "user/settings", {
      method: "PUT",
      params: {
        lastPlannedTasks: dayjs().toISOString(),
      },
    });
  }, [session]);

  const handlePrioritize = useCallback(() => {
    fetchRawApi(session, "space/tasks/task", {
      method: "PUT",
      params: {
        id: slide.id,
        pinned: slide.pinned ? "false" : "true",
        date: dayjs().toISOString(),
      },
    });
    setIsPinned(true);
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsPinned(false);
    }, 800);
  }, [setProgress, session, slide]);

  const handleToday = useCallback(() => {
    setIsToday(true);
    fetchRawApi(session, "space/tasks/task", {
      method: "PUT",
      params: {
        id: slide.id,
        due: dayjs().toISOString(),
        date: dayjs().toISOString(),
      },
    });
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsToday(false);
    }, 300);
  }, [setIsToday, session, slide]);

  const handlePostpone = useCallback(
    (days) => {
      setIsPostponed(true);
      setPostponeOpen(false);
      fetchRawApi(session, "space/tasks/task", {
        method: "PUT",
        params: {
          id: slide.id,
          due: dayjs().add(days, "day").toISOString(),
          date: dayjs().toISOString(),
        },
      });
      setTimeout(() => {
        setProgress((p) => p + 1);
        setIsPostponed(false);
      }, 800);
    },
    [setIsPostponed, session, slide]
  );

  useHotkeys("1", handlePrioritize);
  useHotkeys("2", handleToday);
  useHotkeys("3", handleNext);
  useHotkeys("4", () => setPostponeOpen(true));
  useHotkeys("backspace", handleBack);

  useEffect(() => {
    if (progress === maxLength - 1) {
      finishPlanning();
    }
  }, [progress, maxLength, finishPlanning]);

  return progress === maxLength - 1 ? (
    <Box
      sx={{
        maxWidth: "100dvw",
        p: 3,
        width: "100%",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Emoji
          emoji="1f4ab"
          size={isMobile ? 50 : 60}
          style={{ marginBottom: "10px" }}
        />
        <Typography variant={isMobile ? "h3" : "h2"} className="font-heading">
          Sky&apos;s the limit.
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.6 }}>
          {maxLength == 1
            ? "What will you achieve today!?"
            : "Reach for the stars. Today's gonna be a great day!"}
        </Typography>
        <Box sx={{ my: 2, borderRadius: 5, background: palette[3], p: 3 }}>
          <Typography>{quote.body}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            &#8212; {quote.author}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {maxLength !== 1 && (
            <Button variant="outlined" onClick={() => setProgress(0)}>
              <Icon>undo</Icon>Restart
            </Button>
          )}
          {maxLength == 1 ? (
            <CreateTask defaultDate={dayjs().startOf("day").toDate()}>
              <Button variant="contained" fullWidth>
                Create a task
                <Icon>add_circle</Icon>
              </Button>
            </CreateTask>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push("/tasks/days")}
            >
              Go to agenda
              <Icon>rocket_launch</Icon>
            </Button>
          )}
        </Box>
      </motion.div>
    </Box>
  ) : (
    <>
      <LinearProgress
        value={((progress + 1) / maxLength) * 100}
        variant="determinate"
        sx={{
          height: 2,
          overflow: "visible",
          background: palette[3],
          "& *": {
            borderRadius: 999,
            color: palette[9],
            boxShadow: `0 0 10px ${palette[9]}`,
          },
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999,
          width: "100%",
        }}
      />
      <TaskDrawer
        isPlan
        id={slide.id}
        mutateList={() => {}}
        editCallback={(updatedTask) => {
          if (updatedTask === "DELETED") {
            setIsDeleted(true);
            setTimeout(() => {
              setProgress((p) => p + 1);
              setIsDeleted(false);
            }, 800);
          } else if (
            dayjs(updatedTask.due).isAfter(
              dayjs().startOf("day").add(1, "day")
            ) ||
            updatedTask.completionInstances.length > 0
          ) {
            setIsPostponed(true);
            setTimeout(() => {
              setProgress((p) => p + 1);
              setIsPostponed(false);
            }, 800);
          }
        }}
      >
        <Box
          sx={{
            transformOrigin: "top center",
            transform: postponeOpen ? "scale(.9)" : "scale(1)",
            transition: "all .2s",
            mt: { xs: "auto", sm: "0" },
            "& .opacity": {
              height: { xs: "100%", sm: 350 },
              maxHeight: { xs: 250, sm: 350 },
              width: { xs: 500, sm: 700 },
              maxWidth: "calc(100dvw - 80px)",
              border: `2px solid ${palette[4]}`,
              overflow: "hidden",
              boxShadow: `0 0 100px ${palette[4]}`,
              "&:hover": {
                background: { sm: palette[2] },
                border: { sm: `2px solid ${palette[5]}` },
              },
              "&:active": {
                filter: "opacity(.6)",
              },
              borderRadius: 5,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 4,
              gap: 2,
              zIndex: 99,
              transition: "all .8s forwards cubic-bezier(.17,.67,.41,1.35)",
              ...(isToday && {
                animation:
                  "today .3s forwards cubic-bezier(0.1, 0.76, 0.55, 0.9)",
                ["@keyframes today"]: {
                  from: { transform: "translateY(0px)", opacity: 1 },
                  to: { transform: "translateY(-50dvh)", opacity: 0 },
                },
              }),
              ...(isPinned && {
                animation: "pin .3s forwards cubic-bezier(.17,.67,.41,1.35)",
                ["@keyframes pin"]: {
                  from: { transform: "scale(1)" },
                  to: { transform: "scale(1.1)" },
                },
              }),
              ...(isPostponed && {
                animation:
                  "postpone .8s forwards cubic-bezier(.17,.67,.41,1.35)",
                ["@keyframes postpone"]: {
                  "20%": {
                    opacity: 1,
                    transform: "scale(.9) rotate(2deg)",
                    boxShadow: "none",
                  },
                  "60%": {
                    opacity: 1,
                    transform: "scale(.9) rotate(2deg)",
                    boxShadow: "none",
                  },
                  "100%": {
                    // filter: "blur(5px)",
                    opacity: 0,
                    transform:
                      "scale(.5) rotate(5deg) translate(100vh, -100vh)",
                    boxShadow: "none",
                  },
                },
              }),
              ...(isDeleted && {
                animation: "delete .8s forwards cubic-bezier(.17,.67,.41,1.35)",
                ["@keyframes delete"]: {
                  "20%": {
                    opacity: 1,
                    transform: "scale(.9) rotate(-2deg)",
                    boxShadow: "none",
                  },
                  "60%": {
                    opacity: 1,
                    transform: "scale(.9) rotate(-2deg)",
                    boxShadow: "none",
                  },
                  "100%": {
                    // filter: "blur(5px)",
                    opacity: 0,
                    transform:
                      "scale(.5) rotate(-5deg) translate(-100vh, 100vh)",
                    boxShadow: "none",
                  },
                },
              }),
            },
          }}
        >
          <motion.div
            key={progress}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="opacity"
          >
            {isPinned && (
              <Box
                sx={{
                  transform: "skew(-10deg,-0deg)",
                  width: "300px",
                  display: "block",
                  height: "100dvh",
                  position: "absolute",
                  zIndex: 99,
                  top: 0,
                  left: 0,
                  background: `linear-gradient(90deg, transparent, ${palette[9]}, transparent)`,
                  opacity: 0.3,
                  animation: "slide .8s forwards ",
                  ["@keyframes slide"]: {
                    from: {
                      transform: "skew(-10deg,-0deg) translateX(-1000px)",
                    },
                    to: { transform: "skew(-10deg,-0deg) translateX(1000px)" },
                  },
                }}
              />
            )}
            <Box sx={{ flexWrap: "wrap", display: "flex", gap: 1.5 }}>
              {slide.pinned && (
                <Chip
                  sx={{
                    color: `${orangePalette[11]}!important`,
                    background: `${orangePalette[5]}!important`,
                  }}
                  icon={
                    <Icon sx={{ color: `${orangePalette[11]}!important` }}>
                      priority_high
                    </Icon>
                  }
                  label="Urgent"
                />
              )}
              <Chip
                icon={<Icon className="outlined">calendar_today</Icon>}
                label={`${
                  dayjs(slide.due).isTomorrow()
                    ? "Tomorrow"
                    : dayjs(slide.due).isToday()
                    ? "Today"
                    : dayjs(slide.due).fromNow()
                }`}
              />
              {!slide.dateOnly && (
                <Chip
                  label={dayjs(slide.due).format("h:mm A")}
                  sx={{ background: palette[3] }}
                  icon={<Icon className="outlined">access_time</Icon>}
                />
              )}
              {slide.column && (
                <Tooltip title={slide.column?.name}>
                  <Chip
                    label={slide.column?.board?.name}
                    sx={{ background: palette[3] }}
                    avatar={
                      <Avatar
                        sx={{ borderRadius: 0 }}
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${slide.column?.emoji}.png`}
                      />
                    }
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "40px", sm: "50px" },
                lineHeight: { xs: "40px", sm: "50px" },
              }}
              className="font-heading"
            >
              {slide.name}
            </Typography>
            {slide.description && <Typography>{slide.description}</Typography>}
          </motion.div>
        </Box>
      </TaskDrawer>
      <Box
        sx={{
          display: "flex",
          width: { xs: 500, sm: 700 },
          maxWidth: "calc(100dvw - 20px)",
          mt: { xs: "auto", sm: 2 },
          mb: 3,
          gap: 1,
          transition: "all .3s",
          ...((isPinned || isDeleted || postponeOpen) && {
            opacity: 0,
          }),
        }}
      >
        <Tooltip title="1" enterDelay={1000}>
          <Box sx={styles} onClick={handlePrioritize}>
            <Icon
              sx={{
                ...(slide.pinned && {
                  background: `${palette[9]}!important`,
                  color: `${palette[1]}!important`,
                }),
              }}
            >
              release_alert
            </Icon>
            Prioritize{slide.pinned && "d"}
          </Box>
        </Tooltip>
        <Tooltip title="2" enterDelay={1000}>
          <Box sx={styles} onClick={handleToday}>
            <Icon>priority</Icon>
            Today
          </Box>
        </Tooltip>
        <Tooltip title="3" enterDelay={1000}>
          <Box sx={styles} onClick={handleNext}>
            <Icon>
              {dayjs(slide.due).isTomorrow() ? "outbound" : "next_plan"}
            </Icon>
            {dayjs(slide.due).isTomorrow() ? "Tomorrow" : "Skip"}
          </Box>
        </Tooltip>
        <Tooltip title="4" enterDelay={1000}>
          <Box sx={styles} onClick={() => setPostponeOpen(true)}>
            <Icon>dark_mode</Icon>
            Postpone
          </Box>
        </Tooltip>
      </Box>
      <Tooltip title="backspace" enterDelay={1000}>
        <IconButton
          sx={{
            transition: "all .2s",
            ...((progress == 0 || postponeOpen) && {
              opacity: 0,
              pointerEvents: "none",
            }),
            position: "fixed",
            top: 0,
            right: 55,
            color: palette[11],
            background: palette[3],
            m: 3,
            mt: 4,
          }}
          onClick={handleBack}
        >
          <Icon>undo</Icon>
        </IconButton>
      </Tooltip>
      <PostponeModal
        setOpen={setPostponeOpen}
        open={postponeOpen}
        task={slide}
        handlePostpone={handlePostpone}
      />
    </>
  );
}

function Intro() {
  const { session } = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const getGreeting = useMemo(() => {
    const time = new Date().getHours();
    if (time < 12) return "Good morning";
    else if (time < 17) return "Good afternoon";
    else if (time < 20) return "Good evening";
    else return "Good night";
  }, []);

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <Typography
          variant={isMobile ? "h2" : "h1"}
          className="font-heading"
          sx={{
            textShadow: `0 0 100px ${palette[9]}`,
          }}
        >
          {getGreeting}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            textShadow: `0 0 100px ${palette[9]}`,
          }}
        >
          Let&apos;s take a moment to plan your day{" "}
          <Icon sx={{ verticalAlign: "middle" }}>east</Icon>
        </Typography>
      </motion.div>
    </>
  );
}

export default function Page() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const key = useMemo(() => {
    return [
      "space/tasks/plan",
      {
        start: dayjs().subtract(7, "day").toISOString(),
        end: dayjs().add(1, "day").toISOString(),
      },
    ];
  }, []);

  const { data, mutate, error, isLoading } = useSWR(key, {
    revalidateOnFocus: false,
  });
  const [navbarText, setNavbarText] = useState<undefined | string>(undefined);
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 5 },
        pt: { xs: 4, sm: 6 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        maxWidth: "100dvw",
        position: "relative",
      }}
    >
      <CreateTask defaultDate={dayjs().startOf("day").toDate()}>
        <IconButton
          sx={{
            transition: "all .2s",
            position: "fixed",
            top: 0,
            right: 0,
            color: palette[11],
            background: palette[3],
            m: 3,
            mt: 4,
          }}
        >
          <Icon className="outlined">add</Icon>
        </IconButton>
      </CreateTask>
      <Box sx={{ maxWidth: "100dvw", width: "500px" }}>
        <PlanNavbar subtitle={navbarText} />
      </Box>
      <Box
        sx={{
          pt: { xs: 2, sm: 7 },
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {showIntro && <Intro />}
        {!showIntro && data && (
          <Slides setNavbarText={setNavbarText} data={data} />
        )}
        {error && <ErrorHandler callback={mutate} />}
        {isLoading && !showIntro && <Loader />}
      </Box>
    </Box>
  );
}
