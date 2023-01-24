import {
  AppBar,
  Box,
  Chip,
  Icon,
  IconButton,
  Slider,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { MoreOptions } from "./MoreOptions";
import { TrophyModal } from "./TrophyModal";

export function Goal({ goal, mutationUrl }: any): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    tag.setAttribute(
      "content",
      open
        ? colors[themeColor][900]
        : global.user.darkMode
        ? "hsl(240,11%,10%)"
        : "#fff"
    );
  });

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <Box
        className="active:scale-[.98] shadow-md border"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 5,
          py: 2,
          transition: "all .2s!important",
          px: 3,
          mb: 1,
          cursor: "pointer",
          background: {
            sm: global.user.darkMode ? "hsl(240,11%,13%)" : "#fff",
          },
          borderBottom: {
            xs: global.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid #ddd",
            sm: "none",
          },
          userSelect: "none",
        }}
      >
        <Typography
          className="font-semibold"
          variant="h6"
          sx={{
            ...(goal.completed && {
              opacity: 0.6,
            }),
          }}
        >
          {goal.name}
        </Typography>
        <Typography
          variant="body2"
          className="text-gray-500"
          style={{
            ...(goal.completed && {
              opacity: 0.6,
            }),
            ...(goal.progress === goal.durationDays && {
              color: colors[goal.completed ? "green" : "deepOrange"][500],
              fontWeight: 600,
            }),
          }}
        >
          {goal.progress !== goal.durationDays ? (
            <>
              {goal.time === "any"
                ? "Daily"
                : goal.time === "morning"
                ? "Every morning"
                : goal.time === "afternoon"
                ? "Every afternoon"
                : "Nightly"}{" "}
              &bull; {goal.durationDays - goal.progress} days left
            </>
          ) : goal.completed ? (
            "Goal complete!"
          ) : (
            <>Goal complete! Tap to claim your reward!</>
          )}
        </Typography>
        <div
          className="flex gap-3 items-center"
          style={{
            ...(goal.progress === goal.durationDays && {
              color: colors[goal.completed ? "green" : "deepOrange"]["800"],
            }),
            ...(goal.completed && {
              opacity: 0.6,
            }),
          }}
        >
          <Slider
            value={goal.progress}
            max={goal.durationDays}
            step={
              goal.durationDays > 50 ? Math.round(goal.durationDays / 50) : 1
            }
            marks
            sx={{
              pointerEvents: "none",
              "& .MuiSlider-thumb": {
                height: 0,
                width: 7,
              },
              "& .MuiSlider-track": {
                height: 12,
                overflow: "hidden",
                border: 0,
                ...(goal.progress === goal.durationDays && {
                  background:
                    colors[goal.completed ? "green" : "deepOrange"]["800"],
                }),
              },
              "& .MuiSlider-rail": {
                height: 12,
                overflow: "hidden!important",
              },
              "& .MuiSlider-mark": {
                width: { xs: 0, sm: 2 },
                display: goal.progress === goal.durationDays ? "none" : "block",
                height: 6,
                ml: -1,
                borderRadius: 5,
              },
            }}
          />
          <Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                clipRule="evenodd"
              />
            </svg>
          </Icon>
        </div>
      </Box>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100vw",
            ...(global.user.darkMode && {
              backgroundColor: "hsl(240,11%,15%)",
            }),
            maxWidth: "500px",
          },
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            zIndex: 999,
            background: "transparent",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <Icon>west</Icon>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>Goal</Typography>
            <MoreOptions
              goal={goal}
              mutationUrl={mutationUrl}
              setOpen={setOpen}
            />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: "-70px",
            background: `linear-gradient(45deg, ${colors[themeColor]["A400"]}, ${colors[themeColor]["A100"]})`,
            height: "300px",
            minHeight: "300px",
            mb: 5,
            color: colors[themeColor][50],
            p: 5,
          }}
          className="flex"
        >
          <Box sx={{ mt: "auto" }}>
            <Chip
              label={goal.category}
              sx={{
                mb: 1,
                color: "#000",
                background: "rgba(0,0,0,.1)",
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "900",
                color: "#000",
                textDecoration: "underline",
              }}
            >
              {goal.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 5 }}>
          {!goal.completed && goal.progress === goal.durationDays && (
            <TrophyModal goal={goal} mutationUrl={mutationUrl} />
          )}
          {goal.completed && (
            <Box
              sx={{
                p: 3,
                background: "rgba(0,0,0,.1)",
                borderRadius: 5,
                mb: 4,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                Completed
              </Typography>
              <Typography variant="body2">
                You completed this goal on{" "}
                {dayjs(goal.lastDone).format("MMM DD, YYYY")}.
              </Typography>
            </Box>
          )}
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <Icon>access_time</Icon>{" "}
            {goal.time === "any"
              ? "Daily"
              : goal.time === "morning"
              ? "Every morning"
              : goal.time === "afternoon"
              ? "Every afternoon"
              : "Nightly"}
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <Icon>date_range</Icon> {goal.durationDays} days
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <Icon>today</Icon> {goal.durationDays - goal.progress} days left
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 5 }}>
            <Icon>check_circle</Icon> {goal.progress} days completed
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
