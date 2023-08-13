import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Masonry } from "@mui/lab";
import {
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";

function hourIntTo12(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 || hour === 12 ? 12 : hour % 12;
  return `${hour12} ${period}`;
}

function Insights({ tasks }) {
  const session = useSession();

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
        tasks: tasks.filter((task) => new Date(task.due).getHours() === hour)
          .length,
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" className="font-heading" sx={{ mb: 2 }}>
        Insights
      </Typography>
      <Masonry columns={2} spacing={2}>
        <Box sx={cardStyles}>
          <Typography variant="h4" className="cont-heading">
            {hourIntTo12(mostProductiveHour.hour)}
          </Typography>
          <Typography>My most productive hour</Typography>
        </Box>
        <Box
          sx={{
            ...cardStyles,
            background: `linear-gradient(${palette[9]}, ${palette[11]})`,
            color: palette[1],
          }}
        >
          <Typography variant="h4">
            I completed{" "}
            <b>
              <u>{mostProductiveDay.tasks}</u>
            </b>{" "}
            task
            {mostProductiveDay.tasks !== 1 && "s"} on{" "}
            <b>
              <u>{dayjs(mostProductiveDay.day).format("dddd, MMMM YYYY")}</u>
            </b>
            , setting my new productivity record!
          </Typography>
        </Box>
        <Box sx={cardStyles}>
          <Typography variant="h4" className="cont-heading">
            {tasks.length}
          </Typography>
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
  );
}

export default function Page() {
  const session = useSession();
  const { data, url } = useApi("property/tasks/insights", {
    email: session.user.email,
  });
  return data ? <Insights tasks={data} /> : <CircularProgress />;
}
