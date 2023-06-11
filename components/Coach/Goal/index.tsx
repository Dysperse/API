import { useBackButton } from "@/lib/client/useBackButton";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Box,
  Chip,
  LinearProgress,
  Skeleton,
  Slider,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { Puller } from "../../Puller";
import { MoreOptions } from "./MoreOptions";
import { TrophyModal } from "./TrophyModal";

export function Goal({ isScrolling, goal, mutationUrl }: any): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const session = useSession();
  const palette = useColor(session.themeColor, session.user.darkMode);

  useBackButton(() => setOpen(false));

  const repeatText =
    goal.time === "any"
      ? "Daily"
      : goal.time === "morning"
      ? "Every morning"
      : goal.time === "afternoon"
      ? "Every afternoon"
      : "Nightly";

  return isScrolling ? (
    <Skeleton
      variant="rectangular"
      height={122}
      animation={false}
      sx={{ width: "100%", borderRadius: 5, mb: 2 }}
    />
  ) : (
    <Box sx={{ mb: 2, height: 122, overflow: "hidden" }}>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          height: 120,
          borderRadius: 5,
          py: 2,
          transition: "transform .2s!important",
          px: 3,
          background: {
            xs: palette[2],
            sm: palette[4],
          },
          "&:hover": {
            background: { sm: palette[5] },
          },
          "&:active": {
            transform: "scale(.98)",
            transition: { sm: "none!important" },
          },
          mb: { xs: 3, sm: 0 },
          userSelect: "none",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            ...(goal.completed && {
              opacity: 0.6,
            }),
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {goal.name}
        </Typography>
        <Typography
          variant="body2"
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
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
      {!isScrolling && (
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
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
              background: `linear-gradient(45deg, ${palette[9]}, ${palette[12]})`,
              p: { xs: 3, sm: 5 },
              position: "relative",
              pt: { xs: 15 },
              borderRadius: 5,
              display: "flex",
            }}
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
                my: 2,
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
              days completed &bull; {goal.durationDays - goal.progress}{" "}
              remaining
            </Typography>
            <LinearProgress
              sx={{ height: 25, borderRadius: 999 }}
              variant="determinate"
              value={(goal.progress / goal.durationDays) * 100}
            />
          </Box>
        </SwipeableDrawer>
      )}
    </Box>
  );
}
