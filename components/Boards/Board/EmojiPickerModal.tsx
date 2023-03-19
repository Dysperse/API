import { Button, SwipeableDrawer } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useSession } from "../../../pages/_app";

export function EmojiPickerModal({ large = false, emoji, setEmoji }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            mb: { md: 2 },
            borderRadius: { xs: "20px 20px 0 0", md: 4 },
          },
        }}
        sx={{
          zIndex: 9999999,
        }}
      >
        {open && (
          <EmojiPicker
            skinTonePickerLocation={"PREVIEW" as any}
            theme={(session.user.darkMode ? "dark" : "light") as any}
            lazyLoadEmojis={true}
            width="100%"
            onEmojiClick={(event) => {
              const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
              setEmoji(url);
              setOpen(false);
            }}
          />
        )}
      </SwipeableDrawer>
      <Button
        onClick={() => setOpen(true)}
        size={large ? "large" : "medium"}
        sx={{
          minWidth: "unset",
          px: 1,
        }}
      >
        <picture>
          <img
            src={emoji}
            alt="emoji"
            width={large ? 60 : 30}
            height={large ? 60 : 30}
          />
        </picture>
      </Button>
    </>
  );
}
