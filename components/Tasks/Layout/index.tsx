import { ConfirmationModal } from "@/components/ConfirmationModal";
import { GroupModal } from "@/components/Group/GroupModal";
import { Puller } from "@/components/Puller";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useDocumentTitle } from "@/lib/client/useDocumentTitle";
import { toastStyles } from "@/lib/client/useTheme";
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
import { motion } from "framer-motion";
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
import { mutate } from "swr";
import { ErrorHandler } from "../../Error";
import { CreateTask } from "../Task/Create";
import { TaskColorPicker } from "../Task/Create/ChipBar";
import SelectDateModal from "../Task/DatePicker";
import { SearchTasks } from "./SearchTasks";
import { Tab } from "./Tab";

export const SelectionContext = createContext<null | any>(null);

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
      maxWidth: "400px",
      mx: "auto",
      height: 55,
      px: 0,
      "& .MuiToolbar-root": {
        px: 1,
      },
      transition: "all .4s",
      zIndex: 999,
      border: 0,
      background: addHslAlpha(palette[2], 0.9),
    },
    menu: {
      transition: "transform .2s",
      "&:active": { transform: "scale(0.95)" },
      position: "fixed",
      bottom: {
        xs: "70px",
        md: "30px",
      },
      left: "10px",
      zIndex: 9,
      background: addHslAlpha(palette[3], 0.9),
      backdropFilter: "blur(10px)",
      border: "1px solid",
      borderColor: addHslAlpha(palette[3], 0.5),
      fontWeight: "700",
      display: { md: "none" },
      fontSize: "15px",
      color: palette[12],
    },
  };
};

const buttonStyles = (palette, condition: boolean) => ({
  cursor: { sm: "unset!important" },
  transition: "none!important",
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
    background: addHslAlpha(palette[4], 0.5),
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
          `Couldn't edit ${res.errors} item${res.errors == 1 ? "" : "s"}`,
          toastStyles
        );
        return;
      }
      document.getElementById("taskMutationTrigger")?.click();
      toast.success(`Marked as ${completed ? "" : "not"} done!`, toastStyles);
    } catch {
      toast.error(
        `Couldn't mark as ${
          completed ? "" : "not"
        } done! Please try again later`,
        toastStyles
      );
    }
  };

  return (
    <>
      <IconButton sx={{ color: palette[8] }} onClick={() => setOpen(true)}>
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
          <ListItemButton onClick={() => handleSubmit(true)}>
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

  return (
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
              `Couldn't edit ${res.errors} item${res.errors == 1 ? "" : "s"}`,
              toastStyles
            );
            return;
          }
          document.getElementById("taskMutationTrigger")?.click();
          toast.success("Applied label!", toastStyles);
          taskSelection.set([]);
        } catch {
          toast.error(
            "Couldn't apply label! Please try again later",
            toastStyles
          );
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
  const { data, url, error } = useApi("property/boards");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [taskSelection, setTaskSelection] = useState([]);

  useHotkeys(["c", "/"], (e) => {
    e.preventDefault();
    document.getElementById("createTask")?.click();
  });

  useHotkeys("d", () => router.push("/tasks/agenda/days"));
  useHotkeys("w", () => router.push("/tasks/agenda/weeks"));
  useHotkeys("m", () => router.push("/tasks/agenda/months"));

  const groupPalette = useColor(
    session.property.profile.color,
    useDarkMode(session.darkMode)
  );

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
      (x) => x.propertyId !== session?.property?.propertyId
    );

    return { active, archived, shared };
  }, [data, session?.property?.propertyId]);

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
  ];

  const MenuChildren = memo(function MenuChildren() {
    return (
      <>
        {error && (
          <ErrorHandler
            callback={() => mutate(url)}
            error="An error occurred while loading your tasks"
          />
        )}
        <Box sx={{ p: 2, mb: { xs: -4, sm: -3 } }}>
          <GroupModal useRightClick={false}>
            <Button
              variant="contained"
              fullWidth
              size="small"
              sx={{ py: 1, color: palette[12] }}
            >
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
            </Button>
          </GroupModal>
        </Box>
        <Box
          sx={{
            p: 3,
            px: 2,
          }}
        >
          {!isMobile && <SearchTasks setOpen={setOpen} />}
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
              // ".priorityMode &": { opacity: 0, "&:hover": { opacity: 1 } },
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

  const isBoard = router.asPath.includes("/tasks/boards/");
  const isSearch = router.asPath.includes("/tasks/search");
  const isAgenda = router.asPath.includes("/tasks/agenda/");

  const trigger = (
    <Button
      sx={{
        color: palette[8],
        px: 1,
        height: 48,
        ...(!title.includes("•") && { minWidth: 0 }),
        whiteSpace: "nowrap",
        overflow: "hidden",
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
        {title.includes("•") && title.includes("•") !== "-" && (
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
        }}
      >
        <Toolbar sx={{ mt: { sm: -0.5 } }}>
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
                <IconButton sx={{ color: palette[8] }}>
                  <Icon className="outlined">label</Icon>
                </IconButton>
              </BulkColorCode>
              <BulkCompletion />
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
                        toastStyles
                      );
                      return;
                    }
                    document.getElementById("taskMutationTrigger")?.click();
                    toast.success(`Updated due date!`, toastStyles);
                  } catch {
                    toast.error(
                      `Couldn't update due dates! Please try again later`,
                      toastStyles
                    );
                  }
                }}
              >
                <IconButton sx={{ color: palette[8] }}>
                  <Icon className="outlined">today</Icon>
                </IconButton>
              </SelectDateModal>
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
                        }`,
                        toastStyles
                      );
                      return;
                    }
                    document.getElementById("taskMutationTrigger")?.click();
                    toast.success("Deleted!", toastStyles);
                    setTaskSelection([]);
                  } catch {
                    toast.error(
                      "Couldn't delete tasks. Try again later.",
                      toastStyles
                    );
                  }
                }}
                buttonText="Delete"
              >
                <IconButton sx={{ color: palette[8] }}>
                  <Icon className="outlined">delete</Icon>
                </IconButton>
              </ConfirmationModal>
            </>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <AppBar
            sx={{
              ...taskStyles(palette).appBar,
              ...(isSelecting && {
                opacity: 0,
                transform: "scale(.5)",
              }),
            }}
          >
            <Toolbar sx={{ mt: { sm: -0.5 } }}>
              {!isSearch && trigger}
              {isSearch ? <></> : <SearchTasks setOpen={setOpen} />}
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
                    color: palette[8],
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
                      document.getElementById("boardInfoTrigger")?.click();
                    }
                  }}
                >
                  <Icon sx={{ transform: "scale(1.1)" }} className="outlined">
                    {isSearch ? "search" : "more_horiz"}
                  </Icon>
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
                    sx={{
                      color: palette[8],
                      background: addHslAlpha(palette[3], 0.5),
                      "&:active": {
                        transform: "scale(0.9)",
                      },
                      transition: "all .2s",
                    }}
                  >
                    <Icon sx={{ transform: "scale(1.1)" }} className="outlined">
                      add{" "}
                    </Icon>
                  </IconButton>
                </CreateTask>
              )}
            </Toolbar>
          </AppBar>
        </motion.div>
      )}
      {isMobile && !isAgenda && <Box sx={{ height: "65px" }} />}

      <Box sx={{ display: "flex" }}>
        <Drawer
          keepMounted
          ModalProps={{ keepMounted: true }}
          anchor="top"
          onClose={handleClose}
          onClick={handleClose}
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
          <Box sx={{ display: "flex", mt: -0.3, ml: 0.95, mb: 1 }}>
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
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flex: { xs: "100%", md: "0 0 250px" },
            ml: -1,
            background: addHslAlpha(palette[3], 0.5),
            display: { xs: "none", md: "flex" },
            minHeight: "100dvh",
            height: { md: "100dvh" },
            overflowY: { md: "scroll" },
            transition: "all .2s",
            flexDirection: "column",
          }}
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <MenuChildren />
          </motion.div>
        </Box>
        <Box
          sx={{
            maxHeight: { md: "100dvh" },
            minHeight: { md: "100dvh" },
            height: { md: "100dvh" },
            overflowY: { md: "auto" },
            flexGrow: 1,
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
