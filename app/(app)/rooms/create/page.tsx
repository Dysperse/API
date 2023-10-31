"use client";
import EmojiPicker from "@/components/EmojiPicker";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import toast from "react-hot-toast";
import RoomLayout from "../layout";

const Page = memo(function Page() {
  const router = useRouter();
  const { session } = useSession();
  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  const [emoji, setEmoji] = useState("1f4e6");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [loading, setLoading] = useState(false);

  // Memoized event handlers
  const handleNameChange = useCallback((e) => {
    setName(capitalizeFirstLetter(e.target.value));
  }, []);

  const handleNoteChange = useCallback((e) => {
    setNote(e.target.value);
  }, []);

  const handlePrivateToggle = useCallback(() => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchRawApi(session, "space/inventory/rooms/create", {
        name,
        note,
        emoji,
        private: isPrivate ? "true" : "false",
      });
      setLoading(false);
      toast.success("Created room!");
      router.push(`/rooms/${res.id}`);
    } catch (e) {
      toast.error("Couldn't create room. Please try again later");
      setLoading(false);
    }
  }, [session, name, note, emoji, isPrivate, router]);

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
            width: "600px",
            maxWidth: "calc(100% - 20px)",
          }}
        >
          <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
            <EmojiPicker setEmoji={(e) => setEmoji(e)}>
              <IconButton
                size="large"
                sx={{
                  border: "2px dashed " + palette[5],
                  width: 120,
                  height: 120,
                }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                  alt="Emoji"
                  width={80}
                  height={80}
                />
              </IconButton>
            </EmojiPicker>
            <Box sx={{ width: "100%" }}>
              <TextField
                autoFocus
                value={name}
                onChange={handleNameChange}
                fullWidth
                label="Room name"
                placeholder="Garage"
                size="small"
              />
              <TextField
                value={note}
                onChange={handleNoteChange}
                fullWidth
                label="Note"
                placeholder="Optional"
                multiline
                maxRows={3}
                minRows={2}
                size="small"
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
          <ListItem sx={{ my: 1 }}>
            <ListItemText
              primary={isPrivate ? "Private" : "Public"}
              secondary={
                isPrivate
                  ? "Only you can see this room and its contents"
                  : "Others can see this room and its contents"
              }
            />
            <Switch checked={!isPrivate} onClick={handlePrivateToggle} />
          </ListItem>
          <LoadingButton
            loading={loading}
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={name.trim() === ""}
          >
            <Icon>add</Icon>Create
          </LoadingButton>
        </Box>
      </Box>
    </RoomLayout>
  );
});

export default Page;
