import {
  Backdrop,
  Box,
  Button,
  Icon,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { cloneElement, useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Task } from "../components/Coach/DailyRoutine/Task";
import { useSession } from "../lib/client/useSession";

export function Stories({
  onOpen,
  overlay,
  currentIndex,
  setCurrentIndex,
  children,
  stories,
}) {
  const session = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!session.user.darkMode)
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", open ? "hsl(240,11%,10%)" : "#fff");
  }, [session, open]);

  const handleOpen = useCallback(async () => {
    await onOpen();
    setShowOverlay(true);
    setOpen(true);
    setCurrentIndex(0);
    setTimeout(() => setShowOverlay(false), 2000);
  }, [onOpen, setCurrentIndex]);

  const handleClose = useCallback(() => setOpen(false), []);

  const handlePrev = useCallback(
    () => setCurrentIndex((i) => (i == 0 ? i : i - 1)),
    [setCurrentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex === stories.length - 1) handleClose();
    setCurrentIndex((i) => (i == stories.length - 1 ? i : i + 1));
  }, [stories.length, setCurrentIndex, currentIndex, handleClose]);

  const trigger = cloneElement(children, { onClick: handleOpen });

  useHotkeys("ArrowRight", () => open && handleNext());
  useHotkeys("ArrowLeft", () => open && handlePrev());

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        disableSwipeToOpen
        anchor="bottom"
        PaperProps={{
          sx: {
            background: "hsl(240, 11%, 10%)",
            color: "hsl(240, 11%, 90%)",
            overflow: "visible",
            height: "100vh",
            borderRadius: 0,
            userSelect: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: open ? "-9px" : "0px",
            transition: "all .2s",
            left: "0px",
            width: "100%",
            height: "10px",
            borderRadius: "50px 50px 0 0",
            background: "hsl(240, 11%, 10%)",
            zIndex: 999,
          }}
        />
        <Backdrop
          open={showOverlay}
          onClick={() => setShowOverlay(false)}
          onTouchStart={() => setShowOverlay(false)}
          onMouseDown={() => setShowOverlay(false)}
          sx={{
            flexDirection: "column",
            gap: 2,
            backdropFilter: "blur(5px)",
            zIndex: 999999999999999999,
          }}
          className="override-bg"
        >
          {overlay}
        </Backdrop>
        <Box
          sx={{
            display: "flex",
            background: "hsl(240,11%,5%)",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              background: "hsl(240, 11%, 10%)",
              flexGrow: 1,
              transition: "all .2s",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: stories[currentIndex].footer
                ? "0 0 10px 10px"
                : "0px",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 20,
                color: "hsl(240,11%,90%)",
                "&:hover": {
                  color: "#fff",
                },
                zIndex: 9,
                right: 10,
              }}
            >
              <Icon>close</Icon>
            </IconButton>
            <Box
              sx={{
                width: "50%",
                position: "absolute",
                top: 0,
                left: 0,
                height: "100vh",
              }}
              onClick={handlePrev}
            />
            <Box
              sx={{
                width: "50%",
                position: "absolute",
                top: 0,
                right: 0,
                height: "100vh",
              }}
              onClick={handleNext}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                zIndex: 9999,
                mb: "auto",
                p: 1,
              }}
            >
              {[...new Array(stories.length)].map((e, i) => (
                <Box
                  key={e}
                  sx={{
                    width: "100%",
                    height: 2,
                    background:
                      currentIndex > i ? "#fff" : "hsla(240,11%,50%,.7)",
                    borderRadius: 999,
                  }}
                />
              ))}
            </Box>
            {stories[currentIndex].content}
            <Box sx={{ mb: "auto" }} />
          </Box>
          {stories[currentIndex].footer && stories[currentIndex].footer}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const footer = (
    <Box
      sx={{
        background: "hsl(240,11%,5%)",
        mt: "auto",
        p: 2,
        zIndex: 999999,
        display: "flex",
        transition: "all .2s",
      }}
    >
      <Button size="small" sx={{ color: "#fff" }}>
        <Icon className="outlined" sx={{ mt: "-5px" }}>
          local_fire_department
        </Icon>
        Activity
      </Button>
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          gap: 1,
          "& .MuiIconButton-root": {
            "&:hover": { color: "#fff!important" },
            "&:active": { background: "hsl(240,11%,10%)!important" },
          },
        }}
      >
        <IconButton color="inherit" size="small">
          <Icon>ios_share</Icon>
        </IconButton>
        <IconButton color="inherit" size="small">
          <Icon>more_vert</Icon>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Stories
        onOpen={() => {}}
        overlay={<>hi</>}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        stories={[
          {
            content: (
              <Task
                task={{
                  stepName: "hi",
                  lastCompleted: "2023-04-04",
                  durationDays: 100,
                  progress: 8,
                }}
                currentIndex={0}
                setCurrentIndex={() => {}}
              />
            ),
            footer,
          },
          {
            content: (
              <Typography variant="h1" key={1}>
                slide 2
              </Typography>
            ),
            footer,
          },
          {
            content: (
              <Typography variant="h1" key={1}>
                slide 3
              </Typography>
            ),
          },
        ]}
      >
        <Button>open 1</Button>
      </Stories>
    </>
  );
}
