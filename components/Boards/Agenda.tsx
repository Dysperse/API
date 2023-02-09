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
        background: "#fff",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
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

export function Agenda({ view }: { view: "day" | "month" | "year" }) {
  // Gets days in week
  const startOfWeek = dayjs().startOf("day");
  const endOfWeek = dayjs().add(7, "day");

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
        <Column key={day.day} day={day} />
      ))}
      <div
        style={{
          height: "100vh",
          width: "400px",
          flex: "0 0 400px",
          display: "block",
          position: "relative",
          marginLeft: "-40px",
          zIndex: -1,
        }}
      >
        <picture>
          <img
            src="https://images.unsplash.com/photo-1598438924166-6d89ca57f248?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDh8fG1vdW50YWlufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1400&q=60"
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
      </div>
    </Box>
  );
}
