import LoadingButton from "@mui/lab/LoadingButton";
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
  CardActionArea,
  Divider,
  Icon,
  IconButton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";

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
        <Box>
          <Divider
            sx={{
              my: open ? 1.5 : 0.5,
              transition: "all .2s",
              opacity: open ? 1 : 0,
            }}
          />
          <CardActionArea
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
              justifyContent: "space-between",
            }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Typography sx={{ fontWeight: "700" }}>
              Completed ({columnTasks.filter((task) => task.completed).length})
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
                autoComplete="off"
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

function OptionsMenu({ mutationUrl, boardId, column }) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const styles = {
    width: "100%",
    borderRadius: 5,
    transition: "none!important",
    justifyContent: "start",
    gap: 2,
    "&:hover": {
      backgroundColor: colors[themeColor]["100"] + "!important",
    },
  };
  const [editMode, setEditMode] = React.useState(false);
  const [title, setTitle] = React.useState(column.name);
  const [emoji, setEmoji] = React.useState(column.emoji);

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
            borderBottom: "1px solid #e0e0e0",
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
            <Button sx={styles} size="large" onClick={() => setEditMode(true)}>
              <Icon className="outlined">edit</Icon>
              Edit
            </Button>
            <LoadingButton
              loading={loading}
              sx={styles}
              size="large"
              onClick={async () => {
                setLoading(true);
                await fetchApiWithoutHook("property/boards/deleteColumn", {
                  id: column.id,
                });
                await mutate(mutationUrl);
                setLoading(false);
                setOpen(false);
              }}
            >
              <Icon className="outlined">delete</Icon> Delete column
            </LoadingButton>
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
              onClick={() => setEditMode(true)}
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
          transition: "none!important",
          "&:hover,&:active": {
            color: "#000",
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

  return (
    <Box
      className="w-[350px] bg-neutral-100 border border-gray-200 mb-10 dark:bg-[hsl(240,11%,13%)]"
      sx={{
        position: "relative",
        width: "350px",
        flex: "0 0 350px",
        p: 3,
        pt: 4,
        px: checkList ? 4 : 2,
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
          mb: 2,
        }}
      >
        {!checkList && (
          <Box sx={{ px: 1 }}>
            <picture>
              <img src={column.emoji} alt="emoji" />
            </picture>
          </Box>
        )}
        {!checkList && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              px: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                className="font-secondary"
                sx={{
                  fontWeight: "600",
                  mb: 1,
                  mt: 2,
                  textDecoration: "underline",
                }}
              >
                {column.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "400",
                  mt: 1,
                }}
              >
                {columnTasks.filter((task) => task.completed).length} out of{" "}
                {columnTasks.length} completed
              </Typography>
            </Box>
            <OptionsMenu
              boardId={boardId}
              column={column}
              mutationUrl={mutationUrl}
            />
          </Box>
        )}
      </Box>
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
        tasks={tasks}
        checkList={checkList}
        mutationUrl={mutationUrl}
        boardId={boardId}
        columnId={column.id}
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
  );
});
