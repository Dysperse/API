"use client";
import { TaskColorPicker } from "@/app/(app)/tasks/Task/Create/TaskColorPicker";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { vibrate } from "@/lib/client/vibration";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import SelectDateModal from "./Task/DatePicker";
import { MenuChildren } from "./menu";
import { SelectionContext } from "./selection-context";
import { taskStyles } from "./styles";

function BulkCompletion() {
  const { session } = useSession();
  const taskSelection = useContext(SelectionContext);
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));

  const [open, setOpen] = useState(false);

  const handleSubmit = async (completed) => {
    try {
      setOpen(false);
      const res = await fetchRawApi(session, "space/tasks/task/many", {
        method: "PUT",
        params: {
          selection: JSON.stringify(
            taskSelection.values.filter((e) => e !== "-1")
          ),
          completed,
        },
      });
      if (res.errors !== 0) {
        toast.error(
          `Couldn't edit ${res.errors} item${res.errors == 1 ? "" : "s"}`
        );
        return;
      }
      document.getElementById("taskMutationTrigger")?.click();
      taskSelection.set([]);
      toast.success(`Marked as ${completed ? "" : "not"} done!`);
    } catch {
      toast.error(
        `Couldn't mark as ${
          completed ? "" : "not"
        } done! Please try again later`
      );
    }
  };

  return session.permission === "read-only" ? (
    <></>
  ) : (
    <>
      <IconButton sx={{ color: palette[9] }} onClick={() => setOpen(true)}>
        <Icon className="outlined">check_circle</Icon>
      </IconButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onClose={() => setOpen(false)}
      >
        <Puller showOnDesktop />
        <Box sx={{ p: 2, pt: 0 }}>
          <ListItemButton onClick={() => handleSubmit(true)}>
            <Icon>check_circle</Icon>
            <ListItemText primary="Mark as done" />
          </ListItemButton>
          <ListItemButton onClick={() => handleSubmit(false)}>
            <Icon className="outlined">circle</Icon>
            <ListItemText primary="Mark as not done" />
          </ListItemButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function BulkColorCode({ children }) {
  const { session } = useSession();
  const taskSelection = useContext(SelectionContext);

  return session.permission === "read-only" ? (
    <></>
  ) : (
    <TaskColorPicker
      color="null"
      setColor={async (e) => {
        try {
          const res = await fetchRawApi(session, "space/tasks/task/many", {
            method: "PUT",
            params: {
              selection: JSON.stringify(
                taskSelection.values.filter((e) => e !== "-1")
              ),
              color: e,
            },
          });
          if (res.errors !== 0) {
            toast.error(
              `Couldn't edit ${res.errors} item${res.errors == 1 ? "" : "s"}`
            );
            return;
          }
          document.getElementById("taskMutationTrigger")?.click();
          toast.success("Applied label!");
          taskSelection.set([]);
        } catch {
          toast.error("Couldn't apply label! Please try again later");
        }
      }}
      titleRef={null}
    >
      {children}
    </TaskColorPicker>
  );
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session } = useSession();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [editMode, setEditMode] = useState(false);
  const [taskSelection, setTaskSelection] = useState([]);

  useHotkeys("c", (e) => {
    e.preventDefault();
    document.getElementById("createTaskTrigger")?.click();
  });
  useHotkeys(["/", "ctrl+f"], (e) => {
    e.preventDefault();
    document.getElementById("searchTasks")?.focus();
  });

  useHotkeys("shift+w", () => router.push("/tasks/perspectives/days"));
  useHotkeys("shift+m", () => router.push("/tasks/perspectives/weeks"));
  useHotkeys("shift+y", () => router.push("/tasks/perspectives/years"));
  useHotkeys("shift+c", () => router.push("/tasks/color-coded"));
  useHotkeys("shift+i", () => router.push("/tasks/insights"));
  useHotkeys("shift+b", () => router.push("/tasks/stream/backlog"));
  useHotkeys("shift+u", () => router.push("/tasks/stream/upcoming"));
  useHotkeys("shift+u", () => router.push("/tasks/stream/upcoming"));
  useHotkeys("shift+n", () => router.push("/tasks/stream/unscheduled"));
  useHotkeys("shift+o", () => router.push("/tasks/stream/completed"));

  const pathname = usePathname();

  const isSelecting = taskSelection.length > 0;

  useHotkeys("esc", () => setTaskSelection([]));

  useEffect(() => {
    if (taskSelection.length > 0) vibrate(50);
  }, [taskSelection]);

  return (
    <SelectionContext.Provider
      value={{
        values: taskSelection,
        set: setTaskSelection,
      }}
    >
      <AppBar
        sx={{
          ...taskStyles(palette).appBar,
          ...(!isSelecting && {
            transform: "translate(-50%, -100px)",
            pointerEvents: "none",
          }),
          zIndex: 99999999,
          background: addHslAlpha(palette[4], 0.5),
          maxWidth: { md: "400px" },
          pt: "0!important",
          ...((taskSelection.find((e) => e == "-2") && {
            display: "none",
          }) as any),
        }}
      >
        <Toolbar sx={{ mt: { sm: -0.5 }, pt: "0!important" }}>
          <Button
            variant="contained"
            sx={{
              px: 1,
              mr: "auto",
              background: palette[5] + "!important",
            }}
            onClick={() => setTaskSelection([])}
          >
            <Icon>close</Icon>
            {taskSelection.filter((e) => e !== "-1").length}
            {taskSelection.filter((e) => e !== "-1").length == 0 && " selected"}
          </Button>
          {taskSelection.filter((e) => e !== "-1").length !== 0 && (
            <>
              <BulkColorCode>
                <IconButton sx={{ color: palette[9] }}>
                  <Icon className="outlined">label</Icon>
                </IconButton>
              </BulkColorCode>
              <BulkCompletion />
              {session.permission !== "read-only" && (
                <SelectDateModal
                  date={new Date()}
                  dateOnly
                  setDate={async (newDate) => {
                    try {
                      const res = await fetchRawApi(
                        session,
                        "space/tasks/task/many",
                        {
                          method: "PUT",
                          params: {
                            selection: JSON.stringify(
                              taskSelection.filter((e) => e !== "-1")
                            ),
                            due: newDate.toISOString(),
                          },
                        }
                      );
                      if (res.errors !== 0) {
                        toast.error(
                          `Couldn't edit ${res.errors} item${
                            res.errors == 1 ? "" : "s"
                          }`
                        );
                        return;
                      }
                      document.getElementById("taskMutationTrigger")?.click();
                      toast.success(`Updated due date!`);
                      setTaskSelection([]);
                    } catch {
                      toast.error(
                        `Couldn't update due dates! Please try again later`
                      );
                    }
                  }}
                >
                  <IconButton sx={{ color: palette[9] }}>
                    <Icon className="outlined">today</Icon>
                  </IconButton>
                </SelectDateModal>
              )}
              {session.permission !== "read-only" && (
                <ConfirmationModal
                  title={`Delete ${
                    taskSelection.filter((e) => e !== "-1").length
                  } item${
                    taskSelection.filter((e) => e !== "-1").length !== 1
                      ? "s"
                      : ""
                  }?`}
                  question="This action cannot be undone"
                  callback={async () => {
                    try {
                      const res = await fetchRawApi(
                        session,
                        "space/tasks/task/many",
                        {
                          method: "DELETE",
                          params: {
                            selection: JSON.stringify(
                              taskSelection.filter((e) => e !== "-1")
                            ),
                          },
                        }
                      );
                      if (res.errors !== 0) {
                        toast.error(
                          `Couldn't delete ${res.errors} item${
                            res.errors == 1 ? "" : "s"
                          }`
                        );
                        return;
                      }
                      document.getElementById("taskMutationTrigger")?.click();
                      toast.success("Deleted!");
                      setTaskSelection([]);
                    } catch {
                      toast.error("Couldn't delete tasks. Try again later.");
                    }
                  }}
                  buttonText="Delete"
                >
                  <IconButton sx={{ color: palette[9] }}>
                    <Icon className="outlined">delete</Icon>
                  </IconButton>
                </ConfirmationModal>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", background: { sm: palette[2] } }}>
        <Box
          id="tasksMenuContainer"
          sx={{
            width: { xs: "100%", sm: 300 },
            flex: { xs: "100%", sm: "0 0 250px" },
            background: palette[2],
            display: { xs: "none", sm: "flex" },
            minHeight: "100dvh",
            maxWidth: "250px",
            opacity: 1,
            ".priorityMode &": {
              visbility: "hidden",
              opacity: 0,
              maxWidth: 0,
            },
            height: { sm: "100dvh" },
            overflowY: { sm: "scroll" },
            transition: "all .2s",
            flexDirection: "column",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              backgroundColor: palette[2],
              border: "3px solid " + palette[2],
            },
            "&:hover": {
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                backgroundColor: palette[4],
                border: "3px solid " + palette[2],
              },
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: palette[6],
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: palette[6],
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: palette[6],
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "transparent",
            },
          }}
        >
          <MenuChildren editMode={editMode} setEditMode={setEditMode} />
        </Box>
        <Box
          sx={{
            maxHeight: { sm: "100dvh" },
            minHeight: { sm: "100dvh" },
            height: { sm: "100dvh" },
            overflowY: { sm: "auto" },
            borderRadius: { sm: "20px 0 0 20px" },
            flexGrow: 1,
            background: palette[1],
          }}
          id="boardContainer"
        >
          {children}
        </Box>
      </Box>
    </SelectionContext.Provider>
  );
}
