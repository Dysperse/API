import { ConfirmationModal } from "@/components/ConfirmationModal";
import { GroupModal } from "@/components/Group/GroupModal";
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
  Drawer,
  Fade,
  Grow,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  cloneElement,
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

export function GroupSelector({ children }: { children?: JSX.Element }) {
  const session = useSession();
  const palette = useColor(session.user.color, useDarkMode(session.darkMode));
  const groupPalette = useColor(
    session.property.profile.color,
    useDarkMode(session.darkMode)
  );

  const content = (
    <>
      <Box
        sx={{
          width: 15,
          borderRadius: 99,
          height: 15,
          flexShrink: 0,
          background: groupPalette[9],
        }}
      />
      <Typography
        sx={{
          fontWeight: 900,
          minWidth: 0,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {session.property.profile.name}
      </Typography>
      <Icon sx={{ ml: "auto" }}>expand_more</Icon>
    </>
  );

  const trigger = cloneElement(children || <div />, {
    children: content,
  });

  return (
    <GroupModal useRightClick={false}>
      {children ? (
        trigger
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{ py: 1, color: palette[12] }}
        >
          {content}
        </Button>
      )}
    </GroupModal>
  );
}

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
      left: "10px",
      width: "calc(100vw - 20px)",
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
  px: 1.5,
  gap: 1.5,
  py: 0.8,
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
    transform: { xs: "scale(.95)", sm: "none" },
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
  const session = useSession();
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
  const session = useSession();
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
  open,
  setOpen,
  children,
}: {
  contentRef?: any;
  open: boolean;
  setOpen: any;
  children: any;
}) {
  const storage = useAccountStorage();
  const router = useRouter();
  const session = useSession();
  const ref: any = useRef();
  const title = useDocumentTitle();

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const { data, mutate, error } = useSWR(["property/boards"]);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [taskSelection, setTaskSelection] = useState([]);

  useHotkeys(["c", "/"], (e) => {
    e.preventDefault();
    document.getElementById("createTaskTrigger")?.click();
  });

  useHotkeys("d", () => router.push("/tasks/agenda/days"));
  useHotkeys("w", () => router.push("/tasks/agenda/weeks"));
  useHotkeys("m", () => router.push("/tasks/agenda/months"));

  const handleClose = () => {
    setOpen(false);
    vibrate(50);
  };

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

  const perspectives = [
    {
      hash: "agenda/days",
      icon: "calendar_view_day",
      label: "Days",
    },
    {
      hash: "agenda/weeks",
      icon: "view_week",
      label: "Weeks",
    },
    {
      hash: "agenda/months",
      icon: "calendar_view_month",
      label: "Months",
    },
    {
      hash: "insights",
      icon: "insights",
      label: "Insights",
    },
  ];

  const MenuChildren = memo(function MenuChildren() {
    return (
      <>
        {error && (
          <ErrorHandler
            callback={() => mutate()}
            error="An error occurred while loading your tasks"
          />
        )}
        <Box sx={{ p: 2, mb: { xs: -4, sm: -3 } }}>
          <GroupSelector />
        </Box>
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
          <Box onClick={() => setOpen(false)}>
            {perspectives
              .filter((b) => b)
              .map((button: any) => (
                <Link
                  href={`/tasks/${button.hash}`}
                  key={button.hash}
                  style={{ cursor: "default" }}
                >
                  <Button
                    size="large"
                    id={`__agenda.${button.hash}`}
                    sx={buttonStyles(
                      palette,
                      router.asPath === `/tasks/${button.hash}`
                    )}
                  >
                    <Icon
                      className={
                        router.asPath === `/tasks/${button.hash}`
                          ? ""
                          : "outlined"
                      }
                    >
                      {button.icon}
                    </Icon>
                    {button.label}
                  </Button>
                </Link>
              ))}

            <Divider sx={taskStyles(palette).divider} />

            {[
              {
                href: "/tasks/color-coded",
                icon: "palette",
                label: "Color coded",
              },
              {
                href: "/tasks/stream",
                icon: "pending",
                label: "Stream",
              },
            ].map((link, index) => (
              <Link key={index} href={link.href} style={{ cursor: "default" }}>
                <Button
                  size="large"
                  sx={buttonStyles(palette, router.asPath === link.href)}
                >
                  <Icon
                    className={router.asPath === link.href ? "" : "outlined"}
                  >
                    {link.icon}
                  </Icon>
                  {link.label}
                </Button>
              </Link>
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
              <Typography sx={taskStyles(palette).subheading}>
                Shared
              </Typography>
            )}
            {boards.shared.map((board) => (
              <Tab
                setDrawerOpen={setOpen}
                key={board.id}
                styles={buttonStyles}
                board={board}
              />
            ))}
            <Divider sx={taskStyles(palette).divider} />
            <Typography sx={taskStyles(palette).subheading}>Boards</Typography>
            {boards.active.map((board) => (
              <Tab
                setDrawerOpen={setOpen}
                key={board.id}
                styles={buttonStyles}
                board={board}
              />
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
                ref={ref}
                size="large"
                onClick={() => setOpen(false)}
                sx={{
                  ...buttonStyles(
                    palette,
                    router.asPath == "/tasks/boards/create"
                  ),
                  px: 2,
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
                  sx={{ ml: -0.5 }}
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
                <Tab
                  setDrawerOpen={setOpen}
                  key={board.id}
                  styles={buttonStyles}
                  board={board}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </>
    );
  });

  const isBoard =
    router.asPath.includes("/tasks/boards/") &&
    !router.asPath.includes("creategi");
  const isSearch = router.asPath.includes("/tasks/search");
  const isAgenda = router.asPath.includes("/tasks/agenda/");

  const trigger = (
    <Button
      sx={{
        color: addHslAlpha(palette[9], 0.7),
        px: 1,
        height: 48,
        ml: -0.5,
        mt: -0.1,
        ...(!title.includes("•") && { minWidth: 0 }),
        whiteSpace: "nowrap",
        transition: "transform .1s !important",
        overflow: "hidden",
        "&:hover": {
          background: "transparent",
        },
        "&:active": {
          background: addHslAlpha(palette[3], 0.5),
          transform: "scale(.95)",
        },
      }}
      size="large"
      onClick={() => {
        vibrate(50);
        setOpen(true);
      }}
    >
      <Icon>expand_all</Icon>
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
            transform: "scale(.5)",
            pointerEvents: "none",
          }),
          zIndex: 99999999,
          background: palette[3],
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
                  date={null}
                  setDate={async (newDate) => {
                    try {
                      setOpen(false);
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
                          }`,
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
          // onClick={() => {
          // window.scrollTo({ top: 0, behavior: "smooth" });
          // }}
          sx={{
            ...taskStyles(palette).appBar,
            ...(isSelecting && {
              opacity: 0,
              transform: "scale(.5)",
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
            {isBoard || isSearch ? (
              <IconButton
                sx={{
                  color: addHslAlpha(palette[9], 0.7),
                  background: addHslAlpha(palette[3], 0.5),
                  "&:active": {
                    transform: "scale(0.9)",
                  },
                  transition: "all .2s",
                }}
                onClick={() => {
                  if (isSearch) {
                    router.push(
                      `/tasks/search/${encodeURIComponent(
                        searchRef.current?.value
                      )}`
                    );
                  } else {
                    router.push(
                      router.asPath.replace("/boards/", "/boards/edit/")
                    );
                  }
                }}
              >
                <Icon sx={{ transform: "scale(1.1)" }} className="outlined">
                  {isSearch ? "search" : "settings"}
                </Icon>
              </IconButton>
            ) : isAgenda ? (
              <IconButton
                sx={{
                  color: palette[9],
                  background: addHslAlpha(palette[3], 0.5),
                  "&:active": {
                    opacity: 0.6,
                  },
                  fontSize: "15px",
                  borderRadius: 999,
                }}
                onClick={() => document.getElementById("agendaToday")?.click()}
              >
                Today
              </IconButton>
            ) : (
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
        {isMobile && (
          <Drawer
            keepMounted
            ModalProps={{ keepMounted: true }}
            anchor="top"
            onClose={handleClose}
            onClick={handleClose}
            onContextMenu={(e) => e.preventDefault()}
            open={open}
            {...{ TransitionComponent: Fade }}
            PaperProps={{
              sx: {
                background: "transparent",
                p: 2,
              },
            }}
            slotProps={{
              backdrop: {
                sx: {
                  backdropFilter: "blur(15px)!important",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", mt: -0.2, ml: 0.89, mb: 1 }}>
              {trigger}
              <div style={{ marginLeft: "auto" }} />
            </Box>
            <Grow in={open} style={{ transformOrigin: "0 0 0" }}>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  ml: 1,
                  pb: 0,
                  borderRadius: 5,
                  maxHeight: "calc(100dvh - 190px)",
                  maxWidth: "calc(100vw - 100px)",
                  overflowY: "scroll",
                  background: addHslAlpha(palette[3], 0.7),
                }}
              >
                <MenuChildren />
              </Box>
            </Grow>
          </Drawer>
        )}
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
