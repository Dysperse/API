import {
  AppBar,
  Avatar,
  Box,
  CardActionArea,
  Chip,
  Drawer,
  Icon,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";
import { capitalizeFirstLetter } from "../ItemPopup";
export const moodOptions = ["1f601", "1f600", "1f610", "1f614", "1f62d"];

export function DailyCheckInDrawer() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = useCallback(() => setOpen(false), [open]);
  const handleOpen = useCallback(() => setOpen(true), [open]);

  const drawerStyles = {
    width: "100%",
    maxWidth: "600px",
  };

  const { data, error } = useApi("user/checkIns/count");
  const [lastBy, setLastBy] = useState<number>(7);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (count: any = -1) => {
    if (count !== -1) setLastBy(count);
    setAnchorEl(null);
  };

  const [emblaRef] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

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

        <Typography variant="h6" sx={{ p: 2, pb: 0 }} gutterBottom>
          By day
        </Typography>
        <Typography sx={{ px: 2 }} variant="body2" gutterBottom>
          <CardActionArea
            onClick={handleClick}
            sx={{
              display: "inline-flex",
              borderRadius: 2,
              width: "auto",
              px: 1,
              ml: -1,
              gap: 1,
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            Last {lastBy} days <Icon>expand_more</Icon>
          </CardActionArea>
        </Typography>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose(-1)}
        >
          <MenuItem selected={lastBy == 7} onClick={() => handleMenuClose(7)}>
            7 days
          </MenuItem>
          <MenuItem selected={lastBy == 14} onClick={() => handleMenuClose(14)}>
            14 days
          </MenuItem>
          <MenuItem selected={lastBy == 30} onClick={() => handleMenuClose(30)}>
            30 days
          </MenuItem>
          <MenuItem
            selected={lastBy == 365}
            onClick={() => handleMenuClose(365)}
          >
            365 days
          </MenuItem>
        </Menu>

        <Box sx={{ px: 2, mb: 2, height: "auto" }}>
          <Sparklines
            data={[
              ...(data && data.length > 0
                ? data.slice(0, lastBy).map((day) => {
                    return moodOptions.reverse().indexOf(day.mood);
                  })
                : [0]),
            ]}
            margin={6}
          >
            <SparklinesLine
              style={{
                strokeWidth: 4,
                stroke: colors[themeColor]["A700"],
                fill: "none",
              }}
            />
            <SparklinesSpots
              size={4}
              style={{
                stroke: colors[themeColor]["A400"],
                strokeWidth: 3,
                fill: global.user.darkMode ? "hsl(240,11%,15%)" : "white",
              }}
            />
          </Sparklines>
        </Box>

        <Box>
          <Box
            className="embla"
            ref={emblaRef}
            sx={{
              width: "100%",
              whiteSpace: "nowrap",
              overflowX: "scroll",
              overflowY: "visible",
            }}
          >
            <div
              className="embla__container"
              style={{ gap: "10px", paddingLeft: "18px" }}
            >
              {data &&
                data
                  .slice(0, lastBy)
                  .reverse()
                  .map(({ date, mood }, index) => (
                    <Chip
                      key={index}
                      label={capitalizeFirstLetter(
                        dayjs(date)
                          .from(dayjs().startOf("day"))
                          .replace("a day ago", "yesterday")
                          .replace("a few seconds ago", "today")
                      )}
                      sx={{
                        p: 1,
                        gap: 1,
                        borderRadius: 9999,
                        height: "auto",
                        maxHeight: "unset",
                      }}
                      avatar={
                        <Avatar
                          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${mood}.png`}
                        />
                      }
                    />
                  ))}
            </div>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ p: 2, pb: 1, pt: 4 }}>
          By mood
        </Typography>
        {moodOptions.map((emoji) => (
          <Box
            key={emoji}
            sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 2 }}
          >
            <IconButton
              key={emoji}
              sx={{
                p: 0,
                width: 35,
                height: 35,
              }}
            >
              <picture>
                <img
                  alt="emoji"
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                />
              </picture>
            </IconButton>
            <LinearProgress
              variant="determinate"
              sx={{
                flexGrow: 1,
                "&, & *": {
                  borderRadius: 999,
                },
                height: 15,
              }}
              value={
                data
                  ? (data.filter(({ mood }) => mood === emoji).length /
                      data.length) *
                    100
                  : 0
              }
            />
          </Box>
        ))}
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
