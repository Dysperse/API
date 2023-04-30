import { Box, Tooltip } from "@mui/material";

export function EmojiButton({ emoji, selectedEmoji, handleEmojiSelect }: any) {
  return (
    <Tooltip
      title={emoji.name}
      placement="top"
      PopperProps={{
        sx: {
          pointerEvents: "none",
          zIndex: 9999999999999,
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
}
