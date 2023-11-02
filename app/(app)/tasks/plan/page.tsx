"use client";

import { Emoji } from "@/components/Emoji";
import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
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
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import randomQuotes from "random-quotes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { TaskNavbar } from "../navbar";

function PlanNavbar({ subtitle }: { subtitle?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ width: 50, height: 50, borderRadius: 3 }}>
        <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
          emoji_objects
        </Icon>
      </Avatar>
      <Box>
        <Typography variant="h6">Plan</Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              textTransform: "uppercase",
              fontWeight: 900,
              mt: -0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
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
  const isDark = useDarkMode(session.darkMode);
  const orangePalette = useColor("orange", isDark);
  const palette = useColor(session.themeColor, isDark);

  const maxLength = data.length;
  const [progress, setProgress] = useState(0);
  const slide = data[progress];

  const styles: SxProps = {
    width: "100%",
    px: 5,
    py: 3,
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
      background: palette[2],
    },
    "&:active": {
      background: palette[3],
      "& .MuiIcon-root": {
        background: palette[4],
      },
    },
  };

  const [isPinned, setIsPinned] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [isPostponed, setIsPostponed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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

  const handleDelete = useCallback(async () => {
    setIsDeleted(true);
    fetchRawApi(session, "space/tasks/task", {
      method: "DELETE",
      params: {
        id: slide.id,
      },
    });
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsDeleted(false);
    }, 800);
  }, [setProgress, session, slide.id]);

  const handleComplete = useCallback(() => {
    fetchRawApi(session, "space/tasks/task/complete", {
      method: "PUT",
      params: {
        id: slide.id,
        isRecurring: false,
        completedAt: dayjs().toISOString(),
        isCompleted: "true",
      },
    });
    setIsCompleted(true);
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsCompleted(false);
    }, 800);
  }, [setIsCompleted, slide, session]);

  const handlePrioritize = useCallback(() => {
    fetchRawApi(session, "space/tasks/task", {
      method: "PUT",
      params: {
        id: slide.id,
        pinned: slide.pinned ? "false" : "true",
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
        lastUpdated: dayjs().toISOString(),
      },
    });
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsToday(false);
    }, 300);
  }, [setIsToday, session, slide.id]);

  const handlePostpone = useCallback(() => {
    setIsPostponed(true);
    fetchRawApi(session, "space/tasks/task", {
      method: "PUT",
      params: {
        id: slide.id,
        due: dayjs().add(1, "day").toISOString(),
        lastUpdated: dayjs().toISOString(),
      },
    });
    setTimeout(() => {
      setProgress((p) => p + 1);
      setIsPostponed(false);
    }, 400);
  }, [setIsPostponed, session, slide.id]);

  useHotkeys("d", handleDelete);
  useHotkeys("o", handleComplete);
  useHotkeys("u", handlePrioritize);
  useHotkeys("t", handleToday);
  useHotkeys("p", handlePostpone);
  useHotkeys("backspace", handleBack);

  useEffect(() => {
    if (progress === maxLength - 1) {
      finishPlanning();
    }
  }, [progress, maxLength, finishPlanning]);
  const quote = randomQuotes();
  return progress === maxLength - 1 ? (
    <Box>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Emoji emoji="1f389" size={60} />
        <Typography variant="h3" className="font-heading" sx={{ mt: 1 }}>
          Let&apos;s reach for the stars.
        </Typography>
        <Typography variant="h6">
          Today&apos;s gonna be a great day. Onward!
        </Typography>
        <Box sx={{ my: 2, borderRadius: 5, background: palette[2], p: 3 }}>
          <Typography>{quote.body}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            &#8212; {quote.author}
          </Typography>
        </Box>
        <Button variant="contained" fullWidth>
          Go to agenda
          <Icon>rocket_launch</Icon>
        </Button>
      </motion.div>
    </Box>
  ) : (
    <>
      <LinearProgress
        value={((progress + 1) / maxLength) * 100}
        variant="determinate"
        sx={{
          height: 10,
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
          zIndex: 9999,
          width: "100%",
        }}
      />
      <Box
        sx={{
          "& .opacity": {
            height: 350,
            width: 700,
            maxWidth: "100%",
            border: `2px solid ${palette[4]}`,
            boxShadow: `0 0 100px ${palette[4]}`,
            borderRadius: 5,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 4,
            gap: 2,
            zIndex: 99,
            overflow: "hidden",
            transition: "all .8s forwards cubic-bezier(.17,.67,.41,1.35)",
            ...(isToday && {
              animation:
                "today .3s forwards cubic-bezier(0.1, 0.76, 0.55, 0.9)",
              ["@keyframes today"]: {
                from: { transform: "translateY(0px)", opacity: 1 },
                to: { transform: "translateY(-50dvh)", opacity: 0 },
              },
            }),
            ...(isPostponed && {
              animation:
                "postpone .4s forwards cubic-bezier(0.1, 0.76, 0.55, 0.9)",
              ["@keyframes postpone"]: {
                from: { transform: "translateX(0px)", opacity: 1 },
                to: {
                  transform: "translateX(calc(100%  + 500px))",
                  opacity: 1,
                },
              },
            }),
            ...(isPinned && {
              animation: "pin .3s forwards cubic-bezier(.17,.67,.41,1.35)",
              ["@keyframes pin"]: {
                from: { transform: "scale(1)" },
                to: { transform: "scale(1.1)" },
              },
            }),
            ...(isCompleted && {
              animation: "complete .8s forwards cubic-bezier(.17,.67,.41,1.35)",
              ["@keyframes complete"]: {
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
                  transform: "scale(.5) rotate(5deg) translate(100vh, -100vh)",
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
                  transform: "scale(.5) rotate(-5deg) translate(-100vh, 100vh)",
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
                  from: { transform: "skew(-10deg,-0deg) translateX(-1000px)" },
                  to: { transform: "skew(-10deg,-0deg) translateX(1000px)" },
                },
              }}
            />
          )}
          <Tooltip title="d" enterDelay={1000}>
            <IconButton
              sx={{
                // background: palette[3],
                color: palette[9],
                position: "absolute",
                top: 0,
                left: 0,
                m: 2,
              }}
              onClick={handleDelete}
            >
              <Icon className="outlined">delete</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="o" enterDelay={1000}>
            <IconButton
              sx={{
                background: palette[3],
                color: palette[9],
                position: "absolute",
                top: 0,
                right: 0,
                m: 2,
              }}
              onClick={handleComplete}
            >
              <Icon className="outlined">check</Icon>
            </IconButton>
          </Tooltip>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {slide.pinned && (
              <Chip
                sx={{
                  color: `${orangePalette[11]}!important`,
                  background: `${orangePalette[5]}!important`,
                }}
                icon={<Icon>priority_high</Icon>}
                label="Urgent"
              />
            )}
            <Chip
              icon={<Icon className="outlined">calendar_today</Icon>}
              label={dayjs(slide.due).format("MMMM Do")}
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
          <Typography variant="h3" className="font-heading">
            {slide.name}
          </Typography>
          <Typography>{slide.description}</Typography>
        </motion.div>
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          mb: 3,
          gap: 1,
          transition: "all .3s",
          ...((isPinned || isDeleted) && {
            opacity: 0,
          }),
        }}
      >
        <Tooltip title="u" enterDelay={1000}>
          <Box sx={styles} onClick={handlePrioritize}>
            <Icon>priority_high</Icon>
            Prioritize
          </Box>
        </Tooltip>
        <Tooltip title="t" enterDelay={1000}>
          <Box
            sx={{ ...styles, background: addHslAlpha(palette[4], 0.3) }}
            onClick={handleToday}
          >
            <Icon>north</Icon>
            Today
          </Box>
        </Tooltip>
        <Tooltip title="p" enterDelay={1000}>
          <Box sx={styles} onClick={handlePostpone}>
            <Icon>east</Icon>
            Postpone
          </Box>
        </Tooltip>
      </Box>
      <Tooltip title="backspace" enterDelay={1000}>
        <IconButton
          sx={{
            transition: "all .2s",
            ...(progress == 0 && {
              opacity: 0,
              pointerEvents: "none",
            }),
            position: "fixed",
            bottom: 50,
            right: 0,
            background: palette[2],
            color: palette[11],
            m: 3,
          }}
          onClick={handleBack}
        >
          <Icon>undo</Icon>
        </IconButton>
      </Tooltip>
      <IconButton
        sx={{
          transition: "all .2s",
          ...(progress === maxLength - 1 && {
            opacity: 0,
            pointerEvents: "none",
          }),
          position: "fixed",
          bottom: 0,
          right: 0,
          background: palette[2],
          color: palette[11],
          m: 3,
        }}
        onClick={handleNext}
      >
        <Icon>redo</Icon>
      </IconButton>
    </>
  );
}

function Intro() {
  const { session } = useSession();
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
          variant="h1"
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
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const key = useMemo(() => {
    return [
      "space/tasks/plan",
      {
        timezone: session.user.timeZone,
        utcOffset: dayjs().utcOffset(),
        start: dayjs().subtract(7, "day").toISOString(),
        end: dayjs().endOf("day").toISOString(),
        type: "week",
      },
    ];
  }, [session.user.timeZone]);

  const { data, mutate, error, isLoading } = useSWR(key);
  const [navbarText, setNavbarText] = useState<undefined | string>(undefined);
  return (
    <Box
      sx={{
        p: 5,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <TaskNavbar title="Plan" />
      <Box sx={{ maxWidth: "500px" }}>
        <PlanNavbar subtitle={navbarText} />
      </Box>
      <Box
        sx={{
          pt: 7,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
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
