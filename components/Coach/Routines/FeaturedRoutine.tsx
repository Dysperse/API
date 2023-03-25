import {
  AppBar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { colors } from "../../../lib/colors";
import { DurationPicker } from "./DurationPicker";

export function FeaturedRoutine({ mutationUrl, setOpen, routine }) {
  const [loading, setLoading] = useState(false);
  const [open, setInfoOpen] = useState(false);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const [daysOfWeek, setDaysOfWeek] = useState(routine.daysOfWeek);
  const [routineItems, setRoutineItems] = useState(routine.items);
  const [duration, setDuration] = useState(routine.durationDays);
  const [editDays, setEditDays] = useState(false);

  const chipStyles = { background: "rgba(0,0,0,0.1)", color: "#000" };

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

  const randomColor = useMemo(
    () => randomColors[Math.floor(Math.random() * randomColors.length)],
    [randomColors]
  );

  const handleClick = async () => {
    setLoading(true);
    try {
      alert(routine.name);
      await fetchRawApi("user/routines/createFromTemplate", {
        name: routine.name,
        note: "",
        daysOfWeek,
        emoji: routine.emoji
          .replace(".png", "")
          .replace(
            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/",
            ""
          ),
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
            <img src={routine.emoji} alt="Emoji" />
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
              <img src={routine.emoji} alt="Emoji" />
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
