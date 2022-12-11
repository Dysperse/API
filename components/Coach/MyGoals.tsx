import { Masonry } from "@mui/lab";
import { AppBar, Button, Dialog, IconButton, Skeleton } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import useWindowSize from "react-use/lib/useWindowSize";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { neutralizeBack, revivalBack } from "../../hooks/useBackButton";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../error";
import { ExploreGoals } from "./ExploreGoals";

function TrophyModal({ goal, mutationUrl }) {
  const [open, setOpen] = React.useState(false);
  const [stepTwoOpen, setStepTwoOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (open) {
      const trophy: any = document.getElementById("trophy");
      const slideIn: any = document.getElementById("slide-in-bottom");
      trophy.style.display = "none";
      slideIn.style.display = "none";
      setTimeout(() => {
        trophy.style.display = "";
        slideIn.style.display = "";
      }, 500);
    } else {
      const trophy: any = document.getElementById("trophy");
      const slideIn: any = document.getElementById("slide-in-bottom");
      trophy.style.display = "none";
      slideIn.style.display = "none";
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={stepTwoOpen}
        onClose={() => setStepTwoOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 5,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Are you satisfied with how Carbon Coach helped you achieve this
            goal?
          </Typography>
          <Typography>
            To claim your trophy, rate your experience below!
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[
              "sentiment_dissatisfied",
              "sentiment_neutral",
              "sentiment_satisfied",
            ].map((icon) => (
              <IconButton
                onClick={() => {
                  setLoading(true);
                  fetchApiWithoutHook("user/routines/complete", {
                    daysLeft: goal.durationDays - goal.progress,
                    feedback: icon,
                    id: goal.id,
                  })
                    .then(async () => {
                      try {
                        await mutate(mutationUrl);
                        setStepTwoOpen(false);
                        toast.success(
                          "A trophy has been added to your account! Thanks for your feedback! 🎉"
                        );
                      } catch (e) {
                        toast.error(
                          "An error occurred. Please try again later."
                        );
                      }
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      toast.error("An error occurred. Please try again later.");
                    });
                }}
                disableRipple
                disabled={loading}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "50px",
                  }}
                >
                  {icon}
                </span>
              </IconButton>
            ))}
          </Box>
        </Box>
      </Dialog>
      <Backdrop
        open={open}
        onClick={() => {
          setOpen(false);
          setStepTwoOpen(true);
        }}
        sx={{
          zIndex: 999999,
          cursor: "pointer",
        }}
      >
        <Confetti width={width} height={height} style={{ zIndex: 1 }} />
        <picture>
          <img
            src="https://ouch-cdn2.icons8.com/nTJ88iDOdCDP2Y6YoAuNS1gblZ8t0jwB_LVlkpkkBeo/rs:fit:256:321/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvOTU0/L2RmYmM2MGJkLWUz/ZWMtNDVkMy04YWIy/LWJiYmY1YjM1ZDJm/NS5wbmc.png"
            className="animate-trophy"
            id="trophy"
            style={{
              zIndex: 999999,
            }}
          />
        </picture>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            background: "rgba(0,0,0,0.7)",
            p: 4,
            width: "100%",
            color: "#fff",
            zIndex: 999999999,
            backdropFilter: "blur(20px)",
          }}
          className="slide-in-bottom"
          id="slide-in-bottom"
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "900", textDecoration: "underline" }}
          >
            Congratulations!
          </Typography>
          <Typography variant="body1">
            After spending {goal.durationDays} days working hard towards this
            goal, you finally achieved it! Pat yourself on the back!
          </Typography>
          <Button
            sx={{
              boxShadow: 0,
              background: "#fff!important",
              color: "#000",
              mt: 2,
              width: "100%",
            }}
            variant="contained"
            onClick={() => setOpen(false)}
          >
            Next
          </Button>
        </Box>
      </Backdrop>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          background: colors.deepOrange["100"],
          borderRadius: 5,
          mb: 5,
          cursor: "pointer",
          transition: "all .1s",
          userSelect: "none",
          "&:active": {
            transform: "scale(0.98)",
            transition: "none",
          },
          gap: 3,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            You&apos;ve completed this goal!
          </Typography>
          <Typography variant="body1">
            All that hard work paid off! Tap to claim your trophy!
          </Typography>
        </Box>
        <picture>
          <img
            src="https://ouch-cdn2.icons8.com/nTJ88iDOdCDP2Y6YoAuNS1gblZ8t0jwB_LVlkpkkBeo/rs:fit:256:321/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvOTU0/L2RmYmM2MGJkLWUz/ZWMtNDVkMy04YWIy/LWJiYmY1YjM1ZDJm/NS5wbmc.png"
            alt="trophy"
            width={"100px"}
          />
        </picture>
      </Box>
    </>
  );
}

function MoreOptions({ goal, mutationUrl, setOpen }) {
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
        <MenuItem onClick={handleClose} disabled={goal.completed}>
          <span className="material-symbols-rounded">edit</span> Edit
        </MenuItem>
        <MenuItem
          disabled={goal.completed}
          onClick={() => {
            handleClose();
            fetchApiWithoutHook("user/routines/delete", {
              id: goal.id,
            }).then(async () => {
              await mutate(mutationUrl);
              setOpen(false);
            });
          }}
        >
          <span className="material-symbols-rounded">delete</span> Delete
        </MenuItem>
      </Menu>
      <IconButton color="inherit" disableRipple onClick={handleClick}>
        <span className="material-symbols-rounded">more_horiz</span>
      </IconButton>
    </>
  );
}

function Goal({ goal, mutationUrl }: any) {
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
        className="active:scale-[.98]"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: { xs: 0, sm: 5 },
          py: 2,
          transition: "all .2s!important",
          px: 3,
          mb: 1,
          cursor: "pointer",
          background: { sm: "#eee" },
          borderBottom: { xs: "1px solid #ccc", sm: "none" },
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
              {goal.time == "any"
                ? "Daily"
                : goal.time == "morning"
                ? "Every morning"
                : goal.time == "afternoon"
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
            ...(goal.progress == goal.durationDays && {
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
                ...(goal.progress == goal.durationDays && {
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
                display: goal.progress == goal.durationDays ? "none" : "block",
                height: 6,
                ml: -1,
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
          {!goal.completed && goal.progress == goal.durationDays && (
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
            <span className="material-symbols-rounded">today</span>{" "}
            {goal.durationDays - goal.progress} days left
          </Typography>
          <Typography className="flex items-center" sx={{ gap: 2, mb: 5 }}>
            <span className="material-symbols-rounded">check_circle</span>{" "}
            {goal.progress} days completed
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
      .setAttribute("content", open ? "#814f41" : "#fff");
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
            color: "#000"
          }}
          position="sticky"
        >
          <Toolbar sx={{ height: "64px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-rounded" style={{ color: "#000" }}>chevron_left</span>
            </IconButton>
            <Typography sx={{ mx: "auto", fontWeight: "600", color: "#000" }}>
              Explore
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined" style={{ color: "#000" }}>add_circle</span>
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
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "900",
                  }}
                >
                  You haven&apos;t created any goals yet.
                </Typography>
                <Typography variant="body1">
                  Carbon Coach helps you achieve your goals by adding small
                  tasks to enrich your daily routine.
                </Typography>
              </Box>
            </div>
          ) : (
            <Masonry
              columns={{ xs: 1, sm: 2 }}
              spacing={{ xs: 0, sm: 2 }}
              sx={{}}
            >
              {[
                ...data.filter((item) => item.tasks === item.completed),
                ...data.filter((item) => item.tasks !== item.completed),
              ].map((goal) => (
                <Goal goal={goal} mutationUrl={url} />
              ))}
            </Masonry>
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
