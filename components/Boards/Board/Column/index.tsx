import {
  Box,
  Button,
  Icon,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { fetchRawApi } from "../../../../lib/client/useApi";
import { useSession } from "../../../../lib/client/useSession";
import { toastStyles } from "../../../../lib/client/useTheme";
import { EmojiPicker } from "../../../EmojiPicker";
import { ColumnSettings } from "./Settings";
import { Task } from "./Task";
import { CreateTask } from "./Task/Create";

export function Column({ board, mutationUrls, column, index }) {
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [columnTasks, setColumnTasks] = useState(column.tasks);

  useEffect(() => setColumnTasks(column.tasks), [column.tasks]);

  const toggleShowCompleted = useCallback(
    () => setShowCompleted((e) => !e),
    [setShowCompleted]
  );

  const [title, setTitle] = useState(column.name);
  const [emoji, setEmoji] = useState(column.emoji);
  const ref: any = useRef();
  const buttonRef: any = useRef();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        sx={{
          zIndex: 9999999,
        }}
        onClose={() => {
          mutate(mutationUrls.boardData);
          setOpen(false);
        }}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
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
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              py: 2,
              mb: 1,
              borderBottom: `1px solid ${
                session.user.darkMode ? "hsla(240,11%,25%,50%)" : "#e0e0e0"
              }`,
            }}
          >
            <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
              <picture>
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
                  }).then(() => mutate(mutationUrls.boardData)),
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
        </>
      </SwipeableDrawer>
      <Box
        className="snap-center"
        sx={{
          borderLeft: "1px solid",
          borderColor: session.user.darkMode
            ? "hsl(240,11%,16%)"
            : "rgba(200,200,200,.2)",
          zIndex: 1,
          height: "100%",
          flexGrow: 1,
          flexBasis: 0,
          ml: "-1px",
          minHeight: { md: "100vh" },
          overflowY: "scroll",
          minWidth: { xs: "100vw", md: "340px" },
          transition: "filter .2s",
        }}
      >
        <Box
          sx={{
            color: session.user.darkMode ? "#fff" : "#000",
            p: { xs: 2, sm: 3 },
            px: 4,
            background: session.user.darkMode
              ? "hsla(240,11%,16%, 0.2)"
              : "rgba(255,255,255,.05)",
            borderBottom: "1px solid",
            borderColor: session.user.darkMode
              ? "hsla(240,11%,18%, 0.2)"
              : "rgba(200,200,200,.3)",
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
              "& picture img": {
                width: { xs: "40px", sm: "50px" },
                height: { xs: "40px", sm: "50px" },
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
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                className="font-heading"
                sx={{
                  "& span": {
                    overflow: "hidden",
                    maxWidth: { xs: "100%", sm: "140px" },
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                  fontSize: { xs: "25px", sm: "30px" },
                  borderRadius: 1,
                  width: "auto",
                  mb: 0.7,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>{column.name}</span>
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "15px", sm: "18px" },
                }}
              >
                {columnTasks.length} tasks
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <ColumnSettings
                setColumnTasks={setColumnTasks}
                column={column}
                mutationUrls={mutationUrls}
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
              <Image
                src="/images/noTasks.png"
                width={256}
                height={256}
                style={{
                  ...(session.user.darkMode && {
                    filter: "invert(100%)",
                  }),
                }}
                alt="No items found"
              />

              <Box sx={{ px: 1.5, maxWidth: "calc(100% - 50px)" }}>
                <Typography variant="h6" gutterBottom>
                  Nothing much here...
                </Typography>
                <Typography gutterBottom sx={{ mb: -1.5 }}>
                  You haven&apos;t added any list items to this column
                </Typography>
              </Box>
              <CreateTask
                mutationUrl={mutationUrls.tasks}
                boardId={board.id}
                column={column}
              />
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

          <Button
            className="task"
            fullWidth
            size="large"
            sx={{
              px: { xs: "15px!important", sm: "10px!important" },
              py: { xs: "10px!important", sm: "5px!important" },
              mb: 1,
              ...(columnTasks.filter((task) => task.completed).length === 0 && {
                display: "none",
              }),
              mt: 2,
              mx: { xs: "20px", sm: 0 },
              width: "calc(100% - 40px)",
              ...(showCompleted && {
                background: `hsl(240,11%,${
                  session.user.darkMode ? 20 : 80
                }%)!important`,
              }),
              color: `hsl(240,11%,${session.user.darkMode ? 100 : 30}%)`,
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
        </Box>
      </Box>
    </>
  );
}
