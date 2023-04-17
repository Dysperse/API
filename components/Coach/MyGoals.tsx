import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Icon,
  IconButton,
  InputAdornment,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDeferredValue, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useApi } from "../../lib/client/useApi";
import { useSession } from "../../lib/client/useSession";
import { ErrorHandler } from "../Error";
import { Goal } from "./Goal";

export function MyGoals(): JSX.Element {
  const session = useSession();
  const { data, error, url } = useApi("user/routines");
  const [isScrolling, setIsScrolling] = useState(false);
  const [query, setQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");

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

  const children = data ? (
    <>
      <Box>
        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
          My progress
        </Typography>
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
              background: {
                xs: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
                sm: `hsl(240,11%,${session.user.darkMode ? 25 : 90}%)`,
              },
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
            <>
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
            </>
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

  const trigger = useMediaQuery("(max-width: 600px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  return data ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1,
        pb: "0!important",
        px: 3,
      }}
    >
      {!trigger && children}
      {trigger && (
        <Card
          onClick={() => setMobileOpen(true)}
          sx={{
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
            borderRadius: 5,
            mt: 2,
            transition: "transform .2s",
            "&:active": {
              transform: "scale(.97)",
            },
          }}
        >
          <CardActionArea>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  My progress
                </Typography>
                <Typography>{data.length} goals</Typography>
              </Box>
              <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
      {trigger && (
        <SwipeableDrawer
          disableSwipeToOpen
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          anchor="right"
          PaperProps={{
            sx: {
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              width: "100vw",
              p: 2,
              flexGrow: 1,
            },
          }}
        >
          <IconButton
            sx={{ position: "fixed", top: 0, right: 0, m: 3, mt: 5 }}
            onClick={() => setMobileOpen(false)}
          >
            <Icon>close</Icon>
          </IconButton>
          {children}
        </SwipeableDrawer>
      )}
    </Box>
  ) : error ? (
    <ErrorHandler error="An error occured while trying to fetch your routines" />
  ) : (
    <Box sx={{ mt: 3, px: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My progress
      </Typography>
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
