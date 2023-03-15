import { LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  ListItemButton,
  MenuItem,
  Select,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Stories from "react-insta-stories";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { toastStyles } from "../../../lib/useCustomTheme";
import { useSession } from "../../../pages/_app";
import { EmojiPickerModal } from "../../Boards/Board";
import { ConfirmationModal } from "../../ConfirmationModal";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
import { RoutineEnd, Task } from "../DailyRoutine";

function CreateRoutine() {
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
      const data = fetchApiWithoutHook("user/routines/custom-routines/create", {
        name,
        note,
        emoji,
        daysOfWeek,
        time,
      });
    } catch (e) {
      toast.error(
        "Yikes! An error occured while trying to create your routine! Please try again later."
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
          <Box sx={{ display: "flex", overflow: "hidden", gap: 0.5 }}>
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
                {hour == 0 ? "12" : hour}
                {hour > 12 ? "PM" : "AM"}
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
          <ConfirmationModal
            title="Are you sure you want to delete this routine?"
            question="Your progress will stay safe and your goals won't be deleted"
            callback={() => {
              toast.success("Coming soon!", toastStyles);
            }}
          >
            <ListItemButton
              sx={{
                color: red["A200"],
              }}
            >
              Delete
            </ListItemButton>
          </ConfirmationModal>
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
        <RoutineOptions routine={routine} />
        <Backdrop
          open={showIntro}
          onClick={() => setShowIntro(false)}
          sx={{
            flexDirection: "column",
            gap: 2,
            backdropFilter: "blur(10px)",
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
          <CreateRoutine />
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
