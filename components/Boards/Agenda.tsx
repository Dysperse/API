import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { colors } from "../../lib/colors";
import { CreateTask } from "./Board/Column/Task/Create";

function Column({ view, day }) {
  const subheading =
    view === "day"
      ? dayjs(day.unchanged).format("d") == dayjs().format("d")
        ? "A"
        : "A • M/d"
      : view === "week"
      ? "dddd"
      : view === "month"
      ? "YYYY"
      : "YYYY";

  const startOf =
    view === "day"
      ? "hour"
      : view === "week"
      ? "day"
      : view === "month"
      ? "month"
      : "year";

  const isPast =
    dayjs(day.unchanged).isBefore(dayjs().startOf(startOf)) &&
    day.date !== dayjs().startOf(startOf).format(day.heading);

  return (
    <Box
      sx={{
        borderRight: "1px solid",
        background: global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        borderColor: global.user.darkMode
          ? "hsl(240,11%,16%)"
          : "rgba(200,200,200,.3)",
        zIndex: 1,
        flexGrow: 1,
        flexBasis: 0,
        minWidth: "250px",
      }}
    >
      <Box
        sx={{
          color: global.user.darkMode ? "#fff" : "#000",
          borderBottom: "1px solid",
          p: 3,
          borderColor: global.user.darkMode
            ? "hsl(240,11%,16%)"
            : "rgba(200,200,200,.3)",
        }}
      >
        <Typography
          variant="h4"
          className="font-heading"
          sx={{
            fontSize: "35px",
            ...(day.date == dayjs().startOf(startOf).format(day.heading) && {
              color: "hsl(240,11%,10%)",
              background:
                colors[themeColor][global.user.darkMode ? "A200" : 800],
              px: 0.5,
              ml: -0.5,
            }),
            borderRadius: 1,
            width: "auto",
            height: 45,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...(isPast && {
              opacity: 0.5,
              textDecoration: "line-through",
            }),
            mb: 0.7,
          }}
        >
          {dayjs(day.unchanged).format(day.heading)}
        </Typography>
        <Typography sx={{ fontSize: "20px" }}>
          {dayjs(day.unchanged).format(subheading)}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <CreateTask
          isHovered={false}
          column={{ name: "" }}
          tasks={[]}
          defaultDate={day.unchanged}
          label="Set a goal"
          checkList={false}
          mutationUrl={""}
          boardId={1}
        />
      </Box>
    </Box>
  );
}

export function Agenda({ view }: { view: "day" | "week" | "month" | "year" }) {
  // Gets days in week
  let startOfWeek = dayjs().startOf(view);
  if (view === "week") {
    startOfWeek = dayjs().startOf("day").subtract(1, "day");
  }
  if (view === "day") {
    startOfWeek = dayjs().startOf("hour").subtract(1, "hour");
  }
  let endOfWeek = dayjs().endOf(view);
  if (view === "month") {
    endOfWeek = dayjs().startOf("month").add(3, "month");
  }
  if (view === "day") {
    endOfWeek = dayjs().startOf("hour").add(2, "hour");
  }
  if (view === "year") {
    endOfWeek = dayjs().startOf("year").add(3, "year");
  }
  const days: any = [];

  const e =
    view === "day"
      ? "hour"
      : view === "week"
      ? "day"
      : view === "month"
      ? "month"
      : "year";

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, e); i++) {
    const currentDay = startOfWeek.add(i, e);

    const heading =
      view === "day"
        ? "h"
        : view === "week"
        ? "D"
        : view === "month"
        ? "MMMM"
        : "YYYY";
    days.push({
      unchanged: currentDay,
      heading,
      date: currentDay.format(heading),
      day: currentDay.format("dddd"),
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {days.map((day) => (
        <Column key={day.day} day={day} view={view} />
      ))}
      <Box
        sx={{
          "&:hover": {
            filter: "blur(10px)",
          },
          transition: "all .2s",
          height: "100vh",
          width: "400px",
          flex: "0 0 400px",
          display: "block",
          position: "relative",
          marginLeft: "-40px",
        }}
      >
        <picture>
          <img
            src="https://static.timestripe.com/backgrounds/mountain-05.jpg"
            alt="banner"
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              transition: "all .2s",
              left: 0,
              height: "100%",
              objectFit: "cover",
            }}
          />
        </picture>
      </Box>
    </Box>
  );
}
