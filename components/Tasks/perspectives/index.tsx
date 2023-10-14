import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Collapse,
  Icon,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, memo, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { WidgetBar } from "../Layout/widgets";
import SelectDateModal from "../Task/DatePicker";
import Column from "./Column";

export const PerspectiveContext = createContext<any>(null);

function PerspectivesLoadingScreen(): any {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const TaskSkeleton = memo(function A() {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 3,
          pt: 3,
          alignItems: "center",
        }}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={30}
          height={30}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: `${120 - Math.random() * 100}%`,
            minWidth: "50%",
            maxWidth: "100%",
          }}
        />
      </Box>
    );
  });

  return [...new Array(isMobile ? 1 : Math.round(window.innerWidth / 320))].map(
    (_, i) => (
      <Box
        key={i}
        sx={{
          borderRight: `1px solid ${addHslAlpha(palette[4], 0.5)}`,
          width: { xs: "100%", sm: "320px" },
          flex: { xs: "0 0 100%", sm: "0 0 320px" },
          pt: { xs: "var(--navbar-height)", sm: 0 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: { xs: 3, sm: 4.3 },
            borderBottom: { sm: `1px solid ${addHslAlpha(palette[4], 0.5)}` },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {isMobile && (
            <Skeleton
              animation="wave"
              variant="circular"
              width={30}
              height={30}
              sx={{
                flexShrink: 0,
                mr: "auto",
              }}
            />
          )}
          <Skeleton
            animation="wave"
            variant="circular"
            width={35}
            height={35}
            sx={{
              borderRadius: 3,
              flexShrink: 0,
            }}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={35}
            width={120}
          />
          {isMobile && (
            <Skeleton
              animation="wave"
              variant="circular"
              width={30}
              height={30}
              sx={{
                flexShrink: 0,
                ml: "auto",
              }}
            />
          )}
        </Box>
        <Box sx={{ py: 2, px: 3, display: "flex", gap: 2.5, mb: -2 }}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={37}
            sx={{ flexGrow: 1 }}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={37}
            width={60}
            sx={{ flexShrink: 0 }}
          />
        </Box>
        {[...new Array(isMobile ? 15 : ~~(Math.random() * 4) + 4)].map(
          (_, i) => (
            <TaskSkeleton key={i} />
          )
        )}
      </Box>
    )
  );
}

function FocusTrigger({ view, setView, scrollIntoView }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const redPalette = useColor("red", isDark);

  const [startTime, setStartTime] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;

    if (startTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
      }, 1000); // Update every second
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const mm = minutes % 60;
    const ss = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mm < 10 ? "0" : ""}${mm}`;
    } else {
      return `${mm.toString().padStart(2, "0")}:${ss < 10 ? "0" : ""}${ss}`;
    }
  };

  const startFocus = () => {
    if (view === "priority") {
      // Stop the timer
      setStartTime(null);
    } else {
      // Start the timer
      setStartTime(new Date().getTime() - elapsedTime);
    }
    setView(view === "priority" ? "all" : "priority");
    scrollIntoView();
  };

  return (
    <Button
      variant="contained"
      sx={{
        ml: "auto",
        color: "inherit!important",
        border: `2px solid`,
        borderRadius: view === "priority" ? 3 : 5,
        transition: "border-radius .5s!important",
        borderColor: view === "priority" ? redPalette[9] : palette[3],
      }}
      onClick={startFocus}
    >
      <Icon
        className="outlined"
        sx={{
          transition: "all .5s",
          ...(view === "priority" && {
            ml: -2,
          }),
        }}
      >
        {view === "priority" ? "stop" : "target"}
      </Icon>
      <Box
        sx={{
          textAlign: "left",
          transition: "all .5s",
          ...(view === "priority" && {
            my: -0.5,
            mr: -1.5,
          }),
        }}
      >
        <Typography
          sx={{
            whiteSpace: "nowrap",
            display: "flex",
            transition: "all .5s",
            ...(view === "priority" && {
              fontSize: "12px",
              mb: -0.4,
            }),
          }}
        >
          Focus
          <Collapse in={view === "priority"} orientation="horizontal">
            ing
          </Collapse>
        </Typography>
        <Collapse in={view === "priority"}>{formatTime(elapsedTime)}</Collapse>
      </Box>
    </Button>
  );
}

/**
 * Agenda container
 * "days": Opens days in week
 * "week": Opens weeks in month
 * "months": Opens months in year
 *
 * @param {string} type
 * @param {string} date
 */
export function Agenda({ type, date }) {
  const router = useRouter();
  const agendaContainerRef = useRef<HTMLDivElement>();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [view, setView] = useState("all");

  const columnMap = {
    days: isMobile ? "day" : "week",
    weeks: isMobile ? "week" : "month",
    months: isMobile ? "month" : "year",
  };

  const columnMap1 = {
    days: "week",
    weeks: "month",
    months: "year",
  };

  const viewHeadingFormats = {
    days: "MMMM",
    weeks: "MMMM",
    months: "YYYY",
  };

  const viewSubHeadingFormats = {
    days: "YYYY",
    weeks: "YYYY",
    months: "-",
  };

  const handleNext = () => {
    // if (!agendaContainerRef.current) return;
    // // alert(agendaContainerRef.current?.scrollLeft);
    // const { scrollLeft, clientWidth, scrollWidth } = agendaContainerRef.current;
    // const { width } = agendaContainerRef.current.getBoundingClientRect();

    // const canScrollRight = scrollLeft + clientWidth <= scrollWidth - 10;

    // if (canScrollRight && !isMobile) {
    //   agendaContainerRef.current.scrollTo({
    //     left: width + scrollLeft - 50,
    //     behavior: "smooth",
    //   });
    // } else {
    agendaContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    const next = dayjs(date).add(1, columnMap[type]).format("YYYY-MM-DD");
    router.push(`/tasks/perspectives/${type}/${next}`);
    // }
  };

  const handlePrev = () => {
    // if (!agendaContainerRef.current) return;
    // const { scrollLeft } = agendaContainerRef.current;
    // const { width } = agendaContainerRef.current.getBoundingClientRect();

    // const canScrollLeft = scrollLeft > 0;

    // if (canScrollLeft && !isMobile) {
    //   agendaContainerRef.current.scrollTo({
    //     left: (width + scrollLeft - 50) * -1,
    //     behavior: "smooth",
    //   });
    // } else {
    const prev = dayjs(date).subtract(1, columnMap[type]).format("YYYY-MM-DD");
    router.push(`/tasks/perspectives/${type}/${prev}`);
    // }
  };

  const { session } = useSession();

  const start = dayjs(date).startOf(columnMap[type]);
  const end = dayjs(start).endOf(columnMap[type]);

  // Create an array of columns for each [type] in [columnMap]
  const columns = Array.from(
    { length: Math.ceil(end.diff(start, type, true)) },
    (_, index) => start.clone().add(index, type)
  );

  const {
    data,
    mutate: mutateList,
    error,
  } = useSWR([
    "property/tasks/perspectives",
    {
      timezone: session.user.timeZone,
      start: start.toISOString(),
      end: end.toISOString(),
      type: columnMap1[type],
    },
  ]);

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const scrollIntoView = () => {
    const column = document.getElementById("active");
    if (column) {
      column.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const [alreadyScrolled, setAlreadyScrolled] = useState(false);

  useEffect(() => {
    if (data && !alreadyScrolled) {
      scrollIntoView();
      setAlreadyScrolled(true);
    }
  }, [data, alreadyScrolled]);

  useHotkeys("esc", () => {
    if (view === "priority") {
      document.getElementById("exitFocus")?.click();
    }
  });

  const isToday =
    router.asPath ===
      `/tasks/perspectives/${type}/${dayjs().format("YYYY-MM-DD")}` ||
    router.asPath === `/tasks/perspectives/${type}`;

  return (
    <PerspectiveContext.Provider
      value={{
        start,
        end,
        mutateList,
        type,
      }}
    >
      <Head>
        <title>
          {dayjs(start).format(viewHeadingFormats[type])} &bull;{" "}
          {dayjs(start).format(viewSubHeadingFormats[type])}
        </title>
      </Head>
      {!isMobile && <WidgetBar view={view} setView={setView} />}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          minHeight: "100dvh",
        }}
      >
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          style={{
            width: "100%",
            // zIndex: 999,
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              px: 4,
              pt: "env(titlebar-area-height, 10px)",
              pb: "10px",
              textAlign: "left",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              borderBottom: `1.5px solid ${
                palette[view === "priority" ? 3 : 3]
              }`,
              width: "100%",
              transition: "all .2s",
              ...(view === "priority" && {
                "& .priority-hidden": {
                  opacity: 0,
                  transition: "opacity 0.2s",
                },
                "&:hover .priority-hidden": {
                  opacity: 1,
                },
              }),
            }}
          >
            <SelectDateModal
              type={
                type === "days"
                  ? undefined
                  : type === "weeks"
                  ? "month"
                  : "year"
              }
              date={start}
              setDate={(date) => {
                setTimeout(() => {
                  router.push(
                    `/tasks/perspectives/${type}/${dayjs(date).format(
                      "YYYY-MM-DD"
                    )}`
                  );
                }, 900);
              }}
              dateOnly
              closeOnSelect
            >
              <Button
                variant="contained"
                sx={{
                  textAlign: "left",
                  borderRadius: 3,
                  ml: -1,
                  color: "inherit!important",
                }}
                size="small"
              >
                <Icon>today</Icon>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dayjs(start).format(viewHeadingFormats[type])}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Typography sx={{ fontWeight: 900 }}>
                      {dayjs(start).format(viewHeadingFormats[type])}
                    </Typography>
                    {viewSubHeadingFormats[type] !== "-" && (
                      <Typography variant="body2" sx={{ mt: -0.5 }}>
                        {dayjs(start).format(viewSubHeadingFormats[type])}
                      </Typography>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </SelectDateModal>
            <FocusTrigger
              view={view}
              setView={setView}
              scrollIntoView={scrollIntoView}
            />
            <Box
              sx={{ ml: "auto", background: palette[3], borderRadius: 3 }}
              className="priority-hidden"
            >
              <IconButton
                onClick={handlePrev}
                id="agendaPrev"
                sx={{ color: "inherit!important" }}
              >
                <Icon className="outlined">arrow_back_ios_new</Icon>
              </IconButton>
              {!isToday && (
                <Button
                  id="agendaToday"
                  onClick={() => {
                    router.push(
                      `/tasks/perspectives/${type}/${dayjs().format(
                        "YYYY-MM-DD"
                      )}`
                    );
                    scrollIntoView();
                  }}
                  size="large"
                  sx={{
                    px: 0,
                    color: "inherit!important",
                  }}
                >
                  Today
                </Button>
              )}
              <IconButton
                onClick={handleNext}
                id="agendaNext"
                sx={{ color: "inherit!important" }}
              >
                <Icon className="outlined">arrow_forward_ios</Icon>
              </IconButton>
            </Box>
          </Box>
        </motion.div>
        <Box
          onScroll={(e: any) => {
            // idk what this does
            e.target.getBoundingClientRect();
          }}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            maxWidth: "100dvw",
            overflowX: { xs: "hidden", sm: "auto" },
            ...(!data && { overflow: "scroll" }),
            width: "100%",
            height: "100%",
          }}
          ref={agendaContainerRef}
        >
          {!error && data && columns?.length > 0 ? (
            data.map((column: any) => (
              <Column
                key={column.start}
                column={column.end}
                data={column.tasks.sort((a, b) => {
                  if (
                    (!a.recurringInstance &&
                      a.completionInstances.length > 0) ||
                    (a.recurringInstance &&
                      a.recurrenceDay.includes(column.start))
                  ) {
                    return 1;
                  } else if (
                    (!b.recurringInstance &&
                      b.completionInstances.length > 0) ||
                    (b.recurringInstance &&
                      b.recurrenceDay.includes(column.start))
                  ) {
                    return -1;
                  } else {
                    return a.pinned ? -1 : b.pinned ? 1 : 0;
                  }
                })}
                view={view}
              />
            ))
          ) : error ? (
            <ErrorHandler callback={mutateList} />
          ) : (
            <PerspectivesLoadingScreen />
          )}
        </Box>
      </Box>
    </PerspectiveContext.Provider>
  );
}
