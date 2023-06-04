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
  CircularProgress,
  Collapse,
  Icon,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import { useState } from "react";
import { mutate } from "swr";

function TodaysTasks({ data, url, error }) {
  return data ? (
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
  ) : (
    <CircularProgress />
  );
}
function UpcomingTasks({ data, url, error }) {
  return data ? (
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
          error="Oh no! We couldn't get your upcoming tasks. Please try again later."
          callback={() => mutate(url)}
        />
      )}
    </>
  ) : (
    <CircularProgress />
  );
}

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showTodaysTasks, setShowTodaysTasks] = useState(true);
  const [showUpcomingTasks, setShowUpcomingTasks] = useState(false);

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

  const {
    data: upcomingData,
    url: upcomingUrl,
    error: upcomingError,
  } = useApi("property/tasks/agenda", {
    startTime: dayjs().endOf("day"),
    endTime: dayjs().add(100, "year"),
  });

  const { data: backlogData } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Head>
        <title>Stream</title>
      </Head>
      <Box
        sx={{
          p: { xs: 0, sm: 3 },
          pb: 1,
          pt: { sm: 5 },
          mb: 10,
          maxWidth: "100vw",
        }}
      >
        <Box sx={{ px: { xs: 3.5, sm: 1.5 }, py: { xs: 4, sm: 0 } }}>
          <Typography className="font-heading" variant="h4">
            Stream
          </Typography>
          {data && backlogData && (
            <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
              <Chip
                {...(showTodaysTasks && {
                  onDelete: () => setShowTodaysTasks(false),
                })}
                label={`${data.length} tasks`}
                onClick={() => setShowTodaysTasks(true)}
              />
              {backlogData?.length !== 0 && (
                <Chip
                  {...(showBacklog && {
                    onDelete: () => setShowBacklog(false),
                  })}
                  label={`${backlogData.length} overdue`}
                  onClick={() => setShowBacklog(true)}
                />
              )}
              <Chip
                {...(showUpcomingTasks && {
                  onDelete: () => setShowUpcomingTasks(false),
                })}
                label={`${(upcomingData || []).length} upcoming`}
                onClick={() => setShowUpcomingTasks(true)}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ my: 2, mt: 4 }}>
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
        {backlogData?.length !== 0 && (
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
            {backlogData && (
              <Chip
                variant="outlined"
                size="small"
                label={`${backlogData.filter((e) => e.completed).length}/${
                  backlogData.length
                }`}
              />
            )}
          </CardActionArea>
        )}
        {backlogData?.length !== 0 && (
          <Collapse in={showBacklog} orientation="vertical">
            <Backlog />
          </Collapse>
        )}
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
          {data && (
            <Chip
              variant="outlined"
              size="small"
              label={`${data.filter((e) => e.completed).length}/${data.length}`}
            />
          )}
        </CardActionArea>
        <Collapse in={showTodaysTasks} orientation="vertical">
          <TodaysTasks data={data} url={url} error={error} />
        </Collapse>

        <CardActionArea
          sx={{ ...styles.sectionButton }}
          onClick={() => setShowUpcomingTasks((e) => !e)}
        >
          <Icon
            sx={{
              transform: `rotate(${showUpcomingTasks ? 0 : -90}deg)`,
              transition: "all .2s!important",
            }}
          >
            expand_more
          </Icon>
          Upcoming
          {upcomingData && (
            <Chip
              variant="outlined"
              size="small"
              label={`${upcomingData.filter((e) => e.completed).length}/${
                upcomingData.length
              }`}
            />
          )}
        </CardActionArea>
        <Collapse in={showUpcomingTasks} orientation="vertical">
          <UpcomingTasks
            data={upcomingData}
            url={upcomingUrl}
            error={upcomingError}
          />
        </Collapse>
      </Box>
    </TasksLayout>
  );
}
