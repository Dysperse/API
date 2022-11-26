import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Masonry from "@mui/lab/Masonry";
import React from "react";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ExploreGoals } from "./ExploreGoals";
import { goals } from "./goalTemplates";
import { LinearProgress } from "@mui/material";

export function MyGoals(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);

  let data = goals.map((goal) => {
    return {
      ...goal,
      completed: 5,
      tasks: 10,
    };
  });

  // Group data where the object's tasks === object's completed
  let completedGoals = data.filter((item) => item.tasks === item.completed);
  let incompleteGoals = data.filter((item) => item.tasks !== item.completed);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          className:
            "w-full h-[80vh] rounded-t-2xl p-10 px-5 overflow-y-auto sm:rounded-2xl sm:max-w-[90vw] sm:mx-auto shadow-none sm:mb-10",
        }}
      >
        <ExploreGoals />
      </SwipeableDrawer>

      <div
        className="flex flex-col justify-center w-full h-full rounded-xl p-3 px-5 mb-4 sticky top-[75px] z-10"
        style={{
          background: `linear-gradient(145deg, ${colors[themeColor][900]} 0%, ${colors[themeColor][500]} 100%)`,
          color: colors[themeColor][50],
        }}
      >
        <h2 className="text-sm font-light">Today&apos;s routine</h2>
        <h3 className="text-lg">5 out of 7 tasks completed</h3>
        <div className="flex items-center gap-4">
          <LinearProgress
            variant="determinate"
            value={70}
            sx={{
              height: "5px",
              borderRadius: 99,
              width: "100%",
              backgroundColor: colors[themeColor][400],
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors[themeColor][50],
              },
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
        </div>
      </div>
      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={0}>
        {[...incompleteGoals, ...completedGoals].map((goal) => (
          <div className="bg-gray-100 rounded-3xl mb-3 sm:border-8 border-white overflow-hidden">
            <div className="relative">
              <div
                className="bg-gray-400 absolute h-full top-0 left-0 pointer-events-none opacity-20"
                style={{
                  width: (goal.completed / goal.tasks) * 100 + "%",
                  ...(goal.completed === goal.tasks && {
                    background: colors.green[500],
                  }),
                }}
              />
              <div className="p-2 px-3">
                <h3 className="font-secondary font-bold mt-2">{goal.name}</h3>
                <h3 className="font-thin mt-1">
                  {goal.description ?? "No description"}
                </h3>
                <div className="flex items-center mt-2 gap-5">
                  <div className="flex items-center mt-2 gap-2">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    5/10
                  </div>
                  <div className="flex items-center mt-2 gap-2">
                    <span className="material-symbols-outlined">sunny</span>
                    Every morning
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
      <div
        onClick={() => setOpen(true)}
        className="w-full p-4 rounded-2xl flex items-center select-none cursor-pointer active:scale-[.98] transition-transform active:transition-[0s] mb-3"
        style={{
          background: colors[themeColor][50],
          color: colors[themeColor][900],
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
