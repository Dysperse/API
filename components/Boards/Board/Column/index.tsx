import EmojiPicker from "emoji-picker-react";
import React, { cloneElement } from "react";
import { mutate } from "swr";
import { fetchApiWithoutHook } from "../../../../hooks/useApi";
import { Task } from "./Task";
import { CreateTask } from "./Task/Create";

import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  ListItem,
  Menu,
  MenuItem,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import toast from "react-hot-toast";
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
      <Divider sx={{ my: 2 }} />
      <ListItem
        tabIndex={0}
        className="task mb-2 flex border-none"
        sx={{
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
          sx={{
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            py: 1,
          }}
        >
          <span>Completed</span>
          <Chip
            sx={{
              ml: 1.5,
              px: 0.5,
            }}
            label={columnTasks.filter((task) => task.completed).length}
            size="small"
          />
        </Typography>
        <Icon
          sx={{
            transition: "transform .2s",
            transform: open ? "rotate(-180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </Icon>
      </ListItem>
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
            className: "task",
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
            sx: {
              mb: 1,
              px: "15px!important",
              py: "5px!important",
            },
          }}
        />
        {open &&
          columnTasks
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
        sx={{
          zIndex: 9999999,
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

function FilterMenu({
  children,
  originalTasks,
  columnTasks,
  setColumnTasks,
  board,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const trigger = cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: "-3px!important",
            ml: "7px!important",
          },
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
      {trigger}
    </>
  );
}

function OptionsMenu({
  columnTasks,
  setColumnTasks,
  setCurrentColumn,
  mutationUrl,
  column,
  board,
}) {
  const [open, setOpen] = React.useState(false);
  const styles = {
    ml: "auto",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
  };
  const trigger = useMediaQuery("(max-width: 600px)");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [title, setTitle] = React.useState(column.name);
  const [emoji, setEmoji] = React.useState(column.emoji);
  const ref: any = React.useRef();
  const buttonRef: any = React.useRef();
  useStatusBar(open);
  const triggerRef: any = React.useRef();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const children = (
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
            global.user.darkMode ? "hsla(240,11%,25%,50%)" : "#e0e0e0"
          }`,
        }}
      >
        <EmojiPickerModal
          emoji={emoji}
          setEmoji={setEmoji}
          lazyLoadEmojis={true}
        />
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
      </Box>

      <Box sx={{ display: "flex" }}>
        <Button
          ref={buttonRef}
          sx={styles}
          size="large"
          onClick={async () => {
            toast.promise(
              fetchApiWithoutHook("property/boards/column/edit", {
                id: column.id,
                name: title,
                emoji: emoji,
              }).then(() => mutate(mutationUrl)),
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
  );

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        sx={{
          zIndex: 9999999,
        }}
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
        {children}
      </SwipeableDrawer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <FilterMenu
          originalTasks={column.tasks.filter(
            (task) => task.parentTasks.length === 0
          )}
          board={board}
          columnTasks={columnTasks}
          setColumnTasks={setColumnTasks}
        >
          <MenuItem className="sortMenu">
            <Icon className="outlined">filter_list</Icon>
            Sort
            <Icon className="outlined" sx={{ ml: "auto" }}>
              chevron_right
            </Icon>
          </MenuItem>
        </FilterMenu>

        <MenuItem onClick={() => setOpen(true)}>
          <Icon className="outlined">edit</Icon>Edit
        </MenuItem>
        <MenuItem disabled>
          <Icon className="outlined">east</Icon>Move right
        </MenuItem>
        <MenuItem disabled>
          <Icon className="outlined">west</Icon>Move left
        </MenuItem>
        <ConfirmationModal
          title="Delete column?"
          question="Are you sure you want to delete this column? This action annot be undone."
          callback={async () => {
            await fetchApiWithoutHook("property/boards/column/delete", {
              id: column.id,
            });
            await mutate(mutationUrl);
            setOpen(false);
            setCurrentColumn((e) => e - 1);
          }}
        >
          <MenuItem onClick={() => setOpen(true)}>
            <Icon className="outlined">delete</Icon>Delete column
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      <Tooltip title="Options (e)" placement="top">
        <IconButton
          onClick={handleClick}
          ref={triggerRef}
          size="small"
          sx={{
            ml: "auto",
            flexShrink: 0,
            display: board.archived ? "none" : "",
            transition: "none!important",
            "&:hover, &:active": {
              background: global.user.darkMode
                ? "hsl(240,11%,20%)!important"
                : "rgba(200,200,200,.4)!important",
            },
            position: "relative",
            backdropFilter: "blur(10px)",
            bottom: { xs: board.columns.length ? 0 : -50, sm: 0 },
          }}
        >
          <Icon className="outlined">edit</Icon>
        </IconButton>
      </Tooltip>
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

  return (
    <Box
      className="mb-10 w-[370px] border border-gray-200 shadow-lg dark:border-[hsla(240,11%,18%)] dark:shadow-xl sm:mb-0"
      sx={{
        borderRight: "1px solid",
        borderColor: global.user.darkMode
          ? "hsl(240,11%,16%)"
          : "rgba(200,200,200,.2)",
        zIndex: 1,
        flexGrow: 1,
        flexBasis: 0,
        ml: "-1px",
        minHeight: { sm: "100vh" },
        overflowY: "scroll",
        minWidth: { xs: "100vw", sm: "320px" },
        transition: "filter .2s",
      }}
    >
      <Box
        sx={{
          color: global.user.darkMode ? "#fff" : "#000",
          p: 3,
          px: 5,
          background: global.user.darkMode
            ? "hsla(240,11%,16%, 0.2)"
            : "rgba(200,200,200,.05)",
          borderBottom: "1px solid",
          borderColor: global.user.darkMode
            ? "hsla(240,11%,18%, 0.2)"
            : "rgba(200,200,200,.3)",
          userSelect: "none",
          zIndex: 9,
          backdropFilter: "blur(10px)",
          position: "sticky",
          mb: 3,
          top: 0,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <OptionsMenu
            columnTasks={columnTasks}
            setColumnTasks={setColumnTasks}
            board={board}
            column={column}
            mutationUrl={mutationUrl}
            setCurrentColumn={setCurrentColumn}
          />
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: checkList ? "none" : "inline-flex" },
            mb: { sm: 1 },
          }}
        >
          <picture>
            <img
              loading="lazy"
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
          </Box>
        )}
      </Box>
      <Box sx={{ px: 2, mb: 5 }}>
        {!board.archived &&
          !(
            columnTasks.filter((task) => task.completed).length ==
              columnTasks.length && columnTasks.length >= 1
          ) && (
            <div
              style={{
                marginBottom: "7px",
              }}
            >
              <CreateTask
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
              isAgenda
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
            <Alert
              severity="info"
              icon="🥳"
              sx={{
                color: global.user.darkMode ? "#fff" : "#000",
                background: "transparent",
              }}
              action={
                <CreateTask
                  column={column}
                  tasks={tasks}
                  checkList={checkList}
                  mutationUrl={mutationUrl}
                  boardId={board.id}
                />
              }
            >
              <Typography sx={{ width: "100%" }}>0 items remaining!</Typography>
            </Alert>
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
