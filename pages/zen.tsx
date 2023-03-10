import { openSpotlight } from "@mantine/spotlight";
import { Masonry } from "@mui/lab";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
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
import { TaskDrawer } from "../components/Boards/Board/Column/Task/TaskDrawer";
import { DailyRoutine } from "../components/Coach/DailyRoutine";
import { DailyCheckIn } from "../components/Zen/DailyCheckIn";
import { useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { useSession } from "./_app";

function RecentItems() {
  const { data, url, error } = useApi("property/boards/recent");
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, ml: 1 }}>
        Recently edited
      </Typography>
      <Box
        sx={{
          overflow: "scroll",
          display: "flex",
          gap: 2,
          mb: 2,
        }}
      >
        {data &&
          data.map((item) => (
            <TaskDrawer id={item.id} key={item.id} mutationUrl={url}>
              <Card
                sx={{ width: { xs: "90vw", sm: "300px" }, borderRadius: 5 }}
                variant="outlined"
              >
                <CardActionArea sx={{ height: "100%" }}>
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </Typography>
                    {item.due && <Chip label={dayjs(item.due).fromNow()} />}
                    {item.pinned && <Chip label="Important" />}
                  </CardContent>
                </CardActionArea>
              </Card>
            </TaskDrawer>
          ))}
      </Box>
    </>
  );
}

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
              {!editMode && (
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
              )}
            </Box>
          </Box>
          <Box
            sx={{
              mt: 15,
              mb: 10,
            }}
          >
            <Typography
              className="font-heading"
              sx={{
                fontSize: {
                  xs: "40px",
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
              {session?.user?.name.includes(" ")
                ? session?.user?.name.split(" ")[0]
                : session?.user?.name}
              !
            </Typography>
          </Box>
        </Box>
        <RecentItems />
        <Masonry columns={{ xs: 1, sm: 2 }} spacing={2}>
          <Box>
            <DailyCheckIn />
          </Box>
          <Box>
            <DailyRoutine zen />
          </Box>
          <Box>
            <ListItemButton
              sx={{
                px: "15px !important",
                background: session?.user?.darkMode
                  ? "hsl(240, 11%, 10%)"
                  : "#fff",
                gap: 2,
                border: "1px solid",
                borderColor: session?.user?.darkMode
                  ? "hsl(240, 11%, 20%)"
                  : "rgba(200, 200, 200, 0.3)",
              }}
              className="shadow-md"
              disableRipple={editMode}
              onClick={() => !editMode && router.push("/tasks/#/agenda/week")}
            >
              <Icon sx={{ ml: 1 }}>task_alt</Icon>
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
          <Box>
            <ListItemButton
              sx={{
                px: "15px !important",
                background: session?.user?.darkMode
                  ? "hsl(240, 11%, 10%)"
                  : "#fff",
                gap: 2,
                border: "1px solid",
                borderColor: session?.user?.darkMode
                  ? "hsl(240, 11%, 20%)"
                  : "rgba(200, 200, 200, 0.3)",
              }}
              className="shadow-md"
              disableRipple={editMode}
              onClick={() => !editMode && router.push("/tasks/#/backlog")}
            >
              <Icon sx={{ ml: 1 }}>auto_mode</Icon>
              <b>Backlog</b>
            </ListItemButton>
          </Box>
        </Masonry>
        <Toolbar />
      </div>
    </>
  );
}
