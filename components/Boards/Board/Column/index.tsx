import EmojiPicker from "emoji-picker-react";
import React from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { colors } from "../../../../lib/colors";
import { Task } from "./Task";
import { CreateTask } from "./Task/Create";

import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useStatusBar } from "../../../../hooks/useStatusBar";
import { ConfirmationModal } from "../../../ConfirmationModal";

function CompletedTasks({
  checkList,
  mutationUrl,
  boardId,
  columnTasks,
  column,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return columnTasks.filter((task) => task.completed).length !== 0 ? (
    <Box
      sx={{
        cursor: "unset!important",
      }}
    >
      <Box
        className="p-3 mb-2 dark:border-[hsl(240,11%,18%)] shadow-sm border flex border-gray-100 hover:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-200 active:bg-gray-300 cursor-auto select-none"
        sx={{
          "& *": {
            transition: "none!important",
          },
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
      </Box>
      <Box
        sx={{
          display: open ? "box" : "none",
          animation: "completedTasks .2s forwards",
        }}
      >
        <TextField
          variant="standard"
          size="small"
          placeholder="Filter..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          InputProps={{
            className:
              "p-3 py-2 pb-1 shadow-sm border border-gray-100 hover:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-200 active:bg-gray-300 cursor-auto select-none",
            disableUnderline: true,
            sx: {
              mb: 1,
            },
          }}
        />
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
  ) : null;
}
function EmojiPickerModal({ emoji, setEmoji }: any) {
  const [open, setOpen] = React.useState(false);
  useStatusBar(open);

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
          },
        }}
      >
        <div className="p-2">
          <EmojiPicker
            width="100%"
            onEmojiClick={(event) => {
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

function OptionsMenu({ setCurrentColumn, mutationUrl, column }) {
  const [open, setOpen] = React.useState(false);
  const styles = {
    width: "100%",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
    "&:hover": {
      backgroundColor: `${
        global.user.darkMode ? "hsl(240,11%,18%)" : colors[themeColor]["100"]
      }!important`,
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
            borderBottom: `1px solid ${
              global.user.darkMode ? "hsla(240,11%,25%,50%)" : "#e0e0e0"
            }`,
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
                await fetchApiWithoutHook("property/boards/deleteColumn", {
                  id: column.id,
                });
                await mutate(mutationUrl);
                setOpen(false);
                setCurrentColumn((e) => e - 1);
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
                background: `${colors[themeColor]["800"]}!important`,
                color: `${colors[themeColor]["50"]}!important`,
                "&:hover": {
                  background: `${colors[themeColor]["900"]}!important`,
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
        onClick={() => setOpen(true)}
        disableRipple
        sx={{
          flexShrink: 0,
          // background: "rgba(200,200,200,.3)!important",
          ml: "auto",
          transition: "none!important",
          "&:hover,&:active": {
            color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
          },
        }}
      >
        <Icon className="outlined">settings</Icon>
      </IconButton>
    </>
  );
}

export const Column = React.memo(function Column({
  setCurrentColumn,
  checkList,
  mutationUrl,
  boardId,
  column,
  tasks,
}: any) {
  const columnTasks = column.tasks.filter(
    (task) => task.parentTasks.length === 0
  );

  return (
    <Box
      className="w-[350px] sm:bg-gray-100 dark:sm:border-[hsla(240,11%,18%)] sm:border scroll-ml-7 sm:scroll-ml-10 snap-always snap-start border-gray-200 mb-10 dark:sm:bg-[hsl(240,11%,13%)]"
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: {
          xs: "calc(100vw - 50px)",
          sm: "350px",
        },
        height: "100%",
        flex: {
          xs: "0 0 calc(100vw - 50px)",
          sm: "0 0 350px",
        },
        p: 3,
        pt: { xs: 0, sm: 3 },
        px: {
          xs: checkList ? 4 : 0,
          sm: checkList ? 4 : 2,
        },
        borderRadius: 5,
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
          mb: 3,
          px: { sm: 0.5 },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: checkList ? "none" : "inline-flex" },
            mb: { sm: 1 },
          }}
        >
          <picture>
            <img
              src={column.emoji}
              alt="emoji"
              style={{ margin: "0!important" }}
            />
          </picture>
        </Box>
        {!checkList && (
          <Box
            sx={{
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              px: { xs: 1, sm: 0 },
              gap: 3,
            }}
          >
            <Box sx={{ display: { sm: "none" }, flexShrink: "0" }}>
              <picture>
                <img
                  src={column.emoji}
                  alt="emoji"
                  width={"40px"}
                  height={"40px"}
                />
              </picture>
            </Box>
            <Box
              sx={{
                maxWidth: { xs: "calc(100% - 150px)", sm: "100%" },
                mx: 1,
              }}
            >
              <Tooltip title={column.name}>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: { xs: "nowrap", sm: "unset" },
                    textOverflow: { xs: "ellipsis", sm: "unset" },
                    overflow: { xs: "hidden", sm: "unset" },
                    maxWidth: { xs: "100%", sm: "unset" },
                    fontWeight: "600",
                  }}
                >
                  {column.name}
                </Typography>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "400",
                  whiteSpace: "nowrap",
                  mt: 0.5,
                }}
              >
                {columnTasks.filter((task) => task.completed).length} out of{" "}
                {columnTasks.length} completed
              </Typography>
            </Box>
            <OptionsMenu
              column={column}
              mutationUrl={mutationUrl}
              setCurrentColumn={setCurrentColumn}
            />
          </Box>
        )}
      </Box>
      <Box>
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
        {columnTasks.filter((task) => task.completed).length ==
          columnTasks.length &&
          columnTasks.length >= 1 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: global.user.darkMode
                  ? "hsl(240,11%,20%)"
                  : "rgba(200,200,200,.3)",
                p: 2,
                borderRadius: 3,
                gap: 2,
                mb: 1,
              }}
            >
              <picture>
                <img
                  alt="0 items remaining!"
                  src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f389.png"
                  width="40px"
                  height="40px"
                />
              </picture>
              <Typography sx={{ width: "100%" }}>0 items remaining!</Typography>
              <CreateTask
                column={column}
                tasks={tasks}
                checkList={checkList}
                mutationUrl={mutationUrl}
                boardId={boardId}
              />
            </Box>
          )}
        {!(
          columnTasks.filter((task) => task.completed).length ==
            columnTasks.length && columnTasks.length >= 1
        ) && (
          <CreateTask
            column={column}
            tasks={tasks}
            checkList={checkList}
            mutationUrl={mutationUrl}
            boardId={boardId}
          />
        )}

        <CompletedTasks
          checkList={checkList}
          mutationUrl={mutationUrl}
          boardId={boardId}
          columnTasks={columnTasks}
          column={column}
        />
      </Box>
    </Box>
  );
});
