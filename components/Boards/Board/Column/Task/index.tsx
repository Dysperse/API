import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";

import {
  Box,
  Checkbox,
  CircularProgress,
  Icon,
  Link,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { mutate } from "swr";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { ImageViewer } from "./ImageViewer";
import { SubTask } from "./SubTask";
import { TaskDrawer } from "./TaskDrawer";

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

export const Task = React.memo(function Task({
  board,
  columnId,
  mutationUrl,
  task,
  checkList,
}: any): JSX.Element {
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const BpIcon: any = styled("span")(() => ({
    borderRadius: 10,
    width: 23,
    height: 23,
    boxShadow:
      (global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "brown"]["A400"]}`) +
      ", 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow:
        "0px 0px 0px 2px inset " +
        colors[taskData.color ?? "brown"][700] +
        ", 0px 0px 0px 15px inset " +
        hexToRgba(colors[taskData.color ?? "brown"][900], 0.1),
    },
    "input:not(:checked):hover ~ &": {
      backgroundColor:
        global.theme !== "dark"
          ? colors[taskData.color ?? "brown"]["100"]
          : "hsl(240,11%,20%)!important",
    },
    "input:disabled ~ &": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  }));

  const BpCheckedIcon: any = styled(BpIcon)({
    boxShadow:
      (global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "brown"]["A400"]}`) +
      ", 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
    backgroundColor: `${
      colors[taskData.color || "brown"][global.user.darkMode ? 50 : "A400"]
    }!important`,
    "&:before": {
      display: "block",
      width: 23,
      height: 24,
      backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23${
        global.user.darkMode ? "000" : "fff"
      }' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor:
        colors[taskData.color ?? global.themeColor ?? "brown"][
          global.user.darkMode ? 50 : 900
        ],
    },
  });

  const handleDelete = React.useCallback(
    function handleDelete(taskId) {
      setTaskData(null);
      fetchApiWithoutHook("property/boards/deleteTask", {
        id: taskId,
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl]
  );

  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = useState(taskData.completed);
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
            mouseY: event.clientY - 10,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handlePriorityClick = React.useCallback(async () => {
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await fetchApiWithoutHook("property/boards/togglePin", {
            id: taskData.id,
            pinned: !taskData.pinned ? "true" : "false",
          }).then(() => {
            mutate(mutationUrl);
          });
          await mutate(mutationUrl);
          resolve("");
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: taskData.pinned
          ? "Removing important label"
          : "Marking important...",
        success: taskData.pinned
          ? "The priority has been set back to normal"
          : "Marked as important!",
        error: "Failed to change priority",
      },
      toastStyles
    );
  }, [taskData.pinned, taskData.id, mutationUrl]);

  return !taskData ? (
    <></>
  ) : (
    <>
      <TaskDrawer
        handlePriorityClick={handlePriorityClick}
        handleDelete={handleDelete}
        taskData={taskData}
        setTaskData={setTaskData}
        columnId={columnId}
        board={board}
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
            <Typography variant="h6">{renderText(taskData.name)}</Typography>
            <Typography variant="body2">
              {taskData.description.trim() !== ""
                ? taskData.description
                : "(no description provided)"}
              {taskData.due && <>&nbsp;&bull;&nbsp;</>}
              {taskData.due && dayjs(taskData.due).format("MMMM D, YYYY")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => setOpen(true)}>
          <Icon className="outlined">edit</Icon>Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlePriorityClick();
          }}
        >
          <Icon className="outlined">priority</Icon>Mark as{" "}
          {taskData.pinned ? "unimportant" : "important"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLoading(true);
            handleDelete(taskData.id);
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
      {taskData.subTasks.length >= 0 && (
        <ListItem
          tabIndex={0}
          onClick={() => setOpen(true)}
          onContextMenu={handleContextMenu}
          className="p-1 sm:p-0 shadow-sm border border-gray-100 dark:border-[hsl(240,11%,18%)] hover:border-gray-300 active:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-100 sm:hover:bg-gray-100 active:bg-gray-200 sm:active:bg-gray-200 cursor-auto select-none"
          sx={{
            "&:focus-visible": {
              boxShadow: global.user.darkMode
                ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
                : "0px 0px 0px 1.5px var(--themeDark) !important",
            },
            color:
              colors[taskData.color][global.user.darkMode ? "A100" : "A700"],
            p: {
              xs: 1,
              sm: 0,
            },
            cursor: "unset!important",
            ...(global.user.darkMode && {
              "&:hover": {
                backgroundColor: "hsl(240,11%,19%)!important",
              },
              "&:active": {
                backgroundColor: "hsl(240,11%,16%)!importantgl",
              },
            }),
            ...(!checkList && {
              boxShadow: {
                sm: "none!important",
              },
              border: {
                sm: "none!important",
              },
            }),
            gap: "10px!important",
            mt: {
              xs: 1.5,
              sm: checkList ? 1.5 : taskData.pinned ? 0.5 : 0,
            },
          }}
        >
          <ListItemText
            sx={{
              my: 0,
            }}
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  disabled={
                    (board && board.archived) ||
                    global.permission === "read-only"
                  }
                  disableRipple
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.target.checked);
                    fetchApiWithoutHook("property/boards/markTask", {
                      completed: e.target.checked ? "true" : "false",
                      id: taskData.id,
                    }).catch(() =>
                      toast.error(
                        "An error occured while updating the task",
                        toastStyles
                      )
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
                />

                <Box
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    ...(checked && {
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }),
                  }}
                >
                  {renderText(taskData.name)}
                  {taskData.image && (
                    <ImageViewer trimHeight url={taskData.image} />
                  )}
                </Box>
                {taskData.pinned && (
                  <Tooltip title="Marked as important" placement="top">
                    <Icon
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        ml: "auto",
                        mr: 1,
                        color:
                          colors.red[global.user.darkMode ? "200" : "A400"],
                      }}
                      className="outlined"
                    >
                      priority
                    </Icon>
                  </Tooltip>
                )}
              </Box>
            }
            secondary={
              <span
                style={{
                  marginLeft: "45px",
                  display: "block",
                  position: "relative",
                  top: taskData.image ? "3px" : "-7px",
                  ...(taskData.image && {
                    marginBottom: "7px",
                  }),
                }}
              >
                {taskData.description}
                {taskData.due && (
                  <Tooltip
                    title={dayjs(taskData.due).format("MMMM D, YYYY")}
                    followCursor
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        marginTop: "3px",
                        marginLeft: "-5px",
                      }}
                    >
                      <Icon
                        sx={{ mx: 1, transform: "scale(.9)" }}
                        className="outlined"
                      >
                        schedule
                      </Icon>
                      {dayjs(taskData.due).fromNow()}
                    </span>
                  </Tooltip>
                )}
              </span>
            }
          />
        </ListItem>
      )}
      {taskData.subTasks.map((subtask) => (
        <SubTask
          board={board}
          checkList={checkList}
          mutationUrl={mutationUrl}
          setOpen={setOpen}
          key={taskData.id}
          BpIcon={BpIcon}
          BpCheckedIcon={BpCheckedIcon}
          subtask={subtask}
        />
      ))}
    </>
  );
});
