import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  MenuItem,
  Select,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import Stories from "react-insta-stories";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { toastStyles } from "../../../lib/useCustomTheme";
import { useSession } from "../../../pages/_app";
import { EmojiPickerModal } from "../../Boards/Board";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
import { DailyRoutine, RoutineEnd, Task } from "../DailyRoutine";

function GoalCard({ setData, routine, goal, goals }) {
  const disabled = goal.routineId;
  const included = Boolean(goals.find((g) => g.id == goal.id));
  const [added, setAdded] = useState(included);

  const handleClick = async () => {
    setAdded(!added);
    toast.error("Added goal to routine!", toastStyles);
    await fetchApiWithoutHook("user/routines/assignToRoutine", {
      id: goal.id,
      routineId: added ? routine.id : "-1",
    });

    const res = await fetchApiWithoutHook(
      "user/routines/custom-routines/items",
      {
        id: routine.id,
      }
    );
    setData(res[0]);
  };

  return (
    <Card variant="outlined" sx={{ my: 1 }} onClick={handleClick}>
      <CardActionArea
        sx={{
          ...(disabled && { opacity: 0.5 }),
          display: "flex",
          alignItems: "center",
        }}
        disabled={disabled}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 700 }}>{goal.name}</Typography>
          <Typography variant="body2">
            Last worked on {dayjs(goal.lastCompleted).fromNow()}
          </Typography>
        </CardContent>
        <Icon
          className="outlined"
          sx={{ ml: "auto", mr: 2, opacity: included ? 1 : 0 }}
        >
          {disabled ? "cancel" : "check_circle"}
        </Icon>
      </CardActionArea>
    </Card>
  );
}

function EditRoutine({ setData, editButtonRef, routine }) {
  const { data, error } = useApi("user/routines");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ListItemButton onClick={handleOpen} sx={{ gap: 2 }} ref={editButtonRef}>
        <Icon className="outlined">edit</Icon>
        Edit routine
      </ListItemButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            userSelect: "none",
            maxWidth: "600px",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6">Add goals</Typography>
          {data ? (
            data
              .filter(
                (goal) => !goal.completed && goal.progress < goal.durationDays
              )
              .map((goal) => (
                <GoalCard
                  setData={setData}
                  goal={goal}
                  key={goal.id}
                  goals={data}
                  routine={routine}
                />
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function CreateRoutine({ mutationUrl }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [emoji, setEmoji] = useState(
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2615.png"
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const [daysOfWeek, setDaysOfWeek] = useState(
    `[false, false, false, false, false, false, false]`
  );

  const [time, setTime] = useState(12);

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchApiWithoutHook("user/routines/custom-routines/create", {
        name,
        note,
        emoji,
        daysOfWeek,
        timeOfDay: time,
        time,
      });
      await mutate(mutationUrl);
      toast.success("Created routine!", toastStyles);
      handleClose();
    } catch (e) {
      toast.error(
        "Yikes! An error occured while trying to create your routine! Please try again later.",
        toastStyles
      );
    }
    setLoading(false);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
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

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            userSelect: "none",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="h6" gutterBottom>
            Create routine
          </Typography>
          <EmojiPickerModal large setEmoji={setEmoji} emoji={emoji} />
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
            label="Routine name"
            autoFocus
            placeholder="Morning routine"
          />
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            margin="dense"
            multiline
            rows={4}
            label="Click to add a note"
            placeholder="(Optional)"
          />
          <Typography sx={{ fontWeight: 700, my: 2 }}>
            What days do you want to work on this routine?
          </Typography>
          <Box sx={{ display: "flex", overflowX: "scroll", gap: 0.5 }}>
            {JSON.parse(daysOfWeek).map((day, index) => (
              <Button
                key={index}
                size="small"
                sx={{ px: 1, minWidth: "auto" }}
                onClick={() =>
                  setDaysOfWeek((d) => {
                    let t = JSON.parse(d);
                    t[index] = !t[index];
                    console.log(JSON.parse(d));
                    return JSON.stringify(t);
                  })
                }
                {...(JSON.parse(daysOfWeek)[index] && { variant: "contained" })}
              >
                {days[index]}
              </Button>
            ))}
          </Box>
          <Typography sx={{ fontWeight: 700, my: 2 }}>
            What time do you want to start this routine?
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={time}
            size="small"
            onChange={handleChange}
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour) => (
              <MenuItem value={hour} key={hour}>
                {(hour + 1) % 12 || 12}
                {hour >= 12 ? "PM" : "AM"}
              </MenuItem>
            ))}
          </Select>
          <LoadingButton
            loading={loading}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={
              name.trim() == "" ||
              JSON.parse(daysOfWeek).filter((d) => d === true).length == 0
            }
          >
            Create
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function RoutineOptions({ mutationUrl, setData, editButtonRef, routine }) {
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
        className="editTrigger"
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
            maxWidth: "300px",
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
          <EditRoutine
            routine={routine}
            editButtonRef={editButtonRef}
            setData={setData}
          />
          <ConfirmationModal
            title="Are you sure you want to delete this routine?"
            question="Your progress will stay safe and your goals won't be deleted"
            callback={async () => {
              await fetchApiWithoutHook(
                "user/routines/custom-routines/delete",
                {
                  id: routine.id,
                }
              );
              await mutate(mutationUrl);
              toast.success("Deleted!", toastStyles);
            }}
          >
            <ListItemButton
              sx={{
                color: red["A200"],
                gap: 2,
              }}
            >
              <Icon className="outlined">delete</Icon>
              Delete
            </ListItemButton>
          </ConfirmationModal>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Routine({ mutationUrl, routine }) {
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
      if (edit) {
        const tag: any = ref?.current?.querySelector(".editTrigger");
        tag?.click();
      }
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
        onClick={handleClick}
        onContextMenu={() => handleClick(true)}
        sx={{
          ...(disabled && {
            opacity: 0.6,
            pointerEvents: "none",
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

export function Routines() {
  const { data, url, error } = useApi("user/routines/custom-routines");
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

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  return (
    <Box
      ref={emblaRef}
      sx={{
        maxWidth: "100vw",
      }}
      className="embla"
    >
      {data ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            mb: 2,
          }}
        >
          <DailyRoutine />
          {[
            ...data.filter(
              (routine) => JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
            ...data.filter(
              (routine) => !JSON.parse(routine.daysOfWeek)[dayjs().day()]
            ),
          ]
            .sort((a, b) => {
              if (a.timeOfDay < b.timeOfDay) {
                return -1;
              }
              if (a.timeOfDay > b.timeOfDay) {
                return 1;
              }
              return 0;
            })
            .map((routine) => (
              <Routine routine={routine} key={routine.id} mutationUrl={url} />
            ))}
          <CreateRoutine mutationUrl={url} />
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
