import {
  Box,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { useTaskContext } from "./Context";
import { toast } from "react-hot-toast";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/session";
import { toastStyles } from "@/lib/client/useTheme";

export const LinkedContent = React.memo(function LinkedContent({
  styles,
}: any) {
  const router = useRouter();
  const task = useTaskContext();
  const session = useSession();

  const isTaskImported = task.id.includes("-event-assignment");
  const isBoardPublic = task?.column?.board?.public !== false;
  const groupName = task.property.name;
  const isGroupVisible = !(task?.column?.board?.public === false);

  const handleGroupClick = () => {
    router.push(`/groups/${task.property.id}`);
  };

  const handleBoardClick = () => {
    router.push(`/tasks/boards/${task.column.board.id}`);
  };

  const handleRemoveBoard = async (e) => {
    if (!task.due) {
      toast.error(
        "Set a due date to remove this task from a board",
        toastStyles
      );
      return;
    }

    task.set((prev) => ({ ...prev, column: null, columnId: null }));

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          fetchRawApi(session, "property/boards/column/task/edit", {
            id: task.id,
            columnId: "null",
          });
          await task.mutate();
          resolve("");
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: "Removing task from board...",
        success: "Task moved to agenda!",
        error: "Couldn't remove task from board",
      },
      toastStyles
    );
  };

  return (
    <Box sx={styles.section}>
      {isTaskImported && (
        <ListItem className="item">
          <Box
            sx={{
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
              color: "#000",
              width: 13,
              height: 13,
              borderRadius: "50%",
            }}
          />
          <ListItemText primary={`Imported from Canvas LMS`} />
        </ListItem>
      )}

      <ListItem className="item">
        <ListItemText
          primary={`Edited ${dayjs(task.lastUpdated).fromNow()}`}
          sx={{ fontStyle: "italic" }}
        />
      </ListItem>

      <ListItemButton className="item" onClick={handleGroupClick}>
        <ListItemText
          primary={isGroupVisible ? groupName : "Only visible to you"}
          secondary={
            isGroupVisible
              ? "Visible to group"
              : `Not visible to others in "${groupName}"`
          }
        />
        <Icon sx={{ ml: "auto" }} className="outlined">
          {isBoardPublic ? "group" : "lock"}
        </Icon>
      </ListItemButton>

      {task.column && (
        <ListItemButton className="item" onClick={handleBoardClick}>
          <Icon className="outlined">view_kanban</Icon>
          <ListItemText
            secondary={task.column.name}
            primary={`Found in "${task.column.board.name}"`}
          />
          <IconButton
            sx={{ ml: "auto" }}
            className="outlined"
            onClick={handleRemoveBoard}
          >
            <Icon>close</Icon>
          </IconButton>
        </ListItemButton>
      )}
    </Box>
  );
});
