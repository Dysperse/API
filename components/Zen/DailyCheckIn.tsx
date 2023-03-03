import {
  Alert,
  AppBar,
  Avatar,
  Box,
  CardActionArea,
  Chip,
  Dialog,
  Icon,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  SwipeableDrawer,
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
import { useSession } from "../../pages/_app";
import { capitalizeFirstLetter } from "../ItemPopup";

export const moodOptions = ["1f601", "1f600", "1f610", "1f614", "1f62d"];

function InfoModal() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            p: 3,
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Mental health{" "}
          <Chip
            sx={{
              ml: 1.5,
              background: "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%)",
              color: "#000",
            }}
            size="small"
            label="BETA"
          />
        </Typography>
        <Alert severity="info" sx={{ mb: 1 }}>
          Dysperse mental health is a tool to help track your mood over time
        </Alert>
        <Alert severity="info" sx={{ mb: 1 }}>
          Your mood is only visible to you, meaning that other members in your
          groyp won&apos;t be able to see how you&apos;re feeling
        </Alert>
        <Alert severity="warning" sx={{ mb: 1 }}>
          Mood data is only stared for 1 year
        </Alert>
      </Dialog>
      <IconButton onClick={handleOpen}>
        <Icon className="outlined">info</Icon>
      </IconButton>
    </>
  );
}

export function DailyCheckInDrawer() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  const drawerStyles = {
    width: "100%",
    maxWidth: "600px",
    borderRadius: 0,
    height: "100vh",
    maxHeight: "100vh",
  };

  const { data, error } = useApi("user/checkIns/count");
  const [lastBy, setLastBy] = useState<number>(7);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  const handleMenuClose = (count: any = -1) => {
    if (count !== -1) setLastBy(count);
    setAnchorEl(null);
    setTimeout(() => emblaApi?.reInit(), 100);
  };
  const session = useSession();

  return (
    <>
      <CardActionArea
        onClick={handleOpen}
        sx={{
          cursor: "unset",
          display: "flex",
          gap: 2,
          p: 3,
          borderRadius: 5,
          borderBottomLeftRadius: 0,
          pb: 1,
          borderBottomRightRadius: 0,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              mb: 0.4,
              gap: 1,
            }}
          >
            Mental health{" "}
            <Chip
              label="beta"
              size="small"
              sx={{
                fontSize: "12px",
                height: "auto",
                background: `hsl(240,11%,${
                  session?.user?.darkMode ? 20 : 90
                }%)`,
              }}
            />
          </Typography>
          <Typography sx={{ fontWeight: "900" }}>
            How are you feeling today?
          </Typography>
        </Box>
        <Icon>arrow_forward_ios</Icon>
      </CardActionArea>
      <SwipeableDrawer
        anchor="bottom"
        onOpen={handleOpen}
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
            background: session?.user?.darkMode
              ? "hsla(240,11%,15%, 0.5)"
              : "rgba(255,255,255,.5)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid transparent",
            borderColor: session?.user?.darkMode
              ? "hsla(240,11%,30%, .5)"
              : "rgba(200,200,200,.3)",
            color: session?.user?.darkMode ? "#fff" : "#000",
          }}
        >
          <Toolbar>
            <IconButton onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ fontWeight: "700", mx: "auto" }}>
              Mental health
            </Typography>
            <InfoModal />
          </Toolbar>
        </AppBar>

        <Typography variant="h6" sx={{ p: 4, pb: 0, mb: 0.5 }}>
          By day
        </Typography>
        <Typography sx={{ px: 3, mb: 2 }} variant="body2" gutterBottom>
          <CardActionArea
            onClick={handleClick}
            sx={{
              cursor: "unset",
              display: "inline-flex",
              borderRadius: 2,
              width: "auto",
              px: 1,
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
        <Box sx={{ px: 4, mb: 2, height: "auto", display: "flex", gap: 2 }}>
          <Sparklines
            data={[
              ...(data && data.length > 0
                ? data
                    .slice(0, lastBy)
                    .reverse()
                    .map((day) => {
                      return [
                        "1f62d",
                        "1f614",
                        "1f610",
                        "1f600",
                        "1f601",
                      ].indexOf(day.mood);
                    })
                : [0]),
            ]}
            margin={6}
          >
            <SparklinesLine
              style={{
                strokeWidth: 4,
                stroke: colors[session?.themeColor || "grey"]["A700"],
                fill: "none",
              }}
            />
            <SparklinesSpots
              size={4}
              style={{
                stroke: colors[session?.themeColor || "grey"]["A400"],
                strokeWidth: 3,
                fill: session?.user?.darkMode ? "hsl(240,11%,15%)" : "white",
              }}
            />
          </Sparklines>
        </Box>

        <Box
          sx={{
            display: "flex",
            opacity: 0.5,
            width: "100%",
            px: 4,
            mb: 2,
          }}
        >
          <Typography variant="body2">{lastBy} days ago</Typography>
          <Typography variant="body2" sx={{ ml: "auto" }}>
            today
          </Typography>
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
              style={{ gap: "10px", paddingLeft: "20px", marginTop: "10px" }}
            >
              <div></div>
              {data &&
                data.slice(0, lastBy).map(({ date, mood }, index) => (
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
                      ...(session?.user?.darkMode && {
                        background: "hsl(240,11%,20%)",
                      }),
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

        <Typography variant="h6" sx={{ p: 4, pb: 1, pt: 4 }}>
          By mood
        </Typography>
        {moodOptions.map((emoji) => (
          <Box
            key={emoji}
            sx={{ px: 4, py: 1, display: "flex", alignItems: "center", gap: 2 }}
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
        <Box sx={{ mt: 5 }} />
      </SwipeableDrawer>
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
    [today, mutationUrl, mood]
  );
  const session = useSession();

  return (
    <Box
      sx={{
        background: session?.user?.darkMode ? "hsl(240, 11%, 10%)" : "#fff",
        border: "1px solid",
        borderColor: session?.user?.darkMode
          ? "hsl(240, 11%, 20%)"
          : "rgba(200, 200, 200, 0.3)",
        borderRadius: 5,
        mb: -6,
      }}
      className="shadow-md"
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
