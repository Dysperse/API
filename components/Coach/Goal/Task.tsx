import { ShareGoal } from "@/components/Coach/Goal/Share";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useStatusBar } from "@/lib/client/useStatusBar";
import { toastStyles } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Icon,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { GoalActivity } from "./Activity";

export function GoalTask({ goal, setSlide, mutationUrl, open, setOpen }) {
  const session = useSession();
  const { width, height } = useWindowDimensions();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [loading, setLoading] = useState<boolean>(false);
  const [stepTwoOpen, setStepTwoOpen] = useState<boolean>(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [showProgress, setShowProgress] = useState<boolean>(
    (dayjs(goal.lastCompleted).format("YYYY-MM-DD") ==
      dayjs().format("YYYY-MM-DD") &&
      goal.progress !== goal.durationDays) ||
      false
  );

  const [showProgressLoader, setShowProgressLoader] = useState(false);
  const [progressData, setProgressData] = useState<null | any>(null);

  useEffect(() => {
    fetchRawApi(session, "user/coach/goals/activity", {
      id: goal.id,
      date: dayjs().startOf("week").toISOString(),
    })
      .then((res) => {
        setProgressData(res);
        console.log(res);
      })
      .catch((err) => setProgressData("error"));
  }, [session, goal]);

  const isCompleted = goal.progress === goal.durationDays;

  useStatusBar(palette[2]);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handleNext = () => {
    if (goal.progress === goal.durationDays) {
      setStepTwoOpen(true);
    } else {
      if (goal.progress - 1 !== goal.durationDays) {
        setShowProgress(true);
        setShowProgressLoader(true);
        setTimeout(() => {
          setSlide((s) => s + 1);
        }, 2300);
        setDisabled(true);
      }
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
        height: "100dvh",
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
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
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
                height: "100dvh",
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

        {showProgress ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: !isCompleted ? 0.1 : 1.5 }}
            style={{
              marginTop: "auto",
              width: "100%",
            }}
          >
            <Typography sx={{ color: palette[8] }} gutterBottom>
              THIS WEEK
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                height: 60,
              }}
            >
              {progressData && progressData !== "error"
                ? [...new Array(7)].map((_, day) => {
                    const curr = dayjs()
                      .startOf("week")
                      .add(day, "day")
                      .format("YYYY-MM-DD");

                    const hasCompleted =
                      progressData.find(
                        (day) => dayjs(day.date).format("YYYY-MM-DD") === curr
                      ) || curr == dayjs().format("YYYY-MM-DD");

                    const isFuture = dayjs(curr).isAfter(dayjs());

                    return (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            transform: { xs: "scale(.95)", sm: "scale(1)" },
                            background: !hasCompleted ? palette[4] : palette[9],
                            color: hasCompleted ? palette[4] : palette[9],
                          }}
                        >
                          {!isFuture && (
                            <Icon>{hasCompleted ? "check" : "close"}</Icon>
                          )}
                        </Avatar>
                        <Typography sx={{ color: palette[7] }} variant="body2">
                          {days[day]}
                        </Typography>
                      </Box>
                    );
                  })
                : [...new Array(7)].map((_, day) => {
                    return (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            background: palette[4],
                          }}
                        >
                          &nbsp;
                        </Avatar>
                        <Skeleton
                          width={27}
                          height={25}
                          animation="wave"
                          variant="rectangular"
                          sx={{ background: palette[3], borderRadius: 99 }}
                        />
                      </Box>
                    );
                  })}
            </Box>
          </motion.div>
        ) : (
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
                (disabled ||
                  dayjs(goal.lastCompleted).format("YYYY-MM-DD") ==
                    dayjs().format("YYYY-MM-DD")) &&
                goal.progress !== goal.durationDays
              }
            >
              {isCompleted ? "Claim" : "Done"} <Icon>east</Icon>
            </Button>
          </motion.div>
        )}
      </motion.div>
      <Box
        sx={{
          mt: "auto",
          width: "100%",
          p: 1,
          zIndex: 999,
          maxWidth: "700px",
        }}
      >
        <AnimatePresence mode="wait">
          <Box
            key={showProgressLoader ? "1" : "0"}
            sx={{ height: "40px", overflow: "hidden" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showProgressLoader ? (
                <>
                  <div
                    className="goalBar-outer"
                    style={{
                      background: palette[4],
                    }}
                  >
                    <div
                      className="goalBar-inner"
                      style={{
                        background: palette[9],
                      }}
                    />
                  </div>
                </>
              ) : (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <GoalActivity goal={goal} open={open} setOpen={setOpen}>
                    <Button sx={{ color: "#fff" }} size="small" id="activity">
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
              )}
            </motion.div>
          </Box>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
