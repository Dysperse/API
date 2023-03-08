import { openSpotlight } from "@mantine/spotlight";
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
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DailyRoutine } from "../components/Coach/DailyRoutine";
import { DailyCheckIn } from "../components/Zen/DailyCheckIn";
import { useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { useSession } from "./_app";

export default function Home() {
  const router = useRouter();
  const time = new Date().getHours();
  const [editMode, setEditMode] = useState<boolean>(false);
  useHotkeys("alt+e", (e) => {
    e.preventDefault();
    setEditMode((e) => !e);
  });
  const session = useSession();

  useEffect(() => {
    editMode ? neutralizeBack(() => setEditMode(false)) : revivalBack();
  });

  let greeting;
  if (time < 10) {
    greeting = "Good morning, ";
  } else if (time < 14) {
    greeting = "Good afternoon, ";
  } else if (time < 18) {
    greeting = "Good evening, ";
  } else {
    greeting = "Good night, ";
  }

  const { data, url, error } = useApi("property/boards/agenda", {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().endOf("day").toISOString(),
  });
  return (
    <>
      <div className="px-7">
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
              position: { xs: editMode ? "fixed" : "absolute", md: "static" },
              background: session?.user?.darkMode
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
              }}
            >
              <Tooltip title={editMode ? "Save" : "Edit start"}>
                <IconButton
                  sx={{
                    mr: 0.5,
                    ...(editMode && {
                      background: session?.user?.darkMode
                        ? "hsl(240,11%,25%)!important"
                        : "rgba(200,200,200,.3)!important",
                    }),
                  }}
                  onClick={() => {
                    navigator.vibrate(50);
                    setEditMode(!editMode);
                  }}
                >
                  <Icon className="outlined">
                    {editMode ? "check" : "edit"}
                  </Icon>
                </IconButton>
              </Tooltip>
              {!editMode && (
                <Tooltip title="Jump to" placement="bottom-start">
                  <IconButton
                    onClick={() => {
                      navigator.vibrate(50);
                      openSpotlight();
                    }}
                    sx={{
                      display: { md: "none" },
                    }}
                  >
                    <Icon className="outlined">bolt</Icon>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              my: 4,
              alignItems: { sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Typography
              className="font-heading"
              sx={{
                flexGrow: 1,
                fontSize: {
                  xs: "40px",
                  sm: "50px",
                },
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
              variant="h5"
            >
              {greeting}
              {session?.user?.name.includes(" ")
                ? session?.user?.name.split(" ")[0]
                : session?.user?.name}
              !
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DailyCheckIn />
          <DailyRoutine zen />
          <ListItemButton
            sx={{
              width: "100%",
              px: "15px !important",
              background: session?.user?.darkMode
                ? "hsl(240, 11%, 10%)"
                : "#fff",
              gap: 1.5,
              border: "1px solid",
              borderColor: session?.user?.darkMode
                ? "hsl(240, 11%, 20%)"
                : "rgba(200, 200, 200, 0.3)",
            }}
            className="shadow-md"
            disableRipple={editMode}
            onClick={() => !editMode && router.push("/tasks/#/agenda/week")}
          >
            <Icon>task_alt</Icon>
            <ListItemText
              primary={<b>Today&apos;s agenda</b>}
              secondary={
                !editMode && data
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
                  : !editMode && "Loading..."
              }
            />
            {data &&
              data.length - data.filter((task) => task.completed).length ==
                0 && (
                <Icon
                  sx={{
                    color: green[session?.user?.darkMode ? "A400" : "A700"],
                    fontSize: "30px!important",
                  }}
                >
                  check_circle
                </Icon>
              )}
          </ListItemButton>
        </Box>
        <Toolbar />
      </div>
    </>
  );
}
