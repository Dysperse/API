import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../../../lib/client/useApi";
import { useSession } from "../../../../lib/client/useSession";
import { toastStyles } from "../../../../lib/client/useTheme";
import { EmojiPicker } from "../../../EmojiPicker";
import { CreateGoal } from "../../Goal/Create";

export function CreateRoutine({ buttonRef, isCoach, mutationUrl }) {
  const session = useSession();
  const titleRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("2615");
  const [time, setTime] = useState(12);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => titleRef?.current?.focus(), 100);
  };
  const handleClose = () => setOpen(false);

  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const [daysOfWeek, setDaysOfWeek] = useState(
    "[false, false, false, false, false, false, false]"
  );

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetchRawApi("user/routines/custom-routines/create", {
        name,
        emoji,
        daysOfWeek,
        timeOfDay: time,
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
        ref={buttonRef}
        sx={{
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
              session.user.darkMode ? 15 : isCoach ? 90 : 95
            }%)`,
          },
          "&:active": {
            transform: "scale(.95)",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 9999,
            width: 60,
            height: 60,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: session.user.darkMode
              ? "hsla(240,11%,50%,0.2)"
              : "rgba(200,200,200,.2)",
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
            New routine
          </Typography>
        </Box>
      </Box>

      <CreateGoal mutationUrl={mutationUrl} isCoach={isCoach} />

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={handleClose}
        ModalProps={{ keepMounted: false }}
        onOpen={handleOpen}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            userSelect: "none",
            height: "100vh",
            borderRadius: 0,
          },
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
                  width: "100px",
                  height: "100px",
                  p: 2,
                }}
              >
                <picture>
                  <img
                    width="60px"
                    height="60px"
                    alt="Emoji"
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  />
                </picture>
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
            inputRef={titleRef}
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            fullWidth
            margin="dense"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: `hsl(240,11%,${session.user.darkMode ? 30 : 95}%)`,
                py: 1,
                px: 2,
                borderRadius: 3,
              },
            }}
            placeholder="Morning routine"
          />
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            A{" "}
            <i>
              <u>routine</u>
            </i>{" "}
            is a set of{" "}
            <i>
              <u>goals</u>
            </i>
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 3, opacity: 0.6, fontWeight: 700 }}
          >
            SELECT DAYS TO WORK ON
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
            {JSON.parse(daysOfWeek).map((day, index) => (
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
          <Typography variant="body2" sx={{ opacity: 0.5, mt: 0.5 }}>
            You&apos;ll receive one notification reminder every day
          </Typography>
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
            disableUnderline
            sx={{
              background: `hsl(240,11%,${session.user.darkMode ? 30 : 95}%)`,
              py: 1,
              px: 2,
              mt: 1,
              borderRadius: 3,
            }}
            onChange={handleChange}
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour) => (
              <MenuItem value={hour} key={hour}>
                {(hour + 1) % 12 || 12}
                {hour >= 11 ? "PM" : "AM"}
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
              name.trim() === "" ||
              JSON.parse(daysOfWeek).filter((d) => d === true).length === 0
            }
          >
            Create
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
