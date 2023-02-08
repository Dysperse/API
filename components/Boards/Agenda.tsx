import { Box, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import dayjs from "dayjs";

function Column({ day }) {
  const isPast =
    dayjs(day.unchanged).isBefore(dayjs()) &&
    day.date !== dayjs().format("MMMM D");

  return (
    <Box
      sx={{
        borderRight: "1px solid",
        borderColor: "rgba(200,200,200,.3)",
        flexGrow: 1,
        flexBasis: 0,
        minWidth: "300px",
        p: 3,
        ...(isPast && {
          opacity: 0.5,
        }),
      }}
    >
      <Box
        sx={{
          color: day.date == dayjs().format("MMMM D") ? orange[800] : "#000",
        }}
      >
        <Typography
          variant="h4"
          className="font-heading"
          sx={{
            ...(isPast && {
              textDecoration: "line-through",
            }),
            mb: 0.5,
          }}
        >
          {day.day}
        </Typography>
        <Typography sx={{ fontSize: "20px" }}>{day.date}</Typography>
      </Box>
    </Box>
  );
}

export function Agenda() {
  // Gets days in week
  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  const days: any = [];

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, "day"); i++) {
    const currentDay = startOfWeek.add(i, "day");
    days.push({
      unchanged: currentDay,
      date: currentDay.format("MMMM D"),
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
        <Column day={day} />
      ))}
    </Box>
  );
}
