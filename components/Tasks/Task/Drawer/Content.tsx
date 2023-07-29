import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { colors } from "@/lib/colors";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { parseEmojis } from ".";
import { Task } from "..";
import { ConfirmationModal } from "../../../ConfirmationModal";
import { CreateTask } from "../Create";
import { SelectDateModal } from "../DatePicker";
import { ColorPopover } from "./ColorPopover";
import { LinkedContent } from "./LinkedContent";
import { RescheduleModal } from "./Snooze";
import { TaskDetailsSection } from "./TaskDetailsSection";

const DrawerContent = React.memo(function DrawerContent({
  handleDelete,
  handleMutate,
  isDateDependent,
  handleParentClose,
  setTaskData,
  mutationUrl,
  data,
}: any) {
  const storage = useAccountStorage();
  const session = useSession();
  const dateRef = useRef();

  const isMobile = useMediaQuery("(max-width: 600px)");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isDark = useDarkMode(session.darkMode);

  const isSubTask = data.parentTasks.length !== 0;

  const palette = useColor(session.themeColor, isDark);
  const greenPalette = useColor("green", isDark);
  const orangePalette = useColor("orange", isDark);

  const handlePriorityChange = useCallback(async () => {
    setAnchorEl(null);
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          fetchRawApi(session, "property/boards/column/task/edit", {
            id: data.id,
            pinned: data.pinned ? "false" : "true",
          }).then(() => mutate(mutationUrl));
          await mutate(mutationUrl);
          resolve("");
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: data.pinned ? "Changing priority..." : "Marking important...",
        success: data.pinned ? "Task unpinned!" : "Task pinned!",
        error: "Failed to change priority",
      },
      toastStyles,
    );
  }, [data.pinned, data.id, mutationUrl, setTaskData, session]);

  const handleEdit = useCallback(
    function handleEdit(id, key, value) {
      setTaskData((prev) => ({ ...prev, [key]: value }));
      fetchRawApi(session, "property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
        [key]: [value],
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData, session],
  );

  const handleComplete = useCallback(async () => {
    let completed = data.completed;
    setTaskData((prev) => {
      completed = !prev.completed;
      return { ...prev, completed };
    });

    try {
      await fetchRawApi(session, "property/boards/column/task/edit", {
        completed: completed ? "true" : "false",
        id: data.id,
      });
      mutate(mutationUrl);
      handleMutate();
    } catch (e) {
      toast.error("An error occured while updating the task", toastStyles);
    }
  }, [data, setTaskData, mutationUrl, handleMutate, session]);

  const handlePostpone: any = useCallback(
    (count, type) => {
      if (isDateDependent) {
        handleParentClose();
      }
      setTaskData((prev) => ({
        ...prev,
        due: dayjs(data.due).add(count, type).toISOString(),
      }));
      handleEdit(
        data.id,
        "due",
        dayjs(data.due).add(count, type).toISOString(),
      );
    },
    [
      data.id,
      setTaskData,
      data.due,
      handleEdit,
      isDateDependent,
      handleParentClose,
    ],
  );

  const styles = {
    section: {
      background: palette[2],
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      mb: 3,
      "& .item": {
        color: palette[12],
        borderRadius: 0,
        "&.MuiListItem-root, &.MuiListItemButton-root": {
          px: 3,
        },
      },
      "& .item:not(:last-child)": {
        borderBottom: "1px solid",
        borderColor: palette[3],
      },
    },

    button: {
      transition: "none",
      background: palette[3],
      color: palette[12],
      "&:hover": {
        background: { sm: palette[4] },
        color: { sm: palette[11] },
      },
      "&:active": {
        background: palette[5],
        color: palette[10],
      },
    },
  };

  const shouldDisable =
    storage?.isReached === true || session.permission === "read-only";

  return (
    <>
      <AppBar
        sx={{
          border: 0,
          position: { xs: "fixed", sm: "sticky" },
          top: 0,
          left: 0,
        }}
      >
        <Toolbar>
          <IconButton
            onClick={handleParentClose}
            size="small"
            sx={styles.button}
          >
            <Icon>close</Icon>
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
            <MenuItem onClick={handlePriorityChange} disabled={shouldDisable}>
              <Icon
                {...(!data.pinned && { className: "outlined" })}
                sx={{
                  ...(data.pinned && {
                    transform: "rotate(-20deg)",
                  }),
                  transition: "all .2s",
                }}
              >
                push_pin
              </Icon>
              {data.pinned ? "Pinned" : "Pin"}
            </MenuItem>
            <ConfirmationModal
              title="Delete task?"
              question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
              disabled={data.subTasks.length === 0}
              callback={async () => {
                handleParentClose();
                await handleDelete(data.id);
                handleMutate();
              }}
            >
              <MenuItem>
                <Icon className="outlined">delete</Icon>Delete
              </MenuItem>
            </ConfirmationModal>
          </Menu>
          <Box
            sx={{ ml: "auto", display: "flex", gap: 0.5 }}
            id="subtaskTrigger"
          >
            <Button
              disableRipple
              onClick={handleComplete}
              disabled={shouldDisable}
              sx={{
                "& .text": {
                  display: { xs: "none", sm: "inline" },
                },
                px: 1.5,
                ...styles.button,
                ...(data.completed && {
                  background: greenPalette[2],
                  "&:hover": {
                    background: { sm: greenPalette[3] },
                  },
                  "&:active": {
                    background: greenPalette[4],
                  },
                }),
              }}
            >
              <Icon className={data.completed ? "" : "outlined"}>
                check_circle
              </Icon>
              <span className="text">
                {data.completed ? "Completed" : "Complete"}
              </span>
            </Button>
            <RescheduleModal
              data={data}
              handlePostpone={handlePostpone}
              handleEdit={handleEdit}
              setTaskData={setTaskData}
            >
              <Button
                disableRipple
                disabled={!data.due}
                sx={{
                  px: 1.5,
                  ...styles.button,
                }}
              >
                <Icon className="outlined">bedtime</Icon>
                Snooze
              </Button>
            </RescheduleModal>
            {!isMobile && (
              <IconButton
                onClick={handlePriorityChange}
                size="small"
                sx={{
                  flexShrink: 0,
                  ...styles.button,
                  ...(data.pinned && {
                    background: orangePalette[3],
                    "&:hover": {
                      background: orangePalette[4],
                    },
                    "&:active": {
                      background: orangePalette[5],
                    },
                  }),
                }}
                disabled={shouldDisable}
              >
                <Icon
                  {...(!data.pinned && { className: "outlined" })}
                  sx={{
                    ...(data.pinned && {
                      transform: "rotate(-20deg)",
                    }),

                    transition: "transform .2s",
                  }}
                >
                  push_pin
                </Icon>
              </IconButton>
            )}
            {isMobile && (
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{
                  flexShrink: 0,
                  ...styles.button,
                }}
                disabled={shouldDisable}
              >
                <Icon>more_vert</Icon>
              </IconButton>
            )}
            {!isMobile && (
              <ConfirmationModal
                title="Delete task?"
                question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
                disabled={data.subTasks.length === 0}
                callback={async () => {
                  handleParentClose();
                  await handleDelete(data.id);
                  handleMutate();
                }}
              >
                <IconButton
                  onClick={handleParentClose}
                  size="small"
                  sx={{
                    flexShrink: 0,
                    ...styles.button,
                  }}
                >
                  <Icon className="outlined">delete</Icon>
                </IconButton>
              </ConfirmationModal>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 11, sm: 4 }, pb: { sm: 1 } }}>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <ColorPopover
            mutationUrl={mutationUrl}
            setTaskData={setTaskData}
            data={data}
          />

          {!isSubTask && (
            <SelectDateModal
              ref={dateRef}
              styles={() => {}}
              date={data.due}
              setDate={(d) => {
                handleParentClose();
                setTaskData((prev) => ({
                  ...prev,
                  due: d ? null : d?.toISOString(),
                }));
                handleEdit(data.id, "due", d.toISOString());
              }}
            >
              <Chip
                variant="outlined"
                label={
                  data.due && dayjs(data.due).format("MMMM D, YYYY [at] h:mm A")
                }
                disabled={shouldDisable}
              />
            </SelectDateModal>
          )}
        </Box>
        <TextField
          disabled={shouldDisable}
          multiline
          placeholder="Task name"
          fullWidth
          defaultValue={parseEmojis(data.name.trim())}
          variant="standard"
          onBlur={(e) => {
            if (e.target.value.trim() !== "") {
              handleEdit(data.id, "name", e.target.value);
            }
          }}
          onChange={(e: any) =>
            (e.target.value = e.target.value.replaceAll("\n", ""))
          }
          onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
          margin="dense"
          InputProps={{
            disableUnderline: true,
            className: "font-heading",
            sx: {
              "&:focus-within": {
                "&, & *": { textTransform: "none!important" },
                background: palette[2],
                px: 1,
                borderRadius: 5,
              },
              fontSize: { xs: "50px", sm: "55px" },
              textDecoration: "underline",
              color: colors[data.color][isDark ? "A200" : 800],
            },
          }}
        />

        <TaskDetailsSection
          data={data}
          shouldDisable={shouldDisable}
          handleEdit={handleEdit}
          styles={styles}
        />

        <Box sx={styles.section}>
          {!isSubTask && (
            <>
              <CreateTask
                isSubTask
                column={{ id: "-1", name: "" }}
                sx={{ mb: 0 }}
                parent={data.id}
                label="Create a subtask"
                placeholder="Add a subtask..."
                handleMutate={handleMutate}
                boardId={1}
              />
              {/* <ExperimentalAiSubtask task={data} /> */}
              {!isSubTask &&
                data.subTasks.map((subTask) => (
                  <Task
                    key={subTask.id}
                    isSubTask
                    sx={{
                      pl: { xs: 2.6, sm: 1.7 },
                      "& .date": {
                        display: "none",
                      },
                    }}
                    board={subTask.board || false}
                    columnId={subTask.column ? subTask.column.id : -1}
                    mutationUrl=""
                    handleMutate={handleMutate}
                    task={subTask}
                  />
                ))}
            </>
          )}
        </Box>

        <LinkedContent data={data} styles={styles} />
      </Box>
    </>
  );
});
export default DrawerContent;
