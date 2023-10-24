"use client";

import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import useSWR from "swr";

export default function Insights() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const { data } = useSWR([
    "property/tasks/insights",
    { email: session.user.email },
  ]);

  const tasksCompletedByDate = data
    ? (() => {
        const dateCounts = {};

        for (const task of data) {
          if (dayjs(task.completedAt).isValid()) {
            const date = dayjs(task.completedAt).format("YYYY-MM-DD");
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          }
        }

        // Convert dateCounts object into an array of objects
        const dateCountArray = Object.keys(dateCounts).map((date) => ({
          date,
          count: dateCounts[date],
        }));

        // Sort the dateCountArray by date in ascending order
        dateCountArray.sort((a, b) => a.date.localeCompare(b.date));

        return dateCountArray;
      })()
    : [];

  return data ? (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" className="font-heading">
        Insights
      </Typography>
      <Box>
        <BarChart
          xAxis={[
            {
              id: "tasks",
              data: Array.from({ length: 24 }).map((_, i) => i),
              valueFormatter: (i) =>
                Array.from({ length: 24 }, (_, index) => {
                  const hour = index % 12 || 12; // Convert 0 to 12 for 12:00 AM
                  const period = index < 12 ? "AM" : "PM";
                  return `${hour} ${period}`;
                })[i],
              scaleType: "band",
              label: "Hour",
            },
          ]}
          bottomAxis={{
            axisId: "tasks",
            // disableTicks: true,
            // tickFontSize: ,
          }}
          colors={[palette[8]]}
          series={[
            {
              data: Array.from(
                { length: 24 },
                (_, hour) =>
                  data.filter((d) => dayjs(d.completedAt).hour() === hour)
                    .length
              ),
            },
          ]}
          height={300}
        />
        <BarChart
          xAxis={[
            {
              id: "tasks",
              data: Array.from({ length: 7 }).map((_, i) => i),
              valueFormatter: (i) =>
                ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
              scaleType: "band",
              label: "Day",
            },
          ]}
          bottomAxis={{
            axisId: "tasks",
          }}
          colors={[palette[8]]}
          series={[
            {
              data: Array.from(
                { length: 7 },
                (_, hour) =>
                  data.filter((d) => dayjs(d.completedAt).day() === hour).length
              ),
            },
          ]}
          height={300}
        />
        <BarChart
          xAxis={[
            {
              id: "tasks",
              data: Array.from({ length: 12 }).map((_, i) => i),
              valueFormatter: (i) =>
                [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "June",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ][i],
              scaleType: "band",
              label: "Month",
            },
          ]}
          bottomAxis={{
            axisId: "tasks",
          }}
          colors={[palette[8]]}
          series={[
            {
              data: Array.from(
                { length: 12 },
                (_, hour) =>
                  data.filter((d) => dayjs(d.completedAt).month() === hour)
                    .length
              ),
            },
          ]}
          height={300}
        />
        <LineChart
          xAxis={[
            {
              data: tasksCompletedByDate.map((d, i) => i),
              // scaleType: "time",
              valueFormatter: (i) =>
                dayjs(tasksCompletedByDate[i].date).format("MMM D"),
            },
          ]}
          series={[
            {
              label: "Tasks completed",
              showMark: false,
              curve: "catmullRom",
              data: tasksCompletedByDate.map((d) => d.count),
            },
          ]}
          height={300}
        />
        <PieChart
          series={[
            {
              data: [
                {
                  id: 0,
                  value: data?.filter((d) => d.task.pinned).length,
                  label: "Important",
                },
                {
                  id: 1,
                  value: data?.filter((d) => !d.task.pinned).length,
                  label: "Other",
                },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </Box>
    </Box>
  ) : (
    "Loading..."
  );
}
