import { containerRef } from "@/app/container";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import { BoardContext, ColumnContext } from "..";
import EmojiPicker from "../../../../../../components/EmojiPicker";
import { Task } from "../../../../../../components/Tasks/Task";
import { CreateTask } from "../../../../../../components/Tasks/Task/Create";
import { ColumnSettings } from "./Settings";

export function Column({ useReverseAnimation, setUseReverseAnimation }) {
  const ref: any = useRef();
  const buttonRef: any = useRef();
  const columnRef: any = useRef();

  const router = useRouter();
  const { column, navigation, columnLength } = useContext(ColumnContext);
  const { board, permissions, mutateData } = useContext(BoardContext);

  const [isScrolling, setIsScrolling] = useState(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const sortedTasks = column.tasks.filter(
    (task) => task.completionInstances.length === 0
  );

  const toggleShowCompleted = useCallback(
    () => setShowCompleted((e) => !e),
    [setShowCompleted]
  );

  const [title, setTitle] = useState(column.name);
  const [emoji, setEmoji] = useState(column.emoji);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { session } = useSession();

  const incompleteLength = useMemo(
    () => column.tasks.filter((t) => t.completionInstances.length === 0).length,
    [column.tasks]
  );

  const scrollIntoView = async () => {
    if (window.innerWidth > 600) {
      document.body.scrollTop = 0;
      columnRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        ref.current?.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setLoading(true);
    try {
      await mutateData();
      await new Promise((r) => setTimeout(() => r(""), 500));
    } catch (e) {
      toast.error("Yikes! We couldn't get your tasks. Please try again later");
    }
    setLoading(false);
  };

  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  const isMobile = useMediaQuery("(max-width: 600px)");

  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  useEffect(() => {
    if (isMobile) {
      document.title = trigger
        ? `${column.name} • ${board.name}`
        : `${board.name} • Board`;
    }
  });

  const expandTitle = useCallback(() => {
    toast(column.name, {
      icon: (
        <img
          alt="Emoji"
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
          width={20}
          height={20}
        />
      ),
    });
  }, [column.name, column.emoji]);

  return (
    <motion.div
      initial={{ opacity: 0, x: useReverseAnimation ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: useReverseAnimation ? -100 : 100 }}
      style={{
        maxWidth: "340px",
        width: "100%",
      }}
    >
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        sx={{
          zIndex: 9999999,
        }}
        onClick={(e) => e.stopPropagation()}
        onClose={() => {
          mutateData();
          setOpen(false);
        }}
        id="taskMutationTrigger"
        PaperProps={{
          sx: {
            maxWidth: "400px",
            maxHeight: "400px",
            width: "auto",
            p: 1,
            borderRadius: { xs: "20px 20px 0 0", md: 5 },
            mb: { md: 5 },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            py: 2,
            mb: 1,
            borderColor: {
              xs: "transparent",
              sm: addHslAlpha(palette[4], 0.7),
            },
          }}
        >
          <EmojiPicker setEmoji={setEmoji}>
            <img
              alt="emoji"
              src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
            />
          </EmojiPicker>
          <TextField
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            id={"renameInput"}
            inputRef={ref}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                buttonRef.current.click();
              }
            }}
            size="small"
            InputProps={{
              sx: {
                fontWeight: "700",
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Button
            ref={buttonRef}
            size="large"
            onClick={async () => {
              toast.promise(
                fetchRawApi(session, "property/boards/column/edit", {
                  id: column.id,
                  name: title,
                  emoji: emoji,
                }).then(mutateData),
                {
                  loading: "Saving...",
                  success: "Edited column!",
                  error: "Yikes! An error occured - Please try again later!",
                }
              );
              setOpen(false);
            }}
          >
            <Icon className="outlined">save</Icon>
            Save
          </Button>
        </Box>
      </SwipeableDrawer>
      <Box
        ref={columnRef}
        sx={{
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: { xs: "transparent", sm: addHslAlpha(palette[4], 0.7) },
          zIndex: 1,
          height: "100%",
          flexGrow: 1,
          flexBasis: 0,
          ml: "-1px",
          minHeight: { md: "100dvh" },
          maxHeight: { sm: "100dvh" },
          overflowY: "scroll",
          minWidth: { xs: "100vw", md: "340px" },
          width: "100%",
          flex: { xs: "0 0 100%", sm: "0 0 340px" },
          maxWidth: "100vw",
        }}
      >
        <Box
          onClick={() => {
            expandTitle();
            scrollIntoView();
          }}
          onContextMenu={() => {
            if (!isMobile) expandTitle();
          }}
          sx={{
            color: isDark ? "#fff" : "#000",
            p: 2,
            background: { sm: addHslAlpha(palette[1], 0.7) },
            borderBottom: { sm: "1px solid" },
            borderColor: { sm: addHslAlpha(palette[4], 0.7) },
            userSelect: "none",
            zIndex: 9,
            backdropFilter: { md: "blur(2px)" },
            position: "sticky",
            top: 0,
            ...(/\bCrOS\b/.test(navigator.userAgent) && {
              background: palette[1],
              backdropFilter: "none",
            }),
          }}
        >
          <Box
            sx={{
              display: "flex",
              my: 1,
              gap: 3,
              alignItems: "center",
            }}
          >
            {isMobile && (
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconButton
                  size="large"
                  onClick={(e) => {
                    setUseReverseAnimation(true);
                    if (navigation.current == -1) {
                      return;
                    }
                    navigation.setCurrent((i) => i - 1);
                  }}
                  sx={{ p: 3, color: palette[8] + "!important" }}
                >
                  <Icon
                    className="outlined"
                    sx={{
                      ...(navigation.current == 0 && {
                        transform: "scale(1.25)",
                      }),
                    }}
                  >
                    {navigation.current == 0
                      ? "grid_view"
                      : "arrow_back_ios_new"}
                  </Icon>
                </IconButton>
              </Box>
            )}
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: "100%",
                minWidth: 0,
                borderRadius: 5,
                transition: "transform .4s",
                py: { xs: 1, sm: 0 },
              }}
              onContextMenu={expandTitle}
            >
              <Typography
                variant="h6"
                sx={{
                  minWidth: 0,
                  borderRadius: 4,
                  width: "auto",
                  mb: { xs: -0.5, sm: 0.7 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  ...(column.name === "" && { display: "none" }),
                  "& img": {
                    width: "30px",
                    height: "30px",
                    mb: -0.2,
                  },
                }}
              >
                <img
                  alt="Emoji"
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                  width={20}
                  height={20}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      minWidth: 0,
                      maxWidth: "100%",
                    }}
                  >
                    {column.name}
                  </span>
                </Box>
              </Typography>
              <Typography
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {incompleteLength} item{incompleteLength !== 1 && "s"}
              </Typography>
            </Box>
            {isMobile && (
              <Box sx={{ ml: "auto" }} onClick={(e) => e.stopPropagation()}>
                <IconButton
                  onClick={() => {
                    if (navigation.current === columnLength - 1) {
                      router.push(
                        (pathname || "").replace("/boards/", "/boards/edit/") +
                          "#columns"
                      );
                      return;
                    }
                    setUseReverseAnimation(false);
                    navigation.setCurrent((i) => i + 1);
                  }}
                  sx={{ p: 3, color: palette[8] }}
                  size="large"
                >
                  <Icon className="outlined">
                    {navigation.current === columnLength - 1
                      ? "new_window"
                      : "arrow_forward_ios"}
                  </Icon>
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ p: { xs: 0, sm: 2 }, mb: { xs: 15, sm: 0 } }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              px: 3,
              pb: 2,
              justifyContent: "center",
            }}
          >
            <CreateTask
              onSuccess={mutateData}
              defaultDate={null}
              boardData={{
                boardId: board.id,
                columnId: column.id,
                columnName: column.name,
                columnEmoji: column.emoji,
              }}
              sx={{ flexGrow: 1, mb: 0 }}
            >
              <Button variant="contained" fullWidth sx={{ width: "100%" }}>
                <Icon>add_circle</Icon>List item
              </Button>
            </CreateTask>
            <ColumnSettings tasks={column.tasks as any[]}>
              <Button variant="outlined" size="small">
                <Icon>more_horiz</Icon>
              </Button>
            </ColumnSettings>
          </Box>
          {column.tasks.filter((task) => task.completionInstances.length === 0)
            .length === 0 && (
            <Box sx={{ py: 1, px: { xs: 2, sm: 0 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mx: "auto",
                  textAlign: { xs: "center", sm: "left" },
                  alignItems: { xs: "center", sm: "start" },
                  flexDirection: "column",
                  "& img": {
                    display: { sm: "none" },
                  },
                  background: palette[2],
                  borderRadius: 5,
                }}
              >
                <Box sx={{ p: 3, maxWidth: "calc(100% - 50px)" }}>
                  <Typography variant="h6">It&apos;s quiet here!</Typography>
                  <Typography sx={{ fontWeight: 300 }}>
                    There&apos;s nothing in this column.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Virtuoso
            isScrolling={setIsScrolling}
            useWindowScroll
            customScrollParent={
              isMobile ? containerRef.current : columnRef.current
            }
            data={sortedTasks}
            itemContent={(_, task) => (
              <Task
                permissions={permissions}
                key={task.id}
                isScrolling={isScrolling}
                board={board}
                columnId={column.id}
                task={task}
                mutateList={mutateData}
              />
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="task"
              size="large"
              sx={{
                width: { sm: "100%" },
                px: { xs: "15px!important", sm: "10px!important" },
                py: { xs: "10px!important", sm: "5px!important" },
                mb: 1,
                ...(column.tasks.filter(
                  (task) => task.completionInstances.length !== 0
                ).length === 0 && {
                  display: "none",
                }),
                color: palette[12],
                borderRadius: 4,
                ...(showCompleted && {
                  background: palette[3] + "!important",
                  color: palette[11],
                }),
                transition: "transform .1s !important",
                "&:active": {
                  transform: "scale(.95)",
                },
              }}
              onClick={toggleShowCompleted}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {
                  column.tasks.filter(
                    (task) => task.completionInstances.length !== 0
                  ).length
                }{" "}
                completed
              </Typography>
              <Icon
                sx={{
                  ml: "auto",
                  transition: "all .2s",
                  ...(showCompleted && { transform: "rotate(180deg)" }),
                }}
              >
                expand_more
              </Icon>
            </Button>
          </Box>
          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Virtuoso
                isScrolling={setIsScrolling}
                useWindowScroll
                customScrollParent={columnRef.current}
                data={column.tasks.filter(
                  (task) => task.completionInstances.length !== 0
                )}
                itemContent={(index, task) => (
                  <Task
                    permissions={permissions}
                    isScrolling={isScrolling}
                    key={task.id}
                    board={board}
                    columnId={column.id}
                    mutateList={mutateData}
                    task={task}
                  />
                )}
              />
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
