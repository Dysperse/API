import { Box, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../Error";
import { Task } from "./Board/Column/Task";

export function Backlog() {
  const { data, url, error } = useApi("property/boards/backlog", {
    date: dayjs().startOf("day").toISOString(),
  });

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
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
      <Box sx={{ p: 5, pb: 0 }}>
        <Typography className="font-heading" variant="h4" gutterBottom>
          Backlog
        </Typography>
        <Typography sx={{ mb: 2 }}>{data.length} unfinished tasks</Typography>
        {error && (
          <ErrorHandler error="Yikes! An error occured while trying to fetch your backlog. Please try again later." />
        )}
      </Box>
      <Box sx={{ px: 4, pb: 5 }}>
        {data.map((task, index) => (
          <Task
            key={task.id}
            board={task.board || false}
            columnId={task.column ? task.column.id : -1}
            isAgenda
            mutationUrl={url}
            task={task}
          />
        ))}
      </Box>
    </Box>
  );
}
