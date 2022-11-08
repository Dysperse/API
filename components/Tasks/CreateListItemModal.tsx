import LoadingButton from "@mui/lab/LoadingButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { Puller } from "../Puller";
import { SelectDateModal } from "./Lists";

export function CreateListItemModal({
  parent,
  listData,
  setListData,
  mutationUrl,
}) {
  const [open, setOpen] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);
  useStatusBar(open);
  const styles = {
    color: colors[themeColor][800],
    borderRadius: 3,
    transition: "none",
  };

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState<any>(null);
  const [pinned, setPinned] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // If the title contains "today", set the date to today
    if (title.toLowerCase().includes("today")) {
      setDate(new Date());
    } else if (title.toLowerCase().includes("tomorrow")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
    }
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchApiWithoutHook("property/lists/createItem", {
      name: title,
      details: description,
      pinned: pinned ? "true" : "false",
      due: date,
      list: parent.id,
    }).then((res) => {
      setLoading(false);
      setListData(
        listData.map((list) => {
          if (list.id === parent.id) {
            return {
              ...list,
              items: [res, ...list.items],
            };
          }
          return list;
        })
      );
      setTitle("");
      setDescription("");
      setDate(null);
      setPinned(false);
      setOpen(false);
    });
  };

  // useeffect hook when / pressed open modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
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
        <Box sx={{ display: { sm: "none" } }}>
          <Puller />
        </Box>
        <Box sx={{ p: { xs: 3, sm: 3 }, pt: { xs: 0, sm: 3 } }}>
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
      <Card
        onClick={() => setOpen(true)}
        sx={{
          mb: 2,
          background: "#eee",
          border: "2px solid #ddd",
          borderRadius: 5,
          transition: "none",
          cursor: "pointer",
          "&:hover": {
            borderColor: "#ccc",
            background: "#ddd",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            userSelect: "none",
            py: 2,
          }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex" }}>
              <Typography>New list item</Typography>

              <Box
                sx={{
                  ml: "auto",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    background: colors[themeColor][100],
                    p: 0.6,
                    px: 1,
                    borderRadius: 1,
                    fontWeight: "900",
                  }}
                >
                  /
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
}
