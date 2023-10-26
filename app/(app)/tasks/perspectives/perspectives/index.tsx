"use client";
import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
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
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { WidgetBar } from "../../../../../components/Tasks/Layout/widgets";
import SelectDateModal from "../../../../../components/Tasks/Task/DatePicker";
import Column from "./Column";

export const PerspectiveContext = createContext<any>(null);

const columnMap = (isMobile) => ({
  days: isMobile ? "day" : "week",
  weeks: isMobile ? "week" : "month",
  months: isMobile ? "month" : "year",
});

export function PerspectivesInfo({
  type,
  start,
  end,
  date,
  view,
  setView,
  scrollIntoView,
  agendaContainerRef,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isToday =
    pathname ===
      `/tasks/perspectives/${type}/${dayjs().format("YYYY-MM-DD")}` ||
    pathname === `/tasks/perspectives/${type}`;

  const heading = {
    days: `${dayjs(start).format("Do")} - ${dayjs(end).format("Do")}`,
    weeks: dayjs(start).format("MMMM"),
    months: dayjs(start).format("YYYY"),
  }[type];

  const subheading = {
    days: dayjs(start).format("MMMM YYYY"),
    weeks: dayjs(start).format("YYYY"),
    months: "-",
  }[type];

  const handlePrev = () => {
    const prev = dayjs(date)
      .subtract(1, columnMap(isMobile)[type])
      .format("YYYY-MM-DD");
    router.push(`/tasks/perspectives/${type}/${prev}`);
  };

  const handleNext = () => {
    agendaContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    const next = dayjs(date)
      .add(1, columnMap(isMobile)[type])
      .format("YYYY-MM-DD");
    router.push(`/tasks/perspectives/${type}/${next}`);
  };

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        width: "300px",
        flex: "0 0 300px",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: 5,
          background: addHslAlpha(palette[3], 0.6),
          backdropFilter: "blur(10px)",
        }}
      >
        <SelectDateModal
          type={
            type === "days" ? undefined : type === "weeks" ? "month" : "year"
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
          <Typography
            variant="h3"
            className="font-heading"
            sx={{
              px: 1,
              mx: -1,
              borderRadius: 5,
              "&:hover": { background: palette[3] },
              "&:active": { background: palette[4] },
            }}
          >
            {heading}
          </Typography>
        </SelectDateModal>
        <Typography variant="h6">{subheading}</Typography>
        <FocusTrigger
          view={view}
          setView={setView}
          scrollIntoView={scrollIntoView}
        />
        <Box
          sx={{
            ml: "auto",
            background: palette[3],
            borderRadius: 3,
            WebkitAppRegion: "no-drag",
            display: "flex",
            position: "absolute",
            bottom: 0,
            right: 0,
            m: 2,
            "& .MuiIconButton-root, & .MuiButton-root": {
              color: "inherit!important",
              borderRadius: 3,
              "&:hover": { background: palette[4] + "!important" },
              "&:active": { background: palette[5] + "!important" },
            },
          }}
          className="priority-hidden"
        >
          <IconButton onClick={handlePrev} id="agendaPrev">
            <Icon className="outlined">arrow_back_ios_new</Icon>
          </IconButton>
          {!isToday && (
            <Button
              id="agendaToday"
              onClick={() => {
                router.push(
                  `/tasks/perspectives/${type}/${dayjs().format("YYYY-MM-DD")}`
                );
                scrollIntoView();
              }}
              size="large"
              sx={{
                px: 0,
              }}
            >
              Today
            </Button>
          )}
          <IconButton onClick={handleNext} id="agendaNext">
            <Icon className="outlined">arrow_forward_ios</Icon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export const sortedTasks = (tasks, column) =>
  tasks.sort((a, b) => {
    if (
      (!a.recurringInstance && a.completionInstances?.length > 0) ||
      (a.recurringInstance && a.recurrenceDay.includes(column.start))
    ) {
      return 1;
    } else if (
      (!b.recurringInstance && b.completionInstances?.length > 0) ||
      (b.recurringInstance && b.recurrenceDay.includes(column.start))
    ) {
      return -1;
    } else {
      return a.pinned ? -1 : b.pinned ? 1 : 0;
    }
  });
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
          borderLeft: `2px solid ${addHslAlpha(palette[4], 0.5)}`,
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
            borderBottom: { sm: `2px solid ${addHslAlpha(palette[4], 0.5)}` },
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

  const handleSubmit = useCallback(async () => {
    await fetchRawApi(session, "user/status/set", {
      status: "focusing",
      start: dayjs().utc().toISOString(),
      until: "",
      timeZone: session.user.timeZone,
      profile: JSON.stringify(session.user.profile),
      email: session.user.email,
      emoji: "",
      text: "",
      notifyFriendsForStatusUpdates: session.NotificationSettings
        ?.notifyFriendsForStatusUpdates
        ? "true"
        : "false",
    });
  }, [session]);

  const clearStatus = useCallback(async () => {
    await fetchRawApi(session, "user/status/set", {
      status: "focusing",
      start: dayjs().utc().toISOString(),
      until: 0,
      timeZone: session.user.timeZone,
      profile: JSON.stringify(session.user.profile),
      email: session.user.email,
      emoji: "",
      text: "",
      notifyFriendsForStatusUpdates: "false",
    });
  }, [session]);

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
      clearStatus();
    } else {
      // Start the timer
      setStartTime(new Date().getTime() - elapsedTime);
    }
    handleSubmit();
    setView(view === "priority" ? "all" : "priority");
    scrollIntoView();
  };

  return (
    <Button
      variant="contained"
      sx={{
        mt: 2,
        WebkitAppRegion: "no-drag",
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
  const agendaContainerRef = useRef<HTMLDivElement>();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [view, setView] = useState("all");

  const columnMap1 = {
    days: "week",
    weeks: "month",
    months: "year",
  };

  const { session } = useSession();

  const start = dayjs(date).startOf(columnMap(isMobile)[type]);
  const end = dayjs(start).endOf(columnMap(isMobile)[type]);

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
      utcOffset: dayjs().utcOffset(),
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

  return (
    <PerspectiveContext.Provider
      value={{
        start,
        end,
        mutateList,
        type,
      }}
    >
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
          {!isMobile && (
            <PerspectivesInfo
              date={date}
              type={type}
              start={start}
              end={end}
              view={view}
              setView={setView}
              scrollIntoView={scrollIntoView}
              agendaContainerRef={agendaContainerRef}
            />
          )}
          {!error && data && columns?.length > 0 ? (
            data.map((column: any) => (
              <Column
                key={column.start}
                column={column.end}
                data={sortedTasks(column.tasks, column)}
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
