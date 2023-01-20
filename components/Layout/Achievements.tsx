import {
  AppBar,
  Box,
  Chip,
  Drawer,
  Icon,
  IconButton,
  LinearProgress,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { achievements } from "./achievements";

export const Achievement: any = React.memo(function Achievement({
  achievement,
  index,
}: any) {
  return (
    <Box
      key={index}
      sx={{
        p: 2,
        px: 3,
        background: global.user.darkMode
          ? "hsl(240,11%,20%)"
          : "rgba(200,200,200,.3)",
        borderRadius: 5,
        mb: 2,
      }}
    >
      <Chip
        label={achievement.type.split(":")[0]}
        sx={{
          textTransform: "capitalize",
          background: global.user.darkMode
            ? "hsl(240,11%,30%)"
            : "rgba(200,200,200,.3)",
          mb: 1,
        }}
        size="small"
      />
      <Typography
        sx={{
          fontWeight: "700",
          textDecoration: "underline",
        }}
      >
        {achievement.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.8,
          whiteSpace: "nowrap",
          mb: 1,
        }}
      >
        {achievement.description}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          color="warning.main"
          variant="body2"
          sx={{
            fontWeight: "600",
          }}
        >
          Level 1
        </Typography>
        <LinearProgress
          variant="determinate"
          color="warning"
          sx={{ height: 3, flexGrow: 1, borderRadius: 999 }}
          value={Math.random() * 100}
        />
      </Box>
    </Box>
  );
});

export function Achievements({ styles }) {
  const [open, setOpen] = useState(false);
  const availableAchievements = achievements;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
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
          <Toolbar className="flex" sx={{ height: "var(--navbar-height)" }}>
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
        <Box>
          <Box
            sx={{
              position: "relative",
              display: "block",
              height: "350px",
              mt: "calc(var(--navbar-height) * -1)",
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
          >
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
              TO BE UNLOCKED
            </Typography>
            {availableAchievements.map((achievement: any, index) => (
              <Achievement
                achievement={achievement}
                key={index}
                index={index}
              />
            ))}
          </Box>
        </Box>
      </Drawer>
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
