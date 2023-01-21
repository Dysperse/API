import { Checkbox, Link, ListItem, ListItemText } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";

// use whatever you want here
const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const renderText = (txt) =>
  txt.split(" ").map((part) =>
    URL_REGEX.test(part) ? (
      <Link
        target="_blank"
        href={part}
        sx={{
          color: colors[themeColor]["700"],
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {part.replace(/\/$/, "").replace("https://", "").replace("http://", "")}{" "}
      </Link>
    ) : (
      `${part} `
    )
  );

export const SubTask = React.memo(function SubTask({
  checkList,
  setOpen,
  noMargin = false,
  mutationUrl = "",
  subtask,
  BpCheckedIcon,
  BpIcon,
}: {
  checkList: any;
  setOpen?: any;
  noMargin?: any;
  mutationUrl: any;
  subtask: any;
  BpCheckedIcon: any;
  BpIcon: any;
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
        onClick={() => {
          if (setOpen) {
            setOpen(true);
            setTimeout(() => {
              document.getElementById("subTasksTrigger")?.click();
            }, 10);
          }
        }}
        onContextMenu={handleContextMenu}
        key={subtask.id}
        className="p-1 shadow-sm border border-gray-100 hover:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-200 active:bg-gray-300 cursor-auto select-none"
        sx={{
          color: colors["brown"][global.user.darkMode ? "A100" : "A700"],
          p: { xs: 1, sm: 0 },
          width: "calc(100% - 20px)",
          ml: "20px",
          py: { sm: "0!important" },
          cursor: "unset!important",
          ...(global.user.darkMode && {
            "&:hover": {
              backgroundColor: "hsl(240,11%,19%)!important",
            },
            "&:active": {
              backgroundColor: "hsl(240,11%,16%)",
            },
          }),
          boxShadow: {
            sm: "none!important",
          },
          gap: "10px!important",
          mb: {
            xs: 1.5,
            sm: 0,
          },
        }}
      >
        <Checkbox
          disableRipple
          checked={checked}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            setChecked(e.target.checked);
            fetchApiWithoutHook("property/boards/markTask", {
              completed: e.target.checked ? "true" : "false",
              id: subtask.id,
            }).catch(() =>
              toast.error("An error occured while updating the task")
            );
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
              {renderText(subtask.name)}
            </span>
          }
        />
      </ListItem>
    </>
  );
});
