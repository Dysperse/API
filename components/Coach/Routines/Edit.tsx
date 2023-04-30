import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  ListItemButton,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchRawApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";
const EmojiPicker = dynamic(() => import("../../EmojiPicker"));

export function EditRoutine({ setData, routine }) {
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
  const session = useSession();

  return (
    <>
      <ListItemButton onClick={handleOpen} sx={{ gap: 2 }}>
        <Icon className="outlined">settings</Icon>
        Edit
      </ListItemButton>

      <SwipeableDrawer
        ModalProps={{ keepMounted: false }}
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
            height: "100vh",
            borderRadius: 0,
          },
        }}
        sx={{
          zIndex: "9999999!important",
        }}
      >
        <AppBar sx={{ mb: 5 }}>
          <Toolbar>
            <Typography sx={{ fontWeight: 700 }}>Create routine</Typography>
            <IconButton sx={{ ml: "auto" }} onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, pt: 0 }}>
          <Box sx={{ textAlign: "center" }}>
            <EmojiPicker setEmoji={setEmoji} emoji={emoji}>
              <IconButton
                sx={{
                  border: "2px dashed",
                  borderColor: `hsl(240,11%,${
                    session.user.darkMode ? 30 : 80
                  }%)`,
                  p: 2,
                }}
              >
                <picture>
                  <img
                    alt="emoji"
                    width="60px"
                    height="60px"
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 30,
                      background: `hsl(240,11%,${
                        session.user.darkMode ? 90 : 30
                      }%)`,
                      color: "#fff",
                      borderRadius: 999,
                    }}
                  >
                    <Icon>edit</Icon>
                  </Box>
                </picture>
              </IconButton>
            </EmojiPicker>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 3, opacity: 0.6, fontWeight: 700 }}
          >
            ROUTINE NAME
          </Typography>
          <TextField
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            fullWidth
            margin="dense"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: `hsl(240,11%,${session.user.darkMode ? 30 : 90}%)`,
                py: 1,
                px: 2,
                borderRadius: 3,
              },
            }}
            placeholder="Morning routine"
          />
          <Typography
            variant="body2"
            sx={{ mt: 3, opacity: 0.6, fontWeight: 700 }}
          >
            ADD A NOTE
          </Typography>
          <TextField
            value={note}
            onChange={(e: any) => setNote(e.target.value)}
            fullWidth
            margin="dense"
            multiline
            rows={4}
            placeholder="(Optional)"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: `hsl(240,11%,${session.user.darkMode ? 30 : 90}%)`,
                py: 1,
                px: 2,
                borderRadius: 3,
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{ mt: 3, opacity: 0.6, fontWeight: 700 }}
          >
            SELECT DAYS TO WORK ON
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
            {JSON.parse(daysOfWeek).map((_, index) => (
              <Button
                key={index}
                size="small"
                sx={{ px: 1, minWidth: "auto" }}
                onClick={() =>
                  setDaysOfWeek((d) => {
                    let t = JSON.parse(d);
                    t[index] = !t[index];

                    return JSON.stringify(t);
                  })
                }
                {...(JSON.parse(daysOfWeek)[index] && { variant: "contained" })}
              >
                {days[index]}
              </Button>
            ))}
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 3, opacity: 0.6, fontWeight: 700 }}
          >
            SELECT TIME TO WORK ON
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={time}
            variant="standard"
            size="small"
            onChange={handleChange}
            disableUnderline
            sx={{
              background: `hsl(240,11%,${session.user.darkMode ? 30 : 90}%)`,
              py: 1,
              px: 2,
              mt: 1,
              borderRadius: 3,
            }}
            MenuProps={{
              sx: {
                zIndex: 9999999999999,
              },
            }}
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
        </Box>
      </SwipeableDrawer>
    </>
  );
}
