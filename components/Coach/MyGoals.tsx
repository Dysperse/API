import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Masonry from "@mui/lab/Masonry";
import React from "react";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ExploreGoals } from "./ExploreGoals";
import { goals } from "./goalTemplates";

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
      <div className="sm:flex w-full gap-2 border-b pb-10">
        <div
          className="w-full p-4 rounded-2xl flex items-center select-none cursor-pointer active:scale-[.98] transition-transform active:transition-[0s] mb-3"
          style={{
            background: colors[themeColor][50],
            color: colors[themeColor][900],
          }}
        >
          <div>
            <h3 className="font-secondary font-bold">Today&apos;s routine</h3>
            <h4 className="font-sm font-light">7 tasks remaining</h4>
          </div>
          <span className="material-symbols-rounded ml-auto">
            arrow_forward
          </span>
        </div>

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
      </div>
      <h2 className="my-10 text-2xl font-secondary text-center">My goals</h2>
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
    </>
  );
}
