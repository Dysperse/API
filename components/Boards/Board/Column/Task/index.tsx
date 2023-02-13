import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";

import {
  Box,
  Checkbox,
  Chip,
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
import Item from "../../../../ItemPopup";
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
          textDecorationColor: colors[themeColor]["700"],
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
export const renderDescription = (txt: any) => {
  let result: any = [];
  let lastIndex: any = 0;

  const items: any = txt.match(/<items:(.*?):(.*?)>/g);
  const links: any = txt.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  );

  if (!items && !links) return txt;

  if (items) {
    items.forEach((item) => {
      const startIndex = txt.indexOf(item, lastIndex);
      const endIndex = startIndex + item.length;

      if (startIndex > lastIndex) {
        result.push(txt.slice(lastIndex, startIndex) as any);
      }

      const [, id, name] = item.split(":");

      result.push(
        (
          <Item id={id}>
            <Tooltip
              title={"Linked to item " + id}
              followCursor
              onClick={(e) => e.stopPropagation()}
              placement="bottom-start"
            >
              <Chip
                size="small"
                key={id}
                label={name.slice(0, -1)}
                icon={<Icon>link</Icon>}
              />
            </Tooltip>
          </Item>
        ) as any
      );

      lastIndex = endIndex;
    });
  }

  if (links) {
    links.forEach((link) => {
      const startIndex = txt.indexOf(link, lastIndex);
      const endIndex = startIndex + link.length;

      if (startIndex > lastIndex) {
        result.push(txt.slice(lastIndex, startIndex) as any);
      }

      result.push(
        (
          <Chip
            size="small"
            label={new URL(link).hostname}
            onClick={(e) => {
              e.stopPropagation();
              window.open(link);
            }}
            icon={<Icon>open_in_new</Icon>}
          />
        ) as any
      );

      lastIndex = endIndex;
    });
  }

  if (lastIndex < txt.length) {
    result.push(txt.slice(lastIndex) as any);
  }

  return result;
};

export const Task = function Task({
  board,
  isAgenda = false,
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
      backgroundColor: !global.user.darkMode
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
      fetchApiWithoutHook("property/boards/column/task/delete", {
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
            maxWidth: "300px",
          }}
        >
          <Box>
            <Typography variant="h6">{renderText(taskData.name)}</Typography>
            <Typography
              variant="body2"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "hidden",
              }}
            >
              {taskData.description !== ""
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
          <Icon className="outlined">error</Icon>Mark as{" "}
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
        <TaskDrawer id={taskData.id} mutationUrl={mutationUrl}>
          <ListItem
            tabIndex={0}
            onClick={() => setOpen(true)}
            onContextMenu={handleContextMenu}
            className="task"
            sx={{
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
                  backgroundColor: "hsl(240,11%,16%)!important",
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
                      mutate(mutationUrl);
                      fetchApiWithoutHook("property/boards/column/task/mark", {
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
                    checkedIcon={<BpCheckedIcon />}
                    icon={<BpIcon />}
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
                            colors.orange[
                              global.user.darkMode ? "200" : "A400"
                            ],
                        }}
                        className="outlined"
                      >
                        error
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
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  {renderDescription(taskData.description)}
                  {taskData.due && !isAgenda && (
                    <Tooltip
                      title={dayjs(taskData.due).format("MMMM D, YYYY")}
                      followCursor
                      placement="bottom-start"
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
        </TaskDrawer>
      )}
      {taskData.subTasks.map((subtask) => (
        <SubTask
          board={board}
          checkList={checkList}
          mutationUrl={mutationUrl}
          setOpen={setOpen}
          key={subtask.id}
          BpIcon={BpIcon}
          BpCheckedIcon={BpCheckedIcon}
          subtask={subtask}
        />
      ))}
    </>
  );
};
