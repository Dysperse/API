import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Icon,
  MenuItem,
  Select,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { useSession } from "../../../pages/_app";
import { EmojiPickerModal } from "../../Boards/Board/EmojiPickerModal";
import { Puller } from "../../Puller";

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
            Routine
          </Typography>
        </Box>
      </Box>

      <Box
        onClick={() => router.push("/coach")}
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
            background: "rgba(200,200,200,.2)",
            position: "relative",
          }}
        >
          <Icon className="outlined">auto_awesome</Icon>
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
            Goal
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
