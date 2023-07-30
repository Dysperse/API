import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, SwipeableDrawer, TextField, Typography } from "@mui/material";
import { SearchIndex, init } from "emoji-mart";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import { Puller } from "../Puller";
import { EmojiButton } from "./button";

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
  const [results, setResults] = useState<Array<any>>([]);
  const [inputValue, setInputValue] = useState("");
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, { onClick: handleOpen });
  const debouncedHandleSearch = debounce(handleSearch, 500);

  useEffect(
    () => debouncedHandleSearch(inputValue),
    [inputValue, debouncedHandleSearch]
  );

  async function handleSearch(value) {
    const data = (await import("@emoji-mart/data")).default;
    init({ data });
    const emojis = await SearchIndex.search(value || "face");
    setResults(emojis);
  }

  useEffect(() => {
    if (inputValue.length === 0) {
      handleSearch("face");
      setInputValue("");
    }
  }, [inputValue.length]);

  function handleEmojiSelect(emoji) {
    const code = useNativeEmoji
      ? emoji.skins[0].native
      : emoji.skins[0].unified;
    setEmoji(code);
    handleClose();
  }

  const ref: any = useRef();

  useEffect(() => {
    if (open) setTimeout(() => ref?.current?.focus(), 100);
  }, [open]);

  return (
    <>
      {trigger}

      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor="bottom"
        sx={{
          zIndex: 99999999999,
        }}
      >
        <Puller showOnDesktop />
        <Box sx={{ px: 2 }}>
          <TextField
            type="text"
            size="small"
            variant="standard"
            sx={{ mb: 2 }}
            InputProps={{
              disableUnderline: true,
              sx: {
                px: 2,
                py: 1,
                borderRadius: 3,
                background: palette[2],
                "&:focus-within": {
                  background: palette[3],
                },
              },
            }}
            autoFocus
            placeholder="Search..."
            inputRef={ref}
            onChange={(e: any) => {
              setInputValue(e.target.value);
              debouncedHandleSearch(e.target.value);
            }}
            value={inputValue}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              maxHeight: "350px",
              overflowY: "scroll",
            }}
          >
            {(!results || (results && results.length === 0)) &&
              inputValue.length !== 0 && (
                <Box
                  sx={{
                    mb: 2,
                    p: 3,
                    background: "rgba(200,200,200,.2)",
                    borderRadius: 3,
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <picture>
                    <img
                      src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png"
                      alt="Crying emoji"
                    />
                  </picture>
                  <Typography sx={{ mt: 1, fontWeight: 700 }}>
                    No results found
                  </Typography>
                </Box>
              )}
            {results &&
              results.map((thisEmoji) => (
                <EmojiButton
                  handleEmojiSelect={handleEmojiSelect}
                  selectedEmoji={emoji}
                  emoji={thisEmoji}
                  key={thisEmoji.id}
                />
              ))}
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
});

export default EmojiPicker;
