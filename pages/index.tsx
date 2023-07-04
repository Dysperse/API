import { DailyCheckIn } from "@/components/CheckIns";
import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import { GroupModal } from "@/pages/users";
import {
  Box,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export function Logo({ intensity = 4 }: any) {
  const session = useSession();

  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="45"
      version="1"
      viewBox="0 0 375 375"
      fill={palette[intensity]}
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

export function Navbar({
  showLogo = false,
  right,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
}) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        "& svg": {
          display: showLogo ? { sm: "none" } : "none",
        },
      }}
    >
      <Logo />
      {right || (
        <>
          <IconButton
            sx={{
              ml: "auto",
              color: palette[8],
              "&:active": { transform: "scale(.9)" },
              transition: "all .4s",
            }}
            onClick={openSpotlight}
          >
            <Icon className="outlined">search</Icon>
          </IconButton>
          <GroupModal list>
            <IconButton
              sx={{
                color: palette[8],
                "&:active": { transform: "scale(.9)" },
                transition: "all .4s",
              }}
              onClick={() => router.push("/users")}
            >
              <Icon className="outlined">tag</Icon>
            </IconButton>
          </GroupModal>
        </>
      )}
    </Box>
  );
}

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const time = new Date().getHours();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const getGreeting = useMemo(() => {
    if (time < 12) return "Good morning.";
    else if (time < 17) return "Good afternoon.";
    else if (time < 20) return "Good evening.";
    else return "Good afternoon.";
  }, [time]);

  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  });

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

  const { data: coachData } = useApi("user/coach");

  const completedGoals = (coachData || [])
    .filter((goal) => !goal.completed)
    .filter((goal) => goal.lastCompleted == dayjs().format("YYYY-MM-DD"));

  const completedTodaysTasks =
    data &&
    data.length - data.filter((task) => task.completed).length == 0 &&
    data.length !== 0;

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

  const completedDailyGoals =
    coachData &&
    completedGoals.length == coachData.filter((g) => !g.completed).length;

  const [isHover, setIsHover] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss A"));

  useEffect(() => {
    if (isHover) {
      setCurrentTime(dayjs().format("hh:mm:ss A"));
      const interval = setInterval(() => {
        setCurrentTime(dayjs().format("hh:mm:ss A"));
      });
      return () => clearInterval(interval);
    }
  }, [isHover]);

  const open = () => {
    vibrate(50);
    setIsHover(true);
  };
  const close = () => {
    vibrate(50);
    setIsHover(false);
  };

  return (
    <Box sx={{ ml: { sm: -1 } }}>
      {isMobile && <Navbar showLogo />}
      <Box
        sx={{
          pt: { xs: 7, sm: 23 },
        }}
      >
        <Box
          sx={{
            mb: { xs: 10, sm: 2 },
            textAlign: "center",
          }}
        >
          <Typography
            className="font-heading"
            {...(isMobile
              ? {
                  onTouchStart: open,
                  onTouchEnd: close,
                }
              : {
                  onMouseEnter: open,
                  onMouseLeave: close,
                })}
            sx={{
              px: { xs: 2, sm: 4 },
              fontSize: {
                xs: "70px",
                sm: "80px",
              },
              // whiteSpace: "nowrap",
              userSelect: "none",
              overflow: "hidden",
              background: `linear-gradient(${palette[11]}, ${palette[5]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            variant="h4"
          >
            {isHover ? currentTime : greeting}
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
        <ListItemButton
          sx={{
            ...listItemStyles,
            ...(!(dayjs().hour() >= 13) && { order: -1 }),
            ...(completedDailyGoals && { order: 1 }),
          }}
          onClick={() => router.push("/coach/routine")}
        >
          <ListItemText
            primary={<b>Daily goals</b>}
            secondary={
              coachData &&
              completedGoals.length ==
                coachData.filter((g) => !g.completed).length
                ? null
                : `Tap to ${completedGoals.length > 0 ? "resume" : "begin"}`
            }
          />
          {completedDailyGoals && (
            <Icon
              sx={{
                color: green[isDark ? "A400" : "A700"],
                fontSize: "30px!important",
              }}
            >
              check_circle
            </Icon>
          )}
          <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
        </ListItemButton>
        <ListItemButton
          sx={{ ...listItemStyles, ...(completedTodaysTasks && { order: 1 }) }}
          onClick={() => router.push("/tasks/agenda/week")}
        >
          <ListItemText
            primary={<b>Today&apos;s plan</b>}
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
                      data.length - data.filter((task) => task.completed).length
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
          {completedTodaysTasks && (
            <Icon
              sx={{
                color: green[isDark ? "A400" : "A700"],
                fontSize: "30px!important",
              }}
            >
              check_circle
            </Icon>
          )}
          <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
        </ListItemButton>
        <ListItemButton
          sx={{
            ...listItemStyles,
            ...(backlogData?.length == 0 && { order: 1 }),
          }}
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
        <ListItemButton
          sx={{
            ...listItemStyles,
            ...(upcomingData?.length == 0 && { order: 1 }),
          }}
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
      <Toolbar />
    </Box>
  );
}
