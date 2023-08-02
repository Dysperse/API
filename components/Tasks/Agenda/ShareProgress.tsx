import { exportAsImage } from "@/components/Coach/Goal/Options";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Button, Icon, SwipeableDrawer, Typography } from "@mui/material";
import dayjs from "dayjs";
import { cloneElement, useRef, useState } from "react";

export function ShareProgress({ day, children, data, tasksLeft }) {
  const ref = useRef();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const trigger = cloneElement(children, {
    onClick: (e) => {
      e.stopPropagation();
      setOpen(true);
    },
  });

  const handleExport = async () => {
    setExporting(true);
    setTimeout(async () => {
      await exportAsImage(ref.current, "progress.png");
    }, 50);
    setExporting(false);
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        anchor="bottom"
        sx={{ zIndex: 9999999 }}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Puller showOnDesktop />
        <Box
          sx={{
            background: palette[9],
            p: 3,
            position: "relative",
            color: "#000",
            ...(exporting && {
              transform: "scale(3)",
            }),
          }}
          ref={ref}
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

          <Typography sx={{ opacity: 0.7, mt: 10 }}>
            {dayjs(day.unchanged).format("MMMM D, YYYY")}
          </Typography>
          <Typography variant="h3" className="font-heading" sx={{ mt: 1 }}>
            I finished {data.length - tasksLeft} task
            {data.length - tasksLeft !== 1 && "s"} today!
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ opacity: 0.8 }}>
            {tasksLeft === 0
              ? "Conquered my entire to-do list like a boss."
              : `Only ${tasksLeft} more to conquer.`}
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            onClick={handleExport}
            variant="outlined"
            size="large"
            disabled={exporting}
            fullWidth
            sx={{ borderWidth: "2px!important" }}
          >
            <Icon>download</Icon>Save to camera roll
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}