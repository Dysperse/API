import {
  Box,
  Button,
  CircularProgress,
  Icon,
  ListItemButton,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchRawApi, useApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { EmojiPicker } from "../../EmojiPicker";
import { Puller } from "../../Puller";
import { GoalCard } from "./GoalCard";

export function EditRoutine({ setData, editButtonRef, routine }) {
  const { data } = useApi("user/routines");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(routine.name);
  const [note, setNote] = useState(routine.note);

  const [emoji, setEmoji] = useState(routine.emoji);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const [daysOfWeek, setDaysOfWeek] = useState(routine.daysOfWeek);

  const [time, setTime] = useState(parseInt(routine.timeOfDay));

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    await fetchRawApi("user/routines/custom-routines/edit", {
      id: routine.id,
      name,
      note,
      emoji,
      daysOfWeek,
      timeOfDay: time,
    });

    const res = await fetchRawApi("user/routines/custom-routines/items", {
      id: routine.id,
    });
    setData(res[0]);
    toast.success("Saved!", toastStyles);
  };

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
        BackdropProps={{
          className: "override-bg",
          sx: {
            background: "transparent",
            backdropFilter: "blur(10px)",
          },
        }}
        PaperProps={{
          sx: {
            userSelect: "none",
            maxWidth: "600px",
            maxHeight: "90vh",
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Routine
          </Typography>
          <EmojiPicker setEmoji={setEmoji} emoji={emoji}>
            <picture>
              <img
                alt="emoji"
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
              />
            </picture>
          </EmojiPicker>
          <TextField
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            fullWidth
            margin="dense"
            label="Routine name"
            autoFocus
            placeholder="Morning routine"
          />
          <TextField
            value={note}
            onChange={(e: any) => setNote(e.target.value)}
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
            {JSON.parse(daysOfWeek).map((_, index) => (
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
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                ml: "auto",
                "&, &:hover": {
                  background: "hsl(240,11%,95%)!important",
                  color: "#000!important",
                },
              }}
            >
              Save
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Add goals
          </Typography>
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
