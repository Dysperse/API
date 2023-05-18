import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
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
import { useCallback, useState } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { InfoModal } from "./InfoModal";
import { moodOptions, reasons } from "./index";

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
    ...(!session.user.darkMode && { background: "#fff" }),
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

  const moodIcons = moodOptions.reverse();
  const defaultMood = [0];

  const chartData = data?.length
    ? data
        .slice(0, lastBy)
        .reverse()
        .map((day) => moodIcons.indexOf(day.mood))
    : data?.length < 4
    ? [1, 7, 3, 6, 7, 8, 2, 5, 4, 7, 6, 4, 3]
    : defaultMood;

  return (
    <>
      <CardActionArea
        id="overviewTrigger"
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

        <div style={{ position: "relative" }}>
          <div
            style={{
              ...((!data || data.length < 4) && {
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
              <Sparklines data={chartData} margin={6}>
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
              .filter((emoji) => {
                return reasons.some((reason) => {
                  return (
                    data &&
                    data.some(
                      (a) => a.reason === reason.name && a.mood === emoji
                    )
                  );
                });
              })
              .map((emoji) => {
                const filteredReasons = reasons
                  .filter((reason) => {
                    return (
                      data &&
                      data.some(
                        (a) => a.reason === reason.name && a.mood === emoji
                      )
                    );
                  })
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
                          (a) => a.reason === reason.name && a.mood === emoji
                        ).length /
                          data.filter((a) => a.mood === emoji).length) *
                        100
                      : 0;
                    return prevLength > nextLength
                      ? -1
                      : prevLength < nextLength
                      ? 1
                      : 0;
                  });
                return (
                  <Box
                    key={emoji}
                    sx={{ px: 4, py: 1, display: "flex", gap: 2, mb: 2 }}
                  >
                    <IconButton
                      key={emoji}
                      sx={{ p: 0, width: 35, height: 35 }}
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
                    <Box sx={{ flexGrow: 1, pt: 0.8 }}>
                      {filteredReasons.map((reason) => (
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
                              "&, & *": { borderRadius: 999 },
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
                );
              })}
          </div>
          {data?.length < 4 && (
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
