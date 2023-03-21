import { LoadingButton, Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  Icon,
  IconButton,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { colors } from "../../../lib/colors";
import { useSession } from "../../../pages/_app";
import { EmojiPickerModal } from "../../Boards/Board/EmojiPickerModal";
import { Puller } from "../../Puller";
import { CreateGoal as CreateCustomGoal } from "../CreateCustomGoal";
import { categories, goals, routines } from "../goalTemplates";

function FeaturedRoutine({ mutationUrl, setOpen, routine }) {
  const [loading, setLoading] = useState(false);

  const randomColors = [
    "green",
    "red",
    "orange",
    "pink",
    "purple",
    "deepOrange",
    "blueGrey",
    "lime",
  ];
  const randomColor =
    randomColors[Math.floor(Math.random() * randomColors.length)];

  return (
    <Box
      onClick={async () => {
        setLoading(true);
        // try {
        //   await fetchApiWithoutHook("user/routines/create", {
        //     name: routine.name,
        //     stepName: routine.stepName,
        //     category: routine.category,
        //     durationDays: routine.durationDays,
        //     time: routine.time,
        //   });
        //   await mutate(mutationUrl);
        //   setLoading(false);
        //   setOpen(false);
        // } catch (e) {
        //   setLoading(false);
        //   toast.error(
        //     "An error occurred while trying to set your goal. Please try again.",
        //     toastStyles
        //   );
        // }
      }}
      sx={{
        background: `linear-gradient(45deg, ${colors[randomColor]["A200"]}, ${colors[randomColor]["A400"]})`,
        p: { xs: 3, sm: 5 },
        borderRadius: 5,
        pt: { xs: 15, sm: 20 },
        ...(loading && { opacity: 0 }),
        userSelect: "none",
        color: "#000",
        transition: "all .2s",
        "&:active": {
          transform: "scale(.97)",
          transition: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        <picture>
          <img src={routine.emoji} />
        </picture>
        <Box>
          <Typography
            variant="h2"
            className="font-heading"
            sx={{ fontSize: { xs: "40px", sm: "50px" } }}
          >
            {routine.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
            }}
          >
            <Chip label={"Routine"} />
            <Chip label={routine.category} />
            <Chip label={`${routine.durationDays} days`} />
            <Chip label={`${routine.items.length} tasks`} />
            <Chip label={`Daily at ${routine.timeOfDay}:00`} />
          </Box>
        </Box>
        <Icon
          sx={{
            ml: "auto",
            display: { xs: "none!important", sm: "unset!important" },
          }}
        >
          arrow_forward_ios
        </Icon>
      </Box>
    </Box>
  );
}

function ExploreGoalCard({ goal }) {
  return (
    <Box
      onClick={async () => {
        setLoading(true);
        try {
          await fetchApiWithoutHook("user/routines/create", {
            name: goal.name,
            stepName: goal.stepName,
            category: goal.category,
            durationDays: goal.durationDays,
            time: goal.time,
          });
          setLoading(false);
          // await mutate(mutationUrl);
        } catch (e) {
          setLoading(false);
          toast.error(
            "An error occurred while trying to set your goal. Please try again.",
            toastStyles
          );
        }
      }}
      sx={{
        ...(loading && {
          pointerEvents: "none",
          opacity: 0.5,
        }),
        background: session.user.darkMode
          ? "hsl(240,11%,20%)"
          : "rgba(200,200,200,.3)",
        borderRadius: 5,
        p: 2,
        cursor: "pointer",
        transition: "all .1s ease-in-out",
        "&:active": {
          transition: "none",
          transform: "scale(.98)",
        },
        userSelect: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: "600" }}>{goal.name}</Typography>
        <Typography variant="body2">{goal.description}</Typography>
      </Box>
      <Icon
        sx={{
          ml: "auto",
        }}
      >
        east
      </Icon>
    </Box>
  );
}

function CreateGoal() {
  const session = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const randomRoutine = routines[Math.floor(Math.random() * routines.length)];
  const shuffled = goals.sort(() => Math.random() - 0.5);

  return (
    <>
      <Drawer
        ModalProps={{
          keepMounted: false,
        }}
        open={open}
        onClose={handleClose}
        anchor="bottom"
        PaperProps={{
          sx: {
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <AppBar
          sx={{
            background: "rgba(255,255,255,.8)",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton onClick={handleClose}>
              <Icon>expand_more</Icon>
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>Explore</Typography>
            <CreateCustomGoal mutationUrl="" />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            p: { xs: 2, sm: 4 },
          }}
        >
          <FeaturedRoutine
            routine={randomRoutine}
            mutationUrl=""
            setOpen={setOpen}
          />
          <Box
            sx={{
              px: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: { xs: 2, sm: 4 },
                mt: { xs: 5, sm: 7 },
                ml: { xs: 2, sm: 0 },
                fontSize: { xs: 25, sm: 30 },
              }}
            >
              Freshly picked for you
            </Typography>
            <Box sx={{ mr: -2 }}>
              <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                {shuffled.slice(0, 6).map((goal, index) => (
                  <ExploreGoalCard key={index} goal={goal} />
                ))}
              </Masonry>
            </Box>

            {categories.map((category) => (
              <Box
                key={category}
                sx={{
                  px: { xs: 1, sm: 2 },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ mb: 4, mt: 7, fontSize: { xs: 30, sm: 30 } }}
                >
                  {category}
                </Typography>
                <Box sx={{ mr: -2 }}>
                  <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                    {shuffled
                      .filter((goal) => goal.category === category)
                      .map((goal, index) => (
                        <ExploreGoalCard key={index} goal={goal} />
                      ))}
                  </Masonry>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
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
            background: `hsl(240, 11%, ${session.user.darkMode ? 10 : 95}%)`,
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
            background: "rgba(200,200,200,.2)",
            position: "relative",
          }}
        >
          <Icon className="outlined">loupe</Icon>
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
            New goal
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export function CreateRoutine({ emblaApi, mutationUrl }) {
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
      });
      await mutate(mutationUrl);
      emblaApi?.reInit();
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

  const router = useRouter();
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
            background: `hsl(240, 11%, ${session.user.darkMode ? 10 : 95}%)`,
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
            background: "rgba(200,200,200,.2)",
            position: "relative",
          }}
        >
          <Icon className="outlined">web_stories</Icon>
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
            New routine
          </Typography>
        </Box>
      </Box>

      <CreateGoal />

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
