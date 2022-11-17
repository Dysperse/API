import { Button, IconButton, SwipeableDrawer, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useApi, fetchApiWithoutHook } from "../../hooks/useApi";
import { ErrorHandler } from "../error";
import { Column } from "./Column";
import LoadingButton from "@mui/lab/LoadingButton";
import { mutate } from "swr";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import toast from "react-hot-toast";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

function CreateColumn({ emblaApi, mutationUrl, id }: any) {
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
    });
    if (open) {
      emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
      setTimeout(() => {
        const el = document.getElementById("create-column-title");
        if (el) el.focus();
      });
    } else {
      emblaApi.scrollTo(0);
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

                        setTimeout(() => {
                          emblaApi.reInit({
                            dragFree: true,
                            align: "start",
                            containScroll: "trimSnaps",
                          });
                          emblaApi.scrollTo(
                            emblaApi.scrollSnapList().length - 1
                          );
                        }, 100);
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

export function Board({ board }: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
    align: "start",
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [WheelGesturesPlugin()]
  );
  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your tasks" />
      )}
      <Box
        ref={emblaRef}
        sx={{
          maxWidth: "100vw",
        }}
      >
        <div className="embla__container" style={{ gap: "10px" }}>
          <Renderer data={data} url={url} board={board} />
          {data ? (
            data.length < 5 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CreateColumn
                  id={board.id}
                  mutationUrl={url}
                  emblaApi={emblaApi}
                />
              </Box>
            )
          ) : (
            <Box>Loading...</Box>
          )}
        </div>
      </Box>
    </Box>
  );
}
