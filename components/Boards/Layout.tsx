import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Icon,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { colors } from "../../lib/colors";
import { toastStyles } from "../../lib/useCustomTheme";
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
  styles,
  activeTab,
  setDrawerOpen,
  setActiveTab,
  board,
}: any) {
  const handleClick = React.useCallback(() => {
    setDrawerOpen(false);
    window.location.hash = board.id;
    setActiveTab(board.id);
  }, [board.id, setActiveTab, setDrawerOpen]);

  return (
    <div>
      <Button
        size="large"
        disableRipple
        onClick={handleClick}
        onMouseDown={handleClick}
        sx={{
          ...styles(activeTab === board.id),
          ...(board.archived &&
            activeTab !== board.id && {
              opacity: 0.6,
            }),
        }}
      >
        <Box
          sx={{
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 1,
          }}
        >
          <Icon className={activeTab === board.id ? "rounded" : "outlined"}>
            {board.columns.length === 1 ? "check_circle" : "view_kanban"}
          </Icon>
          <span
            style={{
              maxWidth: "calc(100% - 25px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {board.name}
          </span>
          {board.pinned && (
            <Icon
              className="outlined"
              sx={{
                ml: "auto",
                transform: "rotate(-45deg)",
              }}
            >
              push_pin
            </Icon>
          )}
        </Box>
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
    cursor: "unset!important",
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
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...(!condition
      ? {
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240,11%,15%)"
              : `${colors[themeColor][50]}!important`,
          },
          color: global.user.darkMode
            ? "hsl(240,11%,80%)!important"
            : `${colors[themeColor][700]}!important`,
        }
      : {
          background: global.user.darkMode
            ? "hsl(240,11%,20%)!important"
            : `${colors[themeColor][100]}!important`,
          "&:hover, &:focus": {
            background: global.user.darkMode
              ? "hsl(240,11%,25%)!important"
              : `${colors[themeColor][100]}!important`,
          },
          color: global.user.darkMode
            ? "hsl(240,11%,95%)!important"
            : `${colors[themeColor][900]}!important`,
        }),
  });
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const ref: any = useRef();
  const menuRef: any = useRef();

  useHotkeys("alt+c", (e) => {
    e.preventDefault();
    ref.current?.click();
  });
  useHotkeys("alt+m", (e) => {
    e.preventDefault();
    menuRef.current?.click();
  });

  const [archiveOpen, setArchiveOpen] = useState(false);

  const children = (
    <>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}
      {data &&
        data
          .filter((x) => !x.archived)
          .map((board) => (
            <Tab
              setDrawerOpen={setOpen}
              key={board.id}
              styles={styles}
              activeTab={activeTab}
              board={board}
              setActiveTab={setActiveTab}
            />
          ))}
      <Divider sx={{ mb: 1, width: "90%", mx: "auto", opacity: 0.6 }} />
      <Button
        size="large"
        disableRipple
        onClick={() => setArchiveOpen(!archiveOpen)}
        sx={styles(archiveOpen)}
      >
        <Icon className={archiveOpen ? "" : "outlined"}>inventory_2</Icon>
        Archived
        <Icon
          sx={{
            ml: "auto",
          }}
        >
          {archiveOpen ? "expand_less" : "expand_more"}
        </Icon>
      </Button>
      {archiveOpen &&
        data &&
        data
          .filter((x) => x.archived)
          .map((board) => (
            <Tab
              setDrawerOpen={setOpen}
              key={board.id}
              styles={styles}
              activeTab={activeTab}
              board={board}
              setActiveTab={setActiveTab}
            />
          ))}
      <Box
        sx={{
          display: "flex",
          mt: "auto",
          mb: -2,
        }}
      >
        <Tooltip title="Create board (alt • c)">
          <Button
            ref={ref}
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
        </Tooltip>
        <Tooltip title="Toggle menu visibility (alt • m)">
          <Button
            ref={menuRef}
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
        </Tooltip>
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
        disableBackdropTransition
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          sx: {
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
            </>,
            toastStyles
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
        id="boardContainer"
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
                  key={board.id}
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
