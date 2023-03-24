import data from "@emoji-mart/data";
import { Box, SwipeableDrawer, TextField, Tooltip } from "@mui/material";
import { init, SearchIndex } from "emoji-mart";
import { cloneElement, useEffect, useRef, useState } from "react";
import { Puller } from "./Puller";

init({ data });

const EmojiButton: any = ({ emoji, selectedEmoji, handleEmojiSelect }: any) => (
  <Tooltip
    title={emoji.name}
    placement="top"
    PopperProps={{
      sx: {
        pointerEvents: "none",
      },
    }}
  >
    <Box
      sx={{
        width: "16.6666666667%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "25px",
        px: 2,
        userSelect: "none",
        borderRadius: 5,
        transition: "all .2s",
        "&:active": {
          transform: "scale(.95)",
          transition: "none",
        },
        ...(emoji.skins[0].unified === selectedEmoji && {
          background: "rgba(200,200,200,.3)",
        }),
        py: 0.5,
      }}
      onClick={() => handleEmojiSelect(emoji)}
    >
      {emoji.skins[0].native}
    </Box>
  </Tooltip>
);

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function EmojiPicker({ children, emoji, setEmoji }) {
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<Array<any>>([]);
  const [inputValue, setInputValue] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  const debouncedHandleSearch = debounce(handleSearch, 500);

  useEffect(() => {
    debouncedHandleSearch(inputValue);
  }, [inputValue, debouncedHandleSearch]);

  async function handleSearch(value) {
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
    const code = emoji.skins[0].unified;
    setEmoji(code);
    handleClose();
  }

  const ref: any = useRef();

  useEffect(() => {
    if (open) {
      ref?.current?.focus();
    }
  }, [open]);

  return (
    <>
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        anchor="bottom"
        ModalProps={{
          keepMounted: false,
        }}
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
                background: "rgba(200, 200, 200, .3)",
                "&:focus": {
                  background: "rgba(200, 200, 200, .4)",
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
              inputValue.length != 0 && (
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
                  No results found
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
      {trigger}
    </>
  );
}
