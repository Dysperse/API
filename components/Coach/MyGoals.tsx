import { Masonry } from "@mui/lab";
import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../pages/_app";
import { ErrorHandler } from "../Error";
import { Goal } from "./Goal";

export function MyGoals({ setHideRoutine }): JSX.Element {
  const session = useSession();
  const { data, error, url } = useApi("user/routines");

  useEffect(() => {
    if (data && data.length === 0) {
      setHideRoutine(true);
    } else {
      setHideRoutine(false);
    }
  }, [data, setHideRoutine]);

  return (
    <>
      {data ? (
        <>
          {data.length !== 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 7, mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "900",
                  mb: 1,
                }}
              >
                Progress
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
                  backgroundColor: session.user.darkMode
                    ? "hsl(240,11%,14%)"
                    : "rgba(200,200,200,.3)",
                }}
              >
                <picture>
                  <img
                    src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
                    alt="trophy"
                    width={20}
                    height={20}
                  />
                </picture>
                <span>{session.user.trophies}</span>
              </Box>
            </Box>
          )}
          {data.length === 0 ? (
            <div
              className="mb-4 flex w-full flex-col items-center rounded-xl bg-gray-200 p-8 px-5 text-gray-900 dark:bg-gray-900 dark:text-white sm:flex-row"
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
                <Typography variant="h5" gutterBottom>
                  You haven&apos;t created any goals yet.
                </Typography>
                <Typography variant="body1">
                  Dysperse Coach helps you achieve your goals by adding small
                  tasks to enrich your daily routine.
                </Typography>
              </Box>
            </div>
          ) : (
            <>
              {
                // if goals are completed
                data.filter(
                  (goal) =>
                    goal.progress >= goal.durationDays && !goal.completed
                ).length > 0 && (
                  <Typography
                    sx={{
                      color: "warning.main",
                      fontWeight: "600",
                      mb: 2,
                    }}
                  >
                    You completed{" "}
                    {
                      data.filter(
                        (goal) =>
                          goal.progress >= goal.durationDays && !goal.completed
                      ).length
                    }{" "}
                    goal
                    {data.filter(
                      (goal) =>
                        goal.progress >= goal.durationDays && !goal.completed
                    ).length > 1 && "s"}
                    ! Scroll down to claim your trophy.
                  </Typography>
                )
              }
              <Box sx={{ mr: { sm: -2 } }}>
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
                          b.progress / b.durationDays -
                          a.progress / a.durationDays
                        );
                      })
                      .map((goal) => (
                        <Goal key={goal.id} goal={goal} mutationUrl={url} />
                      ))
                  }
                </Masonry>
              </Box>
            </>
          )}
        </>
      ) : error ? (
        <ErrorHandler error="An error occured while trying to fetch your routines" />
      ) : (
        <Box sx={{ mt: 4 }}>
          {[...new Array(10)].map((_, i) => (
            <Skeleton
              variant="rectangular"
              width="100%"
              key={i.toString()}
              height={70}
              animation="wave"
              sx={{ borderRadius: 5, mb: 2 }}
            />
          ))}
        </Box>
      )}
    </>
  );
}
