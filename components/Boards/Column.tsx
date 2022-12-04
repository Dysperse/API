import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CreateTask } from "./CreateTask";
import { Task } from "./Task";
import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { colors } from "../../lib/colors";
import { fetchApiWithoutHook } from "../../hooks/useApi";
import { mutate } from "swr";
import TextField from "@mui/material/TextField";
import EmojiPicker from "emoji-picker-react";

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
          elevation: 0,
          sx: {
            width: "100%",
            maxWidth: "50vw",
            borderRadius: "20px 20px 0 0",
            mx: "auto",
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
      <Button onClick={() => setOpen(true)} className="bg-gray-50">
        <img src={emoji} alt="emoji" width="30" height="30" />
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
          elevation: 0,
          sx: {
            maxWidth: "400px",
            maxHeight: "400px",
            width: "auto",
            p: 1,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mx: "auto",
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
            <img src={column.emoji} alt="emoji" width="30" height="30" />
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
              <span className="material-symbols-outlined">edit</span>
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
              <span className="material-symbols-outlined">delete</span>
              Delete column
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
              <span className="material-symbols-outlined">cancel</span>
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
              disableElevation
              variant="contained"
              onClick={() => setEditMode(true)}
            >
              <span className="material-symbols-outlined">check</span>
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
          border: "1px solid rgba(200, 200, 200, 0)!important",
          "&:hover,&:active": {
            color: "#000",
            border: "1px solid rgba(200, 200, 200, 0.5)!important",
          },
        }}
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </IconButton>
    </>
  );
}

export const Column = React.memo(function ({
  checkList,
  mutationUrl,
  boardId,
  column,
}: any) {
  return (
    <Box
      className="w-[350px] bg-neutral-100 mb-10 dark:bg-[hsl(240,11%,13%)]"
      sx={{
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
      {!checkList && (
        <Box sx={{ px: 1 }}>
          <img src={column.emoji} />
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              mb: 2,
              mt: 2,
              textDecoration: "underline",
            }}
          >
            {column.name}
          </Typography>
          <OptionsMenu
            boardId={boardId}
            column={column}
            mutationUrl={mutationUrl}
          />
        </Box>
      )}
      {column.tasks
        .filter((task) => task.parentTasks.length === 0)
        .map((task) => (
          <Task
            checkList={checkList}
            task={task}
            mutationUrl={mutationUrl}
            boardId={boardId}
            columnId={column.id}
          />
        ))}

      <CreateTask
        checkList={checkList}
        mutationUrl={mutationUrl}
        boardId={boardId}
        columnId={column.id}
      />
    </Box>
  );
});
