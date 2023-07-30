import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
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
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import { ColumnMenu } from "./Column";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);

const AgendaContext = createContext<any>(null);

function Column({ column, data }) {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = useDarkMode(session.darkMode);
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
    days: "MMMM Do",
    weeks: "MMMM Do",
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

  const header = (
    <div style={{ paddingTop: isMobile ? "65px" : 0 }}>
      <Box sx={{ p: 3, borderBottom: "1.5px solid", borderColor: palette[3] }}>
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
              height: { xs: 65, sm: 45 },
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
            fontSize: "20px",
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
      <Box sx={{ p: { sm: 1 }, pb: { sm: 0.5 } }}>
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
      {header}
      <Box sx={{ px: { sm: 1 }, height: "100%" }}>
        <Virtuoso
          isScrolling={setIsScrolling}
          useWindowScroll={isMobile}
          style={{
            height: "100%",
          }}
          totalCount={sortedTasks.length}
          itemContent={(index) => {
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
        {isMobile && <div style={{ height: "calc(60px + var(--sab))" }} />}
      </Box>
    </Box>
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
  const isMobile = useMediaQuery("(max-width: 600px)");

  const columnMap = {
    days: isMobile ? "day" : "week",
    weeks: isMobile ? "week" : "month",
    months: isMobile ? "month" : "year",
  };

  const viewHeadingFormats = {
    days: "[Week #]W",
    weeks: "MMMM YYYY",
    months: "YYYY",
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
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <AgendaContext.Provider value={{ start, end, url, type }}>
      <Head>
        <title>
          {dayjs(start).format(viewHeadingFormats[type])}&bull;
          {capitalizeFirstLetter(type)}
        </title>
      </Head>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 1.5,
            textAlign: "left",
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            borderBottom: "1.5px solid",
            borderColor: palette[3],
            width: "100%",
          }}
        >
          <Typography variant="h6">
            {dayjs(start).format(viewHeadingFormats[type])}
          </Typography>
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
              disabled={
                dayjs(start) <= dayjs() && dayjs() <= dayjs(end) ? true : false
              }
              size="large"
              sx={{ px: 0, color: "inherit" }}
            >
              Today
            </Button>
            <IconButton onClick={handleNext} id="agendaNext">
              <Icon className="outlined">arrow_forward_ios</Icon>
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            maxWidth: "100%",
            overflowX: "scroll",
            width: "100%",
            height: "100%",
          }}
        >
          {data &&
            columns.map((column: any) => (
              <Column key={column} column={column} data={data} />
            ))}
        </Box>
      </Box>
      {isMobile && (
        <Box sx={{ position: "fixed", bottom: 0, right: 0, m: 2 }}>
          <IconButton
            sx={{ color: palette[8] }}
            onClick={() => document.getElementById("agendaNext")?.click()}
          >
            <Icon className="outlined">arrow_forward_ios</Icon>
          </IconButton>
          <IconButton
            sx={{ color: palette[8] }}
            onClick={() => document.getElementById("agendaPrev")?.click()}
          >
            <Icon className="outlined">arrow_back_ios_new</Icon>
          </IconButton>
        </Box>
      )}
    </AgendaContext.Provider>
  );
}
