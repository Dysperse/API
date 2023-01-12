import LoadingButton from "@mui/lab/LoadingButton";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { colors } from "../../../../lib/colors";

import { Box, Button, Icon, SwipeableDrawer, TextField } from "@mui/material";

export function CreateColumn({ hide, mutationUrl, id }: any) {
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
            onEmojiClick={(event) => {
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
            display: "flex",
            gap: 1,
            mx: 2,
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              backgroundColor: global.user.darkMode
                ? "hsl(240,11%,13%)"
                : "rgba(200, 200, 200, 0.3)",
              width: "400px",
              flex: "0 0 auto",
              mr: 2,
              height: "auto",
              border: global.user.darkMode
                ? "1px solid hsl(240,11%,30%)!important"
                : "1px solid rgba(200, 200, 200, 0.9)",
              p: 3,
              px: 4,
              borderRadius: 5,
            }}
          >
            <Button
              onClick={() => setShowEmojiPicker(true)}
              sx={{
                background: global.user.darkMode
                  ? "hsl(240,11%,17%)"
                  : "rgba(200, 200, 200, 0.3)!important",
                borderRadius: 5,
              }}
            >
              <picture>
                <img src={emoji} alt="emoji" />
              </picture>
            </Button>
            <TextField
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("createColumnButton")?.click();
                }
              }}
              id="create-column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              placeholder="Column name"
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
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                id="createColumnButton"
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
                    .then(() => {
                      mutate(mutationUrl)
                        .then(() => {
                          setLoading(false);
                          setTitle("");
                          setEmoji(
                            "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
                          );
                          setOpen(false);
                        })
                        .catch(() => {
                          setLoading(false);
                          toast.error(
                            "Something went wrong while updating the board. Try reloading the page."
                          );
                        });
                    })
                    .catch(() => {
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
        </Box>
      )}
      <Box>
        {!open && (
          <Button
            disableRipple
            disabled={hide || open}
            onClick={() => {
              setOpen(true);
              setTimeout(() => {
                const container: any = document.getElementById("taskContainer");
                container.scrollLeft += 20000;
              }, 10);
            }}
            size="large"
            sx={{
              width: "350px",
              whiteSpace: "nowrap",
              borderRadius: 5,
              justifyContent: "flex-start",
              py: 2,
              pl: 3,
              mr: 4,
              gap: 2,
              transition: "none!important",
              backgroundColor: global.user.darkMode
                ? "hsl(240,11%,15%)"
                : "rgba(200, 200, 200, 0.3)!important",
              border: global.user.darkMode
                ? "1px solid hsl(240,11%,25%)"
                : "1px solid rgba(200, 200, 200, 0.5)!important",
              "&:hover": {
                color: global.user.darkMode ? "hsl(240,11%,90%)" : "#000",
              },
              "&:active": {
                color: global.user.darkMode ? "hsl(240,11%,90%)" : "#000",
                border: global.user.darkMode
                  ? "1px solid hsl(240,11%,30%)!important"
                  : "1px solid rgba(200, 200, 200, 0.9)!important",
                backgroundColor: global.user.darkMode
                  ? "hsl(240,11%,15%)"
                  : "rgba(200, 200, 200, 0.5)!important",
                boxShadow: global.user.darkMode
                  ? "0 0 0 1px hsl(240,11%,30%) inset"
                  : "0 0 0 1px rgba(200, 200, 200, 0.9) inset",
              },
            }}
          >
            <Icon className="outlined">add_circle</Icon> Create column
          </Button>
        )}
      </Box>
    </>
  );
}
