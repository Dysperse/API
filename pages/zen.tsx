import { DailyCheckIn } from "@/components/CheckIns";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";

function Logo() {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="45"
      version="1"
      viewBox="0 0 375 375"
      fill={palette[4]}
    >
      <defs>
        <clipPath id="963808ace8">
          <path d="M37.5 37.5h300.75v300.75H37.5zm0 0"></path>
        </clipPath>
        <clipPath id="f8e32d0f6d">
          <path
            d="M187.875 37.5c0 83.05 67.324 150.375 150.375 150.375-83.05 0-150.375 67.324-150.375 150.375 0-83.05-67.324-150.375-150.375-150.375 83.05 0 150.375-67.324 150.375-150.375zm0 0"
            clipRule="evenodd"
          ></path>
        </clipPath>
      </defs>
      <g clipPath="url(#963808ace8)">
        <g clipPath="url(#f8e32d0f6d)">
          <path d="M338.25 37.5H37.5v300.75h300.75zm0 0"></path>
        </g>
      </g>
    </svg>
  );
}

export function Navbar({ showLogo = false }: { showLogo?: boolean }) {
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: { sm: "none" },
        },
      }}
    >
      <Logo />

      <IconButton
        sx={{ ml: "auto", color: palette[8] }}
        onClick={() => router.push("/users")}
      >
        <Icon className="outlined">group</Icon>
      </IconButton>
    </Box>
  );
}

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
      <Navbar showLogo />
      <Box
        sx={{
          pt: { xs: 5, sm: 15 },
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
            onClick={() => router.push("/tasks/agenda/week")}
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
