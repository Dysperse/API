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
import { useSession } from "../../pages/_app";
import { MoreOptions } from "./MoreOptions";
import { TrophyModal } from "./TrophyModal";

export function Goal({ goal, mutationUrl }: any): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <Box>
      <Box
        className="mb-5 border shadow-md active:scale-[.98] sm:mb-0"
        onClick={() => setOpen(true)}
        sx={{
          ...(session?.user?.darkMode && {
            border: "1px solid hsl(240,11%,20%)",
          }),
          borderRadius: 5,
          "&:hover": {
            background: session?.user?.darkMode
              ? "hsl(240%,11%,20%)"
              : "hsl(240,11%,95%)",
          },
          "&:active": {
            transition: { sm: "none!important" },
          },
          py: 2,
          transition: "transform .2s!important",
          px: 3,
          background: {
            sm: session?.user?.darkMode ? "hsl(240,11%,13%)" : "#fff",
          },
          borderBottom: {
            xs: session?.user?.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid #ddd",
            sm: "none",
          },
          mb: { xs: 3, sm: 0 },
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
          className="flex items-center gap-3"
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
              goal.durationDays > 30 ? Math.round(goal.durationDays / 30) : 2
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
              src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
              alt="trophy"
              width={20}
              height={20}
            />
          </picture>
        </div>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100vw",
            ...(session?.user?.darkMode && {
              backgroundColor: "hsl(240,11%,15%)",
            }),
            maxWidth: "500px",
          },
        }}
      >
        <AppBar
          sx={{
            border: 0,
            background: "transparent",
            color: "#000",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton color="inherit" onClick={() => setOpen(false)}>
              <Icon>expand_more</Icon>
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
            background: `linear-gradient(45deg, ${
              colors[session?.themeColor || "grey"]["A400"]
            }, ${colors[session?.themeColor || "grey"]["A100"]})`,
            height: "300px",
            minHeight: "300px",
            mb: 5,
            color: colors[session?.themeColor || "grey"][50],
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
