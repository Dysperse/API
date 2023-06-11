import { DailyCheckIn } from "@/components/CheckIns";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Icon,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const time = new Date().getHours();
  const palette = useColor(session.themeColor, session.user.darkMode);

  const greeting = useMemo(() => {
    if (time < 12) return "Good morning.";
    else if (time < 17) return "Good afternoon.";
    else if (time < 20) return "Good evening.";
    else return "Good night.";
  }, [time]);

  const { data } = useApi("property/tasks/agenda", {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().endOf("day").toISOString(),
    count: true,
  });

  const { data: backlogData } = useApi("property/tasks/backlog", {
    count: true,
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });

  const { data: upcomingData } = useApi("property/tasks/backlog", {
    count: true,
    upcoming: true,
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });

  const listItemStyles = {
    border: "1px solid",
    borderColor: palette[3],
    background: palette[2],
    gap: 2,
    transition: "transform .2s",
    "&:active": {
      transform: "scale(.98)",
    },
    px: 3,
    py: 1.5,
  };

  return (
    <Box sx={{ ml: { sm: -1 } }}>
      <Box
        sx={{
          pt: { xs: 10, sm: 20 },
        }}
      >
        <Box
          sx={{
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography
            className="font-heading"
            sx={{
              px: { xs: 2, sm: 4 },
              fontSize: {
                xs: "60px",
                sm: "80px",
              },
              userSelect: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            variant="h4"
          >
            {greeting}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "500px",
          maxWidth: "calc(100% - 20px)",
          mx: "auto",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <DailyCheckIn />
        <Box>
          <ListItemButton
            sx={listItemStyles}
            onClick={() => router.push("/tasks/#/agenda/week")}
          >
            <ListItemText
              primary={<b>Today</b>}
              secondary={
                data
                  ? data?.length === 0
                    ? "No tasks"
                    : data &&
                      data.length -
                        data.filter((task) => task.completed).length ==
                        0
                    ? "You finished all your tasks today!"
                    : `${
                        data &&
                        data.length -
                          data.filter((task) => task.completed).length
                      } ${
                        data &&
                        data.length -
                          data.filter((task) => task.completed).length !==
                          1
                          ? "tasks"
                          : "task"
                      } left`
                  : "Loading..."
              }
            />
            {data &&
              data.length - data.filter((task) => task.completed).length == 0 &&
              data.length !== 0 && (
                <Icon
                  sx={{
                    color: green[session.user.darkMode ? "A400" : "A700"],
                    fontSize: "30px!important",
                  }}
                >
                  check_circle
                </Icon>
              )}
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </ListItemButton>
        </Box>
        <Box>
          <ListItemButton
            sx={listItemStyles}
            onClick={() => router.push("/tasks/backlog")}
          >
            <ListItemText
              primary={<b>Backlog</b>}
              secondary={`${(backlogData || []).length} unfinished task${
                (backlogData || []).length !== 1 ? "s" : ""
              }`}
            />
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </ListItemButton>
        </Box>
        <Box>
          <ListItemButton
            sx={listItemStyles}
            onClick={() => router.push("/tasks/backlog")}
          >
            <ListItemText
              primary={<b>Upcoming</b>}
              secondary={`${(upcomingData || []).length} task${
                (upcomingData || []).length !== 1 ? "s" : ""
              }`}
            />
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </ListItemButton>
        </Box>
      </Box>
      <Toolbar />
    </Box>
  );
}
