import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import { ColumnMenu } from "./Column";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

const AgendaContext = createContext<any>(null);

const Column = React.memo(function Column({ column, data }: any) {
  const session = useSession();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { url, type } = useContext(AgendaContext);

  const [isScrolling, setIsScrolling] = useState(false);

  const heading = {
    days: "dddd",
    weeks: "[Week #]W",
    months: "MMMM",
  }[type];

  const columnMap = {
    days: "day",
    weeks: "week",
    months: "month",
  }[type];

  const subheading = {
    days: "MMMM D",
    weeks: "MMMM D",
    months: "YYYY",
  }[type];

  const isToday = dayjs(column).isSame(dayjs().startOf(columnMap), type);
  const isPast = dayjs(column).isBefore(dayjs().startOf(columnMap), type);

  /**
   * Sort the tasks in a "[pinned, incompleted, completed]" order
   */
  const sortedTasks = useMemo(
    () =>
      data
        .filter((task) => {
          const dueDate = new Date(task.due);
          const columnStart = dayjs(column).startOf(type).toDate();
          const columnEnd = dayjs(columnStart).endOf(type).toDate();
          return dueDate >= columnStart && dueDate <= columnEnd;
        })
        .sort((e, d) =>
          e.completed && !d.completed
            ? 1
            : (!e.completed && d.completed) || (e.pinned && !d.pinned)
            ? -1
            : !e.pinned && d.pinned
            ? 1
            : 0
        ),
    [data, column, type]
  );

  const completedTasks = useMemo(
    () => sortedTasks.filter((task) => task.completed),
    [sortedTasks]
  );
  const tasksLeft = sortedTasks.length - completedTasks.length;
  const [loading, setLoading] = useState(false);

  const header = (
    <div style={{ paddingTop: isMobile ? "65px" : 0 }}>
      <Box
        sx={{
          p: 3,
          borderBottom: { sm: "1.5px solid" },
          borderColor: { sm: palette[3] },
          height: { xs: "140px", sm: "120px" },
        }}
        onClick={async () => {
          setLoading(true);
          await mutate(url);
          setLoading(false);
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            className="font-heading"
            sx={{
              fontSize: {
                xs: "55px",
                sm: "35px",
              },
              ...(isToday && {
                color: "#000!important",
                background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                px: 0.5,
                ml: -0.5,
              }),
              borderRadius: 1,
              width: "auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              ...(isPast && { opacity: 0.5 }),
              mb: 0.7,
            }}
          >
            {dayjs(column).format(heading)}
          </Typography>
          <ColumnMenu tasksLeft={tasksLeft} data={data} day={column} />
        </Box>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "17px",
          }}
        >
          <Tooltip
            placement="bottom-start"
            title={
              <Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {isToday
                    ? "Today"
                    : capitalizeFirstLetter(dayjs(column).fromNow())}
                </Typography>
                <Typography variant="body2">
                  {dayjs(column).format("dddd, MMMM D, YYYY")}
                </Typography>
              </Typography>
            }
          >
            <span
              style={{
                ...(isPast && {
                  textDecoration: "line-through",
                  ...(isPast && { opacity: 0.5 }),
                }),
              }}
            >
              {dayjs(column).format(subheading)}
            </span>
          </Tooltip>
          <Typography
            variant="body2"
            sx={{
              ml: "auto",
              opacity: data.length === 0 ? 0 : tasksLeft === 0 ? 1 : 0.6,
            }}
          >
            {tasksLeft !== 0 ? (
              <>
                {tasksLeft} {isPast ? "unfinished" : "left"}
              </>
            ) : (
              <Icon
                sx={{
                  color: green[isDark ? "A700" : "800"],
                }}
                className="outlined"
              >
                check_circle
              </Icon>
            )}
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ p: { sm: 1 }, pt: { xs: 1 }, pb: { sm: 0.5 } }}>
        <CreateTask
          column={{ id: "-1", name: "" }}
          defaultDate={column}
          label="New task"
          placeholder="Create a task..."
          mutationUrl={url}
          boardId={1}
        />
      </Box>
    </div>
  );
  return (
    <Box
      {...(isToday && { id: "active" })}
      sx={{
        display: "flex",
        height: "100%",
        flex: { xs: "0 0 100%", sm: "0 0 300px" },
        flexDirection: "column",
        width: { xs: "100%", sm: "300px" },
        borderRight: "1.5px solid",
        borderColor: palette[3],
      }}
    >
      <Collapse in={loading}>
        <Box
          sx={{
            height: { xs: "140px", sm: "100px" },
            display: "flex",
            justifyContent: "center",
            mt: { xs: "65px", sm: "0px" },
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Collapse>
      {header}
      <Box sx={{ px: { sm: 1 }, height: "100%" }}>
        <Virtuoso
          isScrolling={setIsScrolling}
          useWindowScroll={isMobile}
          style={{
            height: "100%",
          }}
          totalCount={
            sortedTasks.length +
            (sortedTasks.filter((task) => !task.completed).length === 0 ? 1 : 0)
          }
          itemContent={(index) => {
            if (
              index === 0 &&
              sortedTasks.filter((task) => !task.completed).length === 0
            ) {
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mx: "auto",
                    py: { sm: 2 },
                    alignItems: { xs: "center", sm: "start" },
                    textAlign: { xs: "center", sm: "left" },
                    flexDirection: "column",
                    "& img": {
                      display: { sm: "none" },
                    },
                  }}
                >
                  <Image
                    src="/images/noTasks.png"
                    width={256}
                    height={256}
                    style={{
                      ...(isDark && {
                        filter: "invert(100%)",
                      }),
                    }}
                    alt="No items found"
                  />

                  <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                    <Typography variant="h6" gutterBottom>
                      {sortedTasks.length === 0 ? "No tasks!" : "Let's go!"}
                    </Typography>
                    <Typography gutterBottom sx={{ fontWeight: 300 }}>
                      {sortedTasks.length === 0
                        ? "Nothing planned for this time"
                        : "You have no tasks remaining!"}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "100%", mt: 1 }}>
                    {sortedTasks.length !== 0 && (
                      <Divider sx={{ mt: 2, mb: -1 }} />
                    )}
                  </Box>
                </Box>
              );
            }
            if (index === sortedTasks.length) return;
            const task = sortedTasks[index];
            return (
              <Task
                isAgenda={true}
                isDateDependent={true}
                key={task.id}
                isScrolling={isScrolling}
                board={task.board || false}
                columnId={task.column ? task.column.id : -1}
                mutationUrl={url}
                task={task}
              />
            );
          }}
        />
        {isMobile && <div style={{ height: "calc(130px + var(--sab))" }} />}
      </Box>
    </Box>
  );
});

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

  const columnMap = {
    days: isMobile ? "day" : "week",
    weeks: isMobile ? "week" : "month",
    months: isMobile ? "month" : "year",
  };

  const viewHeadingFormats = {
    days: "MMMM YYYY",
    weeks: "MMMM",
    months: "YYYY",
  };

  const viewSubHeadingFormats = {
    days: "[Week] W",
    weeks: "YYYY",
    months: "-",
  };

  const handleNext = () =>
    router.push(
      `/tasks/agenda/${type}/${dayjs(date)
        .add(1, columnMap[type])
        .format("YYYY-MM-DD")}`
    );

  const handlePrev = () =>
    router.push(
      `/tasks/agenda/${type}/${dayjs(date)
        .subtract(1, columnMap[type])
        .format("YYYY-MM-DD")}`
    );

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

  useEffect(() => {
    const column = document.getElementById("active");
    if (data && column) {
      column.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [data]);

  return (
    <AgendaContext.Provider value={{ start, end, url, type }}>
      <Head>
        <title>
          {dayjs(start).format(viewHeadingFormats[type])} &bull;{" "}
          {dayjs(start).format(viewSubHeadingFormats[type])}
        </title>
      </Head>
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
              background: `linear-gradient(${palette[1]}, ${palette[2]})`,
              width: "100%",
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
            <Box sx={{ ml: "auto" }}>
              <IconButton onClick={handlePrev} id="agendaPrev">
                <Icon className="outlined">arrow_back_ios_new</Icon>
              </IconButton>
              <Button
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
              <IconButton onClick={handleNext} id="agendaNext">
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
              <Column key={column} column={column} data={data} />
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
