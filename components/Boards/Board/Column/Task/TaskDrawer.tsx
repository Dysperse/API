import {
  Alert,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  Icon,
  InputAdornment,
  SwipeableDrawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { cloneElement, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { ErrorHandler } from "../../../../Error";
import { Puller } from "../../../../Puller";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";

function DrawerContent({ setTaskData, mutationUrl, data }) {
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
        success: data.pinned
          ? "The priority has been set back to normal"
          : "Marked as important!",
        error: "Failed to change priority",
      },
      toastStyles
    );
  }, [data.pinned, data.id, mutationUrl]);

  const handleDelete = useCallback(
    function handleDelete(taskId) {
      setTaskData("deleted");
      fetchApiWithoutHook("property/boards/column/task/delete", {
        id: taskId,
      }).then(() => {
        mutate(mutationUrl);
      });
    },
    [mutationUrl]
  );

  const handleCompletion = useCallback(
    async (e) => {
      setTaskData((prev) => ({ ...prev, completed: !prev.completed }));
      fetchApiWithoutHook("property/boards/column/task/mark", {
        completed: e.target.checked ? "true" : "false",
        id: data.id,
      }).catch(() =>
        toast.error("An error occured while updating the task", toastStyles)
      );
    },
    [data.id]
  );

  const iconStyles = {
    flexDirection: "column",
    borderRadius: 5,
    gap: 1,
    py: 2,
    color: global.user.darkMode ? "hsl(240,11%,80%)" : "hsl(240,11%,30%)",
    "&:hover": {
      background: global.user.darkMode
        ? "hsl(240, 11%, 22%)"
        : "rgba(200, 200, 200, .3)",
    },
    "& .MuiIcon-root": {
      fontVariationSettings:
        '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
      width: 40,
      color: global.user.darkMode ? "hsl(240,11%,90%)" : "hsl(240,11%,10%)",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 99999,
      border: "1px solid",
      borderColor: global.user.darkMode
        ? "hsl(240, 11%, 30%)"
        : "rgba(200, 200, 200, .3)",
    },
  };

  return (
    <>
      {/* Task name input */}
      <TextField
        multiline
        fullWidth
        defaultValue={data.name.trim()}
        variant="standard"
        margin="dense"
        InputProps={{
          disableUnderline: true,
          className: "font-heading",
          sx: { fontSize: "35px", textDecoration: "underline", mt: 2 },
        }}
      />

      {/* Description */}
      <TextField
        multiline
        placeholder="Click to add description"
        fullWidth
        defaultValue={data.description}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            mt: 2,
            borderRadius: 5,
            background: global.user.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: global.user.darkMode
                ? "hsl(240,11%,22%)"
                : "rgba(200,200,200,.4)",
            },
            p: 3,
          },
        }}
      />

      <TextField
        fullWidth
        variant="standard"
        defaultValue={
          data.due && dayjs(data.due).format("ddd, MMM D, YYYY h:mm A")
        }
        placeholder="Set a due date"
        InputProps={{
          readOnly: true,
          sx: {
            borderRadius: 5,
            background: global.user.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: global.user.darkMode
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
      {data.image && <ImageViewer url={data.image} />}
      <Box
        sx={{
          display: "flex",
          background: global.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 1,
          my: 2,
        }}
      >
        <Button onClick={handleCompletion} sx={iconStyles} fullWidth>
          <Icon className="shadow-xl">
            {data.completed ? "check" : "close"}
          </Icon>
          {data.completed ? "Completed" : "Incomplete"}
        </Button>
        <Button
          onClick={!data.pinned ? handlePriorityChange : undefined}
          sx={iconStyles}
          fullWidth
        >
          <Icon className="shadow-xl">push_pin</Icon>
          {data.pinned ? "Important" : "Unpinned "}{" "}
        </Button>
        <ConfirmationModal
          title="Delete task?"
          question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
          disabled={data.subTasks.length == 0}
          callback={() => handleDelete(data.id)}
        >
          <Button sx={iconStyles} fullWidth>
            <Icon className="outlined shadow-xl">delete</Icon>
            Delete
          </Button>
        </ConfirmationModal>
      </Box>
      <Box
        sx={{
          background: global.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 3,
          ...(data.parentTasks.length !== 0 && {
            display: "none",
          }),
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Subtasks
        </Typography>
        {data.parentTasks.length === 0 &&
          data.subTasks.map((subTask) => (
            <TaskDrawer
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
          isHovered={false}
          column={{ id: "-1", name: "" }}
          tasks={[]}
          parent={data.id}
          label="Create a subtask"
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

export function TaskDrawer({
  children,
  id,
  mutationUrl,
}: {
  children: JSX.Element;
  id: number;
  mutationUrl: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  // Fetch data when the trigger is clicked on
  const handleOpen = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    try {
      const data = await fetchApiWithoutHook("property/boards/column/task", {
        id,
      });
      setData(data);
      setLoading(false);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  // Callback function when drawer is closed
  const handleClose = useCallback(() => {
    setOpen(false);
    mutate(mutationUrl);
  }, [mutationUrl]);

  // Attach the `onClick` handler to the trigger
  const trigger = cloneElement(children, {
    onClick: handleOpen,
  });

  // Some basic drawer styles
  const drawerStyles = {
    width: "100vw",
    maxWidth:
      data && data !== "deleted" && data.parentTasks.length == 1
        ? "500px"
        : "600px",
    maxHeight: "80vh",
    borderBottom: 0,
    borderLeft: 0,
    borderRight: 0,
  };

  return (
    <>
      {trigger}
      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen
        anchor="bottom"
        PaperProps={{ sx: drawerStyles }}
      >
        <Puller />
        <Box sx={{ p: 5, pt: 0 }}>
          {error && (
            <ErrorHandler error="Oh no! An error occured while trying to get this task's information. Please try again later or contact support" />
          )}
          {loading && (
            <Box
              sx={{
                textAlign: "center",
                py: 30,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {data && data !== "deleted" && (
            <DrawerContent
              data={data}
              mutationUrl={mutationUrl}
              setTaskData={setData}
            />
          )}
          {data == "deleted" && (
            <Alert severity="info" icon="💥">
              This task has &quot;mysteriously&quot; vanished into thin air
            </Alert>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}
