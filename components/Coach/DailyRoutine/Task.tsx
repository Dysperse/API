import { Box, Button, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { fetchRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";

export function Task({ task, currentIndex, setCurrentIndex }) {
  const [completed, setCompleted] = useState(false);

  const handleClick = useCallback(() => {
    setCompleted(true);
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
          disabled={
            completed || task.lastCompleted === dayjs().format("YYYY-MM-DD")
          }
          variant="contained"
          fullWidth
          sx={{
            "&,&:hover": { background: "hsl(240,11%,14%)!important" },
            color: "#fff!important",
          }}
          size="large"
          onClick={handleClick}
        >
          {completed || task.lastCompleted === dayjs().format("YYYY-MM-DD") ? (
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
