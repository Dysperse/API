"use client";

import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Chip,
  Icon,
  IconButton,
  NoSsr,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs from "dayjs";
import GaugeChart from "react-gauge-chart";
import toast from "react-hot-toast";

import useSWR from "swr";
import { TaskNavbar } from "../navbar";

export default function Insights() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const redPalette = useColor("red", isDark);
  const yellowPalette = useColor("yellow", isDark);
  const orangePalette = useColor("orange", isDark);
  const greenPalette = useColor("green", isDark);
  const bluePalette = useColor("blue", isDark);

  const { data } = useSWR([
    "property/tasks/insights",
    { email: session.user.email },
  ]);

  const boxStyles = {
    border: `2px solid ${palette[3]}`,
    background: palette[2],
    borderRadius: 5,
    "& .MuiTypography-root": {
      px: 2,
      pt: 2,
      mb: -3,
      color: palette[12],
      opacity: 0.6,
      textTransform: "uppercase",
      fontWeight: 900,
    },
  };

  const { data: score, error: scoreError } = useSWR([
    "property/tasks/score",
    { email: session.user.email },
  ]);

  const colors = [
    ...new Array(2).fill(redPalette[7]),
    ...new Array(3).fill(orangePalette[7]),
    ...new Array(3).fill(yellowPalette[7]),
    ...new Array(15).fill(greenPalette[7]),
    ...new Array(3).fill(bluePalette[7]),
  ];

  const tasksCompletedByDate = data
    ? (() => {
        const dateCounts = {};

        for (const task of data) {
          if (dayjs(task.completedAt).isValid() && task?.completedAt) {
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
  const gradientDefs = (
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="5%" stopColor={palette[9]} />
        <stop offset="95%" stopColor={palette[7]} />
      </linearGradient>
    </defs>
  );
  const chartHeight = 350;

  return (
    <>
      <TaskNavbar
        title="Insights"
        rightContent={
          <IconButton onClick={() => toast("Coming soon!")}>
            <Icon>ios_share</Icon>
          </IconButton>
        }
      />
      {!data ? (
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            pt: { xs: 10, sm: 5 },
            maxWidth: "100dvw",
          }}
        >
          <Box sx={{ mt: 4, mb: 2 }}>
            <Skeleton height={32} width={110.08} variant="circular" />
            <Box />
            <Skeleton
              height={50}
              sx={{ my: 2, mb: 3, width: { xs: 100, sm: 523 } }}
              width={523}
              variant="rectangular"
            />
            <Grid container spacing={2}>
              <Grid xs={12} sm={7}>
                <Skeleton height={110} width={"100%"} variant="rectangular" />
              </Grid>
              <Grid xs={12} sm={5}>
                <Skeleton height={110} width={"100%"} variant="rectangular" />
              </Grid>
              <Grid xs={12} sm={8}>
                <Skeleton height={386} width={"100%"} variant="rectangular" />
              </Grid>
              <Grid xs={12} sm={4}>
                <Skeleton height={386} width={"100%"} variant="rectangular" />
              </Grid>
              <Grid xs={12} sm={4}>
                <Skeleton height={386} width={"100%"} variant="rectangular" />
              </Grid>
              <Grid xs={12} sm={8}>
                <Skeleton height={386} width={"100%"} variant="rectangular" />
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: { xs: 3, sm: 5 },
            pt: { xs: 10, sm: 5 },
            maxWidth: "100dvw",
          }}
        >
          <Box sx={{ mt: 4, mb: 2 }}>
            <Chip label="Experimental" sx={{ mb: 0.5, ml: -0.5 }} />
            <Typography variant="h2" className="font-heading">
              Insights
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid xs={12} sm={7}>
              <Box
                sx={{
                  ...boxStyles,
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: 3, sm: 0 },
                  justifyContent: { xs: "center", sm: "start" },
                  flexDirection: { xs: "column-reverse", sm: "row" },
                }}
              >
                <Box>
                  <Typography
                    sx={{ display: "flex", gap: 1.5, alignItems: "center" }}
                  >
                    #dyspersescore
                    <Tooltip title="Your #dyspersescore is calculated on a scale of 275 based on how you complete your tasks.">
                      <Icon className="outlined">help</Icon>
                    </Tooltip>
                  </Typography>
                  <Box
                    className="font-heading"
                    sx={{ px: 2, fontSize: { xs: "50px", sm: "50px" }, mt: 2 }}
                  >
                    {~~(275 * 0.01 * (score?.percentage || 0))}
                    <span style={{ opacity: 0.6 }}> out of </span>275
                  </Box>
                </Box>
                <Box
                  sx={{
                    ml: { sm: "auto" },
                    mr: { sm: 2 },
                    mt: { xs: 3, sm: 0 },
                  }}
                >
                  <NoSsr>
                    <GaugeChart
                    
                      needleBaseColor={palette[11]}
                      needleColor={palette[11]}
                      hideText
                      style={{
                        marginBottom: "-20px",
                        width: "150px",
                      }}
                      nrOfLevels={colors.length}
                      arcPadding={0.04}
                      cornerRadius={999}
                      colors={colors}
                      arcWidth={0.3}
                      percent={score?.percentage / 100}
                    />
                  </NoSsr>
                </Box>
              </Box>
            </Grid>
            <Grid xs={12} sm={5}>
              <Box sx={{ ...boxStyles, height: "100%" }}>
                <Typography>Tasks completed</Typography>
                <Box
                  className="font-heading"
                  sx={{ px: 2, fontSize: "50px", mt: 2 }}
                >
                  {data.length}
                </Box>
              </Box>
            </Grid>
            <Grid xs={12} sm={8}>
              <Box sx={boxStyles}>
                <Typography>By hour</Typography>
                <BarChart
                  sx={{
                    "& .MuiChartsAxis-directionX .MuiChartsAxis-tickContainer:not(:nth-child(4n))":
                      {
                        opacity: 0,
                      },
                    "& .MuiBarElement-root": {
                      fill: "url('#gradient')",
                    },
                  }}
                  xAxis={[
                    {
                      id: "tasks",
                      data: Array.from({ length: 24 }).map((_, i) => i),
                      valueFormatter: (i) =>
                        Array.from({ length: 24 }, (_, index) => {
                          const hour = index % 12 || 12; // Convert 0 to 12 for 12:00 AM
                          const period = index < 12 ? "am" : "pm";
                          return `${hour}${period}`;
                        })[i],
                      scaleType: "band",
                    },
                  ]}
                  bottomAxis={{
                    axisId: "tasks",
                    disableTicks: true,
                  }}
                  colors={[palette[8]]}
                  series={[
                    {
                      data: Array.from(
                        { length: 24 },
                        (_, hour) =>
                          data.filter(
                            (d) => dayjs(d.completedAt).hour() === hour
                          ).length
                      ),
                    },
                  ]}
                  height={chartHeight}
                >
                  {gradientDefs}
                </BarChart>
              </Box>
            </Grid>
            <Grid xs={12} sm={4}>
              <Box sx={boxStyles}>
                <Typography>By day</Typography>
                <BarChart
                  sx={{
                    "& .MuiBarElement-root": {
                      fill: "url('#gradient')",
                    },
                    "& .MuiChartsAxis-directionX .MuiChartsAxis-tickContainer:not(:nth-child(2n))":
                      {
                        opacity: 0,
                      },
                  }}
                  xAxis={[
                    {
                      id: "tasks",
                      data: Array.from({ length: 7 }).map((_, i) => i),
                      valueFormatter: (i) =>
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
                      scaleType: "band",
                    },
                  ]}
                  bottomAxis={{
                    axisId: "tasks",
                    disableTicks: true,
                  }}
                  colors={[palette[8]]}
                  series={[
                    {
                      data: Array.from(
                        { length: 7 },
                        (_, hour) =>
                          data.filter(
                            (d) => dayjs(d.completedAt).day() === hour
                          ).length
                      ),
                    },
                  ]}
                  height={chartHeight}
                >
                  {gradientDefs}
                </BarChart>
              </Box>
            </Grid>
            <Grid xs={12} sm={6}>
              <Box sx={boxStyles}>
                <Typography>By month</Typography>
                <BarChart
                  sx={{
                    "& .MuiChartsAxis-directionX .MuiChartsAxis-tickContainer:not(:nth-child(2n))":
                      {
                        opacity: 0,
                      },
                    "& .MuiBarElement-root": {
                      fill: "url('#gradient')",
                    },
                  }}
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
                    },
                  ]}
                  bottomAxis={{
                    axisId: "tasks",
                    disableTicks: true,
                  }}
                  colors={[palette[8]]}
                  series={[
                    {
                      data: Array.from(
                        { length: 12 },
                        (_, hour) =>
                          data.filter(
                            (d) => dayjs(d.completedAt).month() === hour
                          ).length
                      ),
                    },
                  ]}
                  height={chartHeight}
                >
                  {gradientDefs}
                </BarChart>
              </Box>
            </Grid>
            <Grid xs={12} sm={6}>
              <Box sx={boxStyles}>
                <Typography>By date</Typography>
                <LineChart
                  sx={{
                    "& .MuiLineElement-root": {
                      stroke: "url('#gradient')",
                      strokeWidth: 4,
                    },
                  }}
                  colors={[palette[8]]}
                  xAxis={[
                    {
                      data: tasksCompletedByDate.map((d, i) => i),
                      // scaleType: "time",
                      valueFormatter: (i) =>
                        tasksCompletedByDate[i]
                          ? dayjs(tasksCompletedByDate[i].date).format("MMM D")
                          : "Now",
                    },
                  ]}
                  series={[
                    {
                      showMark: false,
                      curve: "catmullRom",
                      data: tasksCompletedByDate.map((d) => d.count),
                    },
                  ]}
                  height={chartHeight}
                >
                  {gradientDefs}
                </LineChart>
              </Box>
            </Grid>
            <Grid xs={12} sm={6}>
              <Box sx={boxStyles}>
                <Typography>By urgency</Typography>
                <PieChart
                  sx={{
                    mt: 4,
                    mb: 2,
                    "& .MuiPieArc-series-auto-generated-id:first-child": {
                      fill: "url('#gradient-1')",
                    },
                    "& .MuiPieArc-series-auto-generated-id-0:not(:first-child)":
                      {
                        fill: "url('#gradient')",
                      },
                  }}
                  colors={[palette[9], palette[11]]}
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
                >
                  {gradientDefs}
                  <defs>
                    <linearGradient
                      id="gradient-1"
                      gradientTransform="rotate(40)"
                    >
                      <stop offset="5%" stopColor={palette[7]} />
                      <stop offset="95%" stopColor={palette[6]} />
                    </linearGradient>
                  </defs>
                </PieChart>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
