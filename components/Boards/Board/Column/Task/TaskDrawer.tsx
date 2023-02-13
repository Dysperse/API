import {
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
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { ErrorHandler } from "../../../../Error";
import { Puller } from "../../../../Puller";
import { ImageViewer } from "./ImageViewer";

function DrawerContent({ mutationUrl, data }) {
  return (
    <>
      {/* Task name input */}
      <TextField
        multiline
        fullWidth
        defaultValue={data.name}
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
          sx: { fontSize: "20px", borderRadius: 5 },
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
          label={data.completed ? "Mark as not done" : "Mark as complete"}
          onClick={() => {}}
          sx={{
            ...(data.completed && { background: green["A700"] }),
          }}
        />
        <Chip
          label={data.pinned ? "Important" : "Mark as important "}
          onDelete={data.pinned ? () => {} : undefined}
          onClick={!data.pinned ? () => {} : undefined}
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
      {data.parentTasks.length === 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Subtasks
        </Typography>
      )}
      {data.parentTasks.length === 0 &&
        data.subTasks.map((subTask) => (
          <TaskDrawer id={subTask.id} mutationUrl={mutationUrl}>
            <ListItemButton sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon>
                <Checkbox checked={subTask.completed} />
              </ListItemIcon>
              <ListItemText
                primary={subTask.name}
                secondary={subTask.description}
              />
            </ListItemButton>
          </TaskDrawer>
        ))}
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
    maxWidth: data && data.parentTasks.length == 1 ? "500px" : "600px",
    maxHeight: "80vh",
    border: 0,
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
            <Box>
              <CircularProgress />
            </Box>
          )}
          {data && <DrawerContent data={data} mutationUrl={mutationUrl} />}
        </Box>
      </Drawer>
    </>
  );
}
