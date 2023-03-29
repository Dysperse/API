import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Icon,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import html2canvas from "html2canvas";
import React, { useRef, useState } from "react";
import { mutate } from "swr";
import { fetchRawApi } from "../../lib/client/useApi";
import { colors } from "../../lib/colors";
import { ConfirmationModal } from "../ConfirmationModal";

const exportAsImage = async (el, imageFileName) => {
  const canvas = await html2canvas(el, { backgroundColor: null });
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};
const downloadImage = (blob, fileName) => {
  const fakeLink: any = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};

function ShareGoal({ handleMenuClose, goal }) {
  const [open, setOpen] = useState<boolean>(false);
  const [exportFooterOpen, setExportFooterOpen] = useState<boolean>(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const exportRef = useRef();

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

  const repeatText =
    goal.time === "any"
      ? "Daily"
      : goal.time === "morning"
      ? "Every morning"
      : goal.time === "afternoon"
      ? "Every afternoon"
      : "Nightly";
  const progressBarStyles = {
    background: "rgba(0,0,0,0.1)",
    "& *": {
      background: "#000",
      borderRadius: 999,
    },
    height: 10,
    mt: 2,
    borderRadius: 999,
  };

  const [color, setColor] = useState("red");

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

  const footerCardStyles = {
    transition: "all .2s",
    transformOrigin: "top center",
    ...(exportFooterOpen && {
      transform: "scale(0.8)",
    }),
  };
  return (
    <>
      <MenuItem onClick={handleOpen}>
        <Icon>share</Icon>
        Share
      </MenuItem>

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
              sx={{ color: "inherit!important" }}
            >
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto" }}>Share</Typography>
            <IconButton
              onClick={() => setExportFooterOpen(true)}
              sx={{ color: "inherit!important" }}
              disabled={exportFooterOpen}
            >
              <Icon className="outlined">edit</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box ref={emblaCardRef} className="embla">
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: "0 0 100%",
              }}
            >
              <Box
                ref={exportRef}
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
                <Typography>
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
                <Typography variant="h4" sx={{ my: 0.5 }}>
                  {goal.progress} out of {goal.durationDays}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0,0,0,0.7)", mb: 2 }}
                >
                  {goal.progress !== goal.durationDays ? (
                    <>
                      {goal.durationDays - goal.progress} days left &bull;{" "}
                      {repeatText}
                    </>
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
                    <Typography variant="h4" sx={{ my: 0.5 }}>
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
                          stroke: "rgba(0,0,0,0.5)",
                          strokeLinecap: "round",
                        },
                      }}
                    />
                    <Typography
                      component="div"
                      variant="h6"
                      sx={{
                        width: 80,
                        textAlign: "center",
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
          onOpen={() => {
            setExportFooterOpen(true);
          }}
          onClose={() => {
            setExportFooterOpen(false);
          }}
          sx={{
            zIndex: 9999999999,
            height: "0px!important",
          }}
          hideBackdrop
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
            sx={{ maxWidth: "100vw", p: 3, py: 0 }}
            className="embla"
          >
            <Box sx={{ display: "flex", gap: 2, mb: 2, overflow: "visible" }}>
              {colorChoices.map((choice) => (
                <Box
                  key={choice}
                  sx={{
                    flexShrink: 0,
                    width: 35,
                    height: 35,
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
              onClick={() => exportAsImage(exportRef.current, "test")}
              variant="contained"
              fullWidth
              sx={{
                background: "hsla(240,11%,10%,0.4)!important",
                "&:hover": {
                  background: "hsla(240,11%,10%,0.8)!important",
                },
                color: "hsl(240,11%,90%)",
                mb: 2,
              }}
            >
              Download <Icon>download</Icon>
            </Button>
          </Box>
        </SwipeableDrawer>
      </Drawer>
    </>
  );
}

export function MoreOptions({ goal, mutationUrl, setOpen }): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <ShareGoal handleMenuClose={handleClose} goal={goal} />
        <ConfirmationModal
          title="Stop goal?"
          question="Are you sure you want to stop working towards this goal? ALL your progress will be lost FOREVER. You won't be able to undo this action!"
          callback={() => {
            handleClose();
            fetchRawApi("user/routines/delete", {
              id: goal.id,
            }).then(async () => {
              await mutate(mutationUrl);
              setOpen(false);
            });
          }}
        >
          <MenuItem disabled={goal.completed}>
            <Icon>stop</Icon> Stop goal
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          color: "#000",
          position: "absolute",
          top: 0,
          right: 0,
          m: 3,
        }}
      >
        <Icon>more_vert</Icon>
      </IconButton>
    </>
  );
}
