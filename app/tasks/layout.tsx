"use client";
import { containerRef } from "@/app/container";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { handleBack } from "@/lib/client/handleBack";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDocumentTitle } from "@/lib/client/useDocumentTitle";
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchTasks } from "../../components/Tasks/Layout/SearchTasks";
import { CreateTask } from "../../components/Tasks/Task/Create";
import { TaskColorPicker } from "../../components/Tasks/Task/Create/ChipBar";
import SelectDateModal from "../../components/Tasks/Task/DatePicker";
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
      const res = await fetchRawApi(
        session,
        "property/boards/column/task/editMany",
        {
          selection: JSON.stringify(
            taskSelection.values.filter((e) => e !== "-1")
          ),
          completed,
        }
      );
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
          const res = await fetchRawApi(
            session,
            "property/boards/column/task/editMany",
            {
              selection: JSON.stringify(
                taskSelection.values.filter((e) => e !== "-1")
              ),
              color: e,
            }
          );
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
  const title = useDocumentTitle();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

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
  const isSearch = pathname?.includes("/tasks/search");

  const trigger = (
    <>
      <IconButton
        onClick={() => {
          vibrate(50);
          router.push("/tasks/home");
        }}
        sx={{
          background: addHslAlpha(palette[3], 0.7),
          color: palette[9],
          "&:active": {
            background: addHslAlpha(palette[5], 0.7),
          },
        }}
      >
        <Icon>close</Icon>
      </IconButton>
      <Button
        sx={{
          color: palette[9],
          px: 1,
          height: 48,
          ml: 0.5,
          mt: -0.1,
          ...(!title.includes("•") && { minWidth: 0 }),
          whiteSpace: "nowrap",
          overflow: "hidden",
          "&:hover": {
            background: "transparent",
          },
        }}
        size="large"
      >
        <Box
          sx={{
            overflow: "hidden",
            maxWidth: "100%",
            textOverflow: "ellipsis",
            "& .MuiTypography-root": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              overflow: "hidden",
            },
            textAlign: "left",
            minWidth: 0,
          }}
        >
          <Typography sx={{ fontWeight: 900 }}>
            {title.includes("•") ? title.split("•")[0] : ""}
          </Typography>
          {title.includes("•") &&
            title.split("•")[1].toString().trim() !== "-" && (
              <Typography variant="body2" sx={{ mt: -0.5 }}>
                {title.split("•")[1]}
              </Typography>
            )}
        </Box>
      </Button>
    </>
  );

  const isSelecting = taskSelection.length > 0;

  const searchRef: any = useRef();
  useHotkeys("esc", () => setTaskSelection([]));

  useEffect(() => {
    if (taskSelection.length > 0) vibrate(50);
  }, [taskSelection]);

  useEffect(() => {
    document.body.classList[isSelecting ? "add" : "remove"]("hideBottomNav");
  }, [isSelecting]);

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
            opacity: 0,
            transform: "translateX(-50%) scale(.5)",
            pointerEvents: "none",
          }),
          zIndex: 99999999,
          background: palette[2],
          maxWidth: { md: "400px" },
        }}
      >
        <Toolbar sx={{ mt: { sm: -0.5 }, pt: "0!important" }}>
          <Button
            variant="contained"
            sx={{
              px: 1,
              mr: "auto",
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
                        "property/boards/column/task/editMany",
                        {
                          selection: JSON.stringify(
                            taskSelection.filter((e) => e !== "-1")
                          ),
                          due: newDate.toISOString(),
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
                        "property/boards/column/task/deleteMany",
                        {
                          selection: JSON.stringify(
                            taskSelection.filter((e) => e !== "-1")
                          ),
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
      {isMobile && (
        <AppBar
          onClick={() => {
            containerRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
          sx={{
            ...taskStyles(palette).appBar,
            ...(isSelecting && {
              opacity: 0,
              transform: "translateX(-50%) scale(.5)",
              pointerEvents: "none",
            }),
            ...(pathname?.includes("/edit/") && {
              display: "none",
            }),
          }}
        >
          <Toolbar sx={{ mt: { sm: -0.5 } }}>
            {!isSearch && trigger}
            {isSearch ? <></> : <SearchTasks />}
            {isSearch && (
              <>
                <IconButton
                  onClick={() => handleBack(router)}
                  sx={{ color: palette[9] }}
                >
                  <Icon>arrow_back_ios_new</Icon>
                </IconButton>
                <SearchTasks inputOnly />
              </>
            )}
            {!isSearch && (
              <CreateTask
                closeOnCreate
                defaultDate={dayjs().startOf("day").toDate()}
                onSuccess={() => {
                  document.getElementById("taskMutationTrigger")?.click();
                }}
              >
                <IconButton
                  id="createTaskTrigger"
                  sx={{
                    "&:active": {
                      transform: "scale(0.9)",
                    },
                    color: palette[9],
                    background: addHslAlpha(palette[3], 0.8),
                    transition: "transform .1s",
                  }}
                >
                  <Icon sx={{ transform: "scale(1.1)" }} className="outlined">
                    add
                  </Icon>
                </IconButton>
              </CreateTask>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ display: "flex", background: { sm: palette[2] } }}>
        <Box
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
