import { LoadingButton, Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
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
import { EmojiPicker } from "../../EmojiPicker";
import { Puller } from "../../Puller";
import { CreateGoal as CreateCustomGoal } from "../CreateCustomGoal";
import { categories, goals, routines } from "../goalTemplates";

function DurationPicker({ duration, setDuration }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (d) => {
    setDuration(d);
    setAnchorEl(null);
  };
  return (
    <>
      <Button size="small" variant="contained" onClick={handleClick}>
        {duration}
        <Icon className="outlined">edit</Icon>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleClose(10)}>10 days</MenuItem>
        <MenuItem onClick={() => handleClose(25)}>25 days</MenuItem>
        <MenuItem onClick={() => handleClose(50)}>50 days</MenuItem>
        <MenuItem onClick={() => handleClose(75)}>75 days</MenuItem>
        <MenuItem onClick={() => handleClose(100)}>100 days</MenuItem>
        <MenuItem onClick={() => handleClose(365)}>365 days</MenuItem>
      </Menu>
    </>
  );
}

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

  const chipStyles = {
    background: "rgba(0,0,0,0.1)",
    color: "#000",
  };

  const [open, setInfoOpen] = useState(false);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const [daysOfWeek, setDaysOfWeek] = useState(routine.daysOfWeek);
  const [routineItems, setRoutineItems] = useState(routine.items);
  const [duration, setDuration] = useState(routine.durationDays);
  const [editDays, setEditDays] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetchApiWithoutHook("user/routines/createFromTemplate", {
        name: routine.name,
        note: "",
        daysOfWeek,
        emoji: routine.emoji,
        timeOfDay: routine.timeOfDay,
        items: JSON.stringify(routineItems),
      });
      await mutate(mutationUrl);
      setLoading(false);
      setOpen(false);
    } catch (e) {
      setLoading(false);
      toast.error(
        "An error occurred while trying to set your goal. Please try again.",
        toastStyles
      );
    }
  };

  return (
    <>
      <SwipeableDrawer
        open={open}
        onOpen={() => setInfoOpen(true)}
        onClose={() => setInfoOpen(false)}
        disableSwipeToOpen
        anchor="bottom"
        ModalProps={{
          keepMounted: false,
        }}
      >
        <AppBar>
          <Toolbar>
            <IconButton onClick={() => setInfoOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "700" }}>Goal</Typography>
            <IconButton onClick={handleClick}>
              <Icon>check</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <picture>
            <img
              src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${routine.emoji}.png`}
              alt="Emoji"
            />
          </picture>
          <Typography variant="h4" className="font-heading" sx={{ mt: 2 }}>
            {routine.name}
          </Typography>
          <Box sx={{ py: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip sx={chipStyles} label="Routine" />
            <Chip sx={chipStyles} label={routine.category} />
            <Chip sx={chipStyles} label={`${routine.items.length} tasks`} />
          </Box>
          <Typography variant="h6" gutterBottom>
            When?
          </Typography>
          <Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => setEditDays(!editDays)}
            >
              {JSON.parse(daysOfWeek).filter((day) => day === true).length == 7
                ? "Every day"
                : "On certain days"}
              <Icon className="outlined">edit</Icon>
            </Button>{" "}
            &nbsp; for &nbsp;{" "}
            <DurationPicker duration={duration} setDuration={setDuration} />{" "}
            days
          </Typography>
          <Box
            sx={{
              my: 2,
              display: editDays ? "flex" : "none",
              gap: 1,
              overflowX: "scroll",
              background: "rgba(200,200,200,.3)",
              borderRadius: 4,
              p: 3,
            }}
          >
            {JSON.parse(daysOfWeek).map((day, index) => (
              <Button
                key={index}
                size="small"
                disabled={
                  JSON.parse(daysOfWeek).filter((day) => day === true).length ==
                    1 && JSON.parse(daysOfWeek)[index]
                }
                sx={{ px: 1, minWidth: "auto" }}
                onClick={() =>
                  setDaysOfWeek((d) => {
                    let t = JSON.parse(d);
                    t[index] = !t[index];
                    console.log(JSON.parse(d));
                    return JSON.stringify(t);
                  })
                }
                variant={
                  JSON.parse(daysOfWeek)[index] ? "contained" : "outlined"
                }
              >
                {days[index]}
                {JSON.parse(daysOfWeek)[index] && <Icon>check</Icon>}
              </Button>
            ))}
          </Box>
          <Typography variant="h6" sx={{ mt: 3, sm: 1 }}>
            What?
          </Typography>
          {routineItems.map((item, index) => (
            <ListItem
              sx={{
                gap: 2,
                transition: "all .2s",
                ...(item.disabled && {
                  opacity: 0.5,
                  transform: "scale(.95)",
                }),
              }}
              key={index}
            >
              <Typography
                className="font-heading"
                variant="h4"
                sx={{ flex: "0 0 40px" }}
              >
                #{index + 1}
              </Typography>
              <ListItemText primary={item.name} secondary={item.description} />
              <IconButton
                sx={{ ml: "auto" }}
                size="small"
                onClick={() =>
                  setRoutineItems(
                    routineItems.map((item1) => {
                      if (item1 === item) {
                        return {
                          ...item1,
                          disabled: item1.disabled ? false : true,
                        };
                      } else {
                        return item1;
                      }
                    })
                  )
                }
              >
                <Icon className="outlined">
                  {!item.disabled ? "check_circle" : "do_not_disturb_on"}
                </Icon>
              </IconButton>
            </ListItem>
          ))}
          <Typography variant="h6" sx={{ mt: 3, sm: 1 }}>
            About this routine
          </Typography>
          <ListItem sx={{ gap: 2, alignItems: "start" }}>
            <Icon className="outlined" sx={{ mt: 1.5 }}>
              notifications
            </Icon>
            <ListItemText
              primary="Recieve daily reminders"
              secondary="If turned on, you'll recieve daily reminders to work on this routine"
            />
          </ListItem>
          <ListItem sx={{ gap: 2, alignItems: "start" }}>
            <Icon className="outlined" sx={{ mt: 1.5 }}>
              today
            </Icon>
            <ListItemText
              primary="Have a clear path"
              secondary="You can customize this routine to fit your needs"
            />
          </ListItem>
          <ListItem sx={{ gap: 2, alignItems: "start" }}>
            <Icon className="outlined" sx={{ mt: 1.5 }}>
              eco
            </Icon>
            <ListItemText
              primary="Make small, valuable steps"
              secondary="This course is built to fit overloaded schedule of busy and successful people. Every step requires less than 1 hour of your time per day."
            />
          </ListItem>
        </Box>
      </SwipeableDrawer>

      <Box
        onClick={() => setInfoOpen(true)}
        sx={{
          background: `linear-gradient(45deg, ${colors[randomColor]["A200"]}, ${colors[randomColor]["A400"]})`,
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          pt: { xs: 15, sm: 20 },
          ...(loading && { opacity: 0.9, transform: "scale(.97)" }),
          userSelect: "none",
          color: "#000",
          transition: "all .2s",
          "&:active": {
            transform: "scale(.97)",
            transition: "none",
          },
          position: "relative",
        }}
      >
        <Chip
          size="small"
          label={"Routine"}
          icon={
            <Icon sx={{ color: "#000!important" }} className="outlined">
              wb_cloudy
            </Icon>
          }
          sx={{
            gap: 1,
            ...chipStyles,
            position: "absolute",
            top: 0,
            right: 0,
            m: 3,
            fontWeight: 700,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: { xs: 2, sm: 4 },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              mt: 2,
              "& img": {
                width: { xs: 50, sm: 100 },
                height: { xs: 50, sm: 100 },
              },
            }}
          >
            <picture>
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${routine.emoji}.png`}
                alt="Emoji"
              />
            </picture>
          </Box>
          <Box>
            <Typography
              variant="h2"
              className="font-heading"
              sx={{
                fontSize: { xs: "35px", sm: "50px" },
                mb: { xs: 2, sm: 0 },
              }}
            >
              {routine.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "100%",
                gap: 1,
                mt: 1,
              }}
            >
              <Chip sx={chipStyles} size="small" label={routine.category} />
              <Chip
                sx={chipStyles}
                size="small"
                label={`${routine.durationDays} days`}
              />
              <Chip
                sx={chipStyles}
                size="small"
                label={`${routine.items.length} tasks`}
              />
              <Chip
                sx={chipStyles}
                size="small"
                label={`Daily at ${routine.timeOfDay % 12 || 12} ${
                  routine.timeOfDay >= 12 ? "PM" : "AM"
                }`}
              />
            </Box>
          </Box>
          <Icon
            sx={{
              ml: "auto",
              flexShrink: 0,
              mt: { xs: -5, sm: 0 },
            }}
          >
            arrow_forward_ios
          </Icon>
        </Box>
      </Box>
    </>
  );
}

function ExploreGoalCard({ goal }) {
  const [loading, setLoading] = useState(false);
  const session = useSession();

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
  const [emoji, setEmoji] = useState("2615");

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
        emoji: `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`,
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
          <EmojiPicker setEmoji={setEmoji} emoji={emoji}>
            <IconButton>
              <picture>
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                />
              </picture>
            </IconButton>
          </EmojiPicker>
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
