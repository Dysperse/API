import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CardActionArea,
  Chip,
  Dialog,
  Grid,
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
import { Puller } from "../Puller";

export const moodOptions = ["1f601", "1f600", "1f610", "1f614", "1f62d"];
export const reasons = [
  { icon: "favorite", name: "Relationships" },
  { icon: "work", name: "Work" },
  { icon: "school", name: "School" },
  { icon: "sports_basketball", name: "Hobbies" },
  { icon: "ecg_heart", name: "Health" },
  { icon: "newspaper", name: "Current events" },
  { icon: "group", name: "Family/Friends" },
  { icon: "payments", name: "Finances" },
  { icon: "pending", name: "Something else", w: 12 },
];
function Emoji({ emoji, mood, data, handleMoodChange }) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const session = useSession();
  const [currentReason, setCurrentReason] = useState<null | string>(
    (data && data[0] && data[0].reason) || null
  );

  return (
    <>
      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        anchor="bottom"
        disableSwipeToOpen
        PaperProps={{}}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              pb: 2,
            }}
          >
            <picture style={{ flexShrink: 0, flexGrow: 0 }}>
              <img
                alt="emoji"
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                width="40px"
                height="40px"
              />
            </picture>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                {data && data[0] && mood === emoji
                  ? "Your mood"
                  : "What is making you feel this way?"}
              </Typography>
              <Typography variant="body2">
                {data && data[0] && mood === emoji
                  ? ""
                  : "Select the most relevant option."}
              </Typography>
            </Box>
          </Typography>
          {!(data && data[0] && mood === emoji) && (
            <LinearProgress
              value={75}
              variant="determinate"
              sx={{ borderRadius: 999, mb: 2, height: 2 }}
            />
          )}
          {!(data && data[0] && mood === emoji) && (
            <Grid
              container
              spacing={{
                xs: 1,
                sm: 2,
              }}
            >
              {reasons.map((reason) => (
                <Grid
                  item
                  xs={reason.w || 6}
                  sm={reason.w || 4}
                  key={reason.name}
                >
                  <Box
                    onClick={() =>
                      setCurrentReason(
                        currentReason && reason.name === currentReason
                          ? null
                          : reason.name
                      )
                    }
                    sx={{
                      border: "2px solid transparent",
                      userSelect: "none",
                      py: 2,
                      borderRadius: 4,
                      px: 2,
                      transition: "transform .2s",
                      alignItems: "center",
                      "&:active": {
                        transform: "scale(0.95)",
                        transition: "none",
                      },
                      display: "flex",
                      background: `hsl(240,11%,${
                        session?.user?.darkMode ? 10 : 97
                      }%)!important`,
                      gap: 2,
                      ...(currentReason === reason.name && {
                        borderColor: colors[session?.themeColor][700],
                        boxShadow:
                          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                        background: session?.user?.darkMode
                          ? "hsl(240,11%,10%) !important"
                          : "#fff !important",
                      }),
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: "26px!important",
                      }}
                      className="outlined"
                    >
                      {reason.icon}
                    </Icon>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        flexGrow: 1,
                      }}
                    >
                      {reason.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          <Button
            fullWidth
            disableRipple
            size="large"
            variant="contained"
            disabled={
              mood !== emoji &&
              (!currentReason ||
                (data &&
                  data[0] &&
                  data[0].reason &&
                  currentReason === data[0].reason))
            }
            onClick={() => {
              handleClose();
              handleMoodChange(emoji, currentReason);
            }}
            sx={{
              mt: 2,
              transition: "opacity .2s!important",
              "&:active": { opacity: 0.5, transition: "none!important" },
            }}
          >
            {data && data[0] && mood === emoji ? "Delete" : "Done"}
          </Button>
        </Box>
      </SwipeableDrawer>
      <IconButton
        key={emoji}
        sx={{
          p: 0,
          width: 35,
          height: 35,
          cursor: "pointer!important",
          ...((mood || !data) && {
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
        onClick={handleOpen}
      >
        <picture>
          <img
            alt="emoji"
            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
          />
        </picture>
      </IconButton>
    </>
  );
}

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

  const [showKey, setShowKey] = useState(false);

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
          <Typography sx={{ fontWeight: "900", mb: 0.4 }}>
            How are you feeling today?
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Identify and track your emotions
          </Typography>
        </Box>
        <Icon>arrow_forward_ios</Icon>
      </CardActionArea>
      <SwipeableDrawer
        disableSwipeToOpen
        anchor="bottom"
        onOpen={handleOpen}
        onClose={handleClose}
        open={open}
        PaperProps={{ sx: drawerStyles }}
      >
        <AppBar>
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

        <Typography
          variant="h6"
          sx={{ p: 4, pb: 1, pt: 4, display: "flex", alignItems: "center" }}
        >
          By mood
          <IconButton sx={{ ml: "auto" }} onClick={() => setShowKey(!showKey)}>
            <Icon className="outlined">help</Icon>
          </IconButton>
        </Typography>

        {showKey && (
          <Box
            sx={{
              px: 3,
              mb: 2,
            }}
          >
            {reasons.map((reason) => (
              <Chip
                label={reason.name}
                sx={{ m: 0.5 }}
                variant="outlined"
                icon={
                  <span style={{ marginTop: "5px" }}>
                    <Icon className="outlined">{reason.icon}</Icon>
                  </span>
                }
              />
            ))}
          </Box>
        )}

        {moodOptions.map((emoji) => (
          <Box
            key={emoji}
            sx={{
              px: 4,
              py: 1,
              display: "flex",
              gap: 2,
              mb: 2,
            }}
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
            <Box
              sx={{
                flexGrow: 1,
                pt: 0.8,
              }}
            >
              {reasons
                .filter(
                  (reason) =>
                    data &&
                    data.find(
                      (a) => a.reason === reason.name && a.mood === emoji
                    )
                )
                .map((reason) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Icon className="outlined">{reason.icon}</Icon>
                    <LinearProgress
                      variant="determinate"
                      sx={{
                        width: "100%",
                        "&, & *": {
                          borderRadius: 999,
                        },
                        height: 5,
                      }}
                      value={
                        data
                          ? (data.filter(
                              (a) =>
                                a.reason === reason.name && a.mood === emoji
                            ).length /
                              data.filter((a) => a.mood === emoji).length) *
                            100
                          : 0
                      }
                    />
                  </Box>
                ))}
            </Box>
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
    async (emoji: string, reason: string) => {
      try {
        await fetchApiWithoutHook("user/checkIns/setMood", {
          date: today,
          mood: emoji,
          reason,
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
          <Emoji
            key={emoji}
            emoji={emoji}
            handleMoodChange={handleMoodChange}
            mood={mood}
            data={data}
          />
        ))}
      </Box>
    </Box>
  );
}
