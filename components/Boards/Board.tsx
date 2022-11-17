import { Button, IconButton, SwipeableDrawer, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { Column } from "./Column";
import { ErrorHandler } from "../error";
import { useApi } from "../../hooks/useApi";
import { useState } from "react";
import dynamic from "next/dynamic";
import { colors } from "../../lib/colors";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

function CreateColumn() {
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState(
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
  );
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onOpen={() => setShowEmojiPicker(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: "600px",
            maxHeight: "600px",
            width: "auto",
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mx: "auto",
            mb: { xs: 5 },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <EmojiPicker
            width="100%"
            onEmojiClick={(event, emojiObject) => {
              const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
              setEmoji(url);
              setShowEmojiPicker(false);
            }}
          />
        </Box>
      </SwipeableDrawer>
      {open && (
        <Box
          sx={{
            backgroundColor: "rgba(200, 200, 200, 0.3)",
            width: "400px",
            flex: "0 0 auto",
            mr: 2,
            border: "1px solid rgba(200, 200, 200, 0.9)",
            p: 3,
            px: 4,
            borderRadius: 5,
            height: "100%",
          }}
        >
          <Button
            onClick={() => setShowEmojiPicker(true)}
            sx={{
              background: "rgba(200, 200, 200, 0.3)!important",
              borderRadius: 5,
            }}
          >
            <img src={emoji} alt="emoji" />
          </Button>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Column name"
            autoComplete="off"
            InputProps={{
              disableUnderline: true,
              sx: {
                background: "rgba(200, 200, 200, 0.3)",
                fontWeight: "600",
                mb: 2,
                mt: 1,
                fontSize: 20,
                px: 2,
                py: 1,
                borderRadius: 2,
                textDecoration: "underline",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              disableElevation
              fullWidth
              sx={{ borderWidth: "2px!important" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              sx={{
                border: "1px solid transparent !important",
              }}
            >
              Create
            </Button>
          </Box>
        </Box>
      )}
      <IconButton
        disabled={open}
        onClick={() => setOpen(true)}
        sx={{
          transition: "none!important",
          backgroundColor: "rgba(200, 200, 200, 0.3)!important",
          border: "1px solid rgba(200, 200, 200, 0.5)!important",
          "&:hover,&:active": {
            color: "#000",
            border: "1px solid rgba(200, 200, 200, 0.9)!important",
            backgroundColor: "rgba(200, 200, 200, 0.5)!important",
          },
        }}
      >
        <span className="material-symbols-outlined">add</span>
      </IconButton>
    </>
  );
}

export function Board({ board }: any) {
  const { data, error } = useApi("property/boards/tasks", {
    id: board.id,
  });
  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          width: "100%",
        }}
      >
        {data && data.map((column) => <Column column={column} />)}
        {data && data.length < 5 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreateColumn />
          </Box>
        )}
      </Box>
    </Box>
  );
}
