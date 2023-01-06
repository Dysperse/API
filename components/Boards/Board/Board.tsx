import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { colors } from "../../../lib/colors";
import { ErrorHandler } from "../../Error";
import { Column } from "./Column";
import { CreateColumn } from "./Column/Create";

function BoardSettings({ mutationUrl, board }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(board.name);
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
            p: 2,
            borderRadius: { xs: "20px 20px 0 0", sm: 5 },
            mb: { sm: 5 },
          },
        }}
      >
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
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            sx={{ gap: 2 }}
            variant="outlined"
            fullWidth
            onClick={async () => {
              if (!confirm("Delete board?")) return;
              try {
                await fetchApiWithoutHook("property/boards/deleteBoard", {
                  id: board.id,
                });
                await mutate(mutationUrl);
                setOpen(false);
              } catch (e) {
                toast.error("An error occurred while deleting the board");
              }
            }}
          >
            <Icon className="outlined">delete</Icon>
            Delete
          </Button>
          <Button
            sx={{ gap: 2 }}
            variant="contained"
            fullWidth
            onClick={() => {
              if (title !== board.name && title.trim() !== "") {
                toast.promise(
                  fetchApiWithoutHook("property/boards/renameBoard", {
                    id: board.id,
                    name: title,
                  }).then(() => mutate(mutationUrl)),
                  {
                    loading: "Renaming...",
                    success: "Renamed board",
                    error: "An error occurred while renaming the board",
                  }
                );
              }
            }}
          >
            <Icon className="outlined">edit</Icon>
            Save
          </Button>
        </Box>
      </SwipeableDrawer>
      <IconButton
        disableRipple
        size="small"
        onClick={() => setOpen(true)}
        sx={{
          transition: "none",
          "&:hover": {
            background: colors[themeColor][50] + "!important",
          },
          "&:active": {
            background: colors[themeColor][100] + "!important",
          },
          // ml: "auto",
        }}
      >
        <Icon className="outlined">edit</Icon>
      </IconButton>
    </>
  );
}
function Renderer({ data, url, board }) {
  return (
    <>
      {data &&
        data.map((column) => (
          <Column
            key={column.id}
            tasks={
              /**
               * Return all tasks in boards, which contain columns containing tasks
               */
              data.map((column) => column.tasks).flat()
            }
            checkList={board.columns.length == 1}
            mutationUrl={url}
            boardId={board.id}
            column={column}
          />
        ))}
    </>
  );
}

export const Board = React.memo(function Board({
  setDrawerOpen,
  board,
  collapsed,

  mutationUrl,
}: any) {
  const { data, url, error } = useApi("property/boards/tasks", {
    id: board.id,
  });
  const [starred, setStarred] = React.useState(board.starred || false);

  return (
    <Box
      sx={{
        pb: 2,
        ml: { sm: collapsed ? -2 : -1 },
      }}
    >
      <Box
        sx={{
          position: { sm: "sticky" },
          top: "0",
          borderBottom: "1px solid rgba(200,200,200,.3)",
          background: "rgba(255,255,255,.7)",
          zIndex: 1,
          p: 2,
          maxWidth: "100vw",
          pt: 3,
          px: 4,
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
          }}
        >
          <Typography
            variant="h5"
            onClick={() => setDrawerOpen(true)}
            sx={{
              fontWeight: 600,
              lineHeight: 1.5,
              letterSpacing: 0.15,
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: "100%",
              px: 1,
              mb: 0.2,
              color: "#404040",
              cursor: "auto!important",
              userSelect: "none",
              "&:hover": {
                color: "#303030",
                background: "rgba(200,200,200,.3)",
              },
              "&:active": {
                color: "#000",
                background: "rgba(200,200,200,.4)",
              },

              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {board.name}
            <Icon>expand_more</Icon>
          </Typography>
          <Box
            sx={{
              display: "flex",
              pt: 0.5,
              gap: 1,
              ml: 0.5,
              alignItems: "center",
            }}
          >
            <Chip
              sx={{
                display:
                  data && data.map((column) => column.tasks).flat().length > 0
                    ? "flex"
                    : "none",
              }}
              size="small"
              label={
                (data ? data.map((column) => column.tasks).flat().length : 0) +
                " task" +
                "   •   " +
                (data
                  ? data
                      .map((column) => column.tasks)
                      .flat()
                      .filter((task) => task.completed).length
                  : 0) +
                " completed"
              }
            />
            <Chip
              size="small"
              sx={{
                display:
                  data && data.map((column) => column.tasks).flat().length > 0
                    ? "flex"
                    : "none",
                color: "success.main",
                background: colors.green["50"],
              }}
              label={
                // Calculate percentage of completed tasks
                data
                  ? (
                      (data
                        .map((column) => column.tasks)
                        .flat()
                        .filter((task) => task.completed).length /
                        data.map((column) => column.tasks).flat().length) *
                      100
                    ).toFixed(0) + "% complete"
                  : "0%"
              }
            />
          </Box>
        </Box>
        <IconButton
          size="small"
          disableRipple
          onClick={() => setStarred(!starred)}
          sx={{
            transition: "none",
            "&:hover": {
              background: colors[themeColor][50] + "!important",
            },
            ml: "auto",
            flex: "0 0 auto",

            // display: { xs: "none", sm: "inline-flex" },
          }}
        >
          <Icon className={starred ? "" : "outlined"}>star</Icon>
        </IconButton>
        <BoardSettings board={board} mutationUrl={mutationUrl} />
      </Box>
      <Box sx={{ overflowX: "scroll", mt: 4 }} id="taskContainer">
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your tasks" />
        )}
        <Box
          sx={{
            maxWidth: "100vw",
            pl: data && board.columns.length === 1 ? 0 : 4,
            pr: data ? 0 : 4,
          }}
        >
          <Box
            sx={{
              ...(board.columns.length !== 1
                ? {
                    display: "flex",
                    gap: "10px",
                  }
                : {
                    mt: -3,
                  }),
            }}
          >
            <Renderer data={data} url={url} board={board} />
            {data ? (
              <>
                {board.columns.length !== 1 && data.length < 5 && (
                  <CreateColumn id={board.id} mutationUrl={url} />
                )}
                </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={500}
                  sx={{ width: "350px", flex: "0 0 350px", borderRadius: 5 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
