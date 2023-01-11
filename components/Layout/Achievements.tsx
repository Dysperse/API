import {
  AppBar,
  Box,
  Icon,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

export function Achievements({ styles }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "700px",
            width: "100%",
            m: { sm: "20px" },
            maxHeight: { sm: "calc(100vh - 40px)" },
            height: "100%",
            borderRadius: { sm: 5 },
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 1,
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>
              Achievements
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              sx={{ opacity: 0, pointerEvents: "none" }}
            >
              <Icon>more_horiz</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "sticky",
            mt: "-70px",
            height: "350px",
          }}
        >
          <picture>
            <img
              src={
                global.user.darkMode
                  ? "/images/stats-banner.png"
                  : "https://cdn.dribbble.com/users/1731254/screenshots/11649852/nature_gradients_illustration_tubikarts_4x.png?resize=1400x400&compress=1"
              }
              alt="Achievement banner"
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                opacity: ".5",
                left: 0,
                objectFit: "cover",
                zIndex: -1,
              }}
            />
          </picture>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 1,
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                textDecoration: "underline",
                fontWeight: "600",
              }}
            >
              Achievements coming soon!
            </Typography>
            <Typography variant="body1">
              Earn badges &amp; compare achievement by completing tasks,
              achieving goals, and more!
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 5,
          }}
        ></Box>
      </SwipeableDrawer>
      <Tooltip title="Achievements">
        <IconButton
          color="inherit"
          disableRipple
          onClick={() => {
            setOpen(true);
          }}
          sx={styles}
        >
          <Icon className="outlined">auto_graph</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
}
