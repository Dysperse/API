"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Emoji } from "@/components/Emoji";
import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { updateSettings } from "@/lib/client/updateSettings";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  Skeleton,
  SwipeableDrawer,
  SxProps,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import randomQuotes from "random-quotes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { CreateTask } from "../Task/Create";
import { TaskDrawer } from "../Task/Drawer";

function ProgressBar({ group, progress }: { group: number; progress: number }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const maxGroups = 3;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        gap: 2,
        p: 2,
      }}
    >
      {[...new Array(maxGroups)].map((_, i) => (
        <LinearProgress
          value={group > i ? 100 : group === i ? progress : 0}
          variant="determinate"
          key={i}
          sx={{
            borderRadius: 99,
            height: 5,
            width: "100%",
            background: palette[5],
            "& *": {
              borderRadius: 999,
              background: `linear-gradient(${palette[11]}, ${palette[7]})`,
            },
          }}
        />
      ))}
    </Box>
  );
}

function SetGoals({ setNavbarText, setGroupProgress }) {
  const [step, setStep] = useState(0);
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const greenPalette = useColor("green", isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);
  const [createdTasks, setCreatedTasks] = useState<any[]>([]);

  useEffect(() => {
    if (createdTasks.length === 3 && step === 1) {
      setGroupProgress(1);
    }
  }, [createdTasks.length, step, setGroupProgress]);

  return (
    <>
      <ProgressBar
        group={0}
        progress={((step + 1 + createdTasks.length) / 5) * 100}
      />
      <Box sx={{ width: "500px", maxWidth: "calc(100dvw - 40px)" }}>
        <Typography variant="h3" className="font-heading">
          {step === 1 ? "Supercharge your schedule" : "Kickstart your day"}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {step == 1 ? (
            <>Write down three main things you want to focus on.</>
          ) : (
            <>
              Write down one <u>easy</u> task that could make your day.
            </>
          )}
        </Typography>
        {step === 0 ? (
          <CreateTask
            closeOnCreate
            defaultDate={dayjs().startOf("day").toDate()}
            disableBadge
            isSimple
            onSuccess={() => {
              setStep(1);
            }}
          >
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>add</Icon>
                  </InputAdornment>
                ),
              }}
              inputProps={{ readOnly: true }}
              placeholder="Make breakfast"
              sx={{ fontStyle: "italic", "&, & *": { cursor: "default" } }}
            />
          </CreateTask>
        ) : (
          [...new Array(3)].map((_, i) => (
            <CreateTask
              defaultDate={dayjs().startOf("day").toDate()}
              disableBadge
              closeOnCreate
              key={i}
              onSuccess={(res) =>
                setCreatedTasks((c) => [...c, { name: res.name, id: res.id }])
              }
            >
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>target</Icon>
                    </InputAdornment>
                  ),
                }}
                value={createdTasks[i]?.name}
                disabled={Boolean(createdTasks[i]?.name)}
                inputProps={{ readOnly: true }}
                placeholder="Make breakfast"
                sx={{
                  mb: 1,
                  ...(createdTasks[i]
                    ? {
                        "&, & *": {
                          borderColor: `${greenPalette[9]}!important`,
                          color: `${greenPalette[9]}!important`,
                        },
                      }
                    : {
                        fontStyle: "italic",
                        "&, & *": { cursor: "default" },
                      }),
                }}
              />
            </CreateTask>
          ))
        )}
        <ConfirmationModal
          callback={() => {
            if (step === 1) {
              setGroupProgress(1);
            } else {
              setStep(1);
            }
          }}
          title="Skip?"
          buttonText="Skip"
          question={
            step === 1
              ? "Writing down three focus goals could make your day's vision clearer."
              : "Small tasks may only take a few minutes but could make a big difference in your day."
          }
        >
          <Button fullWidth size="small" sx={{ mt: 1, opacity: 0.7 }}>
            Skip for now
          </Button>
        </ConfirmationModal>
      </Box>
    </>
  );
}

function PastTasks({ setNavbarText, data }) {
  const router = useRouter();
  const { session, setSession } = useSession();
  const [slide, setSlide] = useState(
    dayjs(session.user.lastPlannedTasks).isToday()
      ? 2
      : data.length === 0
      ? 2
      : 0
  );
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [_data, setData] = useState(data);

  const finishPlanning = useCallback(async () => {
    updateSettings(["lastPlannedTasks", dayjs().toISOString()], {
      session,
      setSession,
    });
  }, [session, setSession]);

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (
      ((slide === 2 && !done) || (_data && _data.length === 0)) &&
      !dayjs(session.user.lastPlannedTasks).isToday()
    ) {
      setDone(true);
      setSlide(2);
      finishPlanning();
    }
  }, [finishPlanning, done, slide, _data, setSlide, session]);
  useEffect(() => {
    if (slide === 2) setNavbarText(`Finished`);
  }, [setNavbarText, slide]);
  return (
    <>
      <ProgressBar group={2} progress={(slide / 2) * 100} />
      {slide === 0 ? (
        <Box sx={{ my: "auto" }}>
          <Avatar sx={{ width: 70, height: 70, mb: 1, borderRadius: 3 }}>
            <Emoji emoji="1f4a4" size={40} />
          </Avatar>
          <Typography variant="h2" className="font-heading">
            Overdue tasks
          </Typography>
          <Typography sx={{ mb: 1 }}>
            We&apos;ve picked <b>five tasks</b> which you haven&apos;t completed
            in a while.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <ConfirmationModal
              callback={() => setSlide(2)}
              title="Skip?"
              question="Skip reviewing old tasks?"
            >
              <Button variant="outlined" sx={{ px: 5 }}>
                Skip for now
              </Button>
            </ConfirmationModal>
            <Button variant="contained" fullWidth onClick={() => setSlide(1)}>
              Let&apos;s do it
            </Button>
          </Box>
        </Box>
      ) : slide === 1 ? (
        <Container>
          <Typography variant="h3" className="font-heading" sx={{ mb: 2 }}>
            Overdue tasks
          </Typography>
          {_data.map((task) => (
            <TaskDrawer
              key={task.id}
              id={task.id}
              mutateList={() => {}}
              editCallback={(updatedTask) => {
                if (!updatedTask) {
                } else if (
                  updatedTask === "DELETED" ||
                  dayjs(updatedTask.due).isAfter(dayjs().startOf("day")) ||
                  updatedTask.completionInstances.length === 1
                ) {
                  setData(_data.filter((i) => i.id !== task.id));
                } else {
                  setData(
                    _data.map((i) => {
                      if (i.id === updatedTask.id) {
                        return updatedTask;
                      } else {
                        return i;
                      }
                    })
                  );
                }
              }}
            >
              <Box
                sx={{ mb: 2, background: palette[2], borderRadius: 5, p: 2 }}
              >
                <Typography variant="h6">{task.name}</Typography>
                <Typography sx={{ mb: 0.5 }}>{task.description}</Typography>
                <Chip label={dayjs(task.due).fromNow()} />
              </Box>
            </TaskDrawer>
          ))}
          <Button
            variant="contained"
            fullWidth
            onClick={() => setSlide(2)}
            sx={{ my: 2 }}
          >
            Done
          </Button>
        </Container>
      ) : (
        <Box sx={{ my: "auto" }}>
          <Avatar sx={{ width: 70, height: 70, mb: 1, borderRadius: 3 }}>
            <Emoji emoji="1f4ab" size={40} />
          </Avatar>
          <Typography variant="h2" className="font-heading">
            Reach for the stars!
          </Typography>
          <Typography sx={{ mb: 1 }}>
            You&apos;re all set to be productive today!
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push("/tasks/perspectives/days")}
            >
              Go to agenda
            </Button>
          </Box>
          {dayjs(session.user.lastPlannedTasks).isToday() && (
            <Box
              sx={{
                px: 2,
                fontWeight: 600,
                textTransform: "uppercase",
                opacity: 0.6,
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              New suggestions in:{" "}
              <Countdown
                daysInHours
                precision={2}
                date={dayjs(session.user.lastPlannedTasks)
                  .add(1, "day")
                  .toDate()}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

function PlanNavbar({ subtitle }: { subtitle?: string }) {
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
      <ConfirmationModal
        callback={() => {
          if (isMobile) router.push("/tasks/home");
        }}
        title="Stop planning?"
        question="Changes have been saved, but you'll have to go through everything again"
        disabled={!isMobile || subtitle?.includes("Finished")}
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

function Slides({ setNavbarText, data, setGroupProgress }) {
  const { session } = useSession();
  const quote = randomQuotes();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const orangePalette = useColor("orange", isDark);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const maxLength = data.length;
  const [progress, setProgress] = useState(-1);
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
  useHotkeys("3", () => setPostponeOpen(true));
  useHotkeys("4", handleNext);
  useHotkeys("backspace", handleBack);

  useEffect(() => {
    if (progress === maxLength - 1) {
      setGroupProgress(2);
      // finishPlanning();
    }
  }, [progress, maxLength, setGroupProgress]);

  return (
    <>
      <ProgressBar
        group={1}
        progress={((progress + 2) / (maxLength + 1)) * 100}
      />
      {progress === -1 ? (
        <Box sx={{ my: "auto" }}>
          <Avatar sx={{ width: 70, height: 70, mb: 1, borderRadius: 3 }}>
            <Emoji emoji="1F331" size={40} />
          </Avatar>
          <Typography variant="h2" className="font-heading">
            Upcoming tasks
          </Typography>
          <Typography sx={{ mb: 1 }}>
            Now, let&apos;s review some of your upcoming tasks.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <ConfirmationModal
              callback={() => setGroupProgress(2)}
              title="Skip?"
              question="Skip reviewing old tasks?"
            >
              <Button variant="outlined" sx={{ px: 5 }}>
                Skip for now
              </Button>
            </ConfirmationModal>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setProgress(0)}
            >
              Let&apos;s do it
            </Button>
          </Box>
        </Box>
      ) : (
        <>
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
                    animation:
                      "pin .3s forwards cubic-bezier(.17,.67,.41,1.35)",
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
                    animation:
                      "delete .8s forwards cubic-bezier(.17,.67,.41,1.35)",
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
                        to: {
                          transform: "skew(-10deg,-0deg) translateX(1000px)",
                        },
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
                {slide.description && (
                  <Typography>{slide.description}</Typography>
                )}
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
              <Box sx={styles} onClick={() => setPostponeOpen(true)}>
                <Icon>dark_mode</Icon>
                Postpone
              </Box>
            </Tooltip>
            <Tooltip title="4" enterDelay={1000}>
              <Box sx={styles} onClick={handleNext}>
                <Icon>
                  {dayjs(slide.due).isTomorrow() ? "outbound" : "next_plan"}
                </Icon>
                {dayjs(slide.due).isTomorrow() ? "Tomorrow" : "Next"}
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
      )}
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
        style={{ marginTop: "auto" }}
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
        style={{ marginBottom: "auto" }}
      >
        <Typography
          variant={isMobile ? undefined : "h5"}
          sx={{
            textShadow: `0 0 100px ${palette[9]}`,
            textAlign: "center",
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
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const [showIntro, setShowIntro] = useState(true);
  const [groupProgress, setGroupProgress] = useState(
    dayjs(session.user.lastPlannedTasks).isToday() ? 2 : 0
  );

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const key = useMemo(() => {
    return [
      "space/tasks/plan",
      {
        start: dayjs().startOf("day").toISOString(),
        end: dayjs().endOf("day").toISOString(),
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
        ...(groupProgress === 1 && {
          overflowY: { sm: "hidden" },
        }),
      }}
    >
      {isMobile && (
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
              mt: { xs: 5, sm: 6 },
            }}
          >
            <Icon className="outlined">add</Icon>
          </IconButton>
        </CreateTask>
      )}
      <PlanNavbar subtitle={navbarText} />
      <Box
        sx={{
          pt: { xs: 2, sm: 7 },
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: { xs: "100%", sm: "100dvh" },
          ...(groupProgress !== 2 && {
            justifyContent: "center",
          }),
        }}
      >
        {showIntro && <Intro />}
        {!showIntro && data && groupProgress === 0 && (
          <SetGoals
            setNavbarText={setNavbarText}
            setGroupProgress={setGroupProgress}
          />
        )}
        {!showIntro && data && groupProgress === 1 && (
          <Slides
            setNavbarText={setNavbarText}
            data={data.tasksToday}
            setGroupProgress={setGroupProgress}
          />
        )}
        {!showIntro && data && groupProgress === 2 && (
          <PastTasks data={data.oldTasks} setNavbarText={setNavbarText} />
        )}
        {error && <ErrorHandler callback={mutate} />}
        {isLoading && !showIntro && <Loader />}
      </Box>
    </Box>
  );
}
