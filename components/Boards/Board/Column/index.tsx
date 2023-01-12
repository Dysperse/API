import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { colors } from "../../../../lib/colors";
import { Task } from "./Task";
import { CreateTask } from "./Task/Create";

import {
  Box,
  Button,
  CardActionArea,
  Chip,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useStatusBar } from "../../../../hooks/useStatusBar";
import { ConfirmationModal } from "../../../ConfirmationModal";

function CompletedTasks({
  checkList,
  mutationUrl,
  boardId,
  columnId,
  columnTasks,
  column,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <>
      {columnTasks.filter((task) => task.completed).length !== 0 && (
        <Box
          sx={{
            cursor: "unset!important",
          }}
        >
          <CardActionArea
            disableRipple
            sx={{
              px: 1.5,
              mb: 1,
              "& *": {
                transition: "none!important",
              },
              py: 0.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              mt: 1,
              cursor: "unset!important",
              ...(open && {
                background: "rgba(200,200,200,.2)",
              }),
              "&:active": {
                background: "rgba(200,200,200,.3)",
              },
              justifyContent: "space-between",
            }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Typography
              sx={{ fontWeight: "700", display: "flex", alignItems: "center" }}
            >
              <span>Completed</span>
              <Chip
                sx={{
                  ml: 1,
                }}
                label={columnTasks.filter((task) => task.completed).length}
                size="small"
              />
            </Typography>
            <Icon>{!open ? "expand_more" : "expand_less"}</Icon>
          </CardActionArea>
          <Box
            sx={{
              display: open ? "box" : "none",
              animation: "completedTasks .2s forwards",
            }}
          >
            <Box sx={{ px: 1 }}>
              <TextField
                variant="standard"
                size="small"
                placeholder="Filter..."
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    px: 1,
                    mb: 1,
                    py: 0.5,
                    borderRadius: 2,
                    background: "rgba(200,200,200,.3)",
                  },
                }}
              />
            </Box>
            {columnTasks
              .filter((task) => task.completed)
              .filter((task) =>
                task.name.toLowerCase().includes(value.toLowerCase())
              )
              .map((task) => (
                <Task
                  key={task.id}
                  checkList={checkList}
                  task={task}
                  mutationUrl={mutationUrl}
                  boardId={boardId}
                  columnId={column.id}
                />
              ))}
          </Box>
        </Box>
      )}
    </>
  );
}
function EmojiPickerModal({ emoji, setEmoji }: any) {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open, 1);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "50vw",
            borderRadius: "20px 20px 0 0",
          },
        }}
      >
        <div className="p-2">
          <EmojiPicker
            width="100%"
            onEmojiClick={(event, emojiObject) => {
              const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
              setEmoji(url);
              setOpen(false);
            }}
          />
        </div>
      </SwipeableDrawer>
      <Button onClick={() => setOpen(true)}>
        <picture>
          <img src={emoji} alt="emoji" width="30" height="30" />
        </picture>
      </Button>
    </>
  );
}

function OptionsMenu({ collapsed, mutationUrl, boardId, column }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const styles = {
    width: "100%",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
    "&:hover": {
      backgroundColor:
        (global.user.darkMode
          ? "hsl(240,11%,18%)"
          : colors[themeColor]["100"]) + "!important",
    },
  };
  const [editMode, setEditMode] = React.useState(false);
  const [title, setTitle] = React.useState(column.name);
  const [emoji, setEmoji] = React.useState(column.emoji);
  const ref: any = React.useRef();
  const buttonRef: any = React.useRef();
  useStatusBar(open);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => {
          mutate(mutationUrl);
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
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mb: { sm: 5 },
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
            borderBottom:
              "1px solid " +
              (global.user.darkMode ? "hsla(240,11%,25%,50%)" : "#e0e0e0"),
          }}
        >
          {!editMode ? (
            <picture>
              <img src={column.emoji} alt="emoji" width="30" height="30" />
            </picture>
          ) : (
            <EmojiPickerModal emoji={emoji} setEmoji={setEmoji} />
          )}
          {editMode ? (
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id={"renameInput"}
              inputRef={ref}
              onKeyDown={(e) => {
                if (e.code == "Enter") {
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
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "700" }}>
              {column.name}
            </Typography>
          )}
        </Box>
        {!editMode ? (
          <Box>
            <Button
              sx={styles}
              size="large"
              onClick={() => {
                setEditMode(true);
                setTimeout(() => {
                  ref.current.focus();
                  ref.current.select();
                });
              }}
            >
              <Icon className="outlined">edit</Icon>
              Edit
            </Button>
            <ConfirmationModal
              title="Delete column?"
              question="Are you sure you want to delete this column? This action annot be undone."
              callback={async () => {
                setLoading(true);
                await fetchApiWithoutHook("property/boards/deleteColumn", {
                  id: column.id,
                });
                await mutate(mutationUrl);
                setLoading(false);
                setOpen(false);
              }}
            >
              <Button sx={styles} size="large">
                <Icon className="outlined">delete</Icon> Delete column
              </Button>
            </ConfirmationModal>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button sx={styles} size="large" onClick={() => setEditMode(false)}>
              <Icon className="outlined">cancel</Icon>
              Cancel
            </Button>
            <Button
              sx={{
                ...styles,
                background: colors[themeColor]["800"] + "!important",
                color: colors[themeColor]["50"] + "!important",
                "&:hover": {
                  background: colors[themeColor]["900"] + "!important",
                },
              }}
              size="large"
              variant="contained"
              ref={buttonRef}
              onClick={() => {
                toast.promise(
                  fetchApiWithoutHook("property/boards/editColumn", {
                    columnId: column.id,
                    name: title,
                    emoji: emoji,
                  }).then(() => {
                    mutate(mutationUrl);
                    setOpen(false);
                  }),
                  {
                    loading: "Saving your changes...",
                    success: "Your changes were saved",
                    error: "There was a problem saving your changes.",
                  }
                );
              }}
            >
              <Icon className="outlined">check</Icon>
              Save
            </Button>
          </Box>
        )}
      </SwipeableDrawer>
      <IconButton
        size="small"
        onClick={() => setOpen(true)}
        disableRipple
        sx={{
          ml: "auto",
          display: collapsed ? "none" : "",
          transition: "none!important",
          "&:hover,&:active": {
            color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
          },
        }}
      >
        <Icon className="outlined">more_horiz</Icon>
      </IconButton>
    </>
  );
}

export const Column = React.memo(function Column({
  checkList,
  mutationUrl,
  boardId,
  column,
  tasks,
}: any) {
  const columnTasks = column.tasks.filter(
    (task) => task.parentTasks.length === 0
  );
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      onDoubleClick={() => {
        if (!checkList) {
          setCollapsed(!collapsed);
        }
      }}
      onClick={() => {
        if (!checkList && collapsed) {
          setCollapsed(false);
        }
      }}
      className="w-[350px] bg-gray-100 dark:border-[hsla(240,11%,18%)] border scroll-ml-7 sm:scroll-ml-10 snap-always snap-start border-gray-200 mb-10 dark:bg-[hsl(240,11%,13%)]"
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: {
          xs: collapsed ? "70px" : "calc(100vw - 50px)",
          sm: collapsed ? "70px" : "350px",
        },
        height: "100%",
        flex: {
          xs: collapsed ? "0 0 70px" : "0 0 calc(100vw - 50px)",
          sm: collapsed ? "0 0 70px" : "0 0 350px",
        },
        p: collapsed ? 1 : 3,
        pt: 4,
        px: collapsed ? 1 : checkList ? 4 : 2,
        borderRadius: 5,
        transition: "flex .2s",
        ...(collapsed && {
          cursor: "pointer",
          transition: "all .2s",
          "&:active": {
            transition: "none",
            transform: "scale(.95)",
          },
        }),
        ...(checkList && {
          flex: "0 0 100%!important",
          border: "0!important",
          maxWidth: { xs: "100%", sm: "800px" },
          width: "100%!important",
          background: "transparent!important",
        }),
      }}
    >
      <Box
        sx={{
          mb: 2,
        }}
      >
        {!checkList && (
          <Box sx={{ px: 1 }}>
            <picture>
              <img
                src={column.emoji}
                alt="emoji"
                style={{
                  ...(collapsed && {
                    transform: "scale(.8)",
                    marginLeft: "3px",
                  }),
                }}
              />
            </picture>
          </Box>
        )}
        {!checkList && (
          <Box
            sx={{
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                // className="font-secondary"
                sx={{
                  fontWeight: "600",
                  mb: 1,
                  ...(collapsed && {
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    textOrientation: "mixed",
                    textTransform: "lowercase",
                  }),
                  mt: 2,
                }}
              >
                {column.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  display: collapsed ? "none" : "",
                  fontWeight: "400",
                  whiteSpace: "nowrap",
                  mt: 1,
                }}
              >
                {columnTasks.filter((task) => task.completed).length} out of{" "}
                {columnTasks.length} completed
              </Typography>
            </Box>
            <OptionsMenu
              collapsed={collapsed}
              boardId={boardId}
              column={column}
              mutationUrl={mutationUrl}
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: collapsed ? "none" : "",
        }}
      >
        {columnTasks
          .filter((task) => !task.completed)
          .map((task) => (
            <Task
              key={task.id}
              checkList={checkList}
              task={task}
              mutationUrl={mutationUrl}
              boardId={boardId}
              columnId={column.id}
            />
          ))}
        <CreateTask
          column={column}
          tasks={tasks}
          checkList={checkList}
          mutationUrl={mutationUrl}
          boardId={boardId}
        />

        <CompletedTasks
          checkList={checkList}
          mutationUrl={mutationUrl}
          boardId={boardId}
          columnId={column.id}
          columnTasks={columnTasks}
          column={column}
        />
      </Box>
    </Box>
  );
});
