import { useApi } from "@/lib/client/useApi";
import { Box, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { Task } from "./Task";

export function Backlog() {
  const { data, url } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "calc(100vh - var(--navbar-height) - 55px)",
            sm: "100vh",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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
    </Box>
  );
}
