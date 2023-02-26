import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Icon,
  MenuItem,
  SwipeableDrawer,
  TextField,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { colors } from "../../../../lib/colors";
import { toastStyles } from "../../../../lib/useCustomTheme";
import { Puller } from "../../../Puller";

export default function CreateColumn({
  setCurrentColumn,
  hide,
  mutationUrl,
  id,
  mobile = false,
}: any) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const ref: any = useRef();
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
  );

  useEffect(() => {
    if (open || mobileOpen) {
      setTimeout(() => {
        const el = document.getElementById("create-column-title");
        if (el) el.focus();
      });
    }
  }, [open, mobileOpen]);

  const Children = ({ mobile = false }) => (
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
          ...(mobile
            ? {
                mb: 2,
              }
            : {
                backgroundColor: global.user.darkMode
                  ? "hsl(240,11%,13%)"
                  : "rgba(200, 200, 200, 0.3)",
                width: "400px",
                flex: "0 0 auto",
                mr: 2,
                border: global.user.darkMode
                  ? "1px solid hsl(240,11%,30%)!important"
                  : "1px solid rgba(200, 200, 200, 0.9)",
              }),
          height: "auto",
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
            e.stopPropagation();
            if (e.key === "Enter") {
              document.getElementById("createColumnButton")?.click();
            }
            if (e.key === "Escape") {
              setOpen(false);
              setMobileOpen(false);
            }
          }}
          id="create-column-title"
          inputRef={ref}
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
            onClick={() => {
              setMobileOpen(false);
              setOpen(false);
            }}
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
              background: `${colors[themeColor][900]}!important`,
              color: "white",
              border: "1px solid transparent !important",
            }}
            onClick={() => {
              setLoading(true);
              if (ref?.current?.value.trim() === "") {
                toast.error("Enter a name for this column 👀", toastStyles);
                setLoading(false);
                return;
              }
              fetchApiWithoutHook("property/boards/column/create", {
                title: ref?.current?.value,
                emoji,
                id: id,
              })
                .then(() => {
                  toast.success("Created column!", toastStyles);
                  setOpen(false);
                  mutate(mutationUrl)
                    .then(() => {
                      setCurrentColumn((e) => e + 1);
                      setLoading(false);
                      setEmoji(
                        "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png"
                      );
                      setOpen(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      toast.error(
                        "Something went wrong while updating the board. Try reloading the page.",
                        toastStyles
                      );
                    });
                })
                .catch(() => {
                  setLoading(false);
                  toast.error(
                    "An error occurred while creating the column. Try again later.",
                    toastStyles
                  );
                });
            }}
          >
            Create
          </LoadingButton>
        </Box>
      </Box>
    </Box>
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
          sx: {
            width: "100%",
            maxWidth: "400px",
            mb: { sm: 2 },
            borderRadius: { xs: "20px 20px 0 0", sm: 4 },
          },
        }}
      >
        <EmojiPicker
          skinTonePickerLocation={"PREVIEW" as any}
          theme={(global.user.darkMode ? "dark" : "light") as any}
          lazyLoadEmojis
          width="100%"
          onEmojiClick={(event) => {
            const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
            setEmoji(url);
            setShowEmojiPicker(false);
          }}
        />
      </SwipeableDrawer>
      {open && <Children mobile={false} />}
      <SwipeableDrawer
        anchor="bottom"
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        disableSwipeToOpen
        sx={{
          zIndex: 999999,
        }}
      >
        <Puller />
        <Children mobile />
      </SwipeableDrawer>
      <Box>
        {!open && mobile ? (
          <MenuItem
            disabled={hide || open || mobileOpen}
            onClick={() => {
              setMobileOpen(true);
            }}
          >
            <Icon className="outlined">post_add</Icon> New column
          </MenuItem>
        ) : hide || open || mobileOpen ? null : (
          <Box
            onClick={() => {
              setOpen(true);
              setTimeout(() => {
                const container: any = document.getElementById("taskContainer");
                container.scrollLeft += 20000;
              }, 10);
            }}
            className="mb-2 mr-10 hidden cursor-auto select-none gap-3 rounded-xl border p-4 px-5 pr-5 shadow-lg hover:border-gray-300 hover:bg-gray-200 active:bg-gray-300 dark:border-[hsl(240,11%,18%)] dark:bg-transparent sm:flex"
            sx={{
              whiteSpace: "nowrap",
              transition: "none!important",
            }}
          >
            <Icon className="outlined">add_circle</Icon> Create column
          </Box>
        )}
      </Box>
    </>
  );
}
