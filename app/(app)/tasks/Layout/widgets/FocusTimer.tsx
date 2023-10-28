import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { cloneElement, useCallback, useEffect, useMemo, useState } from "react";

export function FocusTimer({ children }) {
  const { session } = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      padding: 2,
      width: 200,
      height: 200,
      borderRadius: 999,
      background: palette[3],
      backdropFilter: "blur(10px)",
      boxShadow: `0 0 0 5px inset ${palette[4]}`,
    },
    dragHandle: {
      cursor: "move",
    },
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [timeInMinutes, setTimeInMinutes] = useState(25);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<any>(null);
  const [pausedTime, setPausedTime] = useState<any>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerDone, setIsTimerDone] = useState(false);

  const trigger = cloneElement(children, {
    onClick: () => setOpen((s) => !s),
    ...(open && { "data-active": true }),
  });

  const alarmAudio = useMemo(() => new Audio("/sfx/alarm_gentle.wav"), []);

  const handleTimerComplete = useCallback(() => {
    setIsTimerDone(true);
    setIsTimerRunning(false);
    setStartTime(0);
    setElapsedTime(0);
    setIsTimerPaused(false);
    setPausedTime(0);
    alarmAudio.play();
  }, [alarmAudio]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeSelect = (time) => {
    setTimeInMinutes(time);
    handleMenuClose();
  };

  const handleStartTimer = () => {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    setStartTime(Date.now());
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    if (isTimerRunning) {
      setIsTimerPaused(true);
      setPausedTime(Date.now() - startTime);
      setIsTimerRunning(false);
    }
  };

  const handleResumeTimer = () => {
    if (isTimerPaused) {
      setIsTimerPaused(false);
      setStartTime(Date.now() - pausedTime);
      setIsTimerRunning(true);
    }
  };
  const timerValue = Math.max(0, timeInMinutes * 60 * 1000 - elapsedTime);
  const minutes = Math.floor(timerValue / 60000);
  const seconds = Math.floor((timerValue % 60000) / 1000);

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setStartTime(0);
    setElapsedTime(0);
    setIsTimerPaused(false);
    setPausedTime(0);

    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  };

  const updateElapsedTime = useCallback(() => {
    if (isTimerRunning) {
      const currentTime = Date.now();
      const diff = currentTime - startTime;
      setElapsedTime(diff);

      if (timerValue <= 0) {
        handleTimerComplete();
      }
    }
  }, [handleTimerComplete, startTime, isTimerRunning, timerValue]);

  useEffect(() => {
    if (isTimerRunning) {
      const animationFrameId = requestAnimationFrame(updateElapsedTime);
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isTimerRunning, updateElapsedTime]);

  return (
    <>
      {trigger}
      {!open ? (
        <></>
      ) : (
        <Box>
          <Box
            className="drag-widget"
            sx={{
              position: "fixed",
              display: "none",
              ".priorityMode &": {
                display: "block",
              },
              zIndex: 999,
              "& #close": {
                display: "none",
              },
              "&:hover #close": {
                display: "flex",
              },
            }}
          >
            <IconButton
              onClick={() => {
                setOpen(false);
                handleStopTimer();
              }}
              id="close"
              sx={{
                position: "absolute",
                top: 0,
                background: palette[3],
                right: 0,
                mt: -2,
                zIndex: 999999999999999,
                mr: -1,
              }}
              size="small"
            >
              <Icon>close</Icon>
            </IconButton>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Box id="focus-timer" sx={styles.container}>
                {isTimerDone ? (
                  <>
                    <Typography className="font-heading" variant="h3">
                      Time&apos;s up!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setIsTimerDone(false);
                      }}
                    >
                      <Icon>stop</Icon>
                    </Button>
                  </>
                ) : (
                  <>
                    <CircularProgress
                      variant="determinate"
                      value={(timerValue / (timeInMinutes * 60 * 1000)) * 100}
                      size={200}
                      thickness={1}
                      sx={{
                        position: "absolute",
                        top: 0,
                        "&, & *": {
                          transition: "none!important",
                        },
                        left: 0,
                      }}
                    />
                    <Typography variant="h2" className="font-heading">
                      {minutes.toString().padStart(2, "0")}:
                      {seconds.toString().padStart(2, "0")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Menu
                        sx={{ zIndex: 999999 }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        {[1, 5, 10, 15, 20, 25, 30, 45, 60].map((m) => (
                          <MenuItem
                            onClick={() => handleTimeSelect(m)}
                            key={m}
                            selected={timeInMinutes == m}
                          >
                            {m} minute{m !== 1 && "s"}
                          </MenuItem>
                        ))}
                      </Menu>
                      {startTime > 0 ? (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={
                            isTimerPaused ? handleResumeTimer : handlePauseTimer
                          }
                        >
                          <Icon>{!isTimerPaused ? "pause" : "play_arrow"}</Icon>
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleMenuOpen}
                        >
                          <Icon>expand_more</Icon>
                        </Button>
                      )}
                      {(isTimerPaused || !isTimerRunning) && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={
                            isTimerPaused ? handleStopTimer : handleStartTimer
                          }
                        >
                          <Icon>{isTimerPaused ? "stop" : "play_arrow"}</Icon>
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            </motion.div>
          </Box>
        </Box>
      )}
    </>
  );
}
