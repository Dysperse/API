import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import Picker from "@emoji-mart/react";
import { Box, SwipeableDrawer } from "@mui/material";
import React, { cloneElement, useCallback, useState } from "react";

export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const EmojiPicker = React.memo(function EmojiPicker({
  children,
  emoji,
  setEmoji,
  useNativeEmoji = false,
}: {
  children: JSX.Element;
  emoji: string;
  setEmoji: (emoji: string) => void;
  useNativeEmoji?: boolean;
}) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, { onClick: handleOpen });

  function handleEmojiSelect(emoji) {
    const code = emoji[useNativeEmoji ? "native" : "unified"];
    alert(code);
    setEmoji(code);
    handleClose();
  }

  return (
    <>
      {trigger}

      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor="bottom"
        sx={{
          zIndex: 99999999999,
          textAlign: "center",
        }}
        PaperProps={{
          sx: {
            width: "auto",
            minWidth: "auto",
            background: "transparent",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", pb: 5 }}>
          <Picker
            data={async () => {
              const response = await fetch(
                "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
              );

              return response.json();
            }}
            onEmojiSelect={handleEmojiSelect}
            theme={isDark ? "dark" : "light"}
          />
        </Box>
      </SwipeableDrawer>
    </>
  );
});

export default EmojiPicker;
