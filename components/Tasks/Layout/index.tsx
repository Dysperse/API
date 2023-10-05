import { ConfirmationModal } from "@/components/ConfirmationModal";
import { containerRef } from "@/components/Layout";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDocumentTitle } from "@/lib/client/useDocumentTitle";
import { vibrate } from "@/lib/client/vibration";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import useSWR from "swr";
import { ErrorHandler } from "../../Error";
import { CreateTask } from "../Task/Create";
import { TaskColorPicker } from "../Task/Create/ChipBar";
import SelectDateModal from "../Task/DatePicker";
import { SearchTasks } from "./SearchTasks";
import { Tab } from "./Tab";

export const SelectionContext = createContext<null | any>(null);

export const recentlyAccessed = {
  set: (t) => localStorage.setItem("recentlyAccessedTasks", JSON.stringify(t)),
  get: () => {
    try {
      const d = JSON.parse(
        localStorage.getItem("recentlyAccessedTasks") || "{}"
      );
      return d;
    } catch (e) {
      return {};
    }
  },
};

export const taskStyles = (palette) => {
  return {
    divider: {
      mt: 1,
      mb: 2,
      width: { sm: "90%" },
      mx: "auto",
      opacity: 0.5,
    },
    subheading: {
      my: { xs: 1, sm: 1.5 },
      mt: { xs: 1, sm: 1 },
      textTransform: "uppercase",
      fontWeight: 700,
      opacity: 0.5,
      fontSize: "13px",
      px: 1.5,
      color: palette[12],
      userSelect: "none",
    },
    appBar: {
      position: "fixed",
      top: "10px",
      borderRadius: 999,
      left: "50%",
      width: "calc(100vw - 20px)",
      transform: "translateX(-50%)",
      mx: "auto",
      zIndex: 999,
      height: 55,
      px: 0,
      "& .MuiToolbar-root": {
        px: 1,
      },
      transition: "all .4s",
      border: 0,
      background: addHslAlpha(palette[2], 0.9),
    },
    menu: {
      transition: "transform .2s",
      "&:active": { transform: "scale(0.95)" },
      position: "fixed",
      bottom: {
        xs: "70px",
        sm: "30px",
      },
      left: "10px",
      zIndex: 9,
      background: addHslAlpha(palette[3], 0.9),
      backdropFilter: "blur(10px)",
      border: "1px solid",
      borderColor: addHslAlpha(palette[3], 0.5),
      fontWeight: "700",
      display: { sm: "none" },
      fontSize: "15px",
      color: palette[12],
    },
  };
};

const buttonStyles = (palette, condition: boolean) => ({
  cursor: { sm: "unset!important" },
  transition: "transform .1s !important",
  gap: 1.5,
  py: { xs: 1, sm: 0.8 },
  px: { xs: 2, sm: 1.5 },
  mr: 1,
  mb: 0.3,
  width: "100%",
  fontSize: "15px",
  justifyContent: "flex-start",
  borderRadius: 4,
  "&:hover, &:focus": {
    background: {
      xs: "transparent!important",
      sm: addHslAlpha(palette[4], 0.5) + "!important",
    },
  },
  "&:active": {
    background: addHslAlpha(palette[4], 0.5) + "!important",
  },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  ...(!condition
    ? {
        color: addHslAlpha(palette[12], 0.7),
        "&:hover": {
          background: addHslAlpha(palette[4], 0.5),
        },
      }
    : {
        color: palette[12],
        background: addHslAlpha(palette[6], 0.5),
        "&:hover, &:focus": {
          background: addHslAlpha(palette[7], 0.5),
        },
      }),
});

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

export const MenuChildren = memo(function MenuChildren() {
  const { session } = useSession();
  const storage = useAccountStorage();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [showSync, setShowSync] = useState(true);

  const { data, mutate, error } = useSWR(["property/boards"]);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const boards = useMemo(() => {
    if (!data) return { active: [], archived: [], shared: [] };

    const active = data.filter(
      (x) => !x.archived && x.propertyId === session?.property?.propertyId
    );

    const archived = data.filter((x) => x.archived);

    const shared = data.filter(
      (x) =>
        x.propertyId !== session?.property?.propertyId ||
        x.shareTokens?.[0]?.user?.email === session.user.email
    );

    return { active, archived, shared };
  }, [data, session]);

  const router = useRouter();

  const perspectives = useMemo(
    () => [
      {
        key: "s",
        hash: "stream",
        icon: "view_column_2",
        label: "Stream",
        preview: "stream.png",
        description: "View your upcoming tasks - and the ones you've missed",
      },
      {
        key: "w",
        hash: "agenda/days",
        icon: isMobile ? "calendar_view_day" : "view_week",
        label: isMobile ? "Days" : "Weeks",
        preview: "days.png",
        description: "View all your tasks by week",
      },
      {
        key: "m",
        hash: "agenda/weeks",
        icon: isMobile ? "view_week" : "calendar_view_month",
        label: isMobile ? "Weeks" : "Months",
        preview: "weeks.png",
        description: "View all your tasks by month",
      },
      {
        key: "y",
        hash: "agenda/months",
        icon: isMobile ? "calendar_view_month" : "view_compact",
        label: isMobile ? "Months" : "Years",
        preview: "months.png",
        description: "View all your tasks by year",
      },
      {
        key: "i",
        hash: "insights",
        icon: "insights",
        label: "Insights",
        preview: "insights.png",
        description:
          "Dive into your productivity and learn more about yourself",
      },
      {
        key: "c",
        hash: "color-coded",
        icon: "palette",
        label: "Color coded",
        preview: "color-coded.png",
        description: "See all your tasks by color",
      },
    ],
    [isMobile]
  );

  return (
    <>
      {error && (
        <ErrorHandler
          callback={() => mutate()}
          error="An error occurred while loading your tasks"
        />
      )}
      <Box
        sx={{
          p: 3,
          px: 2,
        }}
      >
        {!isMobile && <SearchTasks />}
        <Typography sx={taskStyles(palette).subheading}>
          Perspectives
        </Typography>
        <Box>
          {perspectives.map((button: any) => (
            <Tooltip
              key={button.hash}
              arrow={false}
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    maxWidth: "unset",
                    background: `${addHslAlpha(palette[5], 0.3)}!important`,
                    backdropFilter: "blur(10px)",
                    color: "#fff!important",
                    borderRadius: 5,
                    "& img": {
                      borderRadius: 5,
                    },
                  },
                },
              }}
              title={
                !isMobile && (
                  <Box sx={{ width: "300px", flex: "0 0 300px", py: 1 }}>
                    <Image
                      blurDataURL="data:image/png;base64,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"
                      placeholder="blur"
                      src={`/images/perspectives/${button.preview}`}
                      width={1920 / 3}
                      height={1080 / 3}
                      alt={"Preview of " + button.label}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                    <Box sx={{ p: 1, pt: 0.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          className: "font-heading",
                          mt: 1,
                          mb: 0.5,
                          gap: 2,
                        }}
                      >
                        <Typography variant="h4">{button.label}</Typography>
                        <IconButton
                          sx={{
                            width: 26,
                            height: 26,
                            fontSize: "12px",
                            color: palette[11],
                            ml: "auto",
                            lineHeight: "26px",
                            border: `2px solid ${palette[8]}`,
                          }}
                        >
                          {button.key.toUpperCase()}
                        </IconButton>
                      </Box>
                      <Typography>{button.description}</Typography>
                    </Box>
                  </Box>
                )
              }
              placement="right"
              enterNextDelay={0}
              enterDelay={1000}
              disableTouchListener
            >
              <Link
                href={`/tasks/${button.hash}`}
                style={{ cursor: "default" }}
              >
                <Button
                  size="large"
                  id={`__agenda.${button.hash}`}
                  sx={buttonStyles(
                    palette,
                    router.asPath.includes(`/tasks/${button.hash}`)
                  )}
                  onClick={() =>
                    recentlyAccessed.set({
                      icon: button.icon,
                      label: button.label,
                      path: `/tasks/${button.hash}`,
                    })
                  }
                >
                  <Icon
                    className={
                      router.asPath.includes(`/tasks/${button.hash}`)
                        ? ""
                        : "outlined"
                    }
                  >
                    {button.icon}
                  </Icon>
                  {button.label}
                </Button>
              </Link>
            </Tooltip>
          ))}
        </Box>
        <Box
          sx={{
            transition: "all .2s",
          }}
        >
          {boards.shared.length > 0 && (
            <Divider sx={taskStyles(palette).divider} />
          )}
          {boards.shared.length > 0 && (
            <Typography sx={taskStyles(palette).subheading}>Shared</Typography>
          )}
          {boards.shared.map((board) => (
            <Tab key={board.id} styles={buttonStyles} board={board} />
          ))}
          <Divider sx={taskStyles(palette).divider} />
          <Typography sx={taskStyles(palette).subheading}>Boards</Typography>
          {boards.active.map((board) => (
            <Tab key={board.id} styles={buttonStyles} board={board} />
          ))}
          <Link
            href={
              Boolean(storage?.isReached) ||
              data?.filter((board) => !board.archived).length >= 7 ||
              session.permission === "read-only"
                ? "/tasks"
                : "/tasks/boards/create"
            }
            style={{ width: "100%" }}
          >
            <Button
              fullWidth
              disabled={
                Boolean(storage?.isReached) ||
                data?.filter((board) => !board.archived).length >= 7 ||
                session.permission === "read-only"
              }
              size="large"
              sx={{
                ...buttonStyles(
                  palette,
                  router.asPath == "/tasks/boards/create"
                ),
                cursor: "default",
                ...((storage?.isReached === true ||
                  (data &&
                    data.filter((board) => !board.archived).length >= 7)) && {
                  opacity: 0.5,
                }),
                justifyContent: "start",
              }}
            >
              <Icon
                className={router.asPath == "/tasks/create" ? "" : "outlined"}
              >
                add_circle
              </Icon>
              New board
            </Button>
          </Link>
          <Box>
            {data && data.filter((x) => x.archived).length !== 0 && (
              <>
                <Divider sx={taskStyles(palette).divider} />
                <Typography sx={taskStyles(palette).subheading}>
                  Archived
                </Typography>
              </>
            )}
            {boards.archived.map((board) => (
              <Tab key={board.id} styles={buttonStyles} board={board} />
            ))}
            {isMobile && showSync && (
              <>
                <Divider sx={taskStyles(palette).divider} />
                <Button
                  fullWidth
                  onClick={async () => {
                    toast.success("Tasks resynced - Now up to date.");
                    setShowSync(false);
                    await fetch("/api/property/integrations/resync");
                  }}
                  disabled={
                    Boolean(storage?.isReached) ||
                    session.permission === "read-only"
                  }
                  size="large"
                  sx={{
                    ...buttonStyles(palette, false),
                    cursor: "default",
                    justifyContent: "start",
                  }}
                >
                  <Icon>sync</Icon>
                  Resync tasks
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
});

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

export function TasksLayout({
  contentRef,
  children,
  navbarRightContent,
}: {
  contentRef?: any;
  children: any;
  navbarRightContent?: JSX.Element;
}) {
  const router = useRouter();
  const { session } = useSession();
  const title = useDocumentTitle();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [taskSelection, setTaskSelection] = useState([]);

  useHotkeys(["c", "/"], (e) => {
    e.preventDefault();
    document.getElementById("createTaskTrigger")?.click();
  });

  useHotkeys("s", () => router.push("/tasks/stream"));
  useHotkeys("w", () => router.push("/tasks/agenda/days"));
  useHotkeys("m", () => router.push("/tasks/agenda/weeks"));
  useHotkeys("y", () => router.push("/tasks/agenda/years"));
  useHotkeys("c", () => router.push("/tasks/color-coded"));
  useHotkeys("i", () => router.push("/tasks/insights"));

  const isBoard =
    router.asPath.includes("/tasks/boards/") &&
    !router.asPath.includes("create");
  const isSearch = router.asPath.includes("/tasks/search");
  const isAgenda = router.asPath.includes("/tasks/agenda/");

  const trigger = (
    <>
      <IconButton
        onClick={() => {
          vibrate(50);
          router.push("/tasks/home");
        }}
        sx={{
          background: addHslAlpha(palette[3], 0.7),
          color: palette[8],
          "&:active": {
            background: addHslAlpha(palette[5], 0.7),
          },
        }}
      >
        <Icon>close</Icon>
      </IconButton>
      <Button
        sx={{
          color: addHslAlpha(palette[9], 0.7),
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
            ...(router.asPath.includes("/edit/") && {
              display: "none",
            }),
          }}
        >
          <Toolbar sx={{ mt: { sm: -0.5 } }}>
            {!isSearch && trigger}
            {isSearch ? <></> : <SearchTasks />}
            {isSearch && (
              <TextField
                variant="outlined"
                placeholder="Search tasks..."
                defaultValue={router.query.query}
                size="small"
                InputProps={{
                  sx: { borderRadius: 99 },
                }}
                sx={{ mr: 1 }}
                inputRef={searchRef}
              />
            )}
            {navbarRightContent || (
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
      {isMobile && !isAgenda && !router.asPath.includes("/edit/") && (
        <Box sx={{ height: "65px" }} />
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
          }}
        >
          <MenuChildren />
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
          {...(contentRef && { ref: contentRef })}
          id="boardContainer"
        >
          {children}
        </Box>
      </Box>
    </SelectionContext.Provider>
  );
}
