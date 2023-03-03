import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  Icon,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import DatePicker from "react-calendar";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { useAccountStorage, useSession } from "../../../../../pages/_app";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { Puller } from "../../../../Puller";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";
import { parseEmojis, TaskDrawer } from "./TaskDrawer";

export default function DrawerContent({
  isAgenda,
  setTaskData,
  mutationUrl,
  data,
}) {
  const storage = useAccountStorage();
  const session = useSession();

  const handlePriorityChange = useCallback(async () => {
    setTaskData((prev) => ({ ...prev, pinned: !prev.pinned }));
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await fetchApiWithoutHook("property/boards/togglePin", {
            id: data.id,
            pinned: !data.pinned ? "true" : "false",
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
        loading: data.pinned ? "Changing priority..." : "Marking important...",
        success: data.pinned ? "Task unpinned!" : "Task pinned!",
        error: "Failed to change priority",
      },
      toastStyles
    );
  }, [data.pinned, data.id, mutationUrl, setTaskData]);

  const handleDelete = useCallback(
    function handleDelete(taskId) {
      setTaskData("deleted");
      fetchApiWithoutHook("property/boards/column/task/delete", {
        id: taskId,
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData]
  );

  const handleEdit = useCallback(
    function handleEdit(id, key, value) {
      setTaskData((prev) => ({ ...prev, [key]: value }));
      fetchApiWithoutHook("property/boards/column/task/edit", {
        id,
        [key]: [value],
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl, setTaskData]
  );

  const handleComplete = useCallback(async () => {
    let completed = data.completed;
    setTaskData((prev) => {
      completed = !prev.completed;
      return { ...prev, completed };
    });

    fetchApiWithoutHook("property/boards/column/task/mark", {
      completed: completed ? "true" : "false",
      id: data.id,
    })
      .then(() => mutate(mutationUrl))
      .catch(() =>
        toast.error("An error occured while updating the task", toastStyles)
      );
  }, [data, setTaskData, mutationUrl]);

  const handlePostpone: any = useCallback(
    (count, type) => {
      setTaskData((prev) => ({
        ...prev,
        due: dayjs(data.due).add(count, type).toISOString(),
      }));
      handleEdit(
        data.id,
        "due",
        dayjs(data.due).add(count, type).toISOString()
      );
    },
    [data.id, setTaskData, data.due, handleEdit]
  );

  const [open, setOpen] = useState<boolean>(false);

  const iconStyles = {
    width: "100%",
    flexDirection: "column",
    borderRadius: 5,
    gap: 1,
    py: 2,
    color: session?.user?.darkMode ? "hsl(240,11%,80%)" : "hsl(240,11%,30%)",
    "&:hover": {
      background: session?.user?.darkMode
        ? "hsl(240, 11%, 22%)"
        : "rgba(200, 200, 200, .3)",
    },
    "& .MuiIcon-root": {
      "&:not(.pinned)": {
        fontVariationSettings:
          '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
      },
      width: 40,
      color: session?.user?.darkMode ? "hsl(240,11%,90%)" : "hsl(240,11%,10%)",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99999,
      border: "1px solid",
      borderColor: session?.user?.darkMode
        ? "hsl(240, 11%, 30%)"
        : "rgba(200, 200, 200, .3)",
    },
  };

  const [postponeOpen, setPostponeOpen] = useState<boolean>(false);
  const handleClick = () => setPostponeOpen(true);
  const handleClose = () => setPostponeOpen(false);

  return (
    <>
      {/* Task name input */}
      <TextField
        disabled={storage?.isReached === true}
        multiline
        fullWidth
        defaultValue={parseEmojis(data.name.trim())}
        variant="standard"
        onBlur={(e) => handleEdit(data.id, "name", e.target.value)}
        onChange={(e) => (e.target.value = e.target.value.replaceAll("\n", ""))}
        onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
        margin="dense"
        InputProps={{
          disableUnderline: true,
          className: "font-heading",
          sx: { fontSize: "35px", textDecoration: "underline", mt: 2 },
        }}
      />

      {/* Description */}
      <TextField
        onBlur={(e) => handleEdit(data.id, "description", e.target.value)}
        onKeyDown={(e: any) =>
          e.key === "Enter" && !e.shiftKey && e.target.blur()
        }
        multiline
        placeholder={
          storage?.isReached === true
            ? "You've reached your account storage limits and you can't add a description."
            : "Click to add description"
        }
        disabled={storage?.isReached === true}
        fullWidth
        defaultValue={parseEmojis(data.description)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            "&, & *": {
              cursor: "unset",
            },
            mt: 2,
            borderRadius: 5,
            background: session?.user?.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: session?.user?.darkMode
                ? "hsl(240,11%,22%)"
                : "rgba(200,200,200,.4)",
            },
            p: 2,
            px: 3,
          },
        }}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { p: 3 } }}
      >
        <DatePicker
          value={new Date(data.due)}
          onChange={(e: any) => {
            setTaskData((prev) => ({
              ...prev,
              due: e ? null : e?.toISOString(),
            }));
            handleEdit(data.id, "due", e.toISOString());

            setOpen(false);
          }}
        />
      </Dialog>
      <TextField
        fullWidth
        variant="standard"
        value={data.due && dayjs(data.due).format("dddd, MMM D, YYYY, h:mm A")}
        placeholder="Set a due date"
        onClick={() => setOpen(true)}
        disabled={storage?.isReached === true}
        InputProps={{
          readOnly: true,
          sx: {
            ...(storage?.isReached === true && { pointerEvents: "none" }),
            "&, & *": {
              cursor: "unset",
            },
            borderRadius: 5,
            background: session?.user?.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: session?.user?.darkMode
                ? "hsl(240,11%,22%)"
                : "rgba(200,200,200,.4)",
            },
            p: 3,
            mt: 2,
            py: 1.5,
          },
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <Icon>today</Icon>
            </InputAdornment>
          ),
        }}
      />
      <br />
      <br />
      {data.image && <ImageViewer url={data.image} />}

      <Box
        sx={{
          display: "flex",
          background: session?.user?.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 0.5,
          my: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
          }}
        >
          <Button
            onClick={handleComplete}
            sx={iconStyles}
            disabled={storage?.isReached === true}
          >
            <Icon
              className="shadow-md dark:shadow-xl"
              sx={{
                ...(data.completed && {
                  background: green[900],
                  color: "#fff!important",
                }),
              }}
            >
              {data.completed ? "check" : "close"}
            </Icon>
            {data.completed ? "Completed" : "Incomplete"}
          </Button>
          <Button
            onClick={handlePriorityChange}
            sx={iconStyles}
            disabled={storage?.isReached === true}
          >
            <Icon
              className={`${data.pinned && "pinned"} shadow-md dark:shadow-xl`}
              sx={{
                ...(data.pinned && {
                  transform: "rotate(-20deg)",
                }),
                transition: "all .2s",
              }}
            >
              push_pin
            </Icon>
            {data.pinned ? "Important" : "Unpinned "}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
          }}
        >
          <ConfirmationModal
            title="Delete task?"
            question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
            disabled={data.subTasks.length == 0}
            callback={() => handleDelete(data.id)}
          >
            <Button sx={iconStyles}>
              <Icon className="outlined shadow-md dark:shadow-xl">delete</Icon>
              Delete
            </Button>
          </ConfirmationModal>
          <SwipeableDrawer
            disableSwipeToOpen
            open={postponeOpen}
            onClose={handleClose}
            onOpen={handleClick}
            anchor="bottom"
            PaperProps={{
              sx: {
                p: 1,
                pt: 0,
                "& .MuiMenuItem-root": {
                  cursor: "unset",
                  gap: 2,
                  "&:focus-visible, &:hover": {
                    background: session?.user?.darkMode
                      ? "hsl(240,11%,30%)"
                      : "rgba(200,200,200,.3)",
                    color: session?.user?.darkMode
                      ? colors[session?.themeColor || "grey"][100]
                      : "#000",
                    "& .MuiSvgIcon-root": {
                      color: session?.user?.darkMode
                        ? colors[session?.themeColor || "grey"][200]
                        : colors[session?.themeColor || "grey"][800],
                    },
                  },
                  padding: "8.5px 12px",
                  minHeight: 0,
                  borderRadius: "10px",
                  marginBottom: "1px",
                  "& .MuiSvgIcon-root": {
                    fontSize: 25,
                    color: colors[session?.themeColor || "grey"][700],
                    marginRight: 1.9,
                  },
                  "&:active": {
                    background: session?.user?.darkMode
                      ? "hsl(240,11%,35%)"
                      : "#eee",
                  },
                },
              },
            }}
          >
            <Puller />
            <MenuItem onClick={() => handlePostpone(1, "day")}>
              <Icon className="outlined">east</Icon>
              Tomorrow
            </MenuItem>
            <MenuItem onClick={() => handlePostpone(3, "day")}>
              <Icon className="outlined">view_week</Icon>
              In 3 days
            </MenuItem>
            <MenuItem onClick={() => handlePostpone(1, "week")}>
              <Icon className="outlined">calendar_view_week</Icon>1 week
            </MenuItem>
            <MenuItem onClick={() => handlePostpone(1, "month")}>
              <Icon className="outlined">calendar_view_month</Icon>1 month
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handlePostpone(-1, "day")}>
              <Icon className="outlined">west</Icon>
              Yesterday
            </MenuItem>
          </SwipeableDrawer>
          <Button
            sx={iconStyles}
            onClick={handleClick}
            disabled={storage?.isReached === true}
          >
            <Icon className="outlined shadow-md dark:shadow-xl">schedule</Icon>
            Reschedule
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          background: session?.user?.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 3,
          ...(data.parentTasks.length !== 0 && {
            display: "none",
          }),
        }}
      >
        <Typography variant="h6" sx={{ mb: 1.5, ml: 0.5 }}>
          Subtasks
        </Typography>
        {data.parentTasks.length === 0 &&
          data.subTasks.map((subTask) => (
            <TaskDrawer
              isAgenda={isAgenda}
              key={subTask.id}
              id={subTask.id}
              mutationUrl={mutationUrl}
            >
              <ListItemButton
                sx={{ p: 0, background: "transparent!important" }}
                className="task"
              >
                <ListItemIcon>
                  <Checkbox
                    checked={subTask.completed}
                    disableRipple
                    size="medium"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={subTask.name}
                  secondary={subTask.description}
                />
              </ListItemButton>
            </TaskDrawer>
          ))}
        <CreateTask
          column={{ id: "-1", name: "" }}
          parent={data.id}
          label="Create a subtask"
          placeholder={`Add a subtask to "${data.name}"`}
          checkList={false}
          mutationUrl={mutationUrl}
          boardId={1}
        />
      </Box>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        {data.id.includes("-event-assignment") && (
          <Chip
            label="Synced to Canvas LMS"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
              color: "#000!important",
            }}
          />
        )}
      </Box>
    </>
  );
}
