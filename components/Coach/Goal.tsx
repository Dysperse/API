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
    <Box>
      <Box
        className="active:scale-[.98] shadow-md border"
        onClick={() => setOpen(true)}
        sx={{
          ...(global.user.darkMode && {
            border: "1px solid hsl(240,11%,20%)",
          }),
          borderRadius: 5,
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240%,11%,20%)"
              : "rgba(200,200,200,.3)",
          },
          "&:active": {
            transition: { sm: "none!important" },
          },
          py: 2,
          transition: "transform .2s!important",
          px: 3,
          mb: 2,
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
          <picture>
            <img
              src="https://ouch-cdn2.icons8.com/nTJ88iDOdCDP2Y6YoAuNS1gblZ8t0jwB_LVlkpkkBeo/rs:fit:256:321/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvOTU0/L2RmYmM2MGJkLWUz/ZWMtNDVkMy04YWIy/LWJiYmY1YjM1ZDJm/NS5wbmc.png"
              alt="trophy"
              width={20}
              height={20}
            />
          </picture>
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
            color: "#000",
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
              <Typography variant="h5">Completed</Typography>
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
    </Box>
  );
}
