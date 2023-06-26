import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Icon,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import EmojiPicker from "../../../EmojiPicker";
import { Task } from "../../Task";
import { CreateTask } from "../../Task/Create";
import { ColumnSettings } from "./Settings";

export function Column({ board, mutateData, mutationUrls, column, index }) {
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [columnTasks, setColumnTasks] = useState(column.tasks);

  useEffect(() => setColumnTasks(column.tasks), [column.tasks]);

  const toggleShowCompleted = useCallback(
    () => setShowCompleted((e) => !e),
    [setShowCompleted]
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
    [columnTasks]
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
        toastStyles
      );
    }
    setLoading(false);
  };
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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
            borderColor: { sm: addHslAlpha(palette[4], 0.7) },
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
                fetchRawApi("property/boards/column/edit", {
                  id: column.id,
                  name: title,
                  emoji: emoji,
                }).then(mutateData),
                {
                  loading: "Saving...",
                  success: "Edited column!",
                  error: "Yikes! An error occured - Please try again later!",
                },
                toastStyles
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
          borderColor: { sm: addHslAlpha(palette[4], 0.7) },
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
        <Collapse in={loading} orientation="vertical" mountOnEnter>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100px",
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
            <Box sx={{ flexGrow: 1, maxWidth: "100%", minWidth: 0 }}>
              <Typography
                variant="h4"
                className="font-heading"
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  minWidth: 0,
                  fontSize: {
                    xs: "50px",
                    sm: "35px",
                  },
                  borderRadius: 1,
                  width: "auto",
                  mb: 0.7,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  ...(column.name === "" && { display: "none" }),
                  "& picture img": {
                    width: { xs: "45px", sm: "30px" },
                    height: { xs: "45px", sm: "30px" },
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
                {column.name}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "15px", sm: "18px" },
                }}
              >
                {incompleteLength} task{incompleteLength !== 1 && "s"}
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <ColumnSettings
                setColumnTasks={setColumnTasks}
                column={column}
                mutateData={mutateData}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ p: { sm: 2 }, mb: { xs: 15, md: 0 } }}
          id={`container-${index}`}
        >
          {columnTasks.filter((task) => !task.completed).length === 0 ? (
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
              }}
            >
              <Box sx={{ width: "100%", mt: { sm: -3 }, mb: { sm: 2 } }}>
                <CreateTask
                  mutationUrl={mutationUrls.tasks}
                  boardId={board.id}
                  column={column}
                />
              </Box>
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
              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  No items (yet!)
                </Typography>
              </Box>
            </Box>
          ) : (
            <CreateTask
              mutationUrl={mutationUrls.tasks}
              boardId={board.id}
              column={column}
            />
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
