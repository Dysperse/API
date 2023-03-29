import {
  AppBar,
  Box,
  Button,
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const exportRef = useRef();

  const colorChoices = [
    "red",
    "teal",
    "green",
    "blue",
    "pink",
    "lime",
    "orange",
  ];
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

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <Icon>share</Icon>
        Share
      </MenuItem>

      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        anchor="bottom"
        disableSwipeToOpen
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
              onClick={handleClose}
              sx={{ color: "inherit", opacity: 0 }}
              disabled
            >
              <Icon>help</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Box
            ref={exportRef}
            sx={{
              background: colors[color]["A400"],
              color: "#000",
              p: 5,
              width: "100%",
              position: "relative",
              borderRadius: 5,
            }}
          >
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
            <Typography
              variant="h3"
              className="font-heading"
              gutterBottom
              sx={{ mt: 10 }}
            >
              {goal.name}
            </Typography>
            <Typography>
              <b>{goal.progress}</b> out of <b>{goal.durationDays}</b> days
              complete
            </Typography>
            <LinearProgress
              value={(goal.progress / goal.durationDays) * 100}
              variant="determinate"
              sx={{
                background: "rgba(0,0,0,0.1)",
                "& *": {
                  background: "#000",
                  borderRadius: 999,
                },
                height: 10,
                mt: 2,
                borderRadius: 999,
              }}
            />
          </Box>

          <Box ref={emblaRef} sx={{ maxWidth: "100vw" }} className="embla">
            <Box sx={{ display: "flex", gap: 2, my: 2, overflow: "visible" }}>
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
          </Box>
          <Button
            onClick={() => exportAsImage(exportRef.current, "test")}
            variant="contained"
          >
            Download <Icon>download</Icon>
          </Button>
        </Box>
      </SwipeableDrawer>
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
