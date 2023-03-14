import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { CircularProgressProps } from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import Head from "next/head";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { DailyRoutine } from "../components/Coach/DailyRoutine";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";
import { fetchApiWithoutHook } from "../hooks/useApi";
import { toastStyles } from "../lib/useCustomTheme";
import { useSession } from "./_app";

export function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  const session = useSession();

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        size={40}
        sx={{
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
            color:
              session && session?.user && session?.user?.darkMode
                ? "#fff"
                : "#000",
            transition: "all .2s",
            strokeWidth: props.value === 100 ? 1 : 2,
            width: 100,
            height: 100,
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className={
            props.value === 100
              ? "material-symbols-rounded"
              : "material-symbols-outlined"
          }
        >
          {props.value === 100 ? "celebration" : "play_arrow"}
        </span>
      </Box>
    </Box>
  );
}

export const Task: any = React.memo(function Task({ task }: any) {
  const [checked, setChecked] = React.useState(
    task.lastCompleted === dayjs().format("YYYY-MM-DD")
  );

  const handleClick = React.useCallback(() => {
    setLoading(true);
    fetchApiWithoutHook("user/routines/markAsDone", {
      date: dayjs().format("YYYY-MM-DD"),
      progress:
        task.progress && parseInt(task.progress)
          ? task.progress + 1 > task.durationDays
            ? task.durationDays
            : task.progress + 1
          : 1,
      id: task.id,
    })
      .then(() => {
        setChecked(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error(
          "Something went wrong while trying to mark your routine as done.",
          toastStyles
        );
      });
  }, [task.durationDays, task.id, task.progress]);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Box className="flex items-center" sx={{ mb: 2, gap: 1 }}>
      <Box
        sx={{
          alignSelf: "flex-start",
        }}
      >
        <Box className="relative">
          <Box
            sx={{
              opacity: loading ? 1 : 0,
              visibility: loading ? "visible" : "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <CircularProgress size={20} />
          </Box>
          <Checkbox
            disableRipple
            disabled={checked}
            onClick={handleClick}
            checked={checked}
            sx={{
              ...(loading && { opacity: 0.2, filter: "blur(1px)" }),
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 0.3,
          textDecoration: checked ? "line-through" : "none",
          opacity: checked ? 0.5 : 1,
        }}
      >
        <Typography variant="h6">{task.stepName}</Typography>
        <Typography variant="body2">
          {task.name} &bull; {task.durationDays - task.progress} days left
          &bull;{" "}
          {task.time === "any"
            ? "Daily"
            : task.time === "morning"
            ? "Every morning"
            : task.time === "afternoon"
            ? "Every afternoon"
            : task.time === "evening"
            ? "Every evening"
            : "Nighly"}
        </Typography>
      </Box>
    </Box>
  );
});

export default function Render() {
  const time = new Date().getHours();

  const [hideRoutine, setHideRoutine] = useState<boolean>(false);
  return (
    <Box sx={{ position: "relative" }}>
      <Head>
        <title>Coach &bull; Dysperse</title>
      </Head>
      <Box
        className="mt-5 sm:mt-10 "
        sx={{
          pb: 3,
        }}
      >
        <Routines />
        <Box className="flex max-w-[100vw] flex-col gap-5 p-3 px-6 pt-2 sm:flex-row">
          {!hideRoutine && (
            <h1 className="font-heading my-3 text-4xl font-light underline">
              My goals
            </h1>
          )}
          {!hideRoutine && <DailyRoutine />}
        </Box>
        <Box className="max-w-[100vw] p-3 px-6 pt-0">
          <MyGoals setHideRoutine={setHideRoutine} />
          {!hideRoutine && (
            <Alert severity="info" icon="🔥" sx={{ mb: 15 }}>
              Your goals are only visible to you
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}
