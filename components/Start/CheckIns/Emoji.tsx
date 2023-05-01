import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  Slider,
  SwipeableDrawer,
  Typography,
  colors,
} from "@mui/material";
import dayjs from "dayjs";
import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { mutate } from "swr";
import { reasons } from ".";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";

function Overview() {
  const session = useSession();
  const { data, url, error } = useApi("user/checkIns/count", {
    lte: dayjs().add(1, "day"),
    gte: dayjs().subtract(7, "day"),
  });

  return (
    <Box
      sx={{
        background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
        p: 3,
        mb: 2,
        borderRadius: 5,
      }}
    >
      <Typography variant="h6">Overview</Typography>
      <Typography variant="body2">Past 7 days</Typography>
      {error && (
        <ErrorHandler
          error="Yikes! We couldn't load your past reflections! Please try again later."
          callback={() => mutate(url)}
        />
      )}
      <Box
        sx={{
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
              ? data.reverse().map((day) => {
                  return ["1f62d", "1f614", "1f610", "1f600", "1f601"].indexOf(
                    day.mood
                  );
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
    </Box>
  );
}

function Label({ code, sx = {} }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 3,
        ...sx,
      }}
    >
      <picture>
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${code}.png`}
          alt=""
          width={35}
        />
      </picture>
    </Box>
  );
}

const marks = [
  {
    value: 0,
    label: <Label code={"1f60e"} sx={{ ml: 3 }} />,
  },
  {
    value: 10,
    label: <Label code={"1f61f"} />,
  },
  {
    value: 20,
    label: <Label code={"1f630"} />,
  },
  {
    value: 30,
    label: <Label code={"1f62b"} sx={{ mr: 3 }} />,
  },
];

export function Emoji({ emoji, mood, data, handleMoodChange }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stress, setStress] = useState(10);

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const session = useSession();
  const [currentReason, setCurrentReason] = useState<null | string>(
    (data && data[0] && data[0].reason) || null
  );

  // for push notification
  const [alreadyTriggered, setAlreadyTriggered] = useState<boolean>(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", draggable: false },
    [AutoHeight()]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("scroll", (e) => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  });

  /**
   * If the notification action button === the emoji, open the modal
   */
  useEffect(() => {
    if (
      !alreadyTriggered &&
      window.location.hash &&
      window.location.hash.includes("#/")
    ) {
      let match = window.location.hash.split("#/")[1];
      if (match.includes("-")) {
        match = match.split("-")[1];
      }

      if (match) {
        if (match === emoji) {
          setOpen(true);
          window.location.hash = "";
          setAlreadyTriggered(true);
        }
      }
    }
  }, [emoji, alreadyTriggered]);

  return (
    <>
      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: false }}
        anchor="bottom"
        disableSwipeToOpen
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
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
                  currentIndex == 0 ? emoji : "1f4a5"
                }.png`}
                width="40px"
                height="40px"
              />
            </picture>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                {currentIndex == 0
                  ? "What is making you feel this way?"
                  : currentIndex == 1 && "How are your stress levels?"}
              </Typography>
              <Typography variant="body2">
                {currentIndex == 0
                  ? "Select the most relevant option."
                  : "Drag the slider to represent stress"}
              </Typography>
            </Box>
          </Typography>
          <LinearProgress
            value={((currentIndex + 1) / 4) * 100}
            variant="determinate"
            sx={{ borderRadius: 999, height: 2 }}
          />
        </Box>
        <Box
          sx={{
            pb: 2,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          ref={emblaRef}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "100vw",
              transition: "height .4s",
            }}
          >
            <Box sx={{ flexGrow: 1, flex: "0 0 100%" }}>
              <Box sx={{ p: 3, pb: 0, pt: 0 }}>
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
                          },
                          display: "flex",
                          background: `hsl(240,11%,${
                            session.user.darkMode ? 10 : 97
                          }%)!important`,
                          gap: 2,
                          ...(currentReason === reason.name && {
                            borderColor: `hsl(240,11%,${
                              session.user.darkMode ? 90 : 50
                            }%)!important`,
                            background: `hsl(240,11%,${
                              session.user.darkMode ? 10 : 100
                            }%)!important`,
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
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={() => {
                    handleMoodChange(emoji, currentReason);
                    emblaApi?.scrollTo(1);
                  }}
                  sx={{ mt: 2 }}
                  disabled={!currentReason}
                >
                  Next
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                flex: "0 0 100%",
                overflow: "hidden",
                "& .MuiSlider-mark": {
                  display: "none",
                },
                "& .MuiSlider-rail": {
                  background: `hsl(240,11%,${
                    session.user.darkMode ? 10 : 80
                  }%)`,
                },
                "& .MuiSlider-rail, & .MuiSlider-track": {
                  height: 20,
                  overflow: "hidden",
                },
                "& .MuiSlider-track": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
                "& .MuiSlider-thumb": {
                  boxShadow: 0,
                  background: `hsl(240,11%,${
                    session.user.darkMode ? 10 : 90
                  }%)`,
                  border: "4px solid currentColor",
                },
              }}
            >
              <Box sx={{ px: 3 }}>
                <Box
                  sx={{
                    display: "block",
                    height: "100px",
                  }}
                >
                  <Slider
                    value={stress}
                    onChange={(_, newValue: any) => setStress(newValue)}
                    max={30}
                    step={10}
                    marks={marks}
                  />
                </Box>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                  {stress === 0
                    ? "No stress!"
                    : stress === 10
                    ? "A little"
                    : stress === 20
                    ? "High"
                    : "Really high"}
                </Typography>
                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}
                >
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={() => emblaApi?.scrollTo(0)}
                  >
                    Back
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={() => emblaApi?.scrollTo(2)}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                flex: "0 0 100%",
                display: "flex",
                px: 3,
                flexDirection: "column",
              }}
            >
              <Overview />
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  onClick={() => emblaApi?.scrollTo(0)}
                >
                  Restart
                </Button>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleClose}
                >
                  Done
                </Button>
              </Box>
            </Box>
          </div>
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
            width="100%"
            height="100%"
          />
        </picture>
      </IconButton>
    </>
  );
}
