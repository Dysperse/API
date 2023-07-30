import {
  Box,
  Icon,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { useTaskContext } from "./Context";

export const LinkedContent = React.memo(function LinkedContent({
  styles,
}: any) {
  const router = useRouter();
  const task = useTaskContext();

  return (
    <Box sx={styles.section}>
      {task.id.includes("-event-assignment") && (
        <ListItem className="item" sx={{ gap: 1.5 }}>
          <Box
            sx={{
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
              color: "#000!important",
              width: 13,
              height: 13,
              borderRadius: 999,
            }}
          />
          <ListItemText primary={`Imported from Canvas LMS`} />
        </ListItem>
      )}
      <ListItem className="item">
        <ListItemText
          primary={`Edited  ${dayjs(task.lastUpdated).fromNow()}`}
          sx={{ fontStyle: "italic" }}
        />
      </ListItem>
      <ListItemButton
        className="item"
        onClick={() => router.push(`/groups/${task.property.id}`)}
      >
        <ListItemText
          primary={
            !(task?.column?.board?.public === false)
              ? task.property.name
              : "Only visible to you"
          }
          secondary={
            !(task?.column?.board?.public === false)
              ? "Visible to group"
              : `Not visible to others in "${task.property.name}"`
          }
        />
        <Icon sx={{ ml: "auto" }} className="outlined">
          {!(task?.column?.board?.public === false) ? "group" : "lock"}
        </Icon>
      </ListItemButton>
      {task.column && (
        <ListItemButton
          className="item"
          onClick={() => router.push(`/tasks/boards/${task.column.board.id}`)}
        >
          <ListItemText
            secondary={task.column.name}
            primary={`Found in "${task.column.board.name}"`}
          />
          <Icon sx={{ ml: "auto" }} className="outlined">
            view_kanban
          </Icon>
        </ListItemButton>
      )}
    </Box>
  );
});
