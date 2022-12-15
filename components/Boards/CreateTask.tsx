import LoadingButton from "@mui/lab/LoadingButton";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { SelectDateModal } from "./SelectDateModal";

function ImageModal({ image, setImage, styles }) {
  return (
    <IconButton
      disableRipple
      onClick={() => {
        toast("Coming soon!");
      }}
      sx={{
        ...styles,
        mx: 0.5,
        background: image ? colors[themeColor][100] + "!important" : "",
      }}
      size="small"
    >
      <span className="material-symbols-outlined">image</span>
    </IconButton>
  );
}

export function CreateTask({
  tasks,
  parent = false,
  mutationUrl,
  boardId,
  columnId,
  checkList = false,
}: any) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<any>(null);
  const [pinned, setPinned] = useState(false);
  const [image, setImage] = useState<null | string>(null);

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
              id="title"
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
                id="description"
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
            {title !== "" &&
              tasks.filter((task) =>
                new RegExp("\\b" + task.name.toLowerCase() + "\\b").test(
                  title.toLowerCase()
                )
              ).length !== 0 && (
                <Alert
                  severity="info"
                  sx={{
                    mt: 1,
                    mb: 2,
                    borderRadius: 5,
                    background: colors[themeColor][100],
                  }}
                  icon={
                    <span
                      className="material-symbols-rounded"
                      style={{
                        color: colors[themeColor][800],
                      }}
                    >
                      info
                    </span>
                  }
                >
                  This item might be already added in your list.
                </Alert>
              )}
            <Box sx={{ display: "flex", mt: 1, mb: -1, alignItems: "center" }}>
              <IconButton
                disableRipple
                onClick={() => setPinned(!pinned)}
                sx={{
                  ...styles,
                  background: pinned
                    ? colors[themeColor][100] + "!important"
                    : "",
                }}
                size="small"
              >
                <span
                  style={{ transform: "rotate(-45deg)" }}
                  className="material-symbols-rounded"
                >
                  push_pin
                </span>
              </IconButton>
              <ImageModal styles={styles} image={image} setImage={setImage} />
              <IconButton
                disableRipple
                onClick={() => {
                  setShowDescription(!showDescription);
                  setTimeout(() => {
                    {
                      if (!showDescription)
                        document.getElementById("description")?.focus();
                      else document.getElementById("title")?.focus();
                    }
                  }, 100);
                }}
                sx={{
                  ...styles,
                  mx: 0.5,
                  background: showDescription
                    ? colors[themeColor][100] + "!important"
                    : "",
                }}
                size="small"
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
                    sx={{
                      borderRadius: 5,
                      px: 3,
                      background: colors[themeColor][900] + "!important",
                    }}
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
        button
        disableRipple
        sx={{
          ...(!checkList && {
            border: "0!important",
          }),
          borderRadius: 4,
          gap: 0.5,
          py: 0.5,
          px: 0,
          "&:hover": {
            backgroundColor: "rgba(200,200,200,0.3)",
            cursor: "pointer",
          },
          transition: "transform 0.2s ease-in-out",
          "&:active": {
            transform: "scale(.99)",
            transition: "none",
          },
          ...(checkList && {
            background:
              global.theme === "dark"
                ? "hsl(240,11%,13%)"
                : "#f3f4f6!important",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            px: 1,
            py: 1.5,
            gap: "10px!important",
            borderRadius: "15px!important",
            mb: 1.5,
          }),
        }}
        className="border border-gray-200"
        onClick={() => setOpen(true)}
      >
        <span
          className="material-symbols-outlined"
          style={{
            color: "#505050",
            marginLeft: "7px",
            marginRight: "5px",
            fontSize: "30px",
          }}
        >
          add_task
        </span>

        <ListItemText
          className="textbox"
          primary={
            <span
              style={{
                fontWeight: "300",
              }}
            >
              {parent ? "New subtask" : "New list item"}
            </span>
          }
        />
      </ListItem>
    </>
  );
}
