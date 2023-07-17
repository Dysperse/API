import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CardActionArea,
  CircularProgress,
  Collapse,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { BoardContext, ColumnContext } from "..";
import EmojiPicker from "../../../EmojiPicker";
import { Task } from "../../Task";
import { CreateTask } from "../../Task/Create";
import { ColumnSettings } from "./Settings";

export function Column({
  setMobileOpen,
  useReverseAnimation,
  setUseReverseAnimation,
}) {
  const { column, navigation, columnLength } = useContext(ColumnContext);
  const { board, mutationUrls, mutateData } = useContext(BoardContext);

  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [columnTasks, setColumnTasks] = useState(column.tasks);

  useEffect(() => setColumnTasks(column.tasks), [column.tasks]);

  const toggleShowCompleted = useCallback(
    () => setShowCompleted((e) => !e),
    [setShowCompleted],
  );

  const [title, setTitle] = useState(column.name);
  const [emoji, setEmoji] = useState(column.emoji);
  const [loading, setLoading] = useState(false);

  const ref: any = useRef();
  const buttonRef: any = useRef();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  const incompleteLength = useMemo(
    () => columnTasks.filter((t) => !t.completed).length,
    [columnTasks],
  );

  const scrollIntoView = async () => {
    if (window.innerWidth > 600) {
      document.body.scrollTop = 0;
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
      toast.error(
        "Yikes! We couldn't get your tasks. Please try again later",
        toastStyles,
      );
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
        onClose={() => {
          mutateData();
          setOpen(false);
        }}
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
          <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
            <picture
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                alt="emoji"
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
              />
            </picture>
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
                },
                toastStyles,
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
        sx={{
          scrollSnapType: { xs: "x mandatory", sm: "unset" },
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: { xs: "transparent", sm: addHslAlpha(palette[4], 0.7) },
          zIndex: 1,
          height: "100%",
          flexGrow: 1,
          flexBasis: 0,
          ml: "-1px",
          minHeight: { md: "100vh" },
          maxHeight: { sm: "100vh" },
          overflowY: "scroll",
          minWidth: { xs: "100vw", md: "340px" },
          width: "100%",
          flex: { xs: "0 0 100%", sm: "0 0 340px" },
          transition: "filter .2s",
          maxWidth: "100vw",
        }}
      >
        <Collapse
          in={loading}
          orientation="vertical"
          mountOnEnter
          sx={{
            px: { xs: 2, sm: 0 },
            borderRadius: { xs: 5, sm: 0 },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: { xs: 5, sm: 0 },
              width: "100%",
              height: "100px",
              mt: { xs: 2, sm: 0 },
              background: palette[3],
            }}
          >
            <CircularProgress />
          </Box>
        </Collapse>
        <Box
          onClick={scrollIntoView}
          sx={{
            color: isDark ? "#fff" : "#000",
            p: { xs: 2, sm: column.name === "" ? 1 : 3 },
            px: 4,
            background: { sm: addHslAlpha(palette[2], 0.7) },
            borderBottom: { sm: "1px solid" },
            borderColor: { sm: addHslAlpha(palette[4], 0.7) },
            userSelect: "none",
            zIndex: 9,
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
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
                    navigation.setCurrent((i) => i - 1);
                  }}
                  disabled={navigation.current == 0}
                  sx={{
                    color:
                      palette[navigation.current == 0 ? 6 : 8] + "!important",
                  }}
                >
                  <Icon className="outlined">arrow_back_ios_new</Icon>
                </IconButton>
              </Box>
            )}
            {column.name == "" ? (
              isMobile && <ColumnSettings setColumnTasks={setColumnTasks} />
            ) : (
              <ColumnSettings setColumnTasks={setColumnTasks}>
                <CardActionArea
                  disabled={!isMobile}
                  sx={{
                    flexGrow: 1,
                    maxWidth: "100%",
                    minWidth: 0,
                    borderRadius: 5,
                    transition: "transform .4s",
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                    background: { xs: palette[2], sm: "transparent" },
                    py: { xs: 1, sm: 0 },
                  }}
                  onContextMenu={() => {
                    toast(column.name, {
                      ...toastStyles,
                      icon: (
                        <picture>
                          <img
                            alt="Emoji"
                            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                            width={20}
                            height={20}
                          />
                        </picture>
                      ),
                    });
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      minWidth: 0,
                      fontSize: "35px",
                      borderRadius: 1,
                      width: "auto",
                      mb: { xs: -0.5, sm: 0.7 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "center", sm: "flex-start" },
                      gap: { xs: 0, sm: 2 },
                      flexDirection: { xs: "column", sm: "row" },
                      ...(column.name === "" && { display: "none" }),
                      "& picture img": {
                        width: { xs: "45px", sm: "30px" },
                        height: { xs: "45px", sm: "30px" },
                        mb: -0.2,
                      },
                    }}
                  >
                    <picture
                      style={{
                        flexShrink: 0,
                      }}
                    >
                      <img
                        alt="Emoji"
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                        width={50}
                        height={50}
                      />
                    </picture>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <span
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        className="font-heading"
                      >
                        {column.name}
                      </span>
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                      fontSize: { xs: "15px", sm: "18px" },
                    }}
                  >
                    {incompleteLength} task{incompleteLength !== 1 && "s"}
                  </Typography>
                </CardActionArea>
              </ColumnSettings>
            )}

            <Box sx={{ ml: "auto" }} onClick={(e) => e.stopPropagation()}>
              {isMobile ? (
                <IconButton
                  onClick={() => {
                    if (navigation.current === columnLength - 1) {
                      setMobileOpen(true);
                      setTimeout(() => {
                        document.getElementById("newColumn")?.click();
                      }, 200);
                      return;
                    }
                    setUseReverseAnimation(false);
                    navigation.setCurrent((i) => i + 1);
                  }}
                  sx={{ color: palette[8] }}
                  size="large"
                >
                  <Icon className="outlined">
                    {navigation.current === columnLength - 1
                      ? "new_window"
                      : "arrow_forward_ios"}
                  </Icon>
                </IconButton>
              ) : (
                <ColumnSettings setColumnTasks={setColumnTasks} />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: { sm: 2 }, mb: { xs: 15, md: 0 } }}>
          <CreateTask
            mutationUrl={mutationUrls.tasks}
            boardId={board.id}
            column={column}
          />
          {columnTasks.filter((task) => !task.completed).length === 0 && (
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mx: "auto",
                  py: { sm: 2 },
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
                <Image
                  src="/images/noTasks.png"
                  width={256}
                  height={256}
                  style={{
                    ...(isDark && {
                      filter: "invert(100%)",
                    }),
                  }}
                  alt="No items found"
                />
                <Box sx={{ px: 3, maxWidth: "calc(100% - 50px)" }}>
                  <Typography variant="h6">It&apos;s quiet here!</Typography>
                  <Typography gutterBottom sx={{ fontWeight: 300 }}>
                    There&apos;s nothing in this column (yet!)
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {columnTasks
            .filter((task) => !task.completed)
            .map((task) => (
              <Task
                key={task.id}
                board={board}
                columnId={column.id}
                mutationUrl={mutationUrls.tasks}
                task={task}
              />
            ))}

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="task"
              size="large"
              sx={{
                width: { sm: "100%" },
                px: { xs: "15px!important", sm: "10px!important" },
                py: { xs: "10px!important", sm: "5px!important" },
                mb: 1,
                ...(columnTasks.filter((task) => task.completed).length ===
                  0 && {
                  display: "none",
                }),
                color: palette[12],
                borderRadius: 4,
                ...(showCompleted && {
                  background: palette[3] + "!important",
                  color: palette[11],
                }),
              }}
              onClick={toggleShowCompleted}
            >
              <Typography sx={{ fontWeight: 700 }}>
                {columnTasks.filter((task) => task.completed).length} completed
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
              {showCompleted &&
                columnTasks
                  .filter((task) => task.completed)
                  .map((task) => (
                    <Task
                      key={task.id}
                      board={board}
                      columnId={column.id}
                      mutationUrl={mutationUrls.tasks}
                      task={task}
                    />
                  ))}
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
