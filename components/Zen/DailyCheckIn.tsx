import {
  AppBar,
  Box,
  CardActionArea,
  Drawer,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { toastStyles } from "../../lib/useCustomTheme";

export const moodOptions = ["1f601", "1f600", "1f610", "1f614", "1f62d"];

export function DailyCheckInDrawer() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = useCallback(() => setOpen(false), [open]);
  const handleOpen = useCallback(() => setOpen(true), [open]);

  const drawerStyles = {
    width: "100%",
    maxWidth: "600px",
  };
  return (
    <>
      <CardActionArea
        onClick={handleOpen}
        sx={{
          display: "flex",
          gap: 2,
          p: 3,
          borderRadius: 5,
          borderBottomLeftRadius: 0,
          pb: 1,
          borderBottomRightRadius: 0,
        }}
      >
        <Box>
          <Typography variant="body2">Daily check-in</Typography>
          <Typography variant="h6">How are you feeling today?</Typography>
        </Box>
        <Icon>chevron_right</Icon>
      </CardActionArea>
      <Drawer
        anchor="right"
        onClose={handleClose}
        open={open}
        PaperProps={{ sx: drawerStyles }}
      >
        <AppBar
          elevation={0}
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 999,
            background: global.user.darkMode
              ? "hsla(240,11%,15%, 0.5)"
              : "rgba(255,255,255,.5)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid transparent",
            borderColor: global.user.darkMode
              ? "hsla(240,11%,30%, .5)"
              : "rgba(200,200,200,.3)",
            color: global.user.darkMode ? "#fff" : "#000",
          }}
        >
          <Toolbar>
            <IconButton onClick={handleClose} sx={{ mr: "auto" }}>
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ fontWeight: "700" }}>Mental health</Typography>
            <IconButton
              onClick={handleClose}
              sx={{ ml: "auto", opacity: 0 }}
              disabled
            >
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Drawer>
    </>
  );
}

export function DailyCheckIn() {
  const [mood, setMood] = useState<string | null>(null);
  const today = dayjs().startOf("day");
  const {
    data,
    url: mutationUrl,
    error,
  } = useApi("user/checkIns", {
    date: today,
  });

  useEffect(() => {
    if (data && data[0] && data[0].mood) {
      setMood(data[0].mood);
    } else {
      setMood(null);
    }
  }, [data, mood, setMood]);

  const handleMoodChange: any = useCallback(
    async (emoji: string) => {
      try {
        await fetchApiWithoutHook("user/checkIns/setMood", {
          date: today,
          mood: emoji,
          delete: emoji === mood ? "true" : "false",
        });
        await mutate(mutationUrl);
        toast.success("Updated mood!", toastStyles);
      } catch (e) {
        toast.error(
          "Oh no! Something went wrong while trying to save your mood!",
          toastStyles
        );
      }
    },
    [today]
  );

  return (
    <Box
      sx={{
        background: global.user.darkMode ? "hsl(240, 11%, 10%)" : "#fff",
        border: "1px solid",
        borderColor: global.user.darkMode
          ? "hsl(240, 11%, 20%)"
          : "rgba(200, 200, 200, 0.3)",
        borderRadius: 5,
      }}
      className="shadow-lg"
    >
      <DailyCheckInDrawer />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 0.5,
          mb: -1,
          gap: 0.5,
          p: 3,
          pt: 0,
        }}
      >
        {moodOptions.map((emoji) => (
          <IconButton
            key={emoji}
            sx={{
              p: 0,
              width: 35,
              height: 35,
              cursor: "pointer!important",
              ...(mood && {
                opacity: mood === emoji ? 1 : 0.5,
              }),
              ...(mood === emoji && {
                transform: "scale(1.1)",
              }),
              "&:active": {
                transition: "none",
                transform: "scale(0.9)",
              },
              transition: "transform .2s",
            }}
            onClick={() => handleMoodChange(emoji)}
          >
            <picture>
              <img
                alt="emoji"
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
              />
            </picture>
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}
