"use client";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { WidgetBar } from "../../../../../components/Tasks/Layout/widgets";
import SelectDateModal from "../../../../../components/Tasks/Task/DatePicker";
import Column from "./Column";
import { PerspectivesLoadingScreen } from "./PerspectivesLoadingScreen";

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
    days: `${dayjs(start).format("MMM Do")} — ${dayjs(end).format(
      dayjs(end).month() !== dayjs(start).month() ? "MMM Do" : "Do"
    )}`,
    weeks: dayjs(start).format("MMMM"),
    months: dayjs(start).format("YYYY"),
  }[type];

  const subheading = {
    days: dayjs(start).format("YYYY"),
    weeks: dayjs(start).format("YYYY"),
    months: "",
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
        width: "100%",
      }}
    >
      <AppBar
        sx={{
          border: 0,
          borderRadius: 5,
          background: palette[2],
          color: palette[11],
          maxHeight: "55px",
          height: "55px",
        }}
      >
        <Box
          sx={{
            p: 1,
            display: "flex",
            height: "100%",
            alignItems: "center",
          }}
        >
          <FocusTrigger
            view={view}
            setView={setView}
            scrollIntoView={scrollIntoView}
          />
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
            <Box
              sx={{
                mx: "auto",
                px: 1,
                borderRadius: 3,
                "&:hover": { background: palette[3] },
                "&:active": { background: palette[4] },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                }}
              >
                {heading}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 300, mt: -0.5 }}>
                {subheading}
              </Typography>
            </Box>
          </SelectDateModal>
          <Box
            sx={{
              WebkitAppRegion: "no-drag",
              display: "flex",
              "& .MuiIconButton-root, & .MuiButton-root": {
                color: "inherit!important",
                borderRadius: 3,
                "&:hover": { background: palette[3] + "!important" },
                "&:active": { background: palette[4] + "!important" },
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
                    `/tasks/perspectives/${type}/${dayjs().format(
                      "YYYY-MM-DD"
                    )}`
                  );
                  scrollIntoView();
                }}
                size="large"
                sx={{
                  px: 0,
                  fontWeight: "700!important",
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
      </AppBar>
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
      sx={{
        WebkitAppRegion: "no-drag",
        color: "inherit!important",
        border: `2px solid`,
        px: view === "priority" ? 3 : 1,
        borderRadius: view === "priority" ? 3 : 5,
        transition: "border-radius .5s!important",
        borderColor: view === "priority" ? redPalette[9] : "transparent",
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
          }),
        }}
      >
        <Typography
          sx={{
            fontWeight: "700!important",
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

  if (error) {
    throw new Error("Failed to load perspectives");
  }

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
        {!isMobile && !error && data && columns?.length > 0 && (
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
        <Box
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
                data={sortedTasks(column.tasks, column)}
                view={view}
              />
            ))
          ) : (
            <PerspectivesLoadingScreen />
          )}
        </Box>
      </Box>
    </PerspectiveContext.Provider>
  );
}
