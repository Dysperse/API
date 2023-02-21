import { Calendar } from "@mantine/dates";
import {
  Alert,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  Icon,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { cloneElement, useCallback, useState } from "react";
import { toArray } from "react-emoji-render";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../../hooks/useApi";
import { colors } from "../../../../../lib/colors";
import { toastStyles } from "../../../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../../../ConfirmationModal";
import { ErrorHandler } from "../../../../Error";
import { Puller } from "../../../../Puller";
import { CreateTask } from "./Create";
import { ImageViewer } from "./ImageViewer";

const parseEmojis = (value) => {
  const emojisArray = toArray(value);

  // toArray outputs React elements for emojis and strings for other
  const newValue = emojisArray.reduce((previous: any, current: any) => {
    if (typeof current === "string") {
      return previous + current;
    }
    return previous + current.props.children;
  }, "");

  return newValue;
};

function DrawerContent({ isAgenda, setTaskData, mutationUrl, data }) {
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
    [data.id]
  );

  const [open, setOpen] = useState(false);

  const iconStyles = {
    width: "100%",
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
      "&:not(.pinned)": {
        fontVariationSettings:
          '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
      },
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const postponeOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {/* Task name input */}
      <TextField
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
        placeholder="Click to add description"
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
            background: global.user.darkMode
              ? "hsl(240,11%,20%)"
              : "rgba(200,200,200,.3)",
            "&:focus-within, &:hover": {
              background: global.user.darkMode
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
        <Calendar
          value={new Date(data.due)}
          firstDayOfWeek="sunday"
          onChange={(e: any) => {
            setTaskData((prev) => ({
              ...prev,
              due: e?.toISOString(),
            }));
            handleEdit(data.id, "due", e.toISOString());

            setOpen(false);
          }}
          fullWidth
          styles={(theme) => ({
            // Weekend color
            day: {
              borderRadius: 19,
              transition: "border-radius .2s",
              "&:hover": {
                background:
                  colors[themeColor][global.user.darkMode ? 900 : 100],
              },
              color: colors[themeColor][500],
              "&[data-outside]": {
                color: `${
                  global.user.darkMode
                    ? theme.colors.dark[3]
                    : theme.colors.gray[5]
                }!important`,
              },
              "&[data-selected]": {
                backgroundColor:
                  colors[themeColor][global.user.darkMode ? 100 : 900],
                color: global.user.darkMode
                  ? "#000!important"
                  : "#fff!important",
                borderRadius: 9,
                position: "relative",
              },

              "&[data-weekend]": {
                color: colors[themeColor][500],
              },
            },
          })}
        />
      </Dialog>
      <TextField
        fullWidth
        variant="standard"
        value={data.due && dayjs(data.due).format("dddd, MMM D, YYYY, h:mm A")}
        placeholder="Set a due date"
        onClick={() => setOpen(true)}
        InputProps={{
          readOnly: true,
          sx: {
            "&, & *": {
              cursor: "unset",
            },
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
          <Button onClick={handleCompletion} sx={iconStyles}>
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
          <Button onClick={handlePriorityChange} sx={iconStyles}>
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
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={postponeOpen}
            onClose={handleClose}
            disableAutoFocus={false}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handlePostpone(1, "day")}>
              <Icon className="outlined">today</Icon>
              Tomorrow
            </MenuItem>
            <MenuItem onClick={() => handlePostpone(1, "week")}>
              <Icon className="outlined">calendar_view_week</Icon>1 week
            </MenuItem>
            <MenuItem onClick={() => handlePostpone(1, "month")}>
              <Icon className="outlined">calendar_view_month</Icon>1 month
            </MenuItem>
          </Menu>
          <Button sx={iconStyles} onClick={handleClick}>
            <Icon className="outlined shadow-md dark:shadow-xl">east</Icon>
            Postpone
          </Button>
        </Box>
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
  isAgenda = false,
  children,
  id,
  mutationUrl,
}: {
  isAgenda?: boolean;
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
              isAgenda={isAgenda}
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
