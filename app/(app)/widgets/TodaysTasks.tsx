"use client";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { Task } from "../tasks/Task";
import { CreateTask } from "../tasks/Task/Create";
import { SelectionContext } from "../tasks/selection-context";

export function TodaysTasks() {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const [open, setOpen] = useState<boolean>(false);

  const { data, mutate, error } = useSWR([
    "space/tasks/perspectives",
    {
      utcOffset: dayjs().utcOffset(),
      start: dayjs().startOf("day").toISOString(),
      end: dayjs().endOf("day").toISOString(),
      type: "week",
    },
  ]);

  const completedTasksLength = data
    ? data[0]?.tasks?.filter((taskData) =>
        taskData.recurrenceRule !== null
          ? taskData.completionInstances.find((instance) =>
              dayjs(instance.iteration)
                .startOf("day")
                .isSame(dayjs().startOf("day"))
            )
          : taskData.completionInstances?.length > 0
      ).length || 0
    : 0;

  return (
    <>
      {data && (
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              maxHeight: "calc(100dvh - 50px)",
            },
          }}
        >
          <Puller />
          <Box sx={{ px: 4 }}>
            <CreateTask
              defaultDate={dayjs().startOf("day").toDate()}
              onSuccess={() => mutate()}
            >
              <Button variant="contained" fullWidth>
                <Icon>add_circle</Icon>New task
              </Button>
            </CreateTask>
          </Box>
          <SelectionContext.Provider
            value={{
              values: [],
              set: () => {},
            }}
          >
            {data[0].tasks.map((task) => (
              <Task
                recurringInstance={task.recurrenceDay}
                isAgenda
                isDateDependent={true}
                key={task.id}
                board={task.board || false}
                columnId={task.column ? task.column.id : -1}
                mutateList={() => mutate()}
                task={task}
              />
            ))}
          </SelectionContext.Provider>
        </SwipeableDrawer>
      )}
      {data ? (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            height: "84px",
            p: { xs: 2, sm: 3 },
            borderRadius: 5,
            background: palette[3],
            color: palette[11],
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Icon sx={{ fontSize: "40px!important" }} className="outlined">
            check_circle
          </Icon>
          <Box>
            <Typography variant="h5">
              {data?.[0]?.tasks?.length} task
              {data?.[0]?.tasks?.length !== 1 && "s"}
            </Typography>
            <Typography variant="body2">
              {completedTasksLength} complete
            </Typography>
          </Box>
        </Box>
      ) : (
        <Skeleton height={84} variant="rectangular" />
      )}
    </>
  );
}
