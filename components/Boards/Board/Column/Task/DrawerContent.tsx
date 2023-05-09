import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  Icon,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { useAccountStorage } from "../../../../../lib/client/useAccountStorage";
import { fetchRawApi } from "../../../../../lib/client/useApi";
import { useSession } from "../../../../../lib/client/useSession";
import { toastStyles } from "../../../../../lib/client/useTheme";
import { colors } from "../../../../../lib/colors";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { Color } from "./Color";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";
import { RescheduleModal } from "./RescheduleModal";
import { TaskDrawer, parseEmojis } from "./TaskDrawer";

export default function DrawerContent({
  isDateDependent,
  handleParentClose,
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
          await fetchRawApi("property/boards/togglePin", {
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
      fetchRawApi("property/boards/column/task/delete", {
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
      fetchRawApi("property/boards/column/task/edit", {
        id,
        date: dayjs().toISOString(),
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

    fetchRawApi("property/boards/column/task/mark", {
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
        dayjs(data.due).add(count, type).toISOString()
      );
    },
    [
      data.id,
      setTaskData,
      data.due,
      handleEdit,
      isDateDependent,
      handleParentClose,
    ]
  );

  const [open, setOpen] = useState<boolean>(false);

  const iconStyles = {
    width: "100%",
    flexDirection: { sm: "column" },
    justifyContent: { xs: "start", sm: "center" },
    borderRadius: 5,
    gap: { xs: 2, sm: 1 },
    py: { xs: 1, sm: 2 },
    px: { xs: 1.5, sm: 2 },
    color: session.user.darkMode ? "hsl(240,11%,80%)" : "hsl(240,11%,30%)",
    "&:hover": {
      background: session.user.darkMode
        ? "hsl(240, 11%, 22%)"
        : "rgba(200, 200, 200, .3)",
    },
    "& .MuiIcon-root": {
      "&:not(.pinned)": {
        fontVariationSettings:
          '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
      },
      width: 40,
      color: session.user.darkMode ? "hsl(240,11%,90%)" : "hsl(240,11%,10%)",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99999,
      border: "1px solid",
      borderColor: session.user.darkMode
        ? "hsl(240, 11%, 30%)"
        : "rgba(200, 200, 200, .3)",
    },
  };

  return (
    <>
      {/* Task name input */}
      <TextField
        disabled={
          storage?.isReached === true || session.permission === "read-only"
        }
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
            fontSize: "35px",
            textDecoration: "underline",
            mt: -2,
            color: colors[data.color][session.user.darkMode ? "A200" : 800],
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          overflowX: "scroll",
        }}
      >
        {session.permission !== "read-only" &&
          [
            "orange",
            "red",
            "brown",
            "pink",
            "purple",
            "indigo",
            "teal",
            "green",
            "grey",
          ].map((color) => (
            <Color
              key={color}
              color={color}
              mutationUrl={mutationUrl}
              setTaskData={setTaskData}
              task={data}
            />
          ))}
      </Box>

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
        disabled={
          storage?.isReached === true || session.permission === "read-only"
        }
        fullWidth
        defaultValue={parseEmojis(data.description)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            "&, & *": {},
            mt: 3,
            borderRadius: 5,
            background: session.user.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: session.user.darkMode
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
        keepMounted={false}
      >
        {open && (
          <DatePicker
            value={new Date(data.due || new Date().toISOString())}
            onChange={(e: any) => {
              handleParentClose();
              setTaskData((prev) => ({
                ...prev,
                due: e ? null : e?.toISOString(),
              }));
              handleEdit(data.id, "due", e.toISOString());
              setOpen(false);
            }}
          />
        )}
      </Dialog>

      {/* Date */}
      {data.parentTasks.length == 0 && (
        <TextField
          fullWidth
          variant="standard"
          value={
            data.due && dayjs(data.due).format("dddd, MMM D, YYYY, h:mm A")
          }
          placeholder="Set a due date"
          onClick={() => setOpen(true)}
          disabled={
            storage?.isReached === true || session.permission === "read-only"
          }
          InputProps={{
            readOnly: true,
            sx: {
              ...(storage?.isReached === true && { pointerEvents: "none" }),
              "&, & *": {},
              borderRadius: 5,
              background: session.user.darkMode
                ? "hsl(240,11%,20%)"
                : "rgba(200,200,200,.3)",
              "&:focus-within, &:hover": {
                background: session.user.darkMode
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
            ...(data.due && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={session.permission === "read-only"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTaskData((prev) => ({
                        ...prev,
                        due: false,
                      }));
                      handleParentClose();
                      handleEdit(data.id, "due", "");
                    }}
                    size="small"
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }),
          }}
        />
      )}
      {data.image && <Box sx={{ mt: 4 }} />}
      {data.image && <ImageViewer url={data.image} />}
      <Box
        sx={{
          display: { sm: "flex" },
          background: session.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 0.5,
          my: 2,
        }}
      >
        <Box
          sx={{
            display: { sm: "flex" },
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Button
            onClick={handleComplete}
            sx={iconStyles}
            disabled={
              storage?.isReached === true || session.permission === "read-only"
            }
          >
            <Icon
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
          {data.parentTasks.length == 0 && (
            <Button
              onClick={handlePriorityChange}
              sx={iconStyles}
              disabled={
                storage?.isReached === true ||
                session.permission === "read-only"
              }
            >
              <Icon
                className={`${
                  data.pinned && "pinned"
                } shadow-md dark:shadow-xl`}
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
          )}
        </Box>
        <Box
          sx={{
            display: { sm: "flex" },
            flexDirection: "row",
            width: "100%",
          }}
        >
          <ConfirmationModal
            title="Delete task?"
            question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
            disabled={data.subTasks.length === 0}
            callback={() => {
              handleParentClose();
              handleDelete(data.id);
            }}
          >
            <Button
              sx={iconStyles}
              disabled={session.permission === "read-only"}
            >
              <Icon className="outlined shadow-md dark:shadow-xl">delete</Icon>
              Delete
            </Button>
          </ConfirmationModal>
          {data.parentTasks.length == 0 && (
            <RescheduleModal handlePostpone={handlePostpone} data={data}>
              <Button
                sx={iconStyles}
                disabled={
                  storage?.isReached === true ||
                  session.permission === "read-only"
                }
              >
                <Icon className="outlined shadow-md dark:shadow-xl">
                  schedule
                </Icon>
                Reschedule
              </Button>
            </RescheduleModal>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          background: session.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          ...(data.parentTasks.length !== 0 && {
            display: "none",
          }),
          py: 3,
          px: 1,
        }}
      >
        <Typography variant="h6" sx={{ mb: 0.5, ml: -0.5, px: 2 }}>
          Subtasks
        </Typography>
        {data.parentTasks.length === 0 &&
          data.subTasks.map((subTask, index) => (
            <TaskDrawer
              isAgenda={isAgenda}
              key={index}
              id={subTask.id}
              isDateDependent={isDateDependent}
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
          sx={{
            borderBottom: 0,
            borderRadius: 3,
            py: 1.5,
            px: 1.5,
            "&:hover, &:active": {
              background: "transparent!important",
            },
          }}
          column={{ id: "-1", name: "" }}
          parent={data.id}
          label="Create a subtask"
          placeholder={`Add a subtask to "${data.name}"`}
          mutationUrl={mutationUrl}
          boardId={1}
        />
      </Box>
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
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
        <Chip label={`Last updated ${dayjs(data.lastUpdated).fromNow()}`} />
      </Box>
    </>
  );
}
