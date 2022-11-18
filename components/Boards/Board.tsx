import LoadingButton from "@mui/lab/LoadingButton";
import { Button, IconButton, SwipeableDrawer, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../error";
import { Column } from "./Column";
import EmojiPicker from "emoji-picker-react";

function CreateColumn({ mutationUrl, id }: any) {
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
          elevation: 0,
          sx: {
            maxWidth: "600px",
            maxHeight: "600px",
            width: "auto",
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mx: "auto",
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
              disableElevation
              fullWidth
              sx={{ borderWidth: "2px!important" }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              disableElevation
              fullWidth
              sx={{
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

function Renderer({ data, url, board }) {
  return (
    <>
      {data &&
        data.map((column) => (
          <Column mutationUrl={url} boardId={board.id} column={column} />
        ))}
    </>
  );
}

export const Board = React.memo(function ({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
    align: "start",
  });

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      <Box
        sx={{
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            overflowX: "scroll",
          }}
        >
          <Renderer data={data} url={url} board={board} />
          {data ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexDirection: "column",
              }}
            >
              {data.length < 5 && (
                <CreateColumn id={board.id} mutationUrl={url} />
              )}
              <IconButton
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
                <span className="material-symbols-outlined">more_vert</span>
              </IconButton>
            </Box>
          ) : (
            <Box>Loading...</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});
