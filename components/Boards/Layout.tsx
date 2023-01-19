import {
  Box,
  Button,
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  SwipeableDrawer,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { ConfirmationModal } from "../ConfirmationModal";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";
import { Board } from "./Board/Board";
import { CreateBoard } from "./Board/Create";

function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        minHeight: "500px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        disableShrink
        sx={{
          animationDuration: ".5s",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
    </Box>
  );
}

const Tab = React.memo(function Tab({
  mutationUrl,
  styles,
  activeTab,
  setDrawerOpen,
  setActiveTab,
  board,
}: any) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(board.name);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!editMode) event.preventDefault();
    setAnchorEl(event.currentTarget);
    navigator.vibrate(50);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
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
            handleClose();
            setEditMode(true);
            setTimeout(() => {
              document.getElementById(`renameInput${board.id}`)?.focus();
            }, 100);
          }}
        >
          <Icon>edit</Icon>
          Rename
        </MenuItem>
        <ConfirmationModal
          title="Delete board?"
          question="Are you sure you want to delete this board? This action annot be undone"
          callback={async () => {
            await fetchApiWithoutHook("property/boards/deleteBoard", {
              id: board.id,
            });
            await mutate(mutationUrl);
            handleClose();
          }}
        >
          <MenuItem
            sx={{
              display: "flex",
              minWidth: "100px",
            }}
          >
            <Icon>delete</Icon>
            Delete board
          </MenuItem>
        </ConfirmationModal>
      </Menu>
      <Button
        size="large"
        disableRipple
        onContextMenu={handleClick}
        onClick={(e) => {
          setDrawerOpen(false);
          window.location.hash = board.id;
          if (activeTab === board.id && !editMode) {
            handleClick(e);
          } else {
            setActiveTab(board.id);
          }
        }}
        sx={styles(activeTab === board.id)}
      >
        {!editMode ? (
          <Box
            sx={{
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon className={activeTab === board.id ? "rounded" : "outlined"}>
              {board.columns.length === 1 ? "check_circle" : "view_kanban"}
            </Icon>
            {board.name}
          </Box>
        ) : (
          <input
            id={`renameInput${board.id}`}
            onBlur={async () => {
              setEditMode(false);
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
            style={{
              outline: 0,
              border: 0,
              background: colors[themeColor][600],
              boxShadow: `0px 0px 0px 5px ${colors[themeColor][600]}`,
              fontWeight: "500",
              fontSize: "15px",
              borderRadius: 9,
              color: "#fff",
              width: `${title.length}ch`,
              minWidth: "100px",
            }}
            placeholder="Board title"
            value={title}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
              if (e.key === "Escape") {
                setEditMode(false);
                setTitle(board.name);
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        {/* {activeTab === board.id && <Icon>more_vert</Icon>} */}
      </Button>
    </div>
  );
});

export function TasksLayout() {
  const { data, url, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState("loading");
  useEffect(() => {
    if (data && data[0]) {
      if (
        window.location.hash &&
        data.filter((x) => x.id === window.location.hash.replace("#", ""))
          .length > 0
      ) {
        setActiveTab(window.location.hash.replace("#", ""));
      } else {
        setActiveTab(data[0].id);
      }
    } else {
      if (data && !data[0]) {
        setActiveTab("new");
      }
    }
  }, [data]);

  const styles = (condition: boolean) => ({
    transition: "none!important",
    px: 2,
    gap: 1.5,
    py: 1,
    width: "100%",
    justifyContent: "flex-start",
    borderRadius: 4,
    mr: 1,
    mb: 1,
    fontSize: "15px",
    ...(global.user.darkMode && {
      color: "hsl(240,11%, 80%)",
    }),
    "&:hover, &:focus": {
      background: global.user.darkMode
        ? "hsl(240,11%,15%)"
        : `${colors[themeColor][50]}!important`,
    },
    border: "1px solid transparent",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:active": {
      border: `1px solid ${
        global.user.darkMode ? "hsl(240,11%,25%)" : colors[themeColor][200]
      }!important`,
    },
    ...(!condition && {
      "&:hover": {
        background: global.user.darkMode
          ? "hsl(240,11%,15%)"
          : `${colors[themeColor][50]}!important`,
        border: `1px solid ${
          global.user.darkMode ? "hsl(240,11%,25%)" : colors[themeColor][100]
        }`,
      },
    }),
    ...(condition && {
      background: global.user.darkMode
        ? "hsl(240,11%,20%)!important"
        : `${colors[themeColor][100]}!important`,
      "&:hover, &:focus": {
        background: global.user.darkMode
          ? "hsl(240,11%,25%)!important"
          : `${colors[themeColor][100]}!important`,
        border: `1px solid ${
          global.user.darkMode ? "hsl(240,11%,25%)" : colors[themeColor][100]
        }!important`,
      },
      color: global.user.darkMode
        ? "hsl(240,11%,95%)!important"
        : `${colors[themeColor][900]}!important`,
    }),
  });
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const children = (
    <>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}
      {data &&
        data.map((board) => (
          <Tab
            setDrawerOpen={setOpen}
            key={board.id}
            styles={styles}
            activeTab={activeTab}
            board={board}
            setActiveTab={setActiveTab}
            mutationUrl={url}
          />
        ))}
      <Box
        sx={{
          display: "flex",
          mt: "auto",
          mb: -2,
        }}
      >
        <Button
          size="large"
          onClick={() => {
            setOpen(false);
            setActiveTab("new");
          }}
          disableRipple
          sx={{
            ...styles(activeTab === "new"),
            px: 2,
            justifyContent: { xs: "start", sm: "center" },
          }}
        >
          <Icon className={activeTab === "new" ? "" : "outlined"}>
            add_circle
          </Icon>
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            Create board
          </Box>
        </Button>
        <Button
          size="large"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          disableRipple
          sx={{
            ...styles(false),
            px: 2,
            display: { xs: "none", sm: "block" },
            justifyContent: "center",
          }}
        >
          <Icon
            className={activeTab === "new" ? "" : "outlined"}
            sx={{
              transform: collapsed
                ? "rotate(180deg) scale(1.1)"
                : "rotate(0deg) scale(1)",
              mb: -1,
              transition: "transform 0.3s",
            }}
          >
            menu_open
          </Icon>
        </Button>
      </Box>
    </>
  );

  useStatusBar(open);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <SwipeableDrawer
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            maxWidth: "600px",
            width: "100%",
            pb: 2,
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 1 }}>{children}</Box>
      </SwipeableDrawer>
      <Box
        onDoubleClick={() => {
          setCollapsed(true);
          toast.success(
            <>
              Toggle the sidebar by clicking on the board name
              <Button size="small" onClick={() => setCollapsed(false)}>
                Undo
              </Button>
            </>
          );
        }}
        sx={{
          width: { xs: "100%", sm: 300 },
          flex: { xs: "100%", sm: "0 0 250px" },
          ml: -1,
          p: 3,
          display: collapsed
            ? "none"
            : { xs: "none", sm: data && data.length === 0 ? "none" : "flex" },
          minHeight: "calc(100vh - var(--navbar-height))",
          height: { sm: "calc(100vh - var(--navbar-height))" },
          overflowY: { sm: "scroll" },
          flexDirection: "column",
          borderRight: {
            sm: global.user.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
          },
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          maxHeight: { sm: "calc(100vh - var(--navbar-height))" },
          minHeight: { sm: "calc(100vh - var(--navbar-height))" },
          height: { sm: "calc(100vh - var(--navbar-height))" },
          overflowY: { sm: "auto" },
          flexGrow: 1,
        }}
      >
        {activeTab === "new" && (
          <CreateBoard
            mutationUrl={url}
            setDrawerOpen={setOpen}
            length={data ? data.length : 0}
          />
        )}
        {activeTab === "loading" && <Loading />}
        {data &&
          data.map(
            (board) =>
              activeTab === board.id && (
                <Board
                  mutationUrl={url}
                  board={board}
                  setDrawerOpen={setOpen}
                  collapsed={collapsed}
                />
              )
          )}
      </Box>
    </Box>
  );
}
