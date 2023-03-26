import { openSpotlight } from "@mantine/spotlight";
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
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Routines } from "../components/Coach/Routines";
import { DailyCheckIn } from "../components/Zen/DailyCheckIn";
import { RecentItems } from "../components/Zen/RecentItems";
import { useApi } from "../lib/client/useApi";
import { useSession } from "../lib/client/useSession";

export default function Home() {
  const router = useRouter();
  const session = useSession();
  const time = new Date().getHours();

  const greeting = useMemo(() => {
    if (time < 10) return "Good morning, ";
    else if (time < 14) return "Good afternoon, ";
    else if (time < 18) return "Good evening, ";
    else return "Good night, ";
  }, [time]);

  const { data } = useApi("property/boards/agenda", {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().endOf("day").toISOString(),
  });
  return (
    <>
      <Box
        sx={{
          mt: { xs: "calc(var(--navbar-height) * -1)", md: "-50px" },
          pt: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            alignItems: "center",
            pr: 2,
            gap: 1,
            height: "var(--navbar-height)",
            position: { xs: "absolute", md: "static" },
            background: session.user.darkMode
              ? "hsla(240,11%,10%, .5)"
              : "rgba(255,255,255,.5)",
            top: 0,
            backdropFilter: "blur(10px)",
            zIndex: 9,
            left: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              ml: "auto",
              mr: { sm: 2 },
            }}
          >
            <Tooltip title="Jump to" placement="bottom-start">
              <IconButton
                onClick={() => {
                  navigator.vibrate(50);
                  openSpotlight();
                }}
              >
                <Icon className="outlined">bolt</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            mt: { xs: 3, sm: 10 },
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
              textAlign: { md: "center" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
            variant="h5"
          >
            {greeting}
            <br />
            {session.user.name.includes(" ")
              ? session.user.name.split(" ")[0]
              : session.user.name}
            !
          </Typography>
        </Box>
      </Box>
      <Routines />
      <RecentItems />
      <Box className="px-4 sm:px-7">
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
                sx={{
                  px: "15px !important",
                  background: session.user.darkMode
                    ? "hsl(240, 11%, 10%)"
                    : "#fff",
                  gap: 2,
                  border: "1px solid",
                  borderColor: session.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200, 200, 200, 0.3)",
                }}
                className="shadow-sm"
                onClick={() => router.push("/tasks/#/agenda/week")}
              >
                <Icon sx={{ ml: 1 }}>task_alt</Icon>
                <ListItemText
                  primary={<b>Agenda</b>}
                  secondary={
                    data
                      ? data && data.length == 0
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
                    0 && (
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
                sx={{
                  px: "15px !important",
                  background: session.user.darkMode
                    ? "hsl(240, 11%, 10%)"
                    : "#fff",
                  gap: 2,
                  border: "1px solid",
                  borderColor: session.user.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200, 200, 200, 0.3)",
                }}
                className="shadow-sm"
                onClick={() => router.push("/tasks/#/backlog")}
              >
                <Icon sx={{ ml: 1 }}>auto_mode</Icon>
                <b>Backlog</b>
                <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
              </ListItemButton>
            </Box>
          </Masonry>
        </Box>
      </Box>
      <Toolbar />
    </>
  );
}
