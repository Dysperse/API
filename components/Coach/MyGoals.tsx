import { Masonry } from "@mui/lab";
import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../Error";
import { ExploreGoals } from "./ExploreGoals";

import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { Goal } from "./Goal";

export function MyGoals({ setHideRoutine }): JSX.Element {
  const [open, setOpen] = React.useState(false);
  // useStatusBar(open);
  const { data, error, url } = useApi("user/routines");
  useEffect(() => {
    const tag: any = document.querySelector(`meta[name="theme-color"]`);
    tag.setAttribute("content", open ? "#814f41" : "#fff");
  });

  useEffect(() => {
    if (data && data.length === 0) {
      setHideRoutine(true);
    } else {
      setHideRoutine(false);
    }
  }, [data, setHideRoutine]);
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
            maxWidth: "700px",
            ...(global.user.darkMode && {
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
            color: global.user.darkMode ? "#fff" : "#000",
          }}
          position="static"
        >
          <Toolbar sx={{ height: "64px" }}>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span
                className="material-symbols-rounded"
                style={{ color: global.user.darkMode ? "#fff" : "#000" }}
              >
                west
              </span>
            </IconButton>
            <Typography
              sx={{
                mx: "auto",
                fontWeight: "600",
                color: global.user.darkMode ? "#fff" : "#000",
              }}
            >
              Explore
            </Typography>
            <IconButton
              color="inherit"
              disableRipple
              onClick={() => setOpen(false)}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: global.user.darkMode ? "#fff" : "#000" }}
              >
                add_circle
              </span>
            </IconButton>
          </Toolbar>
        </AppBar>
        <ExploreGoals setOpen={setOpen} mutationUrl={url} />
      </SwipeableDrawer>

      {data ? (
        <>
          {data.length !== 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 7, mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "900",
                }}
              >
                My progress
              </Typography>
              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 0.5,
                  borderRadius: 999,
                  gap: "10px",
                  backgroundColor: global.user.darkMode
                    ? "hsl(240,11%,14%)"
                    : "rgba(200,200,200,.3)",
                }}
              >
                <picture>
                  <img
                    src="https://ouch-cdn2.icons8.com/nTJ88iDOdCDP2Y6YoAuNS1gblZ8t0jwB_LVlkpkkBeo/rs:fit:256:321/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvOTU0/L2RmYmM2MGJkLWUz/ZWMtNDVkMy04YWIy/LWJiYmY1YjM1ZDJm/NS5wbmc.png"
                    alt="trophy"
                    width={20}
                    height={20}
                  />
                </picture>
                <span>{global.user.trophies}</span>
              </Box>
            </Box>
          )}
          {data.length === 0 ? (
            <div
              className="flex items-center text-gray-900 w-full bg-gray-200 rounded-xl p-8 px-5 mb-4 flex-col sm:flex-row"
              style={{ gap: "30px" }}
            >
              <picture>
                <img
                  src="https://i.ibb.co/ZS3YD9C/casual-life-3d-target-and-dart.png"
                  alt="casual-life-3d-target-and-dart"
                  width="100px"
                />
              </picture>
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
                  Dysperse Coach helps you achieve your goals by adding small
                  tasks to enrich your daily routine.
                </Typography>
              </Box>
            </div>
          ) : (
            <Masonry columns={{ xs: 1, sm: 2 }} spacing={{ xs: 0, sm: 2 }}>
              {
                // Sort goals by days left (goal.progress  / goal.durationDays). Sort in reverse order, and move `goal.progress === goal.durationDays` to the end
                data
                  .sort((a, b) => {
                    if (a.progress === a.durationDays) {
                      return 1;
                    }
                    if (b.progress === b.durationDays) {
                      return -1;
                    }
                    return (
                      b.progress / b.durationDays - a.progress / a.durationDays
                    );
                  })
                  .map((goal) => (
                    <Goal key={goal.id} goal={goal} mutationUrl={url} />
                  ))
              }
            </Masonry>
          )}
        </>
      ) : error ? (
        <ErrorHandler error="An error occured while trying to fetch your routines" />
      ) : (
        <Box>
          {[...new Array(10)].map((_, i) => (
            <Skeleton
              variant="rectangular"
              width="100%"
              key={i.toString()}
              height={70}
              animation="wave"
              sx={{ borderRadius: 5, my: 4 }}
            />
          ))}
        </Box>
      )}
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        className={
          "w-full p-4 rounded-2xl flex items-center select-none border shadow-md cursor-pointer active:scale-[.98] transition-transform mb-3 " +
          (data && data.length === 0 && "bg-gray-200 dark:bg-gray-900")
        }
        style={{
          color: global.user.darkMode ? "#fff" : "#000",
        }}
      >
        <div>
          <h3 className="font-bold">Set a goal</h3>
          <h4 className="font-sm font-light">
            Set a goal to get started with your routine
          </h4>
        </div>
        <Icon className="outlined" sx={{ ml: "auto" }}>
          add_circle
        </Icon>
      </div>
    </>
  );
}
