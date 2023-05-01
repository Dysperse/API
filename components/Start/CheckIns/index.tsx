import {
  Alert,
  AppBar,
  Avatar,
  Box,
  CardActionArea,
  Chip,
  Icon,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { mutate } from "swr";
import { capitalizeFirstLetter } from "../../../lib/client/capitalizeFirstLetter";
import { fetchRawApi, useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { toastStyles } from "../../../lib/client/useTheme";
import { colors } from "../../../lib/colors";
import { InfoModal } from "./InfoModal";
import { Emoji } from "./Reflect/Emoji";
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

export function DailyCheckInDrawer({ mood }) {
  const session = useSession();

  const [showKey, setShowKey] = useState(false);
  const [lastBy, setLastBy] = useState<number>(7);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  const { data } = useApi("user/checkIns/count", {
    lte: dayjs().add(1, "day"),
    gte: dayjs().subtract(lastBy, "day"),
  });

  const drawerStyles = {
    width: "100%",
    maxWidth: "600px",
    borderRadius: 0,
    height: "100vh",
    maxHeight: "100vh",
  };

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
  return (
    <>
      <CardActionArea
        id="overviewTrigger"
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
            sx={{
              fontWeight: "900",
              mb: 0.4,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {!mood && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  background:
                    "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
                  borderRadius: 99,
                  flexShrink: 0,
                }}
              />
            )}
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
        ModalProps={{ keepMounted: false }}
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

        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              ...((!data || (data && data.length < 4)) && {
                filter: "blur(5px)",
                opacity: 0.8,
              }),
            }}
          >
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
              <MenuItem
                selected={lastBy === 7}
                onClick={() => handleMenuClose(7)}
              >
                7 days
              </MenuItem>
              <MenuItem
                selected={lastBy === 14}
                onClick={() => handleMenuClose(14)}
              >
                14 days
              </MenuItem>
              <MenuItem
                selected={lastBy === 30}
                onClick={() => handleMenuClose(30)}
              >
                30 days
              </MenuItem>
              <MenuItem
                selected={lastBy === 365}
                onClick={() => handleMenuClose(365)}
              >
                365 days
              </MenuItem>
            </Menu>
            <Box
              sx={{
                px: 4,
                mb: 2,
                height: "auto",
                display: "flex",
                gap: 2,
              }}
            >
              <Sparklines
                data={[
                  ...(data && data.length < 4
                    ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
                    : data && data.length > 0
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
                    fill: session.user.darkMode ? "hsl(240,11%,15%)" : "white",
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
                  style={{
                    gap: "10px",
                    paddingLeft: "20px",
                    marginTop: "10px",
                  }}
                >
                  <div>&nbsp;</div>
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
                          ...(session.user.darkMode && {
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
              sx={{
                p: 4,
                pb: 1,
                pt: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              By mood &amp; reason
              <IconButton
                sx={{
                  ml: "auto",
                  ...(showKey && {
                    background: session.user.darkMode
                      ? "hsl(240,11%,30%)!important"
                      : "rgba(200,200,200,.3)!important",
                    color: session.user.darkMode
                      ? "#fff!important"
                      : "#000!important",
                  }),
                }}
                onClick={() => setShowKey(!showKey)}
              >
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
                    key={reason.name}
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

            {moodOptions
              .filter((emoji) =>
                reasons.find(
                  (reason) =>
                    data &&
                    data.find(
                      (a) => a.reason === reason.name && a.mood === emoji
                    )
                )
              )
              .map((emoji) => (
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
                        loading="lazy"
                        alt="emoji"
                        width="100%"
                        height="100%"
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
                      .sort((prevReason, reason) => {
                        const prevLength = data
                          ? (data.filter(
                              (a) =>
                                a.reason === prevReason.name && a.mood === emoji
                            ).length /
                              data.filter((a) => a.mood === emoji).length) *
                            100
                          : 0;

                        const nextLength = data
                          ? (data.filter(
                              (a) =>
                                a.reason === reason.name && a.mood === emoji
                            ).length /
                              data.filter((a) => a.mood === emoji).length) *
                            100
                          : 0;

                        if (prevLength > nextLength) {
                          return -1;
                        }
                        if (prevLength < nextLength) {
                          return 1;
                        }

                        // names must be equal
                        return 0;
                      })
                      .map((reason) => (
                        <Box
                          key={reason.name}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Tooltip title={reason.name} placement="right">
                            <Icon className="outlined">{reason.icon}</Icon>
                          </Tooltip>
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
                                      a.reason === reason.name &&
                                      a.mood === emoji
                                  ).length /
                                    data.filter((a) => a.mood === emoji)
                                      .length) *
                                  100
                                : 0
                            }
                          />
                        </Box>
                      ))}
                  </Box>
                </Box>
              ))}
          </div>
          {data && data.length < 4 && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                background: session.user.darkMode ? "#000" : "#eee",
                fontSize: "14px",
                fontWeight: 700,
                borderRadius: 5,
                p: 2,
              }}
            >
              Not enough data yet - complete {4 - data.length} more check-ins
              daily to view your chart.
            </Box>
          )}
        </div>
        <Box sx={{ px: 3 }}>
          <Alert icon="🧠">
            Your mental health is private, and other members won&apos;t be able
            to view anything here
          </Alert>
        </Box>
        <Box sx={{ mt: 5 }} />
      </SwipeableDrawer>
    </>
  );
}

export function DailyCheckIn() {
  const [mood, setMood] = useState<string | null>(null);
  const today = dayjs().startOf("day");
  const { data, url: mutationUrl } = useApi("user/checkIns", {
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
    async (emoji: string, reason: string, stress: number) => {
      try {
        await fetchRawApi("user/checkIns/setMood", {
          date: today,
          mood: emoji,
          reason,
          stress,
        });
        await mutate(mutationUrl);
      } catch (e) {
        toast.error(
          "Oh no! Something went wrong while trying to save your mood!",
          toastStyles
        );
      }
    },
    [today, mutationUrl]
  );
  const session = useSession();

  return (
    <Box
      sx={{
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
        border: "1px solid",
        borderColor: session.user.darkMode
          ? "hsl(240, 11%, 20%)"
          : "rgba(200, 200, 200, 0.3)",
        borderRadius: 5,
      }}
    >
      <DailyCheckInDrawer mood={mood} />
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
