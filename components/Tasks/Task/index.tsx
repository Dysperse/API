import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import { colors } from "@/lib/colors";
import {
  Avatar,
  Box,
  Chip,
  Icon,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { SelectionContext } from "../Layout";
import { TaskDrawer } from "./Drawer";
import {
  isAddress,
  isValidHttpUrl,
  videoChatPlatforms,
} from "./Drawer/locationHelpers";
import { ImageViewer } from "./ImageViewer";

export const taskAlgorithm = (e, d) =>
  e.completed && !d.completed
    ? 1
    : (!e.completed && d.completed) || (e.pinned && !d.pinned)
    ? -1
    : !e.pinned && d.pinned
    ? 1
    : 0;

const TaskChips = React.memo(function TaskChips({
  taskData,
  isDark,
  palette,
  isAgenda,
  isSubTask,
  handlePriorityChange,
}: any) {
  const router = useRouter();
  const { session } = useSession();
  const isPinned = taskData.pinned;
  const isDue = taskData.due && !isAgenda;
  const isTimeDue =
    taskData.due &&
    (dayjs(taskData.due).hour() !== 0 || dayjs(taskData.due).minute() !== 0) &&
    !isSubTask;

  const isWhereValid =
    taskData.where &&
    (isValidHttpUrl(taskData.where) || isAddress(taskData.where));

  const isVideoChatPlatform = videoChatPlatforms.some((platform) =>
    taskData?.where?.includes(platform)
  );

  const orangePalette = useColor("orange", isDark);

  const urgentChip = useMemo(
    () => (
      <Chip
        size="small"
        sx={{
          color: `${orangePalette[11]}!important`,
          background: `${orangePalette[5]}!important`,
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
    ),
    []
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        "&:not(:empty)": { mt: 0.5 },
        flexWrap: "wrap",
      }}
    >
      {isPinned && urgentChip}

      {isDue && !isSubTask && (
        <Tooltip
          title={dayjs(taskData.due).format("MMMM D, YYYY")}
          placement="top"
        >
          <Chip
            size="small"
            className="date"
            sx={{ background: palette[3] }}
            label={
              taskData.due === dayjs().startOf("day")
                ? "Today"
                : dayjs(taskData.due).hour() == 0
                ? dayjs(taskData.due).format("MMMM D")
                : dayjs(taskData.due).fromNow()
            }
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
      )}

      {isTimeDue && (
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
      )}

      {taskData.column && (
        <Tooltip title={taskData.column?.name}>
          <Chip
            size="small"
            className="date"
            label={taskData.column?.board?.name}
            sx={{ background: palette[3] }}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/tasks/boards/" + taskData.column?.board?.id);
            }}
            avatar={
              <Avatar
                sx={{ borderRadius: 0 }}
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${taskData.column?.emoji}.png`}
              />
            }
          />
        </Tooltip>
      )}

      {taskData.createdBy &&
        taskData.createdBy?.email !== session.user.email && (
          <Tooltip
            title={`Created by ${capitalizeFirstLetter(
              taskData.createdBy.name
            )}`}
          >
            <Chip
              size="small"
              className="date"
              label={taskData.createdBy?.name}
              sx={{ background: palette[3] }}
              onClick={(e) => {
                e.stopPropagation();
                router.push("/users/" + taskData.createdBy?.email);
              }}
              avatar={<Avatar src={taskData.createdBy?.Profile?.picture} />}
            />
          </Tooltip>
        )}

      {isWhereValid && (
        <Chip
          label={
            isVideoChatPlatform
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
            } else {
              window.open(taskData.where);
            }
          }}
          icon={
            taskData.id.includes("-event-assignment") ? (
              <Image
                src="/images/integrations/canvas.webp"
                width={15}
                height={15}
                alt=""
              />
            ) : (
              <Icon>
                {isVideoChatPlatform
                  ? "call"
                  : isAddress(taskData.where)
                  ? "location_on"
                  : "link"}
              </Icon>
            )
          }
        />
      )}
    </Box>
  );
});

export const Task: any = React.memo(function Task({
  sx = {},
  permissions = "edit",
  isSubTask = false,
  isAgenda = false,
  checkList = false,
  board,
  columnId,
  mutateList,
  task,
}: any): JSX.Element {
  const [taskData, setTaskData] = useState(task);

  const ref: any = useRef();
  const { session } = useSession();
  const storage = useAccountStorage();
  const isDark = useDarkMode(session.darkMode);

  useEffect(() => setTaskData(task), [task]);

  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);

  const BpIcon: any = useMemo(
    () =>
      styled("span")(() => ({
        borderRadius: 90,
        width: 25,
        height: 25,
        boxShadow: `${
          isDark
            ? `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["500"]}`
            : `inset 0 0 0 1.5px ${colors[taskData.color ?? "grey"]["A700"]}`
        }`,
        backgroundColor: "transparent",
        "input:disabled ~ &": {
          cursor: "not-allowed",
          opacity: 0.5,
        },
        "input:active ~ &": {
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
          id: taskData.id,
          completed: e ? "true" : "false",
          date: new Date().toISOString(),
          createdBy: session.user.email,
        });
      } catch (e) {
        toast.error("An error occured while updating the task");
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
          }).then(mutateList);
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
      }
    );
  }, [taskData.pinned, taskData.id, mutateList, setTaskData, session]);

  const isDisabled = useMemo(
    () =>
      (board && board.archived) ||
      session?.permission === "read-only" ||
      storage?.isReached === true ||
      permissions === "read",
    [board, session, storage, permissions]
  );

  const selection = useContext(SelectionContext);
  const isSelected = selection.values.includes(taskData.id);
  const palette = useColor(isSelected ? "blue" : session.themeColor, isDark);

  const handleSelect = (e) => {
    if (e) e.preventDefault();
    if (selection.values.includes(taskData.id)) {
      selection.set(selection.values.filter((s) => s !== taskData.id));
    } else {
      selection.set([...new Set([...selection.values, taskData.id])]);
    }
  };

  const subTasks = useMemo(
    () =>
      taskData && taskData.subTasks
        ? taskData.subTasks
            .sort(taskAlgorithm)
            .map((subtask) => (
              <Task
                key={subtask.id}
                isSubTask
                board={board}
                isAgenda={isAgenda}
                columnId={columnId}
                mutateList={mutateList}
                task={subtask}
                checkList={checkList}
              />
            ))
        : [],
    [board, columnId, isAgenda, mutateList, checkList, taskData]
  );

  return !taskData ? (
    <div />
  ) : (
    <Box
      sx={{
        opacity: "0!important",
        transition: "opacity .4s",
        ...(opacity && {
          opacity: "1!important",
        }),
      }}
    >
      <TaskDrawer
        id={taskData.id}
        mutateList={mutateList}
        isDisabled={isDisabled}
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
                xs: "transparent",
                sm: palette[2],
              },
            },
            "&:active": {
              background: {
                xs: palette[2] + "!important",
                sm: addHslAlpha(palette[3], 0.5) + "!important",
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
          <Icon
            onClick={(e) => {
              e.stopPropagation();
              handleCompletion(!taskData.completed);
            }}
            sx={{
              my: 0.7,
              fontSize: "33px!important",
              transition: "all .1s, opacity 0s !important",
              color: colors[taskData.color ?? "grey"][isDark ? "400" : "A700"],
              "&:active": {
                opacity: 0.6,
              },
            }}
            className={taskData.completed ? "" : "outlined"}
          >
            {taskData.completed ? "check_circle" : "circle"}
          </Icon>
          <ListItemText
            sx={{ ml: 0.7 }}
            primary={
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 200,
                  whiteSpace: "nowrap",
                  ...(taskData.completed && {
                    textDecoration: "line-through",
                    opacity: 0.6,
                  }),
                  textDecorationThickness: "2px",
                }}
              >
                {taskData.name}
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
                    ...(taskData.completed && {
                      textDecoration: "line-through",
                      opacity: 0.7,
                    }),
                  }}
                >
                  {taskData.description}
                </Typography>
                {taskData.image && taskData.image !== "null" && (
                  <ImageViewer url={taskData.image} />
                )}
                <TaskChips
                  taskData={taskData}
                  isDark={isDark}
                  palette={palette}
                  isAgenda={isAgenda}
                  isSubTask={isSubTask}
                  handlePriorityChange={handlePriorityChange}
                />
              </>
            }
          />
        </ListItemButton>
      </TaskDrawer>

      {subTasks}
    </Box>
  );
});
