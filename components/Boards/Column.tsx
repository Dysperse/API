import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CreateTask } from "./CreateTask";
import { Task } from "./Task";
import React from "react";

export const Column = React.memo(function ({
  mutationUrl,
  boardId,
  column,
}: any) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(200, 200, 200, 0.2)",
        width: "350px",
        flex: "0 0 350px",
        border: "1px solid rgba(200, 200, 200, 0.4)",
        p: 3,
        px: 4,
        borderRadius: 5,
      }}
    >
      <img src={column.emoji} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
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
        <IconButton
          size="small"
          sx={{
            ml: "auto",
            transition: "none!important",
            border: "1px solid rgba(200, 200, 200, 0)!important",
            "&:hover,&:active": {
              color: "#000",
              border: "1px solid rgba(200, 200, 200, 0.5)!important",
            },
          }}
        >
          <span className="material-symbols-outlined">more_horiz</span>
        </IconButton>
      </Box>
      {column.tasks
        .filter((task) => task.parentTasks.length === 0)
        .map((task) => (
          <Task task={task} />
        ))}

      <CreateTask
        mutationUrl={mutationUrl}
        boardId={boardId}
        columnId={column.id}
      />
    </Box>
  );
});
