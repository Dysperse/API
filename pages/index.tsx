import { DailyCheckIn } from "@/components/CheckIns";
import { openSpotlight } from "@/components/Layout/Navigation/Search";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Button,
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
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { GroupModal } from "../components/Group/GroupModal";

export function Logo({ intensity = 4, size = 45 }: any) {
  const session = useSession();

  const palette = useColor(
    session?.themeColor || "violet",
    useDarkMode(session?.darkMode || "system")
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
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
  showRightContent = false,
}: {
  showLogo?: boolean;
  right?: JSX.Element;
  showRightContent?: boolean;
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
      {right}
      {(!right || showRightContent) && (
        <>
          <IconButton
            sx={{
              ml: showRightContent ? "" : "auto",
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
    else return "Good night.";
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
    .filter(
      (goal) =>
        dayjs(goal.lastCompleted).format("YYYY-MM-DD") ==
        dayjs().format("YYYY-MM-DD")
    );

  const completedTodaysTasks =
    data &&
    data.length - data.filter((task) => task.completed).length == 0 &&
    data.length !== 0;

  const listItemStyles = {
    background: palette[2],
    "&:hover": {
      background: palette[3],
    },
    gap: 2,
    transition: "transform .2s",
    "&:active": {
      background: palette[3],
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
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }}>
        {isMobile && <Navbar showLogo />}
      </motion.div>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <Box
          sx={{
            pt: { xs: 7, sm: 23 },
          }}
        >
          <Box
            sx={{
              mb: { xs: 3, sm: 5 },
              px: { xs: 4, sm: 6 },
              textAlign: { sm: "center" },
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
                fontSize: {
                  xs: "15vw",
                  sm: "80px",
                },
                background: `linear-gradient(${palette[11]}, ${palette[5]})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                userSelect: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              variant="h4"
            >
              {isHover ? currentTime : greeting}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, color: palette[8] }}
              variant="h6"
            >
              {dayjs().format("MMMM D")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "500px",
            maxWidth: "calc(100% - 40px)",
            mx: "auto",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            fullWidth
            sx={{ px: 2, mb: 2, justifyContent: "start" }}
            onClick={() => openSpotlight()}
            variant="contained"
            size="large"
          >
            <Icon>bolt</Icon>
            Jump to
          </Button>

          <DailyCheckIn />
          <ListItemButton
            sx={{
              ...listItemStyles,
            }}
            onClick={() => router.push("/coach/routine")}
          >
            <ListItemText
              primary={<b>Goals</b>}
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
            sx={{
              ...listItemStyles,
            }}
            onClick={() => router.push("/tasks/agenda/weeks")}
          >
            <ListItemText
              primary={<b>Agenda</b>}
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
        </Box>
        <Toolbar />
      </motion.div>
    </Box>
  );
}
