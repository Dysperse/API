import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";

import {
  Box,
  Checkbox,
  Chip,
  Icon,
  Link,
  ListItem,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Twemoji } from "react-emoji-render";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import Item from "../../../../ItemPopup";
import { ImageViewer } from "./ImageViewer";
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
  isSubTask = false,
  isAgenda = false,
  checkList = false,
  board,
  columnId,
  mutationUrl,
  task,
}: any): JSX.Element {
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const BpIcon: any = styled("span")(() => ({
    borderRadius: 10,
    width: 23,
    height: 23,
    boxShadow: `${
      global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "brown"]["A700"]}`
    }, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)`,
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow: `0px 0px 0px 2px inset ${
        colors[taskData.color ?? "brown"][700]
      }, 0px 0px 0px 15px inset ${hexToRgba(
        colors[taskData.color ?? "brown"][900],
        0.1
      )}`,
    },
    "input:disabled ~ &": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  }));

  const BpCheckedIcon: any = styled(BpIcon)({
    boxShadow: `${
      global.user.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "brown"][500]}`
    }, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.04)`,
    backgroundColor: `${
      colors[taskData.color || "brown"][global.user.darkMode ? 50 : 500]
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
  });

  const ref: any = useRef();

  const handleCompletion = useCallback(
    async (e) => {
      setTaskData((prev) => ({ ...prev, completed: !prev.completed }));
      try {
        await fetchApiWithoutHook("property/boards/column/task/mark", {
          completed: e.target.checked ? "true" : "false",
          id: taskData.id,
        });
        // await mutate(mutationUrl);
      } catch (e) {
        toast.error("An error occured while updating the task", toastStyles);
      }
    },
    [mutationUrl, toastStyles]
  );

  return !taskData ? (
    <></>
  ) : (
    <>
      <TaskDrawer id={taskData.id} mutationUrl={mutationUrl} isAgenda>
        <ListItem
          itemRef={ref}
          tabIndex={0}
          className="task mb-1.5"
          sx={{
            ...(isSubTask && {
              ml: "20px",
              width: "calc(100% - 20px)",
            }),
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
                  checked={taskData.completed}
                  onChange={handleCompletion}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    "&:hover": { bgcolor: "transparent" },
                    cursor: "unset",
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
                    "& img": {
                      display: "inline-flex !important",
                      width: "23px!important",
                      height: "23px!important",
                      verticalAlign: "top !important",
                    },
                    ...(taskData.completed && {
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }),
                  }}
                >
                  <Twemoji>{renderText(taskData.name)}</Twemoji>
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
                          colors.orange[global.user.darkMode ? "200" : "A700"],
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
              <Typography
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
                <Typography
                  sx={{
                    "& img": {
                      display: "inline-flex !important",
                      width: "20px!important",
                      height: "20px!important",
                      verticalAlign: "top !important",
                    },
                  }}
                >
                  <Twemoji>
                    {renderDescription(taskData.description || " ")}
                  </Twemoji>
                </Typography>
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
              </Typography>
            }
          />
        </ListItem>
      </TaskDrawer>
      {taskData &&
        taskData.subTasks &&
        taskData.subTasks.map((subtask) => (
          <Task
            key={subtask.id}
            isSubTask
            board={board}
            isAgenda={isAgenda}
            columnId={columnId}
            mutationUrl={mutationUrl}
            task={subtask}
            checkList={checkList}
          />
        ))}
    </>
  );
};
