import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Icon,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { ErrorHandler } from "../Error";
import { Goal } from "./Goal";

export function MyGoals(): JSX.Element {
  const session = useSession();
  const { data, error, url } = useApi("user/coach");
  const [isScrolling, setIsScrolling] = useState(false);
  const [query, setQuery] = useState("");

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
  const trigger = useMediaQuery("(max-width: 600px)");

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
          `${e.timeOfDay}:00`
            .toLowerCase()
            .includes(deferredQuery.toLowerCase()) ||
          e.stepName.toLowerCase().includes(deferredQuery.toLowerCase())
      ),
    [data, deferredQuery]
  );
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const children = data ? (
    <>
      <Box>
        <TextField
          variant="standard"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon sx={{ ml: -1.5 }}>search</Icon>
              </InputAdornment>
            ),
            disableUnderline: true,
            sx: {
              userSelect: "none",
              borderRadius: 2,
              background: { xs: palette[2], sm: palette[3] },
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
        <Box style={{ gap: "30px", textAlign: "center" }}>
          <picture>
            <Image
              src="/images/no-goals.png"
              alt="No goals created"
              width={256}
              height={256}
            />
          </picture>
          <Typography variant="h6" gutterBottom>
            You haven&apos;t set any goals (yet!)
          </Typography>
          <Typography variant="body1">
            Coach helps you achieve your goals by adding small tasks to enrich
            your daily routine.
          </Typography>
        </Box>
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
            <Box>
              <Virtuoso
                useWindowScroll
                data={sortedGoals}
                itemContent={(index, goal) => (
                  <Goal
                    isScrolling={isScrolling}
                    key={goal.id}
                    goal={goal}
                    mutationUrl={url}
                  />
                )}
              />
            </Box>
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
                    query !== "" ? "1f62d" : "1f615"
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
    </>
  ) : (
    <></>
  );

  return data ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1,
        pb: "0!important",
      }}
    >
      {children}
    </Box>
  ) : error ? (
    <ErrorHandler
      callback={() => mutate(url)}
      error="An error occured while trying to fetch your goals"
    />
  ) : (
    <Box sx={{ mt: 3 }}>
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
