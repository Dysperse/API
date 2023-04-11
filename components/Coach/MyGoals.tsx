import { Box, Skeleton, TextField, Typography } from "@mui/material";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../lib/client/useSession";
import { ErrorHandler } from "../Error";
import { Goal } from "./Goal";

export function MyGoals({ setHideRoutine }): JSX.Element {
  const session = useSession();
  const { data, error, url } = useApi("user/routines");
  const [isScrolling, setIsScrolling] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    data && 0 === data.length ? setHideRoutine(true) : setHideRoutine(false);
  }, [data, setHideRoutine]);

  const completedGoals = useMemo(
    () => (data ? data.filter((goal) => goal.completed).length : 0),
    [data]
  );

  const unclaimedGoals = useMemo(
    () =>
      data
        ? data.filter(
            (goal) => goal.progress >= goal.durationDays && !goal.completed
          ).length
        : 0,
    [data]
  );

  const deferredQuery = useDeferredValue(query);
  const sortedGoals = useMemo(
    () =>
      (data
        ? data.sort((r, s) =>
            r.progress === r.durationDays
              ? 1
              : s.progress === s.durationDays
              ? -1
              : s.progress / s.durationDays - r.progress / r.durationDays
          )
        : []
      ).filter(
        (e) =>
          e.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
          e.stepName.toLowerCase().includes(deferredQuery.toLowerCase())
      ),
    [data, deferredQuery]
  );

  return data ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1,
      }}
    >
      <Box>
        <h1 className="font-heading mt-3 mb-2 text-4xl font-light underline">
          Progress
        </h1>
        <Typography>{data.length - completedGoals} goals</Typography>
        <TextField
          variant="standard"
          placeholder="Search..."
          InputProps={{
            disableUnderline: true,
            sx: {
              mt: 1,
              borderRadius: 2,
              background: `hsl(240,11%,${session.user.darkMode ? 25 : 90}%)`,
              px: 3,
              py: 1,
              mb: 2,
            },
          }}
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
        />
      </Box>
      {data.length === 0 ? (
        <div
          className="mb-10 flex w-full flex-col items-center rounded-xl bg-gray-200 p-8 px-5 text-gray-900 dark:bg-gray-900 dark:text-white sm:flex-row"
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
              Dysperse Coach helps you achieve your goals by adding small tasks
              to enrich your daily routine.
            </Typography>
          </Box>
        </div>
      ) : (
        <>
          {
            // if goals are completed
            data.filter(
              (goal) => goal.progress >= goal.durationDays && !goal.completed
            ).length > 0 && (
              <Typography
                sx={{
                  color: "warning.main",
                  fontWeight: "600",
                  mb: 2,
                }}
              >
                You completed {unclaimedGoals} goal
                {unclaimedGoals > 1 && "s"}! Scroll down to claim your trophy.
              </Typography>
            )
          }
          {sortedGoals.length >= 1 ? (
            <Virtuoso
              isScrolling={setIsScrolling}
              style={{ flexGrow: 1, borderRadius: "20px" }}
              totalCount={sortedGoals.length}
              itemContent={(index) => (
                <Goal
                  isScrolling={isScrolling}
                  key={sortedGoals[index].id}
                  goal={sortedGoals[index]}
                  mutationUrl={url}
                />
              )}
            />
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <picture>
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
                    query == "" ? "1f62d" : "1f615"
                  }.png`}
                  alt="Crying emoji"
                />
              </picture>
              <Typography sx={{ mt: 2 }} variant="h6">
                No results found
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
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
  );
}
