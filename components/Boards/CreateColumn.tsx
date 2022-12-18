import LoadingButton from "@mui/lab/LoadingButton";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { colors } from "../../lib/colors";

import {
  Box,
  Button,
  IconButton,
  SwipeableDrawer,
  TextField,
} from "@mui/material";

export function CreateColumn({ mutationUrl, id }: any) {
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const el = document.getElementById("create-column-title");
        if (el) el.focus();
      });
    }
  }, [open]);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onOpen={() => setShowEmojiPicker(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "600px",
            maxHeight: "600px",
            width: "auto",
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mb: { sm: 5 },
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
            backgroundColor: global.user.darkMode
              ? "hsl(240,11%,13%)"
              : "rgba(200, 200, 200, 0.3)",
            width: "400px",
            flex: "0 0 auto",
            mr: 2,
            height: "100%",
            border: "1px solid rgba(200, 200, 200, 0.9)",
            p: 3,
            px: 4,
            borderRadius: 5,
          }}
        >
          <Button
            onClick={() => setShowEmojiPicker(true)}
            sx={{
              background: "rgba(200, 200, 200, 0.3)!important",
              borderRadius: 5,
            }}
          >
            <picture>
              <img src={emoji} alt="emoji" />
            </picture>
          </Button>
          <TextField
            fullWidth
            id="create-column-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              onClick={() => setOpen(false)}
              variant="outlined"
              fullWidth
              sx={{ borderWidth: "2px!important" }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              fullWidth
              sx={{
                background: colors[themeColor][900] + "!important",
                color: "white",
                border: "1px solid transparent !important",
              }}
              onClick={() => {
                setLoading(true);
                fetchApiWithoutHook("property/boards/createColumn", {
                  title,
                  emoji,
                  id: id,
                })
                  .then((res) => {
                    mutate(mutationUrl)
                      .then(() => {
                        setLoading(false);
                        setTitle("");
                        setEmoji(
                          "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
                        );
                        setOpen(false);
                      })
                      .catch((err) => {
                        setLoading(false);
                        toast.error(
                          "Something went wrong while updating the board. Try reloading the page."
                        );
                      });
                  })
                  .catch((err) => {
                    setLoading(false);
                    toast.error(
                      "An error occurred while creating the column. Try again later."
                    );
                  });
              }}
            >
              Create
            </LoadingButton>
          </Box>
        </Box>
      )}
      {!open && (
        <IconButton
          disabled={open}
          onClick={() => setOpen(true)}
          sx={{
            transition: "none!important",
            backgroundColor: global.user.darkMode
              ? "hsl(240,11%,15%)"
              : "rgba(200, 200, 200, 0.3)!important",
            border: global.user.darkMode
              ? "1px solid hsl(240,11%,25%)"
              : "1px solid rgba(200, 200, 200, 0.5)!important",
            "&:hover,&:active": {
              color: global.user.darkMode ? "hsl(240,11%,90%)" : "#000",
              border: "1px solid rgba(200, 200, 200, 0.9)!important",
              backgroundColor: global.user.darkMode
                ? "hsl(240,11%,15%)"
                : "rgba(200, 200, 200, 0.5)!important",
              boxShadow: global.user.darkMode
                ? "0 0 0 1px hsl(240,11%,90%) inset"
                : "0 0 0 1px rgba(200, 200, 200, 0.9) inset",
            },
          }}
        >
          <span className="material-symbols-outlined">add</span>
        </IconButton>
      )}
    </>
  );
}
