import Masonry from "@mui/lab/Masonry";
import { Skeleton } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React from "react";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ErrorHandler } from "../error";
import { ExploreGoals } from "./ExploreGoals";
import { goals } from "./goalTemplates";

export function MyGoals(): JSX.Element {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);
  const { data, error } = useApi("user/routines");

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
          sx: {
            height: "90vh",
          },
        }}
      >
        <ExploreGoals />
      </SwipeableDrawer>

      {data ? (
        <>
          {data.length > 0 && (
            <div
              className="flex flex-col justify-center w-full h-full rounded-xl p-3 px-5 mb-4 sticky top-[75px] z-10"
              style={{
                background: `linear-gradient(145deg, ${colors[themeColor][900]} 0%, ${colors[themeColor][500]} 100%)`,
                color: colors[themeColor][50],
              }}
            >
              <h2 className="text-sm font-light">Today&apos;s routine</h2>
              <h3 className="text-lg">
                5 out of {data.length} tasks completed
              </h3>
            </div>
          )}
          {data.length == 0 ? (
            <div className="text-gray-900 w-full bg-gray-200 rounded-xl p-3 px-5 mb-4">
              You haven&apos;t created any goals yet.
            </div>
          ) : (
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={0}>
              {[
                ...data.filter((item) => item.tasks === item.completed),
                ...data.filter((item) => item.tasks !== item.completed),
              ].map((goal) => (
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
                      <h3 className="font-secondary font-bold mt-2">
                        {goal.name}
                      </h3>
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
                          <span className="material-symbols-outlined">
                            sunny
                          </span>
                          Every morning
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
      {}
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
