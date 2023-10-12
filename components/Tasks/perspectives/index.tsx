import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
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
import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { WidgetBar } from "../Layout/widgets";
import SelectDateModal from "../Task/DatePicker";
import Column from "./Column";

export const PerspectiveContext = createContext<any>(null);

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
    if (!agendaContainerRef.current) return;
    // alert(agendaContainerRef.current?.scrollLeft);
    const { scrollLeft, clientWidth, scrollWidth } = agendaContainerRef.current;
    const { width } = agendaContainerRef.current.getBoundingClientRect();

    const canScrollRight = scrollLeft + clientWidth <= scrollWidth - 10;

    if (canScrollRight && !isMobile) {
      agendaContainerRef.current.scrollTo({
        left: width + scrollLeft - 50,
        behavior: "smooth",
      });
    } else {
      agendaContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      const next = dayjs(date).add(1, columnMap[type]).format("YYYY-MM-DD");
      router.push(`/tasks/perspectives/${type}/${next}`);
    }
  };

  const handlePrev = () => {
    if (!agendaContainerRef.current) return;
    const { scrollLeft } = agendaContainerRef.current;
    const { width } = agendaContainerRef.current.getBoundingClientRect();

    const canScrollLeft = scrollLeft > 0;

    if (canScrollLeft && !isMobile) {
      agendaContainerRef.current.scrollTo({
        left: (width + scrollLeft - 50) * -1,
        behavior: "smooth",
      });
    } else {
      const prev = dayjs(date)
        .subtract(1, columnMap[type])
        .format("YYYY-MM-DD");
      router.push(`/tasks/perspectives/${type}/${prev}`);
    }
  };

  const start = dayjs(date).startOf(columnMap[type]);
  const end = dayjs(date).endOf(columnMap[type]);

  // Create an array of columns for each [type] in [columnMap]
  const columns = Array.from(
    { length: Math.ceil(end.diff(start, type, true)) },
    (_, index) => start.clone().add(index, type)
  );

  const { data, mutate: mutateList } = useSWR([
    "property/tasks/perspectives",
    {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
  ]);

  const { session } = useSession();
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
            <Button
              variant="contained"
              sx={{
                ml: "auto",
                color: "inherit!important",
                transition: "box-shadow .3s!important",
                "&:hover": {
                  boxShadow: `0 0 25px 1px ${palette[8]}!important`,
                },
                ...(view === "priority" && {
                  opacity: "0!important",
                  pointerEvents: "none!important",
                }),
              }}
              onClick={() => {
                setView("priority");
                scrollIntoView();
                toast.dismiss();
                toast("Focus mode", {
                  icon: <Icon>target</Icon>,
                });
              }}
            >
              <Icon className="outlined">target</Icon>Focus
            </Button>
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
            // what does this do?
            backfaceVisibility: "hidden",
            transform: "translateZd(0)",
            ...(!data && {
              alignItems: "center",
              justifyContent: "center",
            }),
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            maxWidth: "100dvw",
            overflowX: { xs: "hidden", sm: "auto" },
            width: "100%",
            height: "100%",
          }}
          ref={agendaContainerRef}
        >
          {data && columns?.length > 0 ? (
            columns.map((column: any) => (
              <Column
                key={column}
                column={column}
                data={data.data}
                recurringTasks={data.recurringTasks}
                view={view}
              />
            ))
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
    </PerspectiveContext.Provider>
  );
}
