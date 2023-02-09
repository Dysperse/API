import { Box, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { CreateTask } from "./Board/Column/Task/Create";

function Column({ view, day }) {
  const isPast =
    dayjs(day.unchanged).isBefore(dayjs()) &&
    day.date !== dayjs().format("MMMM D");

  const heading =
    view === "day"
      ? "h:mm A"
      : view === "week"
      ? "MMMM D"
      : view === "month"
      ? "MMMM D"
      : "MMMM";

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
      }}
    >
      <Box
        sx={{
          color: day.date == dayjs().format("MMMM D") ? orange[800] : "#000",
          borderBottom: "1px solid",
          p: 3,
          borderColor: "rgba(200,200,200,.3)",
          ...(isPast && {
            opacity: 0.5,
          }),
        }}
      >
        <Typography
          variant="h4"
          className="font-heading"
          sx={{
            ...(isPast && {
              textDecoration: "line-through",
            }),
            mb: 0.7,
          }}
        >
          {dayjs(day.unchanged).format(heading)}
        </Typography>
        <Typography sx={{ fontSize: "20px" }}>
          {dayjs(day.unchanged).format(heading)}
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
  const startOfWeek = dayjs().startOf(view);
  const endOfWeek = dayjs().endOf(view);

  const days: any = [];

  const e =
    view === "day"
      ? "hour"
      : view === "week"
      ? "day"
      : view === "month"
      ? "week"
      : "month";

  for (let i = 0; i <= endOfWeek.diff(startOfWeek, e); i++) {
    const currentDay = startOfWeek.add(i, e);
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
        <Column key={day.day} day={day} view={view} />
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
