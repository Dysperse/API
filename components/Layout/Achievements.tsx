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
import Image from "next/image";
import React, { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useStatusBar } from "../../hooks/useStatusBar";
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

export default function Achievements({ styles }) {
  const [open, setOpen] = useState(false);
  const availableAchievements = achievements;
  useStatusBar(open);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        ModalProps={{
          keepMounted: false,
        }}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: { sm: "500px" },
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
            background: "transparent",
            color: "#fff",
          }}
        >
          <Toolbar className="flex" sx={{ height: "var(--navbar-height)" }}>
            <IconButton color="inherit" onClick={() => setOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>
              Achievements
            </Typography>
            <IconButton
              color="inherit"
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
              height: "50vh",
              color: "#fff",
              mt: "calc(var(--navbar-height) * -1)",
            }}
          >
              <Image
                placeholder="blur"
                blurDataURL="data:image/png;base64,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"
                src="/images/stats-banner.png"
                height={1080}
                width={1920}
                alt="Achievement banner"
                style={{
                  height: "50vh",
                  width: "100%",
                  filter: "brightness(0.5)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  objectFit: "cover",
                  zIndex: -1,
                }}
              />
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
            <Virtuoso
              style={{ height: "50vh" }}
              totalCount={availableAchievements.length}
              itemContent={(index) => (
                <Achievement
                  achievement={availableAchievements[index]}
                  key={index}
                  index={index}
                />
              )}
            />
          </Box>
        </Box>
      </Drawer>
      <Tooltip title="Achievements">
        <IconButton
          id="achievementsTrigger"
          color="inherit"
          onClick={() => setOpen(true)}
          sx={styles}
        >
          <Icon className="outlined">insights</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
}
