import {
  Box,
  Checkbox,
  Chip,
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import hexToRgba from "hex-to-rgba";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Twemoji } from "react-emoji-render";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useAccountStorage } from "../../../../../lib/client/useAccountStorage";
import { fetchRawApi } from "../../../../../lib/client/useApi";
import { useSession } from "../../../../../lib/client/useSession";
import { toastStyles } from "../../../../../lib/client/useTheme";
import { colors } from "../../../../../lib/colors";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { TaskDrawer } from "./TaskDrawer";

const ImageViewer = dynamic(() =>
  import("./ImageViewer").then((mod) => mod.ImageViewer)
);

export const Task: any = React.memo(function Task({
  isSubTask = false,
  isAgenda = false,
  checkList = false,
  board,
  columnId,
  mutationUrl,
  task,
}: any): JSX.Element {
  const [taskData, setTaskData] = useState(task);

  const ref: any = useRef();
  const session = useSession();
  const storage = useAccountStorage();

  useEffect(() => setTaskData(task), [task]);

  const BpIcon: any = useMemo(
    () =>
      styled("span")(() => ({
        borderRadius: 10,
        transform: "translateX(-7px)",
        width: 25,
        height: 25,
        boxShadow: `${
          session.user.darkMode
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
      })),
    [taskData.color, session.user.darkMode]
  );

  const BpCheckedIcon: any = useMemo(
    () =>
      styled(BpIcon)({
        boxShadow: `${
          session.user.darkMode
            ? "inset 0 0 0 2px rgba(255,255,255,.6)"
            : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
        }`,
        backgroundColor: `${
          colors[taskData.color || "grey"][session.user.darkMode ? 50 : "A700"]
        }!important`,
        "&:before": {
          display: "block",
          width: 25,
          height: 25,
          backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 20' fill='none' stroke='%23${
            session.user.darkMode ? "000" : "fff"
          }' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          content: '""',
        },
      }),
    [taskData.color, session.user.darkMode, BpIcon]
  );

  const handleCompletion = useCallback(
    async (e) => {
      navigator.vibrate(50);
      setTaskData((prev) => ({ ...prev, completed: !prev.completed }));
      try {
        await fetchRawApi("property/boards/column/task/mark", {
          completed: e.target.checked ? "true" : "false",
          id: taskData.id,
        });
        // await mutate(mutationUrl);
      } catch (e) {
        toast.error("An error occured while updating the task", toastStyles);
      }
    },
    [taskData.id]
  );

  const handlePriorityChange = useCallback(async () => {
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await fetchRawApi("property/boards/togglePin", {
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
              colors[taskData.color][session.user.darkMode ? "A100" : "A700"],
            fontWeight: 700,
            borderRadius: { xs: 0, sm: 3 },
            borderBottom: { xs: "1px solid", sm: "none" },
            borderColor: `hsl(240, 11%, ${
              session.user.darkMode ? 15 : 95
            }%) !important`,
            transition: "none",
            py: { xs: 1, sm: 0.7 },
            px: { xs: 3.6, sm: 2.5 },
            gap: 1.5,
            "&:active": {
              background: `hsl(240, 11%, ${
                session.user.darkMode ? 15 : 94
              }%) !important`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "unset", p: 0 }}>
            <Checkbox
              sx={{
                p: 0,
              }}
              disabled={
                (board && board.archived) ||
                session?.permission === "read-only" ||
                storage?.isReached === true
              }
              disableRipple
              checked={taskData.completed}
              onChange={handleCompletion}
              onClick={(e) => e.stopPropagation()}
              color="default"
              checkedIcon={<BpCheckedIcon />}
              icon={<BpIcon />}
            />
          </ListItemIcon>
          <ListItemText
            sx={{ ml: "-2px" }}
            primary={
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
                  ...(taskData.completed && { opacity: 0.7 }),
                }}
              >
                <span>
                  <Twemoji>{taskData.name || " "}</Twemoji>
                </span>
              </Box>
            }
            secondary={
              <>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                {taskData.image && (
                  <ImageViewer trimHeight url={taskData.image} />
                )}
                {taskData.due && !isAgenda && (
                  <Tooltip
                    title={dayjs(taskData.due).format("MMMM D, YYYY")}
                    followCursor
                    placement="bottom-start"
                  >
                    <Chip
                      size="small"
                      sx={{ mt: 0.7 }}
                      label={dayjs(taskData.due).fromNow()}
                      icon={
                        <>
                          <Icon
                            className="outlined"
                            sx={{ fontSize: "20px!important", ml: 1 }}
                          >
                            schedule
                          </Icon>
                        </>
                      }
                    />
                  </Tooltip>
                )}
              </>
            }
          />
          {taskData.pinned && (
            <ConfirmationModal
              title="Change priority?"
              question="You are about to unpin this task. You can always change the priority later"
              callback={handlePriorityChange}
            >
              <ListItemIcon sx={{ ml: "auto", minWidth: "auto" }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    width: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 20,
                    flexShrink: 0,
                    background:
                      colors.orange[session.user.darkMode ? "A700" : "200"],
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: "15px!important",
                      color: session.user.darkMode
                        ? "hsl(240,11%,10%)"
                        : colors.orange[900],
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 200, 'opsz' 20!important",
                    }}
                  >
                    priority_high
                  </Icon>
                </Box>
              </ListItemIcon>
            </ConfirmationModal>
          )}
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
