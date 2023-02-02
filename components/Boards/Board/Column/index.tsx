import EmojiPicker from "emoji-picker-react";
import React from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { Task } from "./Task";
import { CreateTask } from "./Task/Create";

import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { useStatusBar } from "../../../../hooks/useStatusBar";
import { toastStyles } from "../../../../lib/useCustomTheme";
import { ConfirmationModal } from "../../../ConfirmationModal";

function CompletedTasks({
  checkList,
  mutationUrl,
  board,
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
        tabIndex={0}
        className="p-3 mb-2 dark:border-[hsl(240,11%,18%)] dark:hover:border-[hsl(240,11%,25%)] shadow-sm border flex border-gray-100 hover:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-200 active:bg-gray-300 cursor-auto select-none"
        sx={{
          py: { sm: "5px!important" },
          mt: 1,
          border: { sm: "none!important" },
          boxShadow: { sm: "none!important" },
          ...(open && {
            background: "rgba(200,200,200,.2)",
          }),
          "&:focus-visible": {
            boxShadow: global.user.darkMode
              ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
              : "0px 0px 0px 1.5px var(--themeDark) !important",
          },
          justifyContent: "space-between",
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography
          component="div"
          sx={{ fontWeight: "700", display: "flex", alignItems: "center" }}
        >
          <span>Completed</span>
          <Chip
            sx={{
              ml: 1,
              px: 1,
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
              "p-3 py-2 pb-1 shadow-sm border border-gray-100 hover:border-gray-300 rounded-xl gap-0.5 dark:bg-transparent hover:bg-gray-200 active:bg-gray-300 cursor-auto select-none dark:border-[hsl(240,11%,18%)] ",
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
          .map((task, i) => (
            <Task
              key={i}
              checkList={checkList}
              task={task}
              mutationUrl={mutationUrl}
              board={board}
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
            maxWidth: "400px",
            mb: { sm: 2 },
            borderRadius: { xs: "20px 20px 0 0", sm: 4 },
          },
        }}
      >
        <EmojiPicker
          // theme={global.user.darkMode ? "dark" : "light"}
          skinTonePickerLocation={"PREVIEW" as any}
          theme={(global.user.darkMode ? "dark" : "light") as any}
          lazyLoadEmojis={true}
          width="100%"
          onEmojiClick={(event) => {
            const url = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${event.unified}.png`;
            setEmoji(url);
            setOpen(false);
          }}
        />
      </SwipeableDrawer>
      <Button onClick={() => setOpen(true)}>
        <picture>
          <img src={emoji} alt="emoji" width="30" height="30" />
        </picture>
      </Button>
    </>
  );
}

function FilterMenu({ originalTasks, columnTasks, setColumnTasks, board }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setColumnTasks(
              originalTasks.sort((a, b) => (a.name > b.name ? 1 : -1))
            );
            handleClose();
          }}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(
              originalTasks.sort((a, b) => (a.name > b.name ? 1 : -1)).reverse()
            );
            handleClose();
          }}
        >
          Z-A
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(originalTasks);
            handleClose();
          }}
        >
          Newest to oldest
        </MenuItem>
        <MenuItem
          onClick={() => {
            setColumnTasks(originalTasks.reverse());
            handleClose();
          }}
        >
          Oldest to newest
        </MenuItem>
      </Menu>
      <IconButton
        sx={{
          flexShrink: 0,
          display: board.archived ? "none" : "",
          ml: "auto",
          mr: -1,
          transition: "none!important",
          "&:hover,&:active": {
            background: global.user.darkMode
              ? "hsl(240,11%,13%)"
              : "rgba(200,200,200,.3)",
            color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
          },
          "&:active": {
            background: global.user.darkMode
              ? "hsl(240,11%,15%)"
              : "rgba(200,200,200,.4)",
          },
        }}
        onClick={handleClick}
      >
        <Icon className="outlined">filter_list</Icon>
      </IconButton>
    </>
  );
}

function OptionsMenu({ setCurrentColumn, mutationUrl, column, board }) {
  const [open, setOpen] = React.useState(false);
  const styles = {
    width: "100%",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
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
            <EmojiPickerModal
              emoji={emoji}
              setEmoji={setEmoji}
              lazyLoadEmojis={true}
            />
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
            <Typography variant="h6">
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
              sx={styles}
              size="large"
              variant="contained"
              ref={buttonRef}
              disabled={
                title.trim() == "" ||
                (title === column.name && emoji === column.emoji)
              }
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
                  },
                  toastStyles
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
        sx={{
          flexShrink: 0,
          display: board.archived ? "none" : "",
          transition: "none!important",
          "&:hover,&:active": {
            background: global.user.darkMode
              ? "hsl(240,11%,13%)"
              : "rgba(200,200,200,.3)",
            color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
          },
          "&:active": {
            background: global.user.darkMode
              ? "hsl(240,11%,15%)"
              : "rgba(200,200,200,.4)",
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
  board,
  column,
  tasks,
}: any) {
  const [columnTasks, setColumnTasks] = React.useState(
    column.tasks.filter((task) => task.parentTasks.length === 0)
  );

  React.useEffect(() => {
    setColumnTasks(
      column.tasks.filter((task) => task.parentTasks.length === 0)
    );
  }, [column]);

  const [isHovered, setIsHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useHotkeys(
    "c",
    (e) => {
      e.preventDefault();
      if (isHovered) {
        const trigger: any = ref.current?.querySelector("#createTask");
        trigger?.click();
        setIsHovered(false);
      }
    },
    [isHovered]
  );
  const trigger = useMediaQuery("(max-width: 600px)");
  return (
    <Box
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-[370px] border border-gray-200 shadow-lg dark:shadow-xl dark:sm:border-[hsla(240,11%,18%)] mb-10"
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: {
          xs: "calc(100vw - 10px)!important",
          sm: "370px!important",
        },
        height: "100%",
        flex: {
          xs: "0 0 calc(100vw - 10px)!important",
          sm: "0 0 370px!important",
        },
        p: 3,
        pt: { xs: 0, sm: 3 },
        px: checkList ? 4 : 2,
        ...(trigger && {
          border: "none !important",
          boxShadow: "none !important",
        }),
        borderRadius: 5,
        ...(checkList && {
          flex: "0 0 100%!important",
          maxWidth: { xs: "100%", sm: "800px" },
          width: "100%!important",
          boxShadow: "none!important",
          border: "none!important",
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
              gap: 1.5,
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
                mx: { xs: 1, sm: 0 },
                mt: 1,
              }}
            >
              <Tooltip title={column.name} followCursor>
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: { xs: "nowrap", sm: "unset" },
                    textOverflow: { xs: "ellipsis", sm: "unset" },
                    overflow: { xs: "hidden", sm: "unset" },
                    maxWidth: { xs: "100%", sm: "unset" },
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
                {columnTasks.filter((task) => task.completed).length}{" "}
                {columnTasks.length !== 0 && " out of "}
                {columnTasks.length == 0 ? "" : columnTasks.length}{" "}
                {columnTasks.length == 0 ? "tasks" : "completed"}
              </Typography>
            </Box>
            <FilterMenu
              originalTasks={column.tasks.filter(
                (task) => task.parentTasks.length === 0
              )}
              board={board}
              columnTasks={columnTasks}
              setColumnTasks={setColumnTasks}
            />
            <OptionsMenu
              board={board}
              column={column}
              mutationUrl={mutationUrl}
              setCurrentColumn={setCurrentColumn}
            />
          </Box>
        )}
      </Box>
      <Box>
        {!board.archived &&
          !(
            columnTasks.filter((task) => task.completed).length ==
              columnTasks.length && columnTasks.length >= 1
          ) && (
            <div onClick={() => setIsHovered(false)}>
              <CreateTask
                isHovered={isHovered}
                column={column}
                tasks={tasks}
                checkList={checkList}
                mutationUrl={mutationUrl}
                boardId={board.id}
              />
            </div>
          )}

        {columnTasks
          .filter((task) => !task.completed)
          .sort((x, y) => (x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1))
          .map((task, i) => (
            <Task
              key={i}
              checkList={checkList}
              task={task}
              mutationUrl={mutationUrl}
              board={board}
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
              <div onClick={() => setIsHovered(false)}>
                <CreateTask
                  isHovered={isHovered}
                  column={column}
                  tasks={tasks}
                  checkList={checkList}
                  mutationUrl={mutationUrl}
                  boardId={board.id}
                />
              </div>
            </Box>
          )}
        <CompletedTasks
          checkList={checkList}
          mutationUrl={mutationUrl}
          board={board}
          columnTasks={columnTasks}
          column={column}
        />
      </Box>
    </Box>
  );
});
