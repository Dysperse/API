import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  LinearProgress,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { cloneElement, useEffect, useRef, useState } from "react";
import { useSession } from "../../../lib/client/useSession";
import { colors } from "../../../lib/colors";
import { exportAsImage } from "./MoreOptions";

export function ShareGoal({ children, goal }) {
  const session = useSession();

  const exportRefs = {
    "0": useRef(),
    "1": useRef(),
    "2": useRef(),
  };

  const [open, setOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exportFooterOpen, setExportFooterOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!session.user.darkMode)
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", open ? "hsl(240,11%,10%)" : "#fff");
  }, [session, open]);

  const colorChoices = [
    "red",
    "teal",
    "green",
    "cyan",
    "pink",
    "lime",
    "orange",
    "deepOrange",
    "blueGrey",
  ];

  const header = (
    <picture>
      <img
        src="/logo.svg"
        alt="Logo"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
        }}
      />
    </picture>
  );

  const progressBarStyles = {
    background: "rgba(0,0,0,0.1)",
    "& *": {
      background: "#000",
      borderRadius: 2,
    },
    height: 10,
    borderRadius: 2,
  };

  const [color, setColor] = useState("red");
  const [screenshotting, setScreenshotting] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  const [emblaCardRef, emblaCardApi] = useEmblaCarousel(
    {
      loop: false,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (emblaCardApi) {
      emblaCardApi.on("select", () => {
        setCurrentIndex(emblaCardApi?.selectedScrollSnap());
      });
    }
  }, [emblaCardApi]);

  const footerCardStyles = {
    transition: "all .2s",
    transformOrigin: "top center",
    ...(exportFooterOpen && {
      transform: "scale(0.9)",
    }),
  };

  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });
  return (
    <>
      {trigger}

      <Drawer
        open={open}
        onClose={handleClose}
        anchor="bottom"
        sx={{
          zIndex: 9999999,
        }}
        PaperProps={{
          sx: {
            height: "100vh",
            background: "hsl(240,11%,10%)",
            color: "hsl(240,11%,90%)",
            borderRadius: 0,
          },
        }}
      >
        <AppBar sx={{ border: 0, background: "none", color: "inherit" }}>
          <Toolbar>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "inherit!important",
                opacity: exportFooterOpen ? 0 : 1,
                transform: exportFooterOpen ? "scale(0.7)" : "",
                transition: "transform .2s,opacity .2s",
              }}
              disabled={exportFooterOpen}
            >
              <Icon>close</Icon>
            </IconButton>
            <Typography
              sx={{
                mx: "auto",
                ml: exportFooterOpen ? "-20px" : "15px",
                transition: "margin .2s",
                fontWeight: 700,
              }}
            >
              Share
            </Typography>
            <IconButton
              onClick={() => setExportFooterOpen(!exportFooterOpen)}
              sx={{
                color: "inherit!important",
                ...(exportFooterOpen && {
                  background: "hsl(240,11%,14%)!important",
                }),
              }}
            >
              <Icon className="outlined">
                {exportFooterOpen ? "close" : "palette"}
              </Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: exportFooterOpen ? 0 : 1,
            transition: "opacity .2s",
            background: "hsla(240,11%,40%,0.3)",
            p: 1,
            px: 3,
            borderRadius: 999,
          }}
        >
          {currentIndex + 1} / 3
        </Box>

        <Box ref={emblaCardRef} className="embla">
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <Box
                ref={exportRefs[0]}
                sx={{
                  background: colors[color]["A400"],
                  color: "#000",
                  p: 5,
                  position: "relative",
                  borderRadius: 5,
                  ...footerCardStyles,
                }}
              >
                {header}
                <Typography
                  variant="h3"
                  className="font-heading"
                  gutterBottom
                  sx={{ mt: 10 }}
                >
                  {goal.name}
                </Typography>
                <Typography
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Only <b>{goal.durationDays - goal.progress}</b> days left to
                  go! I&apos;ve been working on this goal for{" "}
                  <b>{goal.progress}</b> days so far.
                </Typography>
                <LinearProgress
                  value={(goal.progress / goal.durationDays) * 100}
                  variant="determinate"
                  sx={progressBarStyles}
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <Box
                ref={exportRefs[1]}
                sx={{
                  background: colors[color]["A400"],
                  color: "#000",
                  p: 5,
                  position: "relative",
                  height: "auto",
                  borderRadius: 5,
                  ...footerCardStyles,
                }}
              >
                {header}
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0,0,0,0.7)", mt: 7 }}
                >
                  {goal.name}
                </Typography>
                <div style={{ height: "2px" }} />
                <Typography variant="h4">
                  {goal.progress} out of {goal.durationDays}
                </Typography>
                <div style={{ marginTop: "2px" }} />
                <Typography
                  variant="body2"
                  style={{
                    color: "rgba(0,0,0,0.7)",
                    marginBottom: "20px",
                    marginTop: screenshotting ? "10px" : "0px",
                  }}
                >
                  {goal.progress !== goal.durationDays ? (
                    <>days worked on</>
                  ) : (
                    "I completed this goal!"
                  )}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(goal.progress / goal.durationDays) * 100}
                  sx={{ ...progressBarStyles, height: 25 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <Box
                ref={exportRefs[2]}
                sx={{
                  background: colors[color]["A400"],
                  color: "#000",
                  p: 5,
                  position: "relative",
                  height: "auto",
                  borderRadius: 5,
                  ...footerCardStyles,
                }}
              >
                {header}
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0,0,0,0.7)", mt: 7 }}
                >
                  PROGRESS
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ my: 0.5, mb: screenshotting ? 1.5 : 0.5 }}
                    >
                      {goal.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(0,0,0,0.7)", mb: 2 }}
                    >
                      I&apos;ve been working on this goal for {goal.progress}{" "}
                      days!
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                      height: 80,
                      width: 80,
                      display: "flex",
                      alignItems: "center",
                      ml: "auto",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={80}
                      thickness={4}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        "& *": {
                          stroke: "#000",
                          strokeOpacity: 0.2,
                          strokeLinecap: "round",
                        },
                      }}
                    />
                    <Typography
                      component="div"
                      variant="h6"
                      style={{
                        width: 80,
                        textAlign: "center",
                        ...(screenshotting && {
                          marginTop: "-17px",
                        }),
                      }}
                    >
                      {Math.round((goal.progress / goal.durationDays) * 100)}%
                    </Typography>
                    <CircularProgress
                      variant="determinate"
                      size={80}
                      thickness={4}
                      value={(goal.progress / goal.durationDays) * 100}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        strokeLinecap: "round",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <SwipeableDrawer
          open={exportFooterOpen}
          onOpen={() => setExportFooterOpen(true)}
          onClose={() => setExportFooterOpen(false)}
          sx={{
            zIndex: 9999999999,
            height: "0px!important",
          }}
          hideBackdrop
          swipeAreaWidth={300}
          BackdropProps={{
            className: "override-bg",
            sx: {
              display: "none !important",
            },
          }}
          anchor="bottom"
          PaperProps={{
            sx: {
              background: "hsla(240,11%,20%,0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px 20px 0 0",
            },
          }}
        >
          <Box
            className="puller"
            sx={{
              width: "50px",
              mx: "auto",
              height: "2px",
              my: 3,
              mt: 2,
              background: "hsla(240,11%,40%,0.5)",
            }}
          />
          <Box
            ref={emblaRef}
            sx={{ maxWidth: "100vw", p: 3, py: 0, my: 1.5, mb: 3 }}
            className="embla"
          >
            <Box sx={{ display: "flex", gap: 2, mb: 3, overflow: "visible" }}>
              {colorChoices.map((choice) => (
                <Box
                  key={choice}
                  sx={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    background: `linear-gradient(45deg, ${colors[choice]["A400"]}, ${colors[choice]["A100"]})`,
                    borderRadius: 999,
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setColor(choice)}
                >
                  {choice === color && <Icon>check</Icon>}
                </Box>
              ))}
            </Box>
            <Button
              onClick={() => {
                setExportFooterOpen(false);
                setScreenshotting(true);
                setTimeout(() => {
                  exportAsImage(exportRefs[currentIndex].current, "test");
                  setScreenshotting(false);
                }, 400);
              }}
              variant="contained"
              fullWidth
              sx={{
                background: "hsla(240,11%,10%,0.4)!important",
                "&:hover": {
                  background: "hsla(240,11%,10%,0.8)!important",
                },
                color: "hsl(240,11%,90%)",
              }}
            >
              Save to gallery <Icon>download</Icon>
            </Button>
          </Box>
        </SwipeableDrawer>
      </Drawer>
    </>
  );
}
