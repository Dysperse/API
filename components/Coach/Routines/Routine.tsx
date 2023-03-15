import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Stories from "react-insta-stories";
import { fetchApiWithoutHook } from "../../../hooks/useApi";
import { toastStyles } from "../../../lib/useCustomTheme";
import { useSession } from "../../../pages/_app";
import { RoutineEnd, Task } from "../DailyRoutine";
import { RoutineOptions } from "./RoutineOptions";

export function Routine({ mutationUrl, routine }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<null | any>(null);
  const session = useSession();
  const ref: any = useRef();

  const handleClick = async (edit: any = false) => {
    try {
      navigator.vibrate(50);
      setCurrentIndex(0);
      setShowIntro(true);
      setLoading(true);
      if (edit) {
        const tag: any = ref?.current?.querySelector(".editTrigger");
        tag?.click();
        return;
      }

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
      setTimeout(() => setShowIntro(false), 1000);
    } catch (e) {
      toast.error(
        "Yikes! An error occured while trying to get your routine! Please try again later.",
        toastStyles
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

  const editButtonRef: any = useRef();

  const disabled = !JSON.parse(routine.daysOfWeek)[dayjs().day()];

  return (
    <>
      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          ref,
          sx: {
            background: "hsl(240, 11%, 10%)",
            color: "hsl(240, 11%, 90%)",
            overflow: "visible",
            height: "100vh",
            borderRadius: 0,
            userSelect: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: open ? "-17px" : "0px",
            transition: "all .2s",
            left: "0px",
            width: "100%",
            height: "17px",
            borderRadius: "50px 50px 0 0",
            background: "hsl(240, 11%, 10%)",
            zIndex: 999,
          }}
        ></Box>
        <RoutineOptions
          mutationUrl={mutationUrl}
          routine={routine}
          editButtonRef={editButtonRef}
          setData={setData}
        />
        <Backdrop
          open={showIntro}
          onClick={() => setShowIntro(false)}
          sx={{
            flexDirection: "column",
            gap: 2,
            backdropFilter: "blur(5px)",
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
                        >
                          <Box
                            sx={{
                              height: "100vh",
                              width: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                            onClick={() => setOpen(false)}
                          />
                          <Box sx={{ textAlign: "center" }}>
                            <Typography gutterBottom>
                              You haven&apos;t added any goals to this routine
                              yet
                            </Typography>
                            <Button
                              onClick={() => editButtonRef?.current?.click()}
                              sx={{
                                mt: 1,
                                "&, &:hover": {
                                  background: "hsl(240,11%,20%)!important",
                                  color: "#fff!important",
                                },
                              }}
                            >
                              Add a goal
                            </Button>
                          </Box>
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
                            mutate={async () => {
                              const res = await fetchApiWithoutHook(
                                "user/routines/custom-routines/items",
                                {
                                  id: routine.id,
                                }
                              );
                              setData(res[0]);
                            }}
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
        onClick={() => handleClick(false)}
        onContextMenu={() => handleClick(true)}
        sx={{
          ...(disabled && {
            opacity: 0.6,
          }),
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
