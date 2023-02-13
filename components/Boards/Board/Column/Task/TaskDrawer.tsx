import {
  Alert,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  Icon,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { green, orange } from "@mui/material/colors";
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
          sx: { fontSize: "35px", textDecoration: "underline" },
        }}
      />

      {/* Description */}
      <TextField
        multiline
        placeholder="Click to add description"
        fullWidth
        defaultValue={data.description}
        margin="dense"
        InputProps={{
          sx: { borderRadius: 5 },
        }}
      />

      <TextField
        fullWidth
        defaultValue={data.due && dayjs(data.due).format("dddd, MMMM D, YYYY")}
        placeholder="Set a due date"
        margin="dense"
        InputProps={{
          readOnly: true,
          sx: {
            borderRadius: 5,
          },
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
          backdropFilter: "blur(10px)",
          my: 1,
          "& .MuiChip-root": {
            fontWeight: 700,
            mr: 1,
            mb: 1,
            color: global.user.darkMode ? "#fff" : "#000",
            userSelect: "none",
            background: global.user.darkMode
              ? "hsl(240,11%,30%)"
              : "hsl(240,11%,80%)",
          },
        }}
      >
        <Chip
          onClick={handleCompletion}
          label={data.completed ? "Completed" : "Not done"}
          icon={
            <Icon
              sx={{
                color: global.user.darkMode
                  ? "#fff!important"
                  : "#000!important",
              }}
            >
              {data.completed ? "check" : "close"}
            </Icon>
          }
          sx={{
            ...(data.completed && {
              background: `${
                green[global.user.darkMode ? "900" : "A700"]
              }!important`,
            }),
            transition: "none",
            color: global.user.darkMode ? "#fff!important" : "#000!important",
          }}
        />
        <ConfirmationModal
          title="Delete task?"
          question={`This task has ${data.subTasks.length} subtasks, which will also be deleted, and cannot be recovered.`}
          disabled={data.subTasks.length == 0}
          callback={() => handleDelete(data.id)}
        >
          <Chip label="Delete" icon={<Icon>delete</Icon>} />
        </ConfirmationModal>
        <Chip
          label={data.pinned ? "Important" : "Mark as important "}
          onDelete={data.pinned ? handlePriorityChange : undefined}
          onClick={!data.pinned ? handlePriorityChange : undefined}
          color="warning"
          sx={{
            background: `${orange[data.pinned ? 400 : 100]}!important`,
            color: "#000!important",
          }}
        />
        {data.id.includes("-event-assignment") && (
          <Chip
            label="Synced to Canvas LMS"
            sx={{
              background: "linear-gradient(45deg, #ff0f7b, #f89b29)!important",
              color: "#000!important",
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          background: global.user.darkMode
            ? "hsl(240,11%,20%)"
            : "rgba(200,200,200,.3)",
          borderRadius: 5,
          p: 3,
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
                sx={{ p: 0 }}
                className="cursor-auto select-none gap-0.5 rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 hover:bg-gray-100 active:border-gray-300 active:bg-gray-200 dark:border-[hsl(240,11%,18%)] dark:bg-transparent sm:hover:bg-gray-100 sm:active:bg-gray-200"
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
      <Drawer
        open={open}
        onClose={handleClose}
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
      </Drawer>
    </>
  );
}
