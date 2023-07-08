import { ShareGoal } from "@/components/Coach/Goal/ShareGoal";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { toastStyles } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Icon,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { orange } from "@radix-ui/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { cloneElement, useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import Confetti from "react-confetti";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";

function GoalActivity({ goal, children, open, setOpen }) {
  const session = useSession();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetchRawApi(session, "user/coach/goals/activity", {
        id: goal.id,
      })
        .then((res) => {
          setData(res);
        })
        .catch(() =>
          toast.error(
            "Yikes! Something went wrong while trying to fetch your activity",
            toastStyles
          )
        );
    }
  }, [open, session, goal, data]);

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const trigger = cloneElement(children, {
    onClick: () => setOpen(!open),
  });

  return (
    <Box>
      {trigger}
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{
          sx: {
            background: palette[2],
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Puller showOnDesktop />
          <Typography
            className="font-heading"
            variant="h4"
            sx={{ textAlign: "center" }}
          >
            {dayjs().format("MMMM YYYY")}
          </Typography>
          {/* Make an grid of 365 days, rows represent weeks, columns represent days . Use DayJS current month. Ignore data variable for now*/}
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                "& .react-calendar__tile": {
                  color: "#fff!important",
                  border: "none!important",
                  cursor: "default!important",
                },
                ...(!data && {
                  filter: "blur(5px)",
                }),
              }}
            >
              <Calendar
                maxDate={new Date()}
                // value={dayjs().add(0, "month").toDate()}
                showNavigation={false}
                showNeighboringMonth={false}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            borderRadius: "50%",
                            height: 25,
                            width: 25,
                            mt: -4,
                            zIndex: -1,
                            background:
                              data &&
                              data.filter(
                                (d) =>
                                  dayjs(d.date).format("YYYY-MM-DD") ===
                                  dayjs(date).format("YYYY-MM-DD")
                              ).length
                                ? orange["orange10"]
                                : "transparent",
                          }}
                        />
                      </Box>
                    );
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

function GoalTask({ goal, setSlide, mutationUrl, open, setOpen }) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const { width, height } = useWindowDimensions();

  const [loading, setLoading] = useState<boolean>(false);
  const [stepTwoOpen, setStepTwoOpen] = useState<boolean>(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const isCompleted = goal.progress === goal.durationDays;

  const [disabled, setDisabled] = useState<boolean>(false);

  useStatusBar(palette[2]);

  const handleNext = () => {
    if (goal.progress === goal.durationDays) {
      setStepTwoOpen(true);
    } else {
      setSlide((s) => s + 1);
      setDisabled(true);
      fetchRawApi(session, "user/coach/goals/markAsDone", {
        date: dayjs().toISOString(),
        progress:
          goal.progress && parseInt(goal.progress)
            ? goal.progress + 1 > goal.durationDays
              ? goal.durationDays
              : goal.progress + 1
            : 1,
        id: goal.id,
      })
        .then(async () => await mutate(mutationUrl))
        .catch(() => {
          toast.error(
            "Yikes! Something went wrong while trying to mark your routine as done",
            toastStyles
          );
          setDisabled(false);
        });
    }
  };

  useEffect(() => {
    if (isCompleted && !alreadyPlayed) {
      new Audio("/sfx/confetti.mp3").play();
      setAlreadyPlayed(true);
    }
  }, [isCompleted, alreadyPlayed]);

  useEffect(() => {
    window.location.hash = `#${goal.id}`;
  });

  const handleTrophyEarn = async (icon) => {
    try {
      setLoading(true);
      await fetchRawApi(session, "user/coach/goals/complete", {
        daysLeft: goal.durationDays - goal.progress,
        feedback: icon,
        id: goal.id,
      });
      await mutate(mutationUrl);
      setStepTwoOpen(false);
      toast.success("You earned a trophy! Thanks for your feedback!", {
        ...toastStyles,
        icon: "🎉",
      });
      setLoading(false);
    } catch (e) {
      toast.error("An error occurred. Please try again later.", toastStyles);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        ...(open && {
          transform: "scale(0.9)",
        }),
        transformOrigin: "top center",
        transition: "transform 0.3s",
        display: "flex",
        height: "100vh",
        mx: "auto",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        "& .goal-task": {
          flexGrow: 1,
          px: 3,
          background: palette[2],
          overflow: "hidden",
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          width: "100%",
          display: "flex",
          maxWidth: "700px",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
    >
      <Dialog
        open={stepTwoOpen}
        onClose={() => setStepTwoOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
          },
        }}
        maxWidth="xs"
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Are you satisfied with your progress?
          </Typography>
          <Typography>
            We&apos;d love to hear your feedback so we can improve our platform!
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[
              "sentiment_dissatisfied",
              "sentiment_neutral",
              "sentiment_satisfied",
            ].map((icon) => (
              <IconButton
                key={icon}
                onClick={() => handleTrophyEarn(icon)}
                disabled={loading}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "50px",
                  }}
                >
                  {icon}
                </span>
              </IconButton>
            ))}
          </Box>
        </Box>
      </Dialog>
      <motion.div
        className="goal-task"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        {!isCompleted && (
          <Box sx={{ mt: "auto" }}>
            <Chip label={`${goal.timeOfDay}:00`} sx={{ mb: 2 }} />
            <Typography
              variant="h1"
              sx={{
                lineHeight: "85px",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              className="font-heading"
            >
              {goal.stepName}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {~~((goal.progress / goal.durationDays) * 100)}% complete
            </Typography>
          </Box>
        )}
        {isCompleted && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mt: "auto",
            }}
          >
            <Confetti
              friction={1}
              width={width}
              height={height}
              style={{
                zIndex: 1,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{
                width: 100,
                height: 100,
              }}
            >
              <picture>
                <img
                  alt="trophy"
                  src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </picture>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
              style={{
                maxWidth: "calc(100% - 20px)",
                textAlign: "center",
              }}
            >
              <Typography className="font-heading" variant="h3">
                {goal.name}
              </Typography>
              <Typography>
                After {goal.durationDays} days of hard work, you earned a
                trophy!
              </Typography>
            </motion.div>
          </Box>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: !isCompleted ? 0.1 : 1.5 }}
          style={{
            marginTop: "auto",
            width: "100%",
          }}
        >
          <Button
            sx={{
              zIndex: 999999999,
              mb: 2,
              background: palette[3],
            }}
            variant="contained"
            fullWidth
            onClick={handleNext}
            disabled={
              disabled ||
              dayjs(goal.lastCompleted).format("YYYY-MM-DD") ==
                dayjs().format("YYYY-MM-DD")
            }
          >
            {isCompleted ? "Claim" : "Done"} <Icon>east</Icon>
          </Button>
        </motion.div>
      </motion.div>
      <Box
        sx={{ mt: "auto", width: "100%", p: 1, display: "flex", zIndex: 999 }}
      >
        <GoalActivity goal={goal} open={open} setOpen={setOpen}>
          <Button sx={{ color: "#fff" }} size="small">
            <Icon>local_fire_department</Icon>
            Activity
          </Button>
        </GoalActivity>
        <ShareGoal goal={goal}>
          <IconButton sx={{ ml: "auto" }}>
            <Icon>ios_share</Icon>
          </IconButton>
        </ShareGoal>
      </Box>
    </Box>
  );
}

export default function Routine() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const { data, url, error } = useApi("user/coach");

  const [slide, setSlide] = useState(-1);

  const filteredGoals = useMemo(
    () =>
      (data || [])
        .sort((a, b) => a.timeOfDay - b.timeOfDay)
        .sort(function (x, y) {
          // true values first
          return x.completed === y.completed ? 0 : x.completed ? -1 : 1;
          // false values first
          // return (x === y)? 0 : x? 1 : -1;
        })
        .filter((goal) => !goal.completed),
    [data]
  );

  const [alreadySwitched, setAlreadySwitched] = useState(false);

  useEffect(() => {
    if (window.location.hash && data) {
      const hash = window.location.hash.replace("#", "");
      const goal = filteredGoals.find((goal) => goal.id === hash);
      if (goal) {
        setSlide(filteredGoals.indexOf(goal));
        setAlreadySwitched(true);
      } else {
        setSlide(0);
        setAlreadySwitched(true);
      }
    }
    if (data && filteredGoals[0] && !alreadySwitched && !window.location.hash) {
      setSlide(0);
      setAlreadySwitched(true);
    }
  }, [filteredGoals, data, alreadySwitched]);

  const handleNext = () =>
    setSlide((s) => (filteredGoals.length === s ? s : s + 1));
  const handlePrev = () => setSlide((s) => (s === 0 ? 0 : s - 1));

  useHotkeys("ArrowRight", handleNext);
  useHotkeys("ArrowLeft", handlePrev);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        mx: "auto",
        left: 0,
        width: "100vw",
        height: "100vh",
        background: palette[1],
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          top: 0,
          zIndex: 999999,
          gap: 0.5,
          p: 1,
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {[...new Array(filteredGoals?.length || 0)].map((_, index) => (
          <Box
            key={index}
            sx={{
              height: "2px",
              width: "100%",
              background: palette[slide === index ? 10 : index < slide ? 9 : 4],
            }}
          />
        ))}
      </Box>
      <IconButton
        onClick={() => router.push("/coach")}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          m: 2,
          mt: 3,
          zIndex: 9999,
        }}
      >
        <Icon>west</Icon>
      </IconButton>
      {slide === -1 && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          height: "100vh",
          width: "50vw",
          position: "absolute",
          right: 0,
          zIndex: 99,
          top: 0,
        }}
        onClick={handleNext}
      />
      <Box
        sx={{
          height: "100vh",
          width: "50vw",
          position: "absolute",
          left: 0,
          zIndex: 99,
          top: 0,
        }}
        onClick={handlePrev}
      />
      {filteredGoals.map(
        (goal, index) =>
          slide === index && (
            <GoalTask
              open={open}
              setOpen={setOpen}
              mutationUrl={url}
              setSlide={setSlide}
              goal={goal}
              key={goal.id}
            />
          )
      )}
      {slide >= filteredGoals?.length && (
        <motion.div
          initial={{ opacity: 0, scale: 3 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Typography variant="h1" sx={{ mb: 1 }} className="font-heading">
              All done.
            </Typography>
            <Typography sx={{ mb: 2 }}>Come back tomorrow for more.</Typography>
            <Button
              onClick={() => router.push("/coach")}
              sx={{ zIndex: 999 }}
              variant="contained"
              size="large"
            >
              <Icon>home</Icon>Done
            </Button>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
