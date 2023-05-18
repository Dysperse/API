import { DailyCheckIn } from "@/components/CheckIns";
import { Routines } from "@/components/Coach/Routines";
import { openSpotlight } from "@/components/Layout/Navigation/Search";
import UserMenu from "@/components/Layout/Navigation/UserMenu";
import { RecentItems } from "@/components/Start/RecentItems";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import { Masonry } from "@mui/lab";
import {
  Box,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";

export function Navbar() {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const styles = () => {
    return {
      WebkitAppRegion: "no-drag",
      borderRadius: 94,
      p: 0.8,
      m: 0,
      color: session.user.darkMode ? "hsl(240,11%,90%)" : "#606060",
      transition: "opacity .2s",
      "&:hover": {
        background: session.user.darkMode
          ? "hsl(240,11%,15%)"
          : "rgba(200,200,200,.3)",
        color: session.user.darkMode ? "hsl(240,11%,100%)" : "#000",
      },
      "&:active": {
        background: session.user.darkMode
          ? "hsl(240,11%,20%)"
          : "rgba(200,200,200,.5)",
        transition: "none",
      },
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        mb: 2,
        alignItems: "center",
        pr: 2,
        gap: 0.5,
        height: "var(--navbar-height)",
        background: "transparent",
        position: { xs: "absolute", md: "static" },
        top: 0,
        zIndex: 9,
        left: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          ml: "auto",
          mr: { xs: 0, sm: 2 },
          gap: 0.5,
          display: "flex",
        }}
      >
        <Tooltip
          title={
            <>
              <Typography sx={{ fontWeight: 700 }}>Spotlight</Typography>
              <Typography>ctrl &bull; k</Typography>
            </>
          }
          placement="bottom-start"
        >
          <IconButton
            onClick={() => {
              vibrate(50);
              openSpotlight();
            }}
            sx={{
              display: { sm: "none" },
            }}
          >
            <Icon className="outlined">bolt</Icon>
          </IconButton>
        </Tooltip>
        {isMobile && <UserMenu styles={styles} />}
      </Box>
    </Box>
  );
}

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const time = new Date().getHours();

  const greeting = useMemo(() => {
    if (time < 12) return "Good morning, ";
    else if (time < 17) return "Good afternoon, ";
    else if (time < 20) return "Good evening, ";
    else return "Good night, ";
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

  const listItemStyles = {
    background: session.user.darkMode ? "hsl(240, 11%, 10%)" : "#fff",
    gap: 2,
    transition: "transform .2s",
    "&:active": {
      transform: "scale(.98)",
    },
    px: 3,
    py: 1.5,
    border: "1px solid",
    borderColor: session.user.darkMode
      ? "hsl(240, 11%, 20%)"
      : "rgba(200, 200, 200, 0.3)",
  };

  return (
    <Box sx={{ ml: { sm: -1 } }}>
      <Box
        sx={{
          mt: { xs: "calc(var(--navbar-height) * -1)", md: "-50px" },
          pt: 8,
        }}
      >
        <Navbar />
        <Box
          sx={{
            mt: { xs: 3, md: 5 },
            mb: 2,
          }}
        >
          <Typography
            className="font-heading"
            sx={{
              px: { xs: 2, sm: 4 },
              fontSize: {
                xs: "37px",
                sm: "50px",
              },
              userSelect: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            variant="h5"
          >
            {greeting}{" "}
            {session.user.name.includes(" ")
              ? session.user.name.split(" ")[0]
              : session.user.name}
            !
          </Typography>
        </Box>
      </Box>
      <Routines />
      <RecentItems />
      <Box sx={{ px: { xs: 2, sm: 3.5 } }}>
        <Box
          sx={{
            mr: -2,
          }}
        >
          <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
            <Box>
              <DailyCheckIn />
            </Box>
            <Box>
              <ListItemButton
                sx={listItemStyles}
                onClick={() => router.push("/tasks/#/agenda/week")}
              >
                <ListItemText
                  primary={<b>Agenda</b>}
                  secondary={
                    data
                      ? data?.length === 0
                        ? "You don't have any tasks scheduled for today"
                        : data &&
                          data.length -
                            data.filter((task) => task.completed).length ==
                            0
                        ? "Great job! You finished all your tasks today!"
                        : `You have ${
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
                          } left for today`
                      : "Loading"
                  }
                />
                {data &&
                  data.length - data.filter((task) => task.completed).length ==
                    0 &&
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
                onClick={() => router.push("/tasks/#/agenda/backlog")}
              >
                <ListItemText
                  primary={<b>Backlog</b>}
                  secondary={`${(backlogData || []).length} task${
                    (backlogData || []).length !== 1 ? "s" : ""
                  }`}
                />
                <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
              </ListItemButton>
            </Box>
          </Masonry>
        </Box>
      </Box>
      <Toolbar />
    </Box>
  );
}
