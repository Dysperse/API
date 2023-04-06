import {
  Box,
  Chip,
  LinearProgress,
  Slider,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useBackButton } from "../../../lib/client/useBackButton";
import { useSession } from "../../../lib/client/useSession";
import { colors } from "../../../lib/colors";
import { Puller } from "../../Puller";
import { MoreOptions } from "./MoreOptions";
import { TrophyModal } from "./TrophyModal";

export function Goal({ goal, mutationUrl }: any): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();

  useBackButton(() => setOpen(false));

  const repeatText =
    goal.time === "any"
      ? "Daily"
      : goal.time === "morning"
      ? "Every morning"
      : goal.time === "afternoon"
      ? "Every afternoon"
      : "Nightly";

  return (
    <Box>
      <Box
        className="mb-5 border shadow-md active:scale-[.98] sm:mb-0"
        onClick={() => setOpen(true)}
        sx={{
          ...(session.user.darkMode && {
            border: "1px solid hsl(240,11%,20%)",
          }),
          borderRadius: 5,
          "&:hover": {
            background: session.user.darkMode
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
            sm: session.user.darkMode ? "hsl(240,11%,13%)" : "#fff",
          },
          borderBottom: {
            xs: session.user.darkMode
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
              {repeatText} &bull; {goal.durationDays - goal.progress} days left
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
            p: 3,
            pt: 0,
            maxHeight: "80vh",
          },
        }}
      >
        <Puller />
        <Box
          sx={{
            background: `linear-gradient(45deg, ${
              colors[session?.themeColor || "grey"]["A400"]
            }, ${colors[session?.themeColor || "grey"]["A100"]})`,
            color: colors[session?.themeColor || "grey"][50],
            p: { xs: 3, sm: 5 },
            position: "relative",
            pt: { xs: 10 },
            borderRadius: 5,
          }}
          className="flex"
        >
          <MoreOptions
            goal={goal}
            setOpen={setOpen}
            mutationUrl={mutationUrl}
          />
          <Box sx={{ mt: "auto" }}>
            <Typography
              variant="h3"
              className="font-heading"
              sx={{
                color: "#000",
              }}
            >
              {goal.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
              <Chip
                label={goal.category}
                size="small"
                sx={{
                  px: 1,
                  color: "#000",
                  fontWeight: 700,
                  background: "rgba(0,0,0,.1)",
                }}
              />
              <Chip
                label={repeatText}
                size="small"
                sx={{
                  px: 1,
                  color: "#000",
                  fontWeight: 700,
                  background: "rgba(0,0,0,.1)",
                }}
              />
            </Box>
          </Box>
        </Box>
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
        {!goal.completed && goal.progress === goal.durationDays && (
          <TrophyModal goal={goal} mutationUrl={mutationUrl} />
        )}
        <Box
          sx={{ p: 4, background: "rgba(0,0,0,0.1)", borderRadius: 5, mt: 3 }}
        >
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {goal.progress} out of {goal.durationDays}
          </Typography>
          <Typography gutterBottom sx={{ mb: 1.5 }}>
            days completed &bull; {goal.durationDays - goal.progress} remaining
          </Typography>
          <LinearProgress
            sx={{ height: 25, borderRadius: 999 }}
            variant="determinate"
            value={(goal.progress / goal.durationDays) * 100}
          />
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
