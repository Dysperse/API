import { Box, Button, Chip, Icon, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { fetchRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { ShareGoal } from "../Goal/ShareGoal";

export function Task({ task, currentIndex, setCurrentIndex }) {
  const handleClick = useCallback(() => {
    setCurrentIndex((index) => index + 1);
    fetchRawApi("user/routines/markAsDone", {
      date: dayjs().format("YYYY-MM-DD"),
      progress:
        task.progress && parseInt(task.progress)
          ? task.progress + 1 > task.durationDays
            ? task.durationDays
            : task.progress + 1
          : 1,
      id: task.id,
    }).catch(() =>
      toast.error(
        "Yikes! Something went wrong while trying to mark your routine as done",
        toastStyles
      )
    );
  }, [task.durationDays, task.id, task.progress, setCurrentIndex]);

  return (
    <Box sx={{ p: 4 }}>
      <ShareGoal goal={task}>
        <IconButton
          sx={{
            position: "absolute",
            top: 23,
            zIndex: 9999,
            right: 60,
            "&, & *": {
              color: "#fff",
            },
            "&:active": {
              background: "hsl(240,11%,14%)",
            },
          }}
        >
          <Icon>ios_share</Icon>
        </IconButton>
      </ShareGoal>
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onClick={() =>
          setCurrentIndex(() => (currentIndex === 0 ? 0 : currentIndex - 1))
        }
      />
      <Box
        sx={{
          height: "100vh",
          width: "50%",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => setCurrentIndex(() => currentIndex + 1)}
      />
      <Typography variant="h2" className="font-heading" gutterBottom>
        {task.stepName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          my: 2,
          "& .MuiChip-root": {
            background: "hsl(240,11%,20%)!important",
            color: "hsl(240,11%,90%)!important",
          },
        }}
      >
        <Chip label={task.category} size="small" />
        <Chip
          size="small"
          label={`${~~((task.progress / task.durationDays) * 100)}% complete`}
        />
        <Chip
          size="small"
          label={
            task.time === "any"
              ? "Daily"
              : task.time === "morning"
              ? "Every morning"
              : task.time === "afternoon"
              ? "Every afternoon"
              : task.time === "evening"
              ? "Every evening"
              : "Nightly"
          }
        />
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          left: 0,
          gap: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
          pb: 2,
        }}
      >
        <Button
          disabled={task.lastCompleted === dayjs().format("YYYY-MM-DD")}
          variant="contained"
          fullWidth
          sx={{
            "&,&:hover": { background: "hsl(240,11%,14%)!important" },
            color: "#fff!important",
          }}
          size="large"
          onClick={handleClick}
        >
          {task.lastCompleted === dayjs().format("YYYY-MM-DD") ? (
            <>
              <span>🔥</span> Completed today!
            </>
          ) : (
            <>
              <span>🎯</span> I worked towards it!
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}
