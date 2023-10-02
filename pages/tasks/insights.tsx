import { TasksLayout } from "@/components/Tasks/Layout";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import useSWR from "swr";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";

function hourIntTo12(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 || hour === 12 ? 12 : hour % 12;
  return `${hour12} ${period}`;
}

function calculatePercentImprovement(prevCount, currentCount) {
  if (prevCount === 0) {
    return currentCount === 0 ? "0%" : "+100%";
  }
  const improvement = ((currentCount - prevCount) / prevCount) * 100;
  return improvement >= 0
    ? `+${improvement.toFixed(2)}%`
    : `${improvement.toFixed(2)}%`;
}

function getTasksCompletedInRange(tasks, days) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const tasksCompletedInRange = tasks.filter(
    (task) =>
      new Date(task.completedAt) >= startDate &&
      new Date(task.completedAt) <= endDate
  );

  return tasksCompletedInRange;
}

function Insights({ profile, tasks, defaultPalette }) {
  const { session } = useSession();
  const router = useRouter();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(defaultPalette || session.themeColor, isDark);

  const cardStyles = {
    borderRadius: 5,
    border: `2px solid ${palette[3]}`,
    p: 2,
  };

  const hours = useMemo(
    () =>
      [...Array(24)].map((_, hour) => ({
        hour,
        tasks: tasks.filter(
          (task) => new Date(task.completedAt).getHours() === hour
        ).length,
      })),
    [tasks]
  );

  const mostProductiveHour = hours.reduce((maxHour, currentHour) =>
    currentHour.tasks > maxHour.tasks ? currentHour : maxHour
  );

  const mostProductiveDay = Object.entries(
    tasks.reduce((acc, task) => {
      const date = new Date(task.completedAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).reduce(
    (max, [date, tasks]: any) =>
      (tasks > max.tasks ? { day: date, tasks } : max) as any,
    { day: null, tasks: 0 }
  );

  const priorityPercentage = useMemo(
    () => (tasks.filter((t) => t.pinned).length / tasks.length) * 100,
    [tasks]
  );

  const isMobile = useMediaQuery("(max-width:600px)");

  const children1 = (
    <>
      <Box sx={cardStyles}>
        <Typography
          variant="body2"
          sx={{ color: palette[11], fontWeight: 900 }}
        >
          TODAY
        </Typography>
        <Typography variant="h4">
          {getTasksCompletedInRange(tasks, 1).length} tasks
        </Typography>
        <Typography>
          {calculatePercentImprovement(
            getTasksCompletedInRange(tasks, 2).length -
              getTasksCompletedInRange(tasks, 1).length,
            getTasksCompletedInRange(tasks, 1).length
          )}{" "}
          compared to yesterday
        </Typography>
      </Box>
      <Box sx={cardStyles}>
        <Typography
          variant="body2"
          sx={{ color: palette[11], fontWeight: 900 }}
        >
          THIS WEEK
        </Typography>
        <Typography variant="h4">
          {getTasksCompletedInRange(tasks, 7).length} tasks
        </Typography>
        <Typography>
          {calculatePercentImprovement(
            getTasksCompletedInRange(tasks, 14).length -
              getTasksCompletedInRange(tasks, 7).length,
            getTasksCompletedInRange(tasks, 7).length
          )}{" "}
          compared to last week
        </Typography>
      </Box>
    </>
  );

  const children2 = (
    <>
      <Box sx={{ ...cardStyles, pointerEvents: "none!important" }}>
        <VictoryChart
          padding={{
            left: 5,
            right: 5,
            bottom: isMobile ? 20 : 17,
          }}
          theme={{
            axis: {
              style: {
                tickLabels: {
                  fill: palette[12],
                },
              },
            },
          }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: palette[8] },
              axisLabel: { fontSize: 20, padding: 30 },
              grid: {
                stroke: palette[6],
              },
              ticks: { stroke: palette[6], size: 5 },
              tickLabels: {
                fontSize: isMobile ? 15 : 11,
                padding: 5,
              },
            }}
            tickCount={isMobile ? 6 : 12}
            tickFormat={(e) => hourIntTo12(e).replace(" ", "").toLowerCase()}
          />
          <VictoryBar
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            style={{ data: { fill: palette[11] } }}
            data={hours}
            x="hours"
            y="tasks"
          />
        </VictoryChart>
      </Box>
      <Box sx={cardStyles}>
        <Typography variant="h4">
          {hourIntTo12(mostProductiveHour.hour)}
        </Typography>
        <Typography>
          My most productive hour &bull; {mostProductiveHour.tasks} task
          {mostProductiveHour.tasks !== 1 && "s"}
        </Typography>
      </Box>
      <Box
        sx={{
          ...cardStyles,
          background: `linear-gradient(${palette[9]}, ${palette[11]})`,
          color: palette[1],
        }}
      >
        <Typography variant="h4">
          <b>{mostProductiveDay.tasks}</b> task
          {mostProductiveDay.tasks !== 1 && "s"}
        </Typography>
        <Typography>
          Most productive day &bull;{" "}
          <b>
            <u>{dayjs(mostProductiveDay.day).format("MMMM Do, YYYY")}</u>
          </b>
        </Typography>
      </Box>
      <Box sx={cardStyles}>
        <Typography variant="h4">{tasks.length}</Typography>
        <Typography>Task{tasks.length !== 1 && "s"} completed</Typography>
        <LinearProgress
          sx={{ my: 1, borderRadius: 999 }}
          variant="determinate"
          value={priorityPercentage}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            size="small"
            label={tasks.filter((t) => t.pinned).length + " priority"}
          />
          <Chip
            size="small"
            sx={{ ml: "auto" }}
            label={tasks.filter((t) => !t.pinned).length + " other"}
          />
        </Box>
      </Box>
    </>
  );
  const InsightsContainer: any = profile ? React.Fragment : Box;

  return tasks.length === 0 ? (
    <Box sx={{ py: 2, maxWidth: "100dvw", overflowX: "hidden" }}>
      <Box
        sx={{
          background: palette[2],
          p: 2,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f914.png`}
          alt="Crying emoji"
          width={40}
          style={{ flexShrink: 0 }}
        />
        Not enough task data to provide insights - check back later!
      </Box>
    </Box>
  ) : (
    <InsightsContainer
      sx={{
        p: profile ? 0 : { xs: 3, sm: 4 },
        maxWidth: "100dvw",
        overflowX: "hidden",
      }}
    >
      {!profile && (
        <Typography variant="h2" className="font-heading" sx={{ mb: 4, mt: 3 }}>
          Insights
        </Typography>
      )}

      {!profile && (
        <Typography variant="h3" className="font-heading" sx={{ mb: 2 }}>
          Recent
        </Typography>
      )}
      {profile ? (
        children1
      ) : (
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {children1}
          </Masonry>
        </Box>
      )}
      {!profile && (
        <Typography variant="h3" className="font-heading" sx={{ mt: 4, mb: 2 }}>
          Overall
        </Typography>
      )}
      {profile ? (
        children2
      ) : (
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {children2}
          </Masonry>
        </Box>
      )}
    </InsightsContainer>
  );
}

export default function Page({ email, profile = false, palette }) {
  const { session } = useSession();
  const { data } = useSWR([
    "property/tasks/insights",
    { email: email || session.user.email },
  ]);

  const c = (
    <Insights tasks={data} profile={profile} defaultPalette={palette} />
  );

  return data ? (
    profile ? (
      c
    ) : (
      <TasksLayout>
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          style={{
            maxWidth: "100dvw",
            overflowX: "hidden",
          }}
        >
          {c}
        </motion.div>
      </TasksLayout>
    )
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
