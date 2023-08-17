import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { AgendaContext } from ".";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import SelectDateModal from "../Task/DatePicker";
import { ColumnMenu } from "./ColumnMenu";

const Header = memo(function Header({
  type,
  subheading,
  url,
  column,
  isToday,
  tasksLeft,
  isPast,
  sortedTasks,
  heading,
  columnEnd,
  handleMutate,
}: any) {
  const session = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  console.log("Header component re-rendered!");

  return (
    <Box
      sx={{
        pt: isMobile ? "65px" : 0,
        backdropFilter: { sm: "blur(20px)" },
        position: { sm: "sticky" },
        top: 0,
        left: 0,
        background: { sm: addHslAlpha(palette[1], 0.7) },
        zIndex: 99,
      }}
    >
      <motion.div
        key="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            pt: { xs: 4 },
            maxWidth: "100vw",
            mb: { xs: 0, sm: 2 },
            borderBottom: { sm: "1.5px solid" },
            borderColor: { sm: addHslAlpha(palette[3], 0.9) },
            height: "auto",
          }}
          id="taskMutationTrigger"
          onClick={handleMutate}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobile && (
              <IconButton
                sx={{ color: palette[8] }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("agendaPrev")?.click();
                }}
              >
                <Icon className="outlined">arrow_back_ios_new</Icon>
              </IconButton>
            )}
            <SelectDateModal
              date={dayjs(column).toDate()}
              setDate={(date) => {
                setTimeout(() => {
                  router.push(
                    "/tasks/agenda/days/" + dayjs(date).format("YYYY-MM-DD")
                  );
                }, 500);
              }}
              dateOnly
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mx: "auto",
                  justifyContent: "cneter",
                  gap: 2,
                  maxWidth: "100%",
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    ...(isToday
                      ? {
                          color: "#000!important",
                          background: `linear-gradient(${palette[7]}, ${palette[9]})`,
                          px: 0.5,
                        }
                      : {
                          background: `linear-gradient(${palette[4]}, ${palette[4]})`,
                          px: 0.5,
                        }),
                    borderRadius: 1,
                    width: "auto",
                    display: "inline-flex",
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    ...(isPast && { opacity: 0.5 }),
                  }}
                >
                  {dayjs(column).format(heading)}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
                      {type === "weeks" &&
                        " - " + dayjs(columnEnd).format("DD")}
                    </span>
                  </Tooltip>
                </Typography>
              </Box>
            </SelectDateModal>
            {isMobile && (
              <IconButton
                sx={{ color: palette[8] }}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("agendaNext")?.click();
                }}
              >
                <Icon className="outlined">arrow_forward_ios</Icon>
              </IconButton>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 3,
            mb: 2,
            justifyContent: "center",
          }}
        >
          {session.permission !== "read-only" && (
            <CreateTask
              onSuccess={() => mutate(url)}
              defaultDate={dayjs(column).startOf(type).toDate()}
            >
              <Button variant="contained" fullWidth>
                <Icon>add_circle</Icon>
                New task
              </Button>
            </CreateTask>
          )}
          <ColumnMenu tasksLeft={tasksLeft} data={sortedTasks} day={column}>
            <Button variant="outlined" size="small">
              <Icon>more_horiz</Icon>
            </Button>
          </ColumnMenu>
        </Box>
      </motion.div>
    </Box>
  );
});

const Column = React.memo(function Column({
  column,
  data,
  view,
}: any): JSX.Element {
  const scrollParentRef = useRef();
  const session = useSession();
  const router = useRouter();
  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const palette = useColor(session.themeColor, isDark);

  const { url, type } = useContext(AgendaContext);

  const columnStart = dayjs(column).startOf(type).toDate();
  const columnEnd = dayjs(columnStart).endOf(type).toDate();

  const [isScrolling, setIsScrolling] = useState(false);

  const heading = {
    days: "DD",
    weeks: "#W",
    months: "YYYY",
  }[type];

  const columnMap = {
    days: "day",
    weeks: "week",
    months: "month",
  }[type];

  const subheading = {
    days: "dddd",
    weeks: "D",
    months: "MMM",
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
    [data, columnEnd, columnStart]
  );

  const completedTasks = useMemo(
    () => sortedTasks.filter((task) => task.completed),
    [sortedTasks]
  );

  const tasksLeft = sortedTasks.length - completedTasks.length;
  const [loading, setLoading] = useState(false);

  const handleMutate = useCallback(async () => {
    setLoading(true);
    await mutate(url);
    setLoading(false);
  }, [url]);

  return (
    <Box
      ref={scrollParentRef}
      {...(isToday && { id: "active" })}
      sx={{
        height: { xs: "auto", sm: "100%" },
        flex: { xs: "0 0 100%", sm: "0 0 300px" },
        width: { xs: "100%", sm: "300px" },
        borderRight: "1.5px solid",
        ...(!isMobile && {
          overflowY: "scroll",
        }),
        ...(view === "priority" &&
          !isToday && {
            opacity: 0.2,
            filter: "blur(5px)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              opacity: 1,
              filter: "none",
            },
          }),
        ...(view === "priority" && {
          borderLeft: "1.5px solid",
        }),
        borderColor: palette[3],
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 999999999,
          }}
        />
      )}
      <Header
        handleMutate={handleMutate}
        type={type}
        subheading={subheading}
        url={url}
        column={column}
        isToday={isToday}
        tasksLeft={tasksLeft}
        loading={loading}
        isPast={isPast}
        sortedTasks={sortedTasks}
        heading={heading}
        columnEnd={columnEnd}
      />
      <Box sx={{ px: { sm: 1 }, height: { sm: "100%" } }}>
        {sortedTasks.filter((task) => !task.completed).length === 0 && (
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
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  borderRadius: "20px",
                  ...(isDark && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  {sortedTasks.length === 0
                    ? "Nothing planned for this time"
                    : "You finished everything!"}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", mt: 1 }}>
                {sortedTasks.length !== 0 && <Divider sx={{ mt: 2, mb: -1 }} />}
              </Box>
            </motion.div>
          </Box>
        )}
        <Virtuoso
          useWindowScroll
          isScrolling={setIsScrolling}
          {...(!isMobile && { customScrollParent: scrollParentRef.current })}
          data={sortedTasks}
          itemContent={(_, task) => (
            <Task
              isAgenda
              isDateDependent={true}
              key={task.id}
              isScrolling={isScrolling}
              board={task.board || false}
              columnId={task.column ? task.column.id : -1}
              mutationUrl={url}
              task={task}
            />
          )}
        />
        <Box sx={{ height: { xs: "calc(130px + var(--sab))", sm: "10px" } }} />
      </Box>
    </Box>
  );
});
export default Column;
