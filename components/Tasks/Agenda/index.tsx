import { ConfirmationModal } from "@/components/ConfirmationModal";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { FocusTimer } from "../Layout/widgets/FocusTimer";
import { WeatherWidget } from "../Layout/widgets/Weather";
import { CreateTask } from "../Task/Create";
import Column from "./Column";

export const AgendaContext = createContext<any>(null);

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
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("all");

  const columnMap = {
    days: isMobile ? "day" : "week",
    weeks: isMobile ? "week" : "month",
    months: isMobile ? "month" : "year",
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
    router.push(
      `/tasks/agenda/${type}/${dayjs(date)
        .add(1, columnMap[type])
        .format("YYYY-MM-DD")}`
    );
    setView("all");
  };

  const handlePrev = () => {
    router.push(
      `/tasks/agenda/${type}/${dayjs(date)
        .subtract(1, columnMap[type])
        .format("YYYY-MM-DD")}`
    );
    setView("all");
  };

  const start = dayjs(date).startOf(columnMap[type]);
  const end = dayjs(date).endOf(columnMap[type]);

  // Create an array of columns for each [type] in [columnMap]
  const columns = Array.from(
    { length: Math.ceil(end.diff(start, type, true)) },
    (_, index) => start.clone().add(index, type)
  );

  const { data, url, error } = useApi("property/tasks/agenda", {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });

  const session = useSession();
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

  useEffect(() => {
    if (data) {
      scrollIntoView();
    }
  }, [data]);

  useEffect(() => {
    document.body.classList[view === "priority" ? "add" : "remove"](
      "priorityMode"
    );
    window.onbeforeunload = () => {
      if (view === "priority") return false;
      else return null;
    };
  }, [view]);

  const focusToolsStyles = useMemo(
    () => ({
      button: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90px",
        py: 2,
        borderRadius: 0,
        background: palette[2],
        "&:hover": {
          background: palette[3],
        },
        color: palette[11],
        fontSize: "13px",
        "& .MuiIcon-root": {
          color: addHslAlpha(palette[11], 0.8),
        },
      },
    }),
    [palette]
  );

  useHotkeys("esc", () => {
    if (view === "priority") {
      document.getElementById("exitFocus")?.click();
    }
  });

  return (
    <AgendaContext.Provider value={{ start, end, url, type }}>
      <Head>
        <title>
          {dayjs(start).format(viewHeadingFormats[type])} &bull;{" "}
          {dayjs(start).format(viewSubHeadingFormats[type])}
        </title>
      </Head>
      {view === "priority" && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100dvh",
            background: palette[2],
            backdropFilter: "blur(10px)",
            width: "90px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            py: 2,
            borderRadius: "0 10px 10px 0",
            zIndex: 999,
          }}
        >
          <ConfirmationModal
            callback={() => setView("all")}
            title="Exit focus mode?"
            question="Any timers set or notes created will be cleared."
          >
            <IconButton
              id="exitFocus"
              sx={{ background: palette[3], mb: "auto" }}
              size="large"
            >
              <Icon className="outlined">close</Icon>
            </IconButton>
          </ConfirmationModal>
          <FocusTimer>
            <Box sx={focusToolsStyles.button}>
              <Icon className="outlined">timer</Icon>
              Timer
            </Box>
          </FocusTimer>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">sticky_note_2</Icon>
            Note
          </Box>
          <Box sx={focusToolsStyles.button}>
            <Icon className="outlined">data_usage</Icon>
            Status
          </Box>
          <WeatherWidget>
            <Box sx={focusToolsStyles.button}>
              <Icon className="outlined">partly_cloudy_day</Icon>
              Weather
            </Box>
          </WeatherWidget>

          <CreateTask>
            <IconButton
              sx={{ mt: "auto", background: palette[3] }}
              size="large"
            >
              <Icon className="outlined">add</Icon>
            </IconButton>
          </CreateTask>
        </Box>
      )}
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
          style={{ width: "100%" }}
        >
          <Box
            sx={{
              px: 4,
              py: 1.5,
              textAlign: "left",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              background:
                view === "priority"
                  ? ""
                  : `linear-gradient(${palette[1]}, ${palette[2]})`,
              borderBottom: `1.5px solid ${
                palette[view === "priority" ? 3 : 2]
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
            <Box>
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
            </Box>
            <Button
              onClick={() => {
                setView("priority");
                scrollIntoView();
                toast.dismiss();
                toast("Focus mode", {
                  ...toastStyles,
                  icon: <Icon>target</Icon>,
                });
              }}
              sx={{
                ml: "auto",
                ...(view === "priority" && { visibility: "hidden" }),
              }}
            >
              <Icon className="outlined">target</Icon>Focus
            </Button>
            <Box sx={{ ml: "auto" }}>
              <IconButton
                onClick={async () => {
                  setLoading(true);
                  await mutate(url);
                  setLoading(false);
                }}
                disabled={loading}
                className="priority-hidden"
              >
                <Icon
                  className="outlined"
                  sx={{
                    transform: loading
                      ? "scale(1.2) rotate(360deg)"
                      : "scale(1.2)",
                    transition: loading ? "transform 0.5s ease" : "",
                  }}
                >
                  refresh
                </Icon>
              </IconButton>
              <IconButton
                onClick={handlePrev}
                id="agendaPrev"
                className="priority-hidden"
              >
                <Icon className="outlined">arrow_back_ios_new</Icon>
              </IconButton>
              <Button
                className="priority-hidden"
                id="agendaToday"
                onClick={() =>
                  router.push(
                    `/tasks/agenda/${type}/${dayjs().format("YYYY-MM-DD")}`
                  )
                }
                disabled={dayjs(start) <= dayjs() && dayjs() <= dayjs(end)}
                size="large"
                sx={{
                  px: 0,
                  color: "inherit",
                  ...(dayjs(start) <= dayjs() &&
                    dayjs() <= dayjs(end) && { display: "none" }),
                }}
              >
                Today
              </Button>
              <IconButton
                onClick={handleNext}
                id="agendaNext"
                className="priority-hidden"
              >
                <Icon className="outlined">arrow_forward_ios</Icon>
              </IconButton>
            </Box>
          </Box>
        </motion.div>
        <Box
          sx={{
            ...(!data && {
              alignItems: "center",
              justifyContent: "center",
            }),
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            maxWidth: "100%",
            overflowX: "scroll",
            width: "100%",
            height: "100%",
          }}
        >
          {data ? (
            columns.map((column: any) => (
              <Column key={column} column={column} data={data} view={view} />
            ))
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: {
              xs: "70px",
              md: "30px",
            },
            ".hideBottomNav &": {
              bottom: {
                xs: "30px",
                md: "30px",
              },
            },
            opacity: 1,
            mr: {
              xs: 1.5,
              md: 3,
            },
            zIndex: 9,
            background: addHslAlpha(palette[3], 0.5),
            border: "1px solid",
            transition: "transform .2s, opacity .2s, bottom .3s",
            backdropFilter: "blur(10px)",
            borderRadius: 999,
            borderColor: addHslAlpha(palette[3], 0.5),
            right: "0",
            color: isDark ? "#fff" : "#000",
            display: "flex",
            alignItems: "center",
            p: 0.5,
          }}
        >
          <IconButton
            sx={{ color: palette[8] }}
            onClick={() => document.getElementById("agendaPrev")?.click()}
          >
            <Icon className="outlined">arrow_back_ios_new</Icon>
          </IconButton>
          <Button
            id="agendaToday"
            onClick={() => document.getElementById("agendaToday")?.click()}
            disabled={
              dayjs(start) <= dayjs() && dayjs() <= dayjs(end) ? true : false
            }
            size="large"
            sx={{ px: 0 }}
          >
            Today
          </Button>
          <IconButton
            sx={{ color: palette[8] }}
            onClick={() => document.getElementById("agendaNext")?.click()}
          >
            <Icon className="outlined">arrow_forward_ios</Icon>
          </IconButton>
        </Box>
      )}
    </AgendaContext.Provider>
  );
}
