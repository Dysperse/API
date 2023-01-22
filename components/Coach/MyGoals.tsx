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
            <Typography
              variant="h5"
              sx={{
                mb: 1.5,
                ml: 1.5,
                fontWeight: "900",
                mt: 7,
              }}
            >
              Personal goals
            </Typography>
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
              {[
                ...data.filter((item) => item.tasks === item.completed),
                ...data.filter((item) => item.tasks !== item.completed),
              ].map((goal) => (
                <Goal key={goal.id} goal={goal} mutationUrl={url} />
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
        role="button"
        tabIndex={0}
        className={
          "w-full p-4 rounded-2xl flex items-center select-none cursor-pointer active:scale-[.98] transition-transform mb-3 " +
          (data && data.length === 0 && "bg-gray-200 dark:bg-gray-900")
        }
        style={{
          color: global.user.darkMode ? "#fff" : "#000",
        }}
      >
        <div>
          <h3 className="font-secondary font-bold">Set a goal</h3>
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
