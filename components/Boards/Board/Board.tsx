import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../../hooks/useApi";
import { useStatusBar } from "../../../hooks/useStatusBar";
import { colors } from "../../../lib/colors";

import { ConfirmationModal } from "../../ConfirmationModal";
import { ErrorHandler } from "../../Error";
import { Column } from "./Column";
import { CreateColumn } from "./Column/Create";

function BoardSettings({ mutationUrl, board }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(board.name);
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
        onOpen={() => {
          setOpen(true);
          navigator.vibrate(200);
        }}
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
          autoFocus
          size="small"
          InputProps={{
            sx: {
              fontWeight: "700",
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <ConfirmationModal
            title="Delete board?"
            question="Are you sure you want to delete this board? This action annot be undone."
            callback={async () => {
              await fetchApiWithoutHook("property/boards/deleteBoard", {
                id: board.id,
              });
              await mutate(mutationUrl);
            }}
          >
            <Button variant="outlined" fullWidth>
              <Icon className="outlined">delete</Icon>
              Delete
            </Button>
          </ConfirmationModal>
          <Button
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
        size="small"
        onClick={() => setOpen(true)}
        sx={{
          transition: "none",
          "&:hover": {
            background: `${
              global.user.darkMode
                ? "hsla(240,11%,14%)"
                : colors[themeColor][50]
            }!important`,
          },
          "&:active": {
            background: `${
              global.user.darkMode
                ? "hsla(240,11%,17%)"
                : colors[themeColor][100]
            }!important`,
          },
          // ml: "auto",
        }}
      >
        <Icon className="outlined">edit</Icon>
      </IconButton>
    </>
  );
}

const Renderer = React.memo(function Renderer({ data, url, board }: any) {
  const [currentColumn, setCurrentColumn] = React.useState(0);
  const trigger = useScrollTrigger({
    threshold: 0,
    target: window ? window : undefined,
  });
  const isMobile = useMediaQuery("(max-width: 610px)");

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: trigger ? "30px" : "90px",
          transition: "bottom .3s",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(200,200,200,.3)",
          backdropFilter: "blur(5px)",
          p: 1,
          borderRadius: 9,
          left: "50%",
          transform: "translateX(-50%)",
          gap: 1.5,
          background: "rgba(255,255,255,.7)",
          zIndex: 999,
          display:
            (board && board.columns.length === 1) || !isMobile
              ? "none"
              : "flex",
        }}
      >
        <Button
          size="small"
          sx={{ borderRadius: 999, minWidth: "auto", px: 1 }}
          onClick={() => {
            setCurrentColumn(currentColumn - 1);
          }}
          disabled={currentColumn <= 0}
        >
          <Icon sx={{ color: currentColumn <= 0 ? "#aaa" : "#000" }}>
            arrow_back
          </Icon>
        </Button>
        {board.columns.length !== 1 && (
          <CreateColumn
            mobile
            id={board.id}
            mutationUrl={url}
            hide={
              (board && board.columns.length === 1) ||
              (data && data.length >= 5)
            }
          />
        )}
        <Button
          size="small"
          sx={{ borderRadius: 999, minWidth: "auto", px: 1 }}
          onClick={() => {
            setCurrentColumn(currentColumn + 1);
          }}
          disabled={currentColumn >= board.columns.length - 1}
        >
          <Icon
            sx={{
              color:
                currentColumn >= board.columns.length - 1 ? "#aaa" : "#000",
            }}
          >
            arrow_forward
          </Icon>
        </Button>
      </Box>
      {data &&
        data
          .filter((col, id) => id === currentColumn || !isMobile)
          .map((column) => (
            <Column
              key={column.id}
              tasks={data.map((column) => column.tasks).flat()}
              checkList={board.columns.length === 1}
              mutationUrl={url}
              boardId={board.id}
              column={column}
            />
          ))}
    </>
  );
});

export const Board = function Board({
  setDrawerOpen,
  board,
  collapsed,
  mutationUrl,
}: any) {
  const boardSwitcherStyles = {
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0.15,
    borderRadius: 2,
    overflow: "hidden",
    maxWidth: "100%",
    px: 1,
    mb: 0.2,
    color: global.user.darkMode ? "hsl(240,11%,70%)" : "#404040",
    cursor: "auto!important",
    userSelect: "none",
    "&:hover": {
      color: global.user.darkMode ? "hsl(240,11%,80%)" : "#303030",
      background: global.user.darkMode
        ? "hsl(240,11%,13%)"
        : "rgba(200,200,200,.3)",
    },
    "&:active": {
      color: global.user.darkMode ? "hsl(240,11%,95%)" : "#000",
      background: global.user.darkMode
        ? "hsl(240,11%,16%)"
        : "rgba(200,200,200,.4)",
    },
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  };

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
          borderBottom: global.user.darkMode
            ? "1px solid hsla(240,11%,15%)"
            : "1px solid rgba(200,200,200,.3)",
          background: global.user.darkMode
            ? "hsla(240,11%,10%)"
            : "rgba(255,255,255,.7)",
          zIndex: 1,
          p: 2,
          maxWidth: "100vw",
          pt: { xs: 1, sm: 3 },
          px: { xs: 2, sm: 4 },
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
            sx={boardSwitcherStyles}
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
            <Tooltip
              title={`${
                data
                  ? data
                      .map((column) => column.tasks)
                      .flat()
                      .filter((task) => task.completed).length
                  : 0
              } out of ${
                data ? data.map((column) => column.tasks).flat().length : 0
              } completed`}
            >
              <Chip
                sx={{
                  display:
                    !data ||
                    (data &&
                      data.map((column) => column.tasks).flat().length > 0)
                      ? "flex"
                      : "none",
                }}
                size="small"
                label={`${
                  data ? data.map((column) => column.tasks).flat().length : 0
                } items`}
              />
            </Tooltip>
            <Chip
              size="small"
              sx={{
                display:
                  !data ||
                  (data && data.map((column) => column.tasks).flat().length > 0)
                    ? "flex"
                    : "none",
                color: "success.main",
                background: global.user.darkMode
                  ? "hsl(240,11%,20%)"
                  : colors.green[50],
              }}
              label={
                // Calculate percentage of completed tasks
                data
                  ? `${(
                      (data
                        .map((column) => column.tasks)
                        .flat()
                        .filter((task) => task.completed).length /
                        data.map((column) => column.tasks).flat().length) *
                      100
                    ).toFixed(0)}% complete`
                  : "0%"
              }
            />
          </Box>
        </Box>
        <IconButton
          size="small"
          disableRipple
          onClick={() => {
            setStarred(!starred);
            toast("Coming soon!");
          }}
          sx={{
            transition: "none",
            "&:hover": {
              background: `${
                global.user.darkMode
                  ? "hsla(240,11%,14%)"
                  : colors[themeColor][50]
              }!important`,
            },
            "&:active": {
              background: `${
                global.user.darkMode
                  ? "hsla(240,11%,17%)"
                  : colors[themeColor][100]
              }!important`,
            },
            ml: "auto",
            flex: "0 0 auto",

            // display: { xs: "none", sm: "inline-flex" },
          }}
        >
          <Icon className={starred ? "" : "outlined"}>push_pin</Icon>
        </IconButton>
        <BoardSettings board={board} mutationUrl={mutationUrl} />
      </Box>

      <Box
        sx={{
          overflowX: "scroll",
          mt: data && board.columns.length === 1 ? -2 : 4,
          display: "flex",
          gap: "10px",

          maxWidth: "100vw",
          pl: data && board.columns.length === 1 ? 0 : 3,
        }}
        id="taskContainer"
        onScroll={() => {
          const container: any = document.getElementById("boardContainer");
          container.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        }}
      >
        {error && (
          <ErrorHandler error="An error occured while trying to fetch your tasks" />
        )}
        <Renderer data={data} url={url} board={board} />

        {data ? (
          <>
            {board.columns.length !== 1 && (
              <CreateColumn
                mobile={false}
                id={board.id}
                mutationUrl={url}
                hide={board.columns.length === 1 || data.length >= 5}
              />
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
              key={Math.random().toString()}
              height={500}
              sx={{
                width: "calc(100vw - 50px)",
                flex: "0 0 calc(100vw - 50px)",
                borderRadius: 5,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
