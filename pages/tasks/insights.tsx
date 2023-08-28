import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useMemo } from "react";
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

function Insights({ tasks }) {
  const session = useSession();
  const router = useRouter();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const cardStyles = {
    borderRadius: 5,
    background: palette[2],
    border: `1px solid ${palette[3]}`,
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
  return (
    <Box sx={{ p: { xs: 1, sm: 4 } }}>
      <IconButton onClick={() => handleBack(router)} sx={{ mb: 2 }}>
        <Icon>arrow_back_ios_new</Icon>
      </IconButton>
      <Box sx={{ p: 2 }}>
        <Typography variant="h2" className="font-heading" sx={{ mb: 4 }}>
          Insights
        </Typography>

        <Typography variant="h3" className="font-heading" sx={{ mb: 2 }}>
          Recent
        </Typography>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
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
          </Masonry>
        </Box>
        <Typography variant="h3" className="font-heading" sx={{ mt: 4, mb: 2 }}>
          Overall
        </Typography>
        <Box sx={{ mr: -2 }}>
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            {/* idk this is blocking scroll */}
            <Box sx={{ ...cardStyles, pointerEvents: "none" }}>
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
                  tickFormat={(e) =>
                    hourIntTo12(e).replace(" ", "").toLowerCase()
                  }
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
          </Masonry>
        </Box>
      </Box>
    </Box>
  );
}

export default function Page() {
  const session = useSession();
  const url = "";

  const { data } = useSWR([
    "property/tasks/insights",
    { email: session.user.email },
  ]);

  return data ? (
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }}>
      <Insights tasks={data} />
    </motion.div>
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
