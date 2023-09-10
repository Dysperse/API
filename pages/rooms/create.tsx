import EmojiPicker from "@/components/EmojiPicker";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import RoomLayout from ".";

export default function Page() {
  const session = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  const [emoji, setEmoji] = useState("1f4e6");

  return (
    <RoomLayout>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            background: palette[2],
            borderRadius: 5,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <EmojiPicker emoji={emoji} setEmoji={(e) => setEmoji(e)}>
              <IconButton
                size="large"
                sx={{
                  border: "2px dashed #ccc",
                  width: 100,
                  height: 100,
                }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  alt="Emoji"
                  width={50}
                  height={50}
                />
              </IconButton>
            </EmojiPicker>
            <TextField label="Room name" size="small" />
          </Box>
          <ListItem>
            <ListItemText
              primary="Public"
              secondary="Others can see this room and its contents"
            />
            <Switch checked />
          </ListItem>
          <Button variant="contained" fullWidth>
            <Icon>add</Icon>Create
          </Button>
        </Box>
      </Box>
    </RoomLayout>
  );
}
