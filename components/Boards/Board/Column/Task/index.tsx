import {
  Box,
  Checkbox,
  Icon,
  ListItemButton,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Twemoji } from "react-emoji-render";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { toastStyles } from "../../../../../lib/useCustomTheme";

const ImageViewer = dynamic(() =>
  import("./ImageViewer").then((mod) => mod.ImageViewer)
);

import { useAccountStorage, useSession } from "../../../../../pages/_app";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { TaskDrawer } from "./TaskDrawer";

const renderText = (
  txt: string,
  rules: {
    regex: RegExp;
    element: any;
  }[]
) => {
  let result: any = [];
  let lastIndex = 0;
  const regexes = rules.map((e) => e.regex);
  const regex = new RegExp(regexes.map((r) => `(${r.source})`).join("|"), "g");

  const matches = txt.match(regex);

  if (!matches) {
    return txt;
  }

  matches.forEach((match, index) => {
    const matchIndex = txt.indexOf(match, lastIndex);

    if (matchIndex > lastIndex) {
      result.push(txt.slice(lastIndex, matchIndex));
    }

    const elementIndex = regexes.findIndex((r) => r.test(match));
    const element = rules[elementIndex].element(match);

    result.push(element);

    lastIndex = matchIndex + match.length;
  });

  if (lastIndex < txt.length) {
    result.push(txt.slice(lastIndex));
  }

  return result;
};

export const Task: any = React.memo(function Task({
  isSubTask = false,
  isAgenda = false,
  checkList = false,
  board,
  columnId,
  mutationUrl,
  task,
}: any): JSX.Element {
  const storage = useAccountStorage();
  const [taskData, setTaskData] = useState(task);

  useEffect(() => setTaskData(task), [task]);
  const session = useSession();

  const BpIcon: any = styled("span")(() => ({
    borderRadius: 10,
    transform: "translateX(-7px)",
    width: 25,
    height: 25,
    boxShadow: `${
      session?.user?.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
    }`,
    backgroundColor: "transparent",
    ".Mui-focusVisible &": {
      boxShadow: `0px 0px 0px 2px inset ${
        colors[taskData.color ?? "grey"][700]
      }, 0px 0px 0px 15px inset ${hexToRgba(
        colors[taskData.color ?? "grey"][900],
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
      session?.user?.darkMode
        ? "inset 0 0 0 2px rgba(255,255,255,.6)"
        : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
    }`,
    backgroundColor: `${
      colors[taskData.color || "grey"][session?.user?.darkMode ? 50 : "A700"]
    }!important`,
    "&:before": {
      display: "block",
      width: 25,
      height: 25,
      backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 20' fill='none' stroke='%23${
        session?.user?.darkMode ? "000" : "fff"
      }' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      content: '""',
    },
  });

  const ref: any = useRef();

  const handleCompletion = useCallback(
    async (e) => {
      navigator.vibrate(50);
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
    [mutationUrl, toastStyles, taskData.id]
  );

  const handlePriorityChange = useCallback(async () => {
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
          ? "Changing priority..."
          : "Marking important...",
        success: taskData.pinned ? "Task unpinned!" : "Task pinned!",
        error: "Failed to change priority",
      },
      toastStyles
    );
  }, [taskData.pinned, taskData.id, mutationUrl, setTaskData]);

  return !taskData ? (
    <></>
  ) : (
    <>
      <TaskDrawer id={taskData.id} mutationUrl={mutationUrl} isAgenda>
        <ListItemButton
          itemRef={ref}
          disableRipple
          tabIndex={0}
          sx={{
            ...(isSubTask && {
              ml: "20px",
              width: "calc(100% - 20px)",
            }),
            color:
              colors[taskData.color][session?.user?.darkMode ? "A100" : "A700"],

            fontWeight: 700,
            borderRadius: { xs: 0, sm: 3 },
            borderBottom: { xs: "1px solid", sm: "none" },
            borderColor: `hsl(240, 11%, ${
              session?.user?.darkMode ? 20 : 95
            }%) !important`,
            transition: "none",
            py: { xs: 0.7, sm: 0.5 },
            px: { xs: 2.5, sm: 1.5 },
            gap: 1.5,

            "&:active": {
              background: `hsl(240, 11%, ${
                session?.user?.darkMode ? 15 : 94
              }%) !important`,
            },
          }}
        >
          <ListItemText
            sx={{ m: 0, p: "0!important" }}
            primary={
              <Box
                sx={{
                  display: "flex",
                  // background: "red",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  disabled={
                    (board && board.archived) ||
                    session?.permission === "read-only" ||
                    storage?.isReached === true
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
                    "& span img": {
                      display: "inline-flex !important",
                      width: "23px!important",
                      height: "23px!important",
                      verticalAlign: "top !important",
                    },
                    ...(taskData.completed && {
                      opacity: 0.7,
                    }),
                  }}
                >
                  <span>
                    <Twemoji>{taskData.name || " "}</Twemoji>
                  </span>
                </Box>
                {taskData.pinned && (
                  <Tooltip title="Important" placement="right">
                    <ConfirmationModal
                      title="Change priority?"
                      question="You are about to unpin this task. You can always change the priority later"
                      callback={handlePriorityChange}
                    >
                      <Box
                        sx={{
                          borderRadius: 2,
                          width: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 20,
                          flexShrink: 0,
                          ml: "auto",
                          background:
                            colors.orange[
                              session?.user?.darkMode ? "A700" : "200"
                            ],
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: "15px!important",
                            color: session?.user?.darkMode
                              ? "hsl(240,11%,10%)"
                              : colors.orange[900],
                            fontVariationSettings: `'FILL' 1, 'wght' 400, 'GRAD' 200, 'opsz' 20!important`,
                          }}
                        >
                          priority_high
                        </Icon>
                      </Box>
                    </ConfirmationModal>
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
                  top: taskData.image ? "-3px" : "-7px",
                  ...(taskData.image && {
                    marginBottom: "7px",
                  }),
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                {taskData.image && (
                  <ImageViewer trimHeight url={taskData.image} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    "& img": {
                      display: "inline-flex !important",
                      width: "20px!important",
                      height: "20px!important",
                      verticalAlign: "top !important",
                    },
                    ...(taskData.completed && {
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }),
                  }}
                >
                  <Twemoji>{taskData.description || " "}</Twemoji>
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
                        sx={{ ml: 0.1, transform: "scale(.8)" }}
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
        </ListItemButton>
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
});
