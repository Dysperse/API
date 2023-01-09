import { Checkbox, ListItem, ListItemText } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";

export function SubTask({
  checkList,
  setOpen = (e: any) => {},
  noMargin = false,
  mutationUrl = "",
  subtask,
  BpCheckedIcon,
  BpIcon,
}) {
  const [checked, setChecked] = useState(subtask.completed);

  const handleDelete = () => {
    fetchApiWithoutHook("property/boards/deleteTask", {
      id: subtask.id,
    }).then(() => {
      mutate(mutationUrl);
    });
  };

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  return (
    <>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <ListItem
        onClick={() => setOpen(true)}
        onContextMenu={handleContextMenu}
        key={subtask.id}
        className="rounded-xl select-none transition-transform dark:bg-transparent duration-100 active:duration-[0s] hover:bg-gray-200 active:bg-gray-300 hover:border-gray-300 active:border-gray-400"
        sx={{
          ml: noMargin ? "10px" : "30px",
          maxWidth: "calc(100% - 30px)",
          gap: 1.5,
          py: 0.5,
          pl: 1.5,
          ...(noMargin && {
            ml: -0.5,
          }),
          borderRadius: 4,
          ...(!checkList && {
            border: "0!important",
          }),
          ...(checkList && {
            background: global.user.darkMode
              ? "hsl(240,11%,13%)"
              : "#f3f4f6!important",

            ...(global.user.darkMode && {
              "&:hover": {
                background: "hsl(240,11%,17%)!important",
              },
              "&:active": {
                background: "hsl(240,11%,20%)!important",
              },
            }),
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            gap: "10px!important",
            borderRadius: "15px!important",
            mb: 1.5,
          }),
        }}
      >
        <Checkbox
          disableRipple
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            setChecked(e.target.checked);
            fetchApiWithoutHook("property/boards/markTask", {
              completed: e.target.checked ? "true" : "false",
              id: subtask.id,
            }).catch((err) =>
              toast.error("An error occured while updating the task")
            );
          }}
          sx={{
            p: 0,
            "&:hover": { bgcolor: "transparent" },
          }}
          color="default"
          checkedIcon={<BpCheckedIcon />}
          icon={<BpIcon />}
          inputProps={{ "aria-label": "Checkbox demo" }}
        />
        <ListItemText
          primary={
            <span
              style={{
                opacity: checked ? 0.5 : 1,
                textDecoration: checked ? "line-through" : "none",
              }}
            >
              {subtask.name}
            </span>
          }
        />
      </ListItem>
    </>
  );
}
