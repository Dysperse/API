import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { Color } from "./Color";

import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  Icon,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import { mutate } from "swr";
import { ImageViewer } from "./ImageViewer";
import { SubTask } from "./SubTask";
import { TaskDrawer } from "./TaskDrawer";

export const Task = React.memo(function Task({
  boardId,
  columnId,
  mutationUrl,
  task,
  checkList,
}: any): JSX.Element {
  const BpIcon: any = styled("span")(() => ({
    borderRadius: 99,
    width: 25,
    height: 25,
    boxShadow: global.user.darkMode
      ? "inset 0 0 0 2px rgba(255,255,255,.6)"
      : "inset 0 0 0 2px rgba(0,0,0,.6)",
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow:
        "0px 0px 0px 2px inset " +
        colors[task.color ?? "brown"][700] +
        ", 0px 0px 0px 15px inset " +
        hexToRgba(colors[task.color ?? "brown"][900], 0.1),
    },
    "input:not(:checked):hover ~ &": {
      boxShadow: global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,0.5)"
        : "inset 0 0 0 2px rgba(0,0,0,.5)",
      backgroundColor:
        global.theme !== "dark"
          ? colors[task.color ?? "brown"][100]
          : "hsl(240,11%,20%)!important",
    },
    "input:disabled ~ &": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  }));

  const BpCheckedIcon: any = styled(BpIcon)({
    backgroundColor:
      colors[task.color ?? global.themeColor ?? "brown"][
        global.user.darkMode ? 50 : 900
      ] + "!important",
    "&:before": {
      display: "block",
      width: 26,
      height: 26,
      backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23${
        global.user.darkMode ? "000" : "fff"
      }' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor:
        colors[task.color ?? global.themeColor ?? "brown"][
          global.user.darkMode ? 50 : 900
        ],
    },
  });

  const handleDelete = (taskId) => {
    fetchApiWithoutHook("property/boards/deleteTask", {
      id: taskId,
    }).then(() => {
      mutate(mutationUrl);
    });
  };
  const [loading, setLoading] = React.useState(false);

  const [checked, setChecked] = useState(task.completed);
  const [open, setOpen] = useState(false);

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
      <TaskDrawer
        handleDelete={handleDelete}
        checked={checked}
        setChecked={setChecked}
        task={task}
        columnId={columnId}
        boardId={boardId}
        open={open}
        setOpen={setOpen}
        BpIcon={BpIcon}
        BpCheckedIcon={BpCheckedIcon}
        mutationUrl={mutationUrl}
      />
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
          onClick={handleClose}
          sx={{
            pointerEvents: "none",
          }}
        >
          <Box>
            <Typography variant="h6">{task.name}</Typography>
            <Typography variant="body2">
              {task.description.trim() !== ""
                ? task.description
                : "(no description provided)"}
              {task.due && <>&nbsp;&bull;&nbsp;</>}
              {task.due && dayjs(task.due).format("MMMM D, YYYY")}
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ m: -1 }} />
        <MenuItem
          disableRipple
          sx={{
            cursor: "auto",
          }}
        >
          <Box className="embla__container" sx={{ gap: 1 }}>
            {[
              "red",
              "orange",
              "deepOrange",
              "lightBlue",
              "blue",
              "indigo",
              "purple",
              "pink",
              "green",
              "lime",
              "brown",
              "blueGrey",
            ].map((color) => (
              <Color
                small
                task={task}
                mutationUrl={mutationUrl}
                color={color}
                key={color}
              />
            ))}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => setOpen(true)}>
          <Icon className="outlined">edit</Icon>Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLoading(true);
            handleDelete(task.id);
          }}
        >
          <Box sx={{ position: "relative", width: "100%" }}>
            {loading && (
              <CircularProgress
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                size={20}
              />
            )}
            <Box
              sx={{
                ...(loading && { filter: "blur(10px)" }),
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Icon className="outlined">delete</Icon>Delete
            </Box>
          </Box>
        </MenuItem>
      </Menu>
      {task.subTasks.length >= 0 && (
        <ListItem
          onClick={() => setOpen(true)}
          onContextMenu={handleContextMenu}
          className="p-0 rounded-xl gap-0.5 select-none hover:cursor-pointer transition-transform active:scale-[.98] duration-100 active:duration-[0s] border border-gray-200"
          sx={{
            color:
              task.color !== "brown"
                ? colors[task.color][global.theme === "dark" ? "A400" : 900]
                : "",
            p: 0,
            "&:hover": {
              backgroundColor: global.user.darkMode
                ? "hsl(240,11%,16%)"
                : "rgba(200,200,200,0.3)",
              cursor: "pointer",
            },
            ...(!checkList && {
              border: "0!important",
            }),
            ...(checkList && {
              background: global.user.darkMode
                ? "hsl(240,11%,13%)"
                : "#f3f4f6!important",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              gap: "10px!important",
              borderRadius: "15px!important",
              mb: 1.5,
            }),
          }}
        >
          <ListItemText
            sx={{
              my: 0,
            }}
            primary={
              <Box>
                <span
                  style={{
                    fontWeight: "400",
                    ...(checked && {
                      textDecoration: "line-through",
                      opacity: 0.5,
                    }),
                  }}
                >
                  <Checkbox
                    disabled={global.permission == "read-only"}
                    disableRipple
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked);
                      fetchApiWithoutHook("property/boards/markTask", {
                        completed: e.target.checked ? "true" : "false",
                        id: task.id,
                      }).catch((err) =>
                        toast.error("An error occured while updating the task")
                      );
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    sx={{
                      "&:hover": { bgcolor: "transparent" },
                    }}
                    color="default"
                    checkedIcon={<BpCheckedIcon dark />}
                    icon={<BpIcon dark />}
                    inputProps={{ "aria-label": "Checkbox demo" }}
                  />
                  {task.name}
                  <Box
                    sx={{
                      ml: 5,
                    }}
                  >
                    {task.image && <ImageViewer trimHeight url={task.image} />}
                  </Box>
                </span>
              </Box>
            }
            secondary={
              <span
                style={{
                  ...(checked && {
                    textDecoration: "line-through",
                    opacity: 0.5,
                  }),
                  marginLeft: "45px",
                  display: "block",
                  position: "relative",
                  top: task.image ? "3px" : "-7px",
                  ...(task.image && {
                    marginBottom: "7px",
                  }),
                }}
              >
                {task.description}
                {task.due && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "3px",
                      marginLeft: "-6px",
                    }}
                  >
                    <Icon sx={{ mx: 1 }}>schedule</Icon>
                    {dayjs(task.due).format("MMMM D, YYYY")}
                  </span>
                )}
              </span>
            }
          />
        </ListItem>
      )}
      {task.subTasks.map((subtask) => (
        <SubTask
          checkList={checkList}
          key={task.id}
          BpIcon={BpIcon}
          BpCheckedIcon={BpCheckedIcon}
          subtask={subtask}
        />
      ))}
    </>
  );
});
