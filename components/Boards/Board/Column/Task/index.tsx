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
  Link,
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
  boardId,
  columnId,
  mutationUrl,
  task,
  checkList,
}: any): JSX.Element {
  const BpIcon: any = styled("span")(() => ({
    borderRadius: 10,
    width: 23,
    height: 23,
    boxShadow:
      (global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[task.color ?? "brown"]["A400"]}`) +
      ", 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow:
        "0px 0px 0px 2px inset " +
        colors[task.color ?? "brown"][700] +
        ", 0px 0px 0px 15px inset " +
        hexToRgba(colors[task.color ?? "brown"][900], 0.1),
    },
    "input:not(:checked):hover ~ &": {
      backgroundColor:
        global.theme !== "dark"
          ? colors[task.color ?? "brown"]["100"]
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
        : `inset 0 0 0 1.5px ${colors[task.color ?? "brown"]["A400"]}`) +
      ", 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
    backgroundColor: `${
      colors[task.color || "brown"][global.user.darkMode ? 50 : "A400"]
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
        : null
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
            <Typography variant="h6">{renderText(task.name)}</Typography>
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
          className="p-1 sm:p-0 shadow-sm border border-gray-100 dark:border-[hsl(240,11%,18%)] hover:border-gray-300 active:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-100 sm:hover:bg-gray-200 active:bg-gray-200 sm:active:bg-gray-200 cursor-auto select-none"
          sx={{
            color: colors[task.color][global.user.darkMode ? "A100" : "A700"],
            p: 1,
            cursor: "unset!important",
            ...(global.user.darkMode && {
              "&:hover": {
                backgroundColor: "hsl(240,11%,19%)!important",
              },
              "&:active": {
                backgroundColor: "hsl(240,11%,16%)",
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
            mb: {
              xs: 1.5,
              sm: checkList ? 1.5 : 0,
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
                  disabled={global.permission === "read-only"}
                  disableRipple
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.target.checked);
                    fetchApiWithoutHook("property/boards/markTask", {
                      completed: e.target.checked ? "true" : "false",
                      id: task.id,
                    }).catch(() =>
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
                  {renderText(task.name)}
                  {task.image && <ImageViewer trimHeight url={task.image} />}
                </Box>
              </Box>
            }
            secondary={
              <span
                style={{
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
          mutationUrl={mutationUrl}
          setOpen={setOpen}
          key={task.id}
          BpIcon={BpIcon}
          BpCheckedIcon={BpCheckedIcon}
          subtask={subtask}
        />
      ))}
    </>
  );
});
