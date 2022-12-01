import { AppBar, Divider, IconButton, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../error";
import { ExploreGoals } from "./ExploreGoals";

function MoreOptions({ goal }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <span className="material-symbols-rounded">share</span> Share
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <span className="material-symbols-rounded">edit</span> Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <span className="material-symbols-rounded">delete</span> Delete
        </MenuItem>
      </Menu>
      <IconButton color="inherit" disableRipple onClick={handleClick}>
        <span className="material-symbols-rounded">more_horiz</span>
      </IconButton>
    </>
  );
}

function Goal({ goal }: any) {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute("content", open ? colors[themeColor][900] : "#fff");
  });

  React.useEffect(() => {
    open ? neutralizeBack(() => setOpen(false)) : revivalBack();
  });

  return (
    <>
      <Box
        className="w-full active:scale-[.98]"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 5,
          py: 1,
          transition: "all .2s!important",
          px: 2,
          mb: 1,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography className="font-semibold" variant="h6">
          {goal.name}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {goal.time == "any"
            ? "Daily"
            : goal.time == "morning"
            ? "Every morning"
            : goal.time == "afternoon"
            ? "Every afternoon"
            : "Nightly"}{" "}
          &bull; {goal.durationDays - goal.progress} days left
        </Typography>
        <div className="flex gap-3 items-center">
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
              },
              "& .MuiSlider-rail": {
                height: 12,
                overflow: "hidden",
              },
              "& .MuiSlider-mark": {
                width: { xs: 0, sm: 2 },
                height: 6,
                borderRadius: 5,
              },
            }}
            // valueLabelDisplay="on"
          />
          <span className="material-symbols-rounded">
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
          </span>
        </div>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            width: "100vw",
            ...(global.theme === "dark" && {
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
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
          }}
        >
          <Toolbar className="flex" sx={{ height: "70px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>Goal</Typography>
            <MoreOptions goal={goal} />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mt: "-70px",
            background: `linear-gradient(45deg, ${colors[themeColor]["600"]}, ${colors[themeColor]["500"]})`,
            height: "400px",
            minHeight: "400px",
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
                color: "#fff",
                background: "rgba(255,255,255,.1)",
              }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: "900", textDecoration: "underline" }}
            >
              {goal.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 5 }}>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <span className="material-symbols-rounded">access_time</span>{" "}
            {goal.time == "any"
              ? "Daily"
              : goal.time == "morning"
              ? "Every morning"
              : goal.time == "afternoon"
              ? "Every afternoon"
              : "Nightly"}
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <span className="material-symbols-rounded">date_range</span>{" "}
            {goal.durationDays} days
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <span className="material-symbols-rounded">check_circle</span>{" "}
            {goal.progress} days completed
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 2 }}>
            <span className="material-symbols-rounded">notifications</span>{" "}
            {goal.reminder ? "Reminders on" : "Reminders off"}
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
export function MyGoals({ setHideRoutine }): JSX.Element {
  const [open, setOpen] = React.useState(false);
  // useStatusBar(open);
  const { data, error, url } = useApi("user/routines");
  useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute("content", open ? colors.pink["900"] : "#fff");
  });

  useEffect(() => {
    if (data && data.length === 0) {
      setHideRoutine(true);
    } else {
      setHideRoutine(false);
    }
  }, [data]);
  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          sx: {
            width: "100vw",
            maxWidth: "900px",
            ...(global.theme === "dark" && {
              backgroundColor: "hsl(240,11%,15%)",
            }),
          },
        }}
      >
        <AppBar
          elevation={0}
          sx={{
            background: "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,0))",
            zIndex: 1,
          }}
          position="sticky"
        >
          <Toolbar sx={{ height: "64px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600" }}>
              Explore
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded">more_horiz</span>
            </IconButton>
          </Toolbar>
        </AppBar>
        <ExploreGoals setOpen={setOpen} mutationUrl={url} />
      </SwipeableDrawer>

      {data ? (
        <>
          {data.length !== 0 && (
            <Typography
              variant="h5"
              sx={{
                mb: 1.5,
                ml: 1.5,
                fontWeight: "900",
                mt: 7,
              }}
            >
              My goals
            </Typography>
          )}
          {data.length == 0 ? (
            <div
              className="flex items-center text-gray-900 w-full bg-gray-200 rounded-xl p-8 px-5 mb-4 flex-col sm:flex-row"
              style={{ gap: "30px" }}
            >
              <img
                src="https://i.ibb.co/ZS3YD9C/casual-life-3d-target-and-dart.png"
                alt="casual-life-3d-target-and-dart"
                width="100px"
              />
              You haven&apos;t created any goals yet.
            </div>
          ) : (
            <>
              {[
                ...data.filter((item) => item.tasks === item.completed),
                ...data.filter((item) => item.tasks !== item.completed),
              ].map((goal) => (
                <Goal goal={goal} />
              ))}
            </>
          )}
        </>
      ) : error ? (
        <ErrorHandler error="An error occured while trying to fetch your routines" />
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          animation="wave"
          sx={{ borderRadius: 5 }}
        />
      )}
      <div
        onClick={() => setOpen(true)}
        className={
          "w-full p-4 rounded-2xl flex items-center select-none cursor-pointer active:scale-[.98] transition-transform my-3 " +
          (data && data.length === 0 && "bg-gray-200 dark:bg-gray-900")
        }
        style={{
          color: global.theme === "dark" ? "#fff" : "#000",
        }}
      >
        <div>
          <h3 className="font-secondary font-bold">Set a goal</h3>
          <h4 className="font-sm font-light">
            Set a goal to get started with your routine
          </h4>
        </div>
        <span className="material-symbols-rounded ml-auto">add</span>
      </div>
    </>
  );
}
