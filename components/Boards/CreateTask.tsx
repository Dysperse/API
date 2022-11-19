import LoadingButton from "@mui/lab/LoadingButton";
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { SelectDateModal } from "./SelectDateModal";
import { BpCheckedIcon, BpIcon } from "./Task";

export function CreateTask({ mutationUrl, boardId, columnId }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<any>(null);
  const [pinned, setPinned] = useState(false);

  const [showDescription, setShowDescription] = useState(false);
  useStatusBar(open);

  const styles = {
    color: colors[themeColor][800],
    borderRadius: 3,
    transition: "none",
  };

  const toastStyles = {
    style: {
      borderRadius: 99999,
      paddingLeft: "15px",
      background: colors[themeColor][700],
      color: colors[themeColor][50],
    },
    // iconTheme: {
    // primary: colors[themeColor][50],
    // secondary: colors[themeColor][900],
    // },
  };

  useEffect(() => {
    // If the title contains "today", set the date to today
    if (title.toLowerCase().includes("today")) {
      setDate(new Date());
    } else if (
      title.toLowerCase().includes("tomorrow") ||
      title.toLowerCase().includes("tmrw") ||
      title.toLowerCase().includes("tmr") ||
      title.toLowerCase().includes("tmw")
    ) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
    } else if (title.toLowerCase().includes("next week")) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDate(nextWeek);
    } else if (title.toLowerCase().includes("next month")) {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setDate(nextMonth);
    }
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      toast.error("Please enter a title", toastStyles);
      return;
    }

    setLoading(true);
    await fetchApiWithoutHook("property/boards/createTask", {
      title,
      description,
      date,
      pinned: pinned ? "true" : "false",
      due: date ? date.toISOString() : "false",

      boardId,
      columnId,
    });
    toast.success("Created task!", toastStyles);

    setLoading(false);
    setTitle("");
    setDescription("");
    setDate(null);
    setPinned(false);
    // setOpen(false);
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
          mutate(mutationUrl);
        }}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "600px",
            mb: { sm: 5 },
            mx: "auto",
            background: colors[themeColor][50],
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              fullWidth
              variant="standard"
              placeholder="Add an item"
              InputProps={{
                className: "font-secondary",
                disableUnderline: true,
                sx: { fontSize: 19 },
              }}
            />
            <Collapse in={showDescription}>
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="standard"
                placeholder="Add a description"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 15, mt: 0.5, mb: 1 },
                }}
              />
            </Collapse>
            <Box sx={{ display: "flex", mt: 1, mb: -1, alignItems: "center" }}>
              <IconButton
                disableRipple
                onClick={() => setPinned(!pinned)}
                sx={{
                  ...styles,
                  background: pinned && colors[themeColor][100],
                }}
              >
                <span
                  style={{ transform: "rotate(-45deg)" }}
                  className="material-symbols-rounded"
                >
                  push_pin
                </span>
              </IconButton>
              <IconButton
                disableRipple
                onClick={() => setShowDescription(!showDescription)}
                sx={{
                  ...styles,
                  mx: 1,
                  background: showDescription && colors[themeColor][100],
                }}
              >
                <span className="material-symbols-rounded">notes</span>
              </IconButton>
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  gap: 2,
                  mt: 0,
                  alignItems: "center",
                }}
              >
                <SelectDateModal
                  styles={styles}
                  date={date}
                  setDate={setDate}
                />
                <div>
                  <LoadingButton
                    loading={loading}
                    type="submit"
                    sx={{ borderRadius: 5, px: 3 }}
                    variant="contained"
                    disableElevation
                  >
                    Create
                  </LoadingButton>
                </div>
              </Box>
            </Box>
          </form>
        </Box>
      </SwipeableDrawer>
      <ListItem
        sx={{
          borderRadius: 4,
          gap: 0.5,
          py: 0,
          px: 0,
          "&:hover": {
            backgroundColor: "rgba(200,200,200,0.3)",
            cursor: "pointer",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Checkbox
          disabled
          sx={{
            "&:hover": { bgcolor: "transparent" },
          }}
          color="default"
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          inputProps={{ "aria-label": "Checkbox demo" }}
        />

        <ListItemText
          className="textbox"
          primary={
            <span
              style={{
                fontWeight: "500",
              }}
            >
              New list item
            </span>
          }
        />
      </ListItem>
    </>
  );
}
