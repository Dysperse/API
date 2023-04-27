import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { lime, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchRawApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";
import { Stories } from "../../Stories";
import { RoutineEnd } from "../DailyRoutine/RoutineEnd";
import { Task } from "../DailyRoutine/Task";
import { ShareGoal } from "../Goal/ShareGoal";
import { RoutineOptions } from "./Options";

export function Routine({ isCoach = false, mutationUrl, routine }) {
  const session = useSession();
  const optionsRef: any = useRef();

  const [data, setData] = useState<null | any>(routine);
  const [loading, setLoading] = useState<boolean>(false);
  const [alreadyOpened, setAlreadyOpened] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleClick = useCallback(async () => {
    try {
      navigator.vibrate(50);
      setCurrentIndex(0);
      setLoading(true);
      const res = await fetchRawApi("user/routines/custom-routines/items", {
        id: routine.id,
      });
      setLoading(true);
      setLoading(false);
      setData(res[0]);
    } catch (e) {
      toast.error(
        "Yikes! An error occured while trying to get your routine! Please try again later.",
        toastStyles
      );
    }
  }, [routine.id]);

  useEffect(() => {
    if (window && window.location.href.includes("#/routine-")) {
      const match = window.location.hash.replace("#/routine-", "");
      if (match && routine.id === match && !alreadyOpened) {
        setAlreadyOpened(true);
        handleClick();
      }
    }
  }, [alreadyOpened, handleClick, routine.id]);

  const tasksRemaining = !data
    ? []
    : data.items
        .filter((task) => task.durationDays - task.progress > 0)
        .filter((task) => task.lastCompleted !== dayjs().format("YYYY-MM-DD"));

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const disabled = !JSON.parse(routine.daysOfWeek)[dayjs().day()];

  return (
    <>
      <RoutineOptions
        mutationUrl={mutationUrl}
        routine={routine}
        optionsRef={optionsRef}
        setData={setData}
      />
      <Stories
        onOpen={handleClick}
        overlay={
          <>
            <picture>
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${routine.emoji}.png`}
                width="35px"
                height="35px"
                alt="Emoji"
              />
            </picture>
            <Typography variant="h6">{routine.name}</Typography>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                borderTop: "1px solid",
                borderColor: "hsl(240,11%,40%,0.3)",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Button
                sx={{
                  minWidth: "unset",
                  px: 0,
                  py: 0.1,
                  whiteSpace: "nowrap",
                  color: "hsl(240,11%,90%)",
                  mr: "auto",
                }}
                size="small"
              >
                {(routine.timeOfDay + 1) % 12 || 12}
                {routine.timeOfDay >= 11 ? "PM" : "AM"}
              </Button>
              {days.map((day, index) => (
                <Button
                  key={day}
                  sx={{
                    minWidth: "unset",
                    px: 0,
                    whiteSpace: "nowrap",
                    py: 0.1,
                    color: "hsl(240,11%,90%)",
                    textTransform: "uppercase",
                    ...(JSON.parse(routine.daysOfWeek)[index] && {
                      background: "hsl(240,11%,20%)!important",
                      color: "#fff",
                    }),
                  }}
                  size="small"
                >
                  {day.split("")[0]}
                </Button>
              ))}
            </Box>
          </>
        }
        stories={
          data.items.length === 0
            ? [
                {
                  content: (
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
                      />
                      <Box sx={{ textAlign: "center", px: 3 }}>
                        <Typography gutterBottom>
                          You haven&apos;t added any goals to this routine yet
                        </Typography>
                        <Button
                          onClick={() => optionsRef?.current?.click()}
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
                    content: (
                      <Task
                        task={task}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                      />
                    ),

                    footer: (
                      <Box
                        sx={{
                          background: "hsl(240,11%,5%)",
                          mt: "auto",
                          p: 2,
                          zIndex: 999999,
                          display: "flex",
                          transition: "all .2s",
                        }}
                      >
                        <Button
                          size="small"
                          sx={{ color: "#fff", opacity: 0.6 }}
                          onClick={() => {
                            toast.dismiss();
                            toast(
                              <Typography>
                                <b>Activity</b> coming soon!
                              </Typography>,
                              toastStyles
                            );
                          }}
                        >
                          <Icon className="outlined" sx={{ mt: "-5px" }}>
                            local_fire_department
                          </Icon>
                          Activity
                        </Button>
                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            gap: 1,
                            "& .MuiIconButton-root": {
                              "&:hover": { color: "#fff!important" },
                              "&:active": {
                                background: "hsl(240,11%,10%)!important",
                              },
                            },
                          }}
                        >
                          <ShareGoal goal={task}>
                            <IconButton color="inherit" size="small">
                              <Icon>ios_share</Icon>
                            </IconButton>
                          </ShareGoal>
                          <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => optionsRef?.current?.click()}
                          >
                            <Icon className="outlined">settings</Icon>
                          </IconButton>
                        </Box>
                      </Box>
                    ),
                  };
                }),
                {
                  content: <RoutineEnd routineId={routine.id} />,
                },
              ]
        }
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        <Box
          onContextMenu={() => optionsRef?.current?.click()}
          sx={{
            ...(disabled && { opacity: 0.6 }),
            flexShrink: 0,
            borderRadius: 5,
            flex: "0 0 70px",
            gap: 0.4,
            display: "flex",
            ...(!isCoach && { flexDirection: "column" }),
            ...(isCoach && {
              width: "100%",
              flex: "0 0 auto",
            }),
            alignItems: "center",
            overflow: "hidden",
            userSelect: "none",
            p: 1,
            transition: "transform .2s",
            "&:hover": {
              background: `hsl(240, 11%, ${
                session.user.darkMode ? (isCoach ? 20 : 15) : isCoach ? 90 : 95
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
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              background: session.user.darkMode
                ? "hsla(240,11%,50%,0.2)"
                : "rgba(200,200,200,.2)",
              border: "2px solid transparent",
              ...(tasksRemaining.length === 0 && {
                borderColor: lime[session.user.darkMode ? "A400" : 800],
              }),
              ...(data.items.length === 0 && {
                borderColor: orange[session.user.darkMode ? "A200" : 800],
                background: session.user.darkMode
                  ? "hsl(240,11%,10%)"
                  : orange[isCoach ? 100 : 50],
              }),
              ...(loading && {
                transition: "border-color .2s",
                borderColor: session.user.darkMode
                  ? "hsl(240,11%,30%)"
                  : "#ccc",
              }),
              position: "relative",
            }}
          >
            {tasksRemaining.length === 0 && data.items.length !== 0 && (
              <Icon
                sx={{
                  opacity: loading ? 0 : 1,
                  color: lime[session.user.darkMode ? "A400" : 800],
                  background: session.user.darkMode
                    ? "hsl(240,11%,10%)"
                    : "hsl(240,11%,93%)",
                  borderRadius: "999px",
                  transition: "opacity .2s",
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                }}
              >
                check_circle
              </Icon>
            )}
            {data.items.length === 0 && (
              <Icon
                sx={{
                  opacity: loading ? 0 : 1,
                  color: orange[session.user.darkMode ? "A400" : 800],
                  background: session.user.darkMode
                    ? "hsl(240,11%,10%)"
                    : orange[isCoach ? 100 : 50],
                  borderRadius: "999px",
                  transition: "opacity .2s",
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                }}
              >
                error
              </Icon>
            )}
            {loading && (
              <CircularProgress
                size={60}
                thickness={1}
                disableShrink={false}
                sx={{
                  position: "absolute",
                  top: -2,
                  left: -2,
                  animationDuration: "2s",
                }}
              />
            )}
            <picture>
              <Image
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${routine.emoji}.png`}
                width={35}
                height={35}
                style={{
                  marginBottom: "-5px",
                }}
                alt="Emoji"
              />
            </picture>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                textAlign: isCoach ? "left" : "center",
                textOverflow: "ellipsis",
                fontSize: "13px",
                overflow: "hidden",
                ...(isCoach && {
                  ml: 3,
                  fontSize: "20px",
                  fontWeight: 700,
                }),
              }}
            >
              {routine.name}
            </Typography>
          </Box>
        </Box>
      </Stories>
    </>
  );
}
