import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CreateTask } from "./CreateTask";
import { Task } from "./Task";

export function Column({ column }): JSX.Element {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        width: "400px",
        border: "1px solid rgba(200, 200, 200, 0.4)",
        p: 3,
        px: 4,
        borderRadius: 5,
      }}
    >
      <img src={column.emoji} />
      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          mb: 2,
          mt: 1,
          textDecoration: "underline",
        }}
      >
        {column.name}
      </Typography>
      {column.tasks
        .filter((task) => task.parentTasks.length === 0)
        .map((task) => (
          <Task task={task} />
        ))}

      <CreateTask />
    </Box>
  );
}
