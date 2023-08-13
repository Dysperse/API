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
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { parseEmojis } from ".";
import { Task } from "..";
import { ConfirmationModal } from "../../../ConfirmationModal";
import { CreateTask } from "../Create";
import SelectDateModal from "../DatePicker";
import { ColorPopover } from "./ColorPopover";
import { useTaskContext } from "./Context";
import { LinkedContent } from "./LinkedContent";
import { RescheduleModal } from "./Snooze";
import { TaskDetailsSection } from "./TaskDetailsSection";

function DrawerMenu({
  task,
  handlePriorityChange,
  shouldDisable,
  handleDelete,
  styles,
}) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: any) => setAnchorEl(event.currentTarget);

  return (
    <>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        <MenuItem onClick={handlePriorityChange} disabled={shouldDisable}>
          <Icon
            {...(!task.pinned && { className: "outlined" })}
            sx={{
              ...(task.pinned && {
                transform: "rotate(-20deg)",
              }),
              transition: "all .2s",
            }}
          >
            push_pin
          </Icon>
          {task.pinned ? "Pinned" : "Pin"}
        </MenuItem>
        <ConfirmationModal
          title="Delete task?"
          question={`This task has ${task.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
          disabled={task.subTasks.length === 0}
          callback={async () => {
            await handleDelete(task.id);
            await task.mutate();
          }}
        >
          <MenuItem>
            <Icon className="outlined">delete</Icon>Delete
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      {isMobile && (
        <IconButton
          onClick={handleMenuClick}
          sx={{
            flexShrink: 0,
            ...styles.button,
          }}
          disabled={shouldDisable}
        >
          <Icon>more_horiz</Icon>
        </IconButton>
      )}
    </>
  );
}

function DrawerContent({ handleDelete, isDateDependent }: any) {
  const dateRef = useRef();
  const session = useSession();
  const task = useTaskContext();
  const storage = useAccountStorage();

  const isDark = useDarkMode(session.darkMode);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const isSubTask = task.parentTasks.length !== 0;

  const greenPalette = useColor("green", isDark);
  const orangePalette = useColor("orange", isDark);
  const palette = useColor(session.themeColor, isDark);

  const handlePriorityChange = useCallback(async () => {
    task.set((prev) => ({ ...prev, pinned: !prev.pinned }));

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          fetchRawApi(session, "property/boards/column/task/edit", {
            id: task.id,
            pinned: task.pinned ? "false" : "true",
          });
          await task.mutate();
          resolve("");
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: task.pinned ? "Changing priority..." : "Marking important...",
        success: task.pinned ? "Task unpinned!" : "Task pinned!",
        error: "Failed to change priority",
      },
      toastStyles
    );
  }, [task, session]);

  const handleComplete = useCallback(async () => {
    let completed = task.completed;
    task.set((prev) => {
      completed = !prev.completed;
      return { ...prev, completed };
    });

    try {
      await fetchRawApi(session, "property/boards/column/task/edit", {
        completed: completed ? "true" : "false",
        id: task.id,
      });
      await task.mutate();
    } catch (e) {
      toast.error("An error occured while updating the task", toastStyles);
    }
  }, [task, session]);

  const handlePostpone: any = useCallback(
    async (count, type) => {
      task.set((prev) => ({
        ...prev,
        due: dayjs(task.due).add(count, type).toISOString(),
      }));
      await task.edit(
        task.id,
        "due",
        dayjs(task.due).add(count, type).toISOString()
      );
      task.close();
    },
    [task]
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
        }}
      >
        <Toolbar>
          <IconButton onClick={task.close} sx={styles.button}>
            <Icon>close</Icon>
          </IconButton>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
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
                ...(task.completed && {
                  background: greenPalette[6] + "!important",
                  color: greenPalette[11] + "!important",
                  "&:hover": {
                    background: { sm: greenPalette[3] },
                  },
                }),
              }}
            >
              <Icon className={task.completed ? "" : "outlined"}>
                check_circle
              </Icon>
              <span className="text">
                {task.completed ? "Completed" : "Complete"}
              </span>
            </Button>
            <RescheduleModal handlePostpone={handlePostpone}>
              <Button
                disableRipple
                disabled={!task.due}
                sx={{
                  px: 1.5,
                  ...styles.button,
                }}
              >
                <Icon className="outlined">bedtime</Icon>
                Snooze
              </Button>
            </RescheduleModal>
            <DrawerMenu
              handlePriorityChange={handlePriorityChange}
              shouldDisable={shouldDisable}
              task={task}
              handleDelete={handleDelete}
              styles={styles}
            />
            {!isMobile && (
              <IconButton
                onClick={handlePriorityChange}
                sx={{
                  flexShrink: 0,
                  ...styles.button,
                  ...(task.pinned && {
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
                  {...(!task.pinned && { className: "outlined" })}
                  sx={{
                    ...(task.pinned && {
                      transform: "rotate(-20deg)",
                    }),

                    transition: "transform .2s",
                  }}
                >
                  push_pin
                </Icon>
              </IconButton>
            )}

            {!isMobile && (
              <ConfirmationModal
                title="Delete task?"
                question={`This task has ${task.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
                disabled={task.subTasks.length === 0}
                callback={async () => {
                  await handleDelete(task.id);
                  await task.mutate();
                }}
              >
                <IconButton
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
      <Box sx={{ p: { xs: 3, sm: 4 }, pb: { sm: 1 } }}>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <ColorPopover />
          {!isSubTask && (
            <SelectDateModal
              styles={() => {}}
              date={task.due}
              setDate={(d) => {
                task.close();
                task.set((prev) => ({
                  ...prev,
                  due: d ? null : d?.toISOString(),
                }));
                task.edit(task.id, "due", d.toISOString());
              }}
            >
              <Chip
                variant="outlined"
                label={
                  task.due && dayjs(task.due).format("MMMM D, YYYY [at] h:mm A")
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
          defaultValue={parseEmojis(task.name.trim())}
          variant="standard"
          onBlur={(e) => {
            if (e.target.value.trim() !== "") {
              task.edit(task.id, "name", e.target.value);
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
              color: colors[task.color][isDark ? "A200" : 800],
            },
          }}
        />

        <TaskDetailsSection
          data={task}
          shouldDisable={shouldDisable}
          styles={styles}
        />

        <Box sx={styles.section}>
          {!isSubTask && (
            <>
              <CreateTask
                isSubTask
                parentId={task.id}
                onSuccess={() => {
                  task.mutate();
                  document.getElementById("taskMutationTrigger")?.click();
                }}
              >
                <Button variant="contained">
                  <Icon>add_circle</Icon>Subtask
                </Button>
              </CreateTask>
              {!isSubTask &&
                task.subTasks.map((subTask) => (
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
                    handleMutate={task.mutate}
                    task={subTask}
                  />
                ))}
            </>
          )}
        </Box>

        <LinkedContent data={task} styles={styles} />
      </Box>
    </>
  );
}
export default DrawerContent;
