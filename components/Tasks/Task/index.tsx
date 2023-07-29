import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { vibrate } from "@/lib/client/vibration";
import { colors } from "@/lib/colors";
import {
  Box,
  Checkbox,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Twemoji } from "react-emoji-render";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ConfirmationModal } from "../../ConfirmationModal";
import { SelectionContext } from "../Layout";
import { TaskDrawer } from "./Drawer";
import {
  isAddress,
  isValidHttpUrl,
  videoChatPlatforms,
} from "./Drawer/locationHelpers";

const ImageViewer = dynamic(() =>
  import("./ImageViewer").then((mod) => mod.ImageViewer)
);

export const Task: any = React.memo(function Task({
  sx = {},
  handleMutate = () => {},
  isDateDependent = false,
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
  const isDark = useDarkMode(session.darkMode);

  useEffect(() => setTaskData(task), [task]);

  const BpIcon: any = useMemo(
    () =>
      styled("span")(() => ({
        borderRadius: 10,
        width: 25,
        height: 25,
        boxShadow: `${
          isDark
            ? `inset 0 0 0 1.5px ${colors[taskData.color ?? "blueGrey"]["600"]}`
            : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
        }`,
        backgroundColor: "transparent",
        "input:disabled ~ &": {
          cursor: "not-allowed",
          opacity: 0.5,
        },
      })),
    [taskData.color, isDark]
  );

  const BpCheckedIcon: any = useMemo(
    () =>
      styled(BpIcon)({
        boxShadow: `${
          isDark
            ? "inset 0 0 0 2px rgba(255,255,255,.6)"
            : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
        }`,
        backgroundColor: `${
          colors[taskData.color || "grey"][isDark ? 50 : "A700"]
        }!important`,
        "&:before": {
          display: "block",
          width: 25,
          height: 25,
          backgroundImage: `url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 20' fill='none' stroke='%23${
            isDark ? "000" : "fff"
          }' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          content: '""',
        },
      }),
    [taskData.color, isDark, BpIcon]
  );

  const handleCompletion = useCallback(
    async (e) => {
      vibrate(50);
      setTaskData((prev) => ({ ...prev, completed: !prev.completed }));
      try {
        await fetchRawApi(session, "property/boards/column/task/edit", {
          completed: e.target.checked ? "true" : "false",
          id: taskData.id,
        });
      } catch (e) {
        toast.error("An error occured while updating the task", toastStyles);
      }
    },
    [taskData.id, session]
  );

  const handlePriorityChange = useCallback(async () => {
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          fetchRawApi(session, "property/boards/column/task/edit", {
            id: taskData.id,
            pinned: !taskData.pinned ? "true" : "false",
          }).then(() => {
            handleMutate();
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
  }, [
    taskData.pinned,
    taskData.id,
    mutationUrl,
    setTaskData,
    handleMutate,
    session,
  ]);

  const isDisabled = useMemo(
    () =>
      (board && board.archived) ||
      session?.permission === "read-only" ||
      storage?.isReached === true,
    [board, session, storage]
  );

  const selection = useContext(SelectionContext);
  const isSelected = selection.values.includes(taskData.id);
  const palette = useColor(isSelected ? "blue" : session.themeColor, isDark);

  const handleSelect = () => {
    if (selection.values.includes(taskData.id)) {
      selection.set(selection.values.filter((s) => s !== taskData.id));
    } else {
      selection.set([...new Set([...selection.values, taskData.id])]);
    }
  };

  return !taskData ? (
    <div />
  ) : (
    <>
      <TaskDrawer
        id={taskData.id}
        mutationUrl={mutationUrl}
        isDateDependent={isDateDependent}
        {...(selection.values.length > 0 && { onClick: handleSelect })}
      >
        <ListItemButton
          itemRef={ref}
          disableRipple
          onContextMenu={handleSelect}
          tabIndex={0}
          className="cursor-unset item"
          sx={{
            color: colors["grey"][isDark ? "A100" : "800"],
            fontWeight: 700,
            borderRadius: { xs: 0, sm: 3 },
            "&, & .MuiChip-root": {
              transition: "transform .2s, border-radius .2s",
            },
            py: { xs: 0.5, sm: 0.2 },
            px: { xs: 2.6, sm: 1.7 },
            ...(isSubTask && {
              pl: { xs: "40px", sm: "40px" },
            }),
            gap: 1.5,
            "&:hover": {
              background: {
                sm: palette[2],
              },
            },
            "&:active": {
              background: {
                xs: palette[2] + "!important",
                sm: palette[3] + "!important",
              },
            },
            "&:focus-within": {
              background: { sm: palette[2] },
            },
            ...sx,
            ...(isSelected && {
              background: palette[2] + "!important",
              transform: "scale(.95)",
              borderRadius: 3,
            }),
          }}
        >
          <Checkbox
            sx={{
              mr: -2,
              ml: -2,
              px: 2,
            }}
            disabled={isDisabled}
            disableRipple
            checked={taskData.completed}
            onChange={handleCompletion}
            onClick={(e) => e.stopPropagation()}
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
          />
          <ListItemText
            sx={{ ml: 0.7 }}
            primary={
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 200,
                  whiteSpace: "nowrap",
                  "& span img": {
                    display: "inline-flex !important",
                    width: "23px!important",
                    height: "23px!important",
                    verticalAlign: "top !important",
                  },
                  ...(taskData.completed && {
                    textDecoration: "line-through",
                    opacity: 0.6,
                  }),
                  textDecorationThickness: "2px",
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
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    "& .MuiChip-root": {
                      mt: 0.5,
                    },
                  }}
                >
                  {taskData.pinned && (
                    <ConfirmationModal
                      title="Change priority?"
                      question="Unpin this task?"
                      callback={handlePriorityChange}
                    >
                      <Tooltip
                        placement="top"
                        title={
                          <Box>
                            <Typography variant="body2">
                              <b>Task marked as important</b>
                            </Typography>
                            <Typography variant="body2">
                              Tap to change
                            </Typography>
                          </Box>
                        }
                      >
                        <Chip
                          size="small"
                          sx={{
                            background:
                              (isDark ? "#642302" : colors.orange[100]) +
                              "!important",
                            color:
                              colors.orange[isDark ? "50" : "900"] +
                              "!important",
                          }}
                          label="Urgent"
                          icon={
                            <Icon
                              className="outlined"
                              sx={{
                                fontSize: "20px!important",
                                color: "inherit!important",
                                ml: 1,
                              }}
                            >
                              priority_high
                            </Icon>
                          }
                        />
                      </Tooltip>
                    </ConfirmationModal>
                  )}
                  {taskData.due && !isAgenda ? (
                    <Tooltip
                      title={dayjs(taskData.due).format("MMMM D, YYYY")}
                      placement="top"
                    >
                      <Chip
                        size="small"
                        className="date"
                        sx={{ background: palette[3] }}
                        label={dayjs(taskData.due).fromNow()}
                        icon={
                          <Icon
                            className="outlined"
                            sx={{ fontSize: "20px!important", ml: 1 }}
                          >
                            today
                          </Icon>
                        }
                      />
                    </Tooltip>
                  ) : (
                    taskData.due &&
                    (dayjs(taskData.due).hour() !== 0 ||
                      dayjs(taskData.due).minute() !== 0) &&
                    !isSubTask && (
                      <Chip
                        size="small"
                        className="date"
                        label={dayjs(taskData.due).format("h:mm A")}
                        sx={{ background: palette[3] }}
                        icon={
                          <Icon
                            className="outlined"
                            sx={{ fontSize: "20px!important", ml: 1 }}
                          >
                            access_time
                          </Icon>
                        }
                      />
                    )
                  )}
                  {(isValidHttpUrl(taskData.where) ||
                    isAddress(taskData.where)) && (
                    <Chip
                      label={
                        videoChatPlatforms.find((platform) =>
                          taskData.where.includes(platform)
                        )
                          ? "Call"
                          : isAddress(taskData.where)
                          ? "Maps"
                          : "Open"
                      }
                      sx={{ background: palette[3] }}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAddress(taskData.where)) {
                          window.open(
                            `https://maps.google.com/?q=${encodeURIComponent(
                              taskData.where
                            )}`
                          );
                          return;
                        }
                        window.open(taskData.where);
                      }}
                      icon={
                        <Icon>
                          {videoChatPlatforms.find((platform) =>
                            taskData.where.includes(platform)
                          )
                            ? "call"
                            : isAddress(taskData.where)
                            ? "location_on"
                            : "link"}
                        </Icon>
                      }
                    />
                  )}
                </Box>
              </>
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
