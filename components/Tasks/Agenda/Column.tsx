import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Icon,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useContext, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { AgendaContext } from ".";
import { Task } from "../Task";
import { CreateTask } from "../Task/Create";
import { ColumnMenu } from "./ColumnMenu";

const Column = React.memo(function Column({ column, data }: any): JSX.Element {
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
    <Box
      sx={{
        pt: isMobile ? "65px" : 0,
        backdropFilter: { sm: "blur(20px)" },
        position: { sm: "sticky" },
        background: { sm: addHslAlpha(palette[1], 0.7) },
        zIndex: 99,
        top: "0",
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: { sm: "1.5px solid" },
          borderColor: { sm: addHslAlpha(palette[3], 0.9) },
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
    </Box>
  );
  const scrollParentRef = useRef();

  return (
    <Box
      ref={scrollParentRef}
      {...(isToday && { id: "active" })}
      sx={{
        display: "flex",
        height: "100%",
        flex: { xs: "0 0 100%", sm: "0 0 300px" },
        flexDirection: "column",
        width: { xs: "100%", sm: "300px" },
        borderRight: "1.5px solid",
        borderColor: palette[3],
        ...(!isMobile && {
          overflowY: "scroll",
        }),
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {header}
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
      </motion.div>
      <Box sx={{ px: { sm: 1 }, height: "100%" }}>
        <Virtuoso
          isScrolling={setIsScrolling}
          customScrollParent={scrollParentRef.current}
          useWindowScroll
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
export default Column;
