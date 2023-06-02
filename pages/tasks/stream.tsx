import { Backlog } from "@/components/Boards/Backlog";
import { Task } from "@/components/Boards/Board/Column/Task";
import { CreateTask } from "@/components/Boards/Board/Column/Task/Create";
import { TasksLayout } from "@/components/Boards/Layout";
import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import {
  Box,
  CardActionArea,
  Chip,
  Collapse,
  Icon,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import { useState } from "react";
import { mutate } from "swr";

function TodaysTasks({ data, url, error }) {
  return (
    <>
      {[
        ...data.filter((task) => task.pinned),
        ...data.filter((task) => !task.pinned),
      ].map((task) => (
        <Task
          isDateDependent={true}
          key={task.id}
          board={task.board || false}
          columnId={task.column ? task.column.id : -1}
          mutationUrl={url}
          task={task}
        />
      ))}
      {error && (
        <ErrorHandler
          error="Oh no! We couldn't get today's tasks. Please try again later."
          callback={() => mutate(url)}
        />
      )}
    </>
  );
}

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showTodaysTasks, setShowTodaysTasks] = useState(true);

  const styles = {
    sectionButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      px: { xs: 2, sm: 1 },
      py: { xs: 1, sm: 0.5 },
      gap: 1,
      borderRadius: { sm: 3 },
      "& *:not(.MuiIcon-root)": {
        transition: "none!important",
      },
      fontWeight: 700,
      fontSize: "22px",
      "& .MuiIcon-root": {
        fontSize: "35px!important",
      },
      mt: 2,
      cursor: "default",
    },
  };

  const { data, url, error } = useApi("property/tasks/agenda", {
    startTime: dayjs().startOf("day"),
    endTime: dayjs().endOf("day"),
  });

  const { data: backlogData } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Head>
        <title>Stream</title>
      </Head>
      <Box sx={{ p: { xs: 0, sm: 3 }, pb: 1, pt: { sm: 5 }, mb: 10 }}>
        <Box sx={{ px: { xs: 3.5, sm: 1.5 }, py: { xs: 4, sm: 0 } }}>
          <Typography className="font-heading" variant="h4">
            Stream
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
            <Chip
              {...(showBacklog === false &&
                showTodaysTasks === true && {
                  onDelete: () => {
                    setShowBacklog(true);
                    setShowTodaysTasks(true);
                  },
                })}
              disabled={showBacklog === true && showTodaysTasks === false}
              label={`${data.length} tasks`}
              onClick={() => {
                setShowBacklog(false);
                setShowTodaysTasks(true);
              }}
            />
            <Chip
              {...(showBacklog === true &&
                showTodaysTasks === false && {
                  onDelete: () => {
                    setShowBacklog(true);
                    setShowTodaysTasks(true);
                  },
                })}
              disabled={showBacklog === false && showTodaysTasks === true}
              label={`${backlogData.length} overdue`}
              onClick={() => {
                setShowBacklog(true);
                setShowTodaysTasks(false);
              }}
            />
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <CreateTask
            closeOnCreate
            column={{ id: "-1", name: "" }}
            defaultDate={new Date()}
            label="New task"
            placeholder="Create a task..."
            mutationUrl={""}
            boardId={1}
          />
        </Box>
        <CardActionArea
          sx={{ ...styles.sectionButton }}
          onClick={() => setShowBacklog((e) => !e)}
        >
          <Icon
            sx={{
              transform: `rotate(${showBacklog ? 0 : -90}deg)`,
              transition: "all .2s!important",
            }}
          >
            expand_more
          </Icon>
          Backlog
        </CardActionArea>
        <Collapse in={showBacklog} orientation="vertical">
          <Backlog />
        </Collapse>
        <CardActionArea
          sx={{ ...styles.sectionButton }}
          onClick={() => setShowTodaysTasks((e) => !e)}
        >
          <Icon
            sx={{
              transform: `rotate(${showTodaysTasks ? 0 : -90}deg)`,
              transition: "all .2s!important",
            }}
          >
            expand_more
          </Icon>
          Today
        </CardActionArea>
        <Collapse in={showTodaysTasks} orientation="vertical">
          <TodaysTasks data={data} url={url} error={error} />
        </Collapse>
      </Box>
    </TasksLayout>
  );
}
