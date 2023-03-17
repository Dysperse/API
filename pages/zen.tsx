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
  Skeleton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { TaskDrawer } from "../components/Boards/Board/Column/Task/TaskDrawer";
import { DailyCheckIn } from "../components/Zen/DailyCheckIn";
import { useApi } from "../hooks/useApi";
import { neutralizeBack, revivalBack } from "../hooks/useBackButton";
import { useSession } from "./_app";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Routines } from "../components/Coach/Routines";
import { colors } from "../lib/colors";

function RecentItems() {
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, url, error } = useApi("property/boards/recent", {
    take: trigger ? 12 : 6,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: trigger,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    emblaApi && emblaApi?.reInit();
  }, [data]);
  const session = useSession();

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mt: 3, ml: 0, mb: 1.5 }}
        className="select-none px-4 sm:px-7"
      >
        Recently edited
      </Typography>
      <Box
        className="embla px-4 sm:px-7"
        ref={emblaRef}
        sx={{
          width: "100%",
          whiteSpace: "nowrap",
          overflowX: "scroll",
          overflowY: "visible",
          mb: 2,
        }}
      >
        <div
          className="embla__container"
          style={{ gap: "15px", paddingBottom: "10px" }}
        >
          {!data && (
            <>
              {[...new Array(6)].map((_, index) => (
                <Skeleton
                  variant="rectangular"
                  height={120}
                  animation="wave"
                  sx={{
                    borderRadius: 5,
                    flex: { xs: "0 0 90%", sm: "0 0 20%" },
                  }}
                  key={index}
                />
              ))}
            </>
          )}
          {data &&
            data.map((item) => (
              <TaskDrawer id={item.id} mutationUrl={url} key={item.id}>
                <Card
                  className="shadow-sm"
                  sx={{
                    border: "1px solid",
                    borderColor: session?.user?.darkMode
                      ? "hsl(240, 11%, 20%)"
                      : "rgba(200, 200, 200, 0.3)",
                    width: "100%",
                    flex: { xs: "0 0 90%", sm: "0 0 20%" },
                    borderRadius: 5,
                  }}
                  variant="outlined"
                >
                  <CardActionArea sx={{ height: "100%" }}>
                    <CardContent sx={{ height: "100%" }}>
                      <Icon
                        sx={{
                          color:
                            colors[item.color][
                              session?.user?.darkMode ? "A400" : 700
                            ],
                        }}
                        {...(item.color === "grey" && {
                          className: "outlined",
                        })}
                      >
                        {item.pinned ? "push_pin" : "check_circle"}
                      </Icon>
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
                      {item.lastUpdated && (
                        <Chip
                          size="small"
                          sx={{ mb: 0.5 }}
                          icon={<Icon>history</Icon>}
                          label={dayjs(item.lastUpdated).fromNow()}
                        />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </TaskDrawer>
            ))}
        </div>
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
              mr: { sm: 2 },
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
            mt: { xs: 3, sm: 10 },
            mb: 4,
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
            {session?.user?.name.includes(" ")
              ? session?.user?.name.split(" ")[0]
              : session?.user?.name}
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
                  background: session?.user?.darkMode
                    ? "hsl(240, 11%, 10%)"
                    : "#fff",
                  gap: 2,
                  border: "1px solid",
                  borderColor: session?.user?.darkMode
                    ? "hsl(240, 11%, 20%)"
                    : "rgba(200, 200, 200, 0.3)",
                }}
                className="shadow-sm"
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
                className="shadow-sm"
                disableRipple={editMode}
                onClick={() => !editMode && router.push("/tasks/#/backlog")}
              >
                <Icon sx={{ ml: 1 }}>auto_mode</Icon>
                <b>Backlog</b>
              </ListItemButton>
            </Box>
          </Masonry>
        </Box>
      </Box>
      <Toolbar />
    </>
  );
}
