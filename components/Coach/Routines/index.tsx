import {
  Backdrop,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Stories from "react-insta-stories";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { useSession } from "../../../pages/_app";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
import { RoutineEnd, Task } from "../DailyRoutine";

function RoutineOptions({ routine }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          m: 2.5,
          mt: 3,
          zIndex: 99,
          background: "transparent",
          color: "#fff!important",
        }}
      >
        <Icon>more_vert</Icon>
      </IconButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        BackdropProps={{
          className: "override-bg",
          sx: {
            backdropFilter: "blur(10px)",
            background: "transparent",
          },
        }}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            background: "hsl(240, 11%, 15%)",
            color: "hsl(240, 11%, 90%)",
            userSelect: "none",
          },
        }}
      >
        <Box
          sx={{
            "& .puller": {
              background: "hsl(240, 11%, 30%)",
            },
          }}
        >
          <Puller />
        </Box>
        <Box sx={{ p: 2, pt: 0 }}>
          <ListItemButton>Edit routine</ListItemButton>
          <ListItemButton
            sx={{
              color: red["A200"],
            }}
          >
            Delete
          </ListItemButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Routine({ routine }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<null | any>(null);
  const session = useSession();

  const handleClick = async () => {
    try {
      setCurrentIndex(0);
      setShowIntro(true);
      setLoading(true);
      const res = await fetchApiWithoutHook(
        "user/routines/custom-routines/items",
        {
          id: routine.id,
        }
      );
      setLoading(true);
      setOpen(true);
      setLoading(false);
      setData(res[0]);
      console.log(data);
      setTimeout(() => setShowIntro(false), 500);
    } catch (e) {
      toast.error(
        "Yikes! An error occured while trying to get your routine! Please try again later."
      );
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tasksRemaining = !data
    ? []
    : data.items
        .filter((task) => task.durationDays - task.progress > 0)
        .filter((task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    if (!session?.user?.darkMode)
      document
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", open ? "hsl(240,11%,10%)" : "#fff");
  }, [session, open]);

  return (
    <>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            background: "hsl(240, 11%, 10%)",
            color: "hsl(240, 11%, 90%)",
            height: "100vh",
            borderRadius: 0,
            userSelect: "none",
          },
        }}
      >
        <RoutineOptions routine={routine} />
        <Backdrop
          open={showIntro}
          onClick={() => setShowIntro(false)}
          sx={{
            flexDirection: "column",
            gap: 2,
            zIndex: 999999,
          }}
          className="override-bg"
        >
          <picture>
            <img src={routine.emoji} width="35px" height="35px" alt="Emoji" />
          </picture>
          <Typography variant="h6">{routine.name}</Typography>
        </Backdrop>
        {data && (
          <Stories
            storyContainerStyles={{
              background: "hsl(240, 11%, 10%)",
              color: "hsl(240, 11%, 80%)",
            }}
            stories={
              data.items.length == 0
                ? [
                    {
                      content: () => (
                        <Box
                          sx={{
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => setOpen(false)}
                        >
                          You haven&apos;t added any goals to this routine yet
                        </Box>
                      ),
                    },
                  ]
                : [
                    ...data.items.map((task) => {
                      return {
                        content: () => (
                          <Task
                            task={task}
                            mutationUrl={""}
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                          />
                        ),
                      };
                    }),
                    {
                      content: () => (
                        <RoutineEnd
                          handleClose={() => setOpen(false)}
                          sortedTasks={data && data.items}
                          tasksRemaining={tasksRemaining}
                          setCurrentIndex={setCurrentIndex}
                        />
                      ),
                    },
                  ]
            }
            // idk why the story doesnt pause in production but the line below works, OK?
            defaultInterval={69696969696969696969696969696969}
            width={"100%"}
            isPaused
            onStoryEnd={() => {}}
            preventDefault
            currentIndex={currentIndex}
            height={"100vh"}
          />
        )}
      </SwipeableDrawer>
      <Box
        onClick={handleClick}
        sx={{
          flexShrink: 0,
          borderRadius: 5,
          flex: "0 0 70px",
          gap: 0.4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          userSelect: "none",
          p: 1,
          transition: "transform .2s",
          "&:hover": {
            background: `hsl(240, 11%, ${session?.user?.darkMode ? 10 : 95}%)`,
          },
          "&:active": {
            transition: "none",
            transform: "scale(.95)",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 9999,
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(200,200,200,.3)",
            position: "relative",
          }}
        >
          {loading && (
            <CircularProgress
              size={60}
              thickness={1}
              disableShrink={false}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                animationDuration: "2s",
              }}
            />
          )}
          <picture>
            <img src={routine.emoji} width="35px" height="35px" alt="Emoji" />
          </picture>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              textAlign: "center",
              textOverflow: "ellipsis",
              fontSize: "13px",
              overflow: "hidden",
            }}
          >
            {routine.name}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export function Routines() {
  const { data, error } = useApi("user/routines/custom-routines");
  const loading = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        overflowX: "hidden",
        gap: 2,
        px: 2,
        mb: 2,
      }}
    >
      {[...new Array(20)].map((_, index) => (
        <Skeleton
          key={index}
          variant="circular"
          animation="wave"
          height={65}
          width={65}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
  const session = useSession();

  return (
    <Box>
      {data ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            overflowX: "hidden",
            gap: 1,
            px: 2,
            mb: 2,
          }}
        >
          {data.map((routine) => (
            <Routine routine={routine} key={routine.id} />
          ))}
          <Box
            sx={{
              flexShrink: 0,
              borderRadius: 5,
              flex: "0 0 70px",
              gap: 0.4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
              userSelect: "none",
              p: 1,
              transition: "transform .2s",
              "&:hover": {
                background: `hsl(240, 11%, ${
                  session?.user?.darkMode ? 10 : 95
                }%)`,
              },
              "&:active": {
                transition: "none",
                transform: "scale(.95)",
              },
            }}
          >
            <Box
              sx={{
                borderRadius: 9999,
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(200,200,200,.3)",
                position: "relative",
              }}
            >
              <Icon className="outlined">add_circle</Icon>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  fontSize: "13px",
                  overflow: "hidden",
                }}
              >
                Create
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        loading
      )}
      {error && (
        <ErrorHandler error="Oh no! An error occured while trying to fetch your routines! Please try again later." />
      )}
    </Box>
  );
}
