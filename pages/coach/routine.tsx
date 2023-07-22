import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { GoalTask } from "../../components/Coach/Goal/Task";

export default function Routine() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const { data, url } = useApi("user/coach");

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
  const [initialTouchY, setInitialTouchY] = useState<any>(null);

  const handleTouchStart = (event) =>
    setInitialTouchY(event.touches[0].clientY);

  const handleTouchEnd = (event) => {
    const currentTouchY = event.changedTouches[0].clientY;
    const touchDistance = initialTouchY - currentTouchY;
    const swipeThreshold = 1; // Adjust this value based on your requirements

    if (touchDistance > swipeThreshold)
      document.getElementById("activity")?.click();
    setInitialTouchY(null);
  };

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
