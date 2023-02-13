import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Icon,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";
import { Agenda } from "./Agenda";
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
            gap: 1.5,
          }}
        >
          <Icon
            sx={{
              opacity: activeTab === board.id ? 1 : 0.8,
            }}
          >
            tag
          </Icon>
          <span
            style={{
              maxWidth: "calc(100% - 25px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: activeTab === board.id ? 1 : 0.9,
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
    if (data && data[0] && data.find((board) => board.pinned)) {
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
      } else {
        setActiveTab("__agenda.week");
      }
    }
  }, [data]);

  const styles = (condition: boolean) => ({
    transition: "none!important",
    px: 1.5,
    cursor: "unset!important",
    gap: 1.5,
    py: 1,
    width: "100%",
    justifyContent: "flex-start",
    borderRadius: 4,
    mr: 1,
    mb: 0.5,
    fontSize: "15px",
    ...(global.user.darkMode && {
      color: "hsl(240,11%, 80%)",
    }),
    "&:hover, &:focus": {
      background: global.user.darkMode
        ? "hsl(240,11%,15%)"
        : `hsl(240,11%,95%)!important`,
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...(!condition
      ? {
          "&:hover": {
            background: global.user.darkMode
              ? "hsl(240,11%,20%)"
              : `hsl(240,11%,93%)!important`,
          },
          color: global.user.darkMode
            ? "hsl(240,11%,80%)!important"
            : `hsl(240,11%,30%)!important`,
        }
      : {
          background: global.user.darkMode
            ? "hsl(240,11%,20%)!important"
            : `hsl(240,11%,85%)!important`,
          "&:hover, &:focus": {
            background: global.user.darkMode
              ? "hsl(240,11%,20%)!important"
              : `hsl(240,11%,85%)!important`,
          },
          color: global.user.darkMode
            ? "hsl(240,11%,95%)!important"
            : `hsl(240,11%,10%)!important`,
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
  useHotkeys("alt+w", (e) => {
    e.preventDefault();
    document.getElementById("__agenda.week")?.click();
  });
  useHotkeys("alt+m", (e) => {
    e.preventDefault();
    document.getElementById("__agenda.month")?.click();
  });
  useHotkeys("alt+y", (e) => {
    e.preventDefault();
    document.getElementById("__agenda.year")?.click();
  });

  useHotkeys("alt+q", (e) => {
    e.preventDefault();
    menuRef.current?.click();
  });

  const [archiveOpen, setArchiveOpen] = useState(false);

  const children = (
    <>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}

      <Typography
        sx={{
          mb: 1,
          opacity: 0.5,
          fontSize: "13px",
          px: 1.5,
          color: global.user.darkMode ? "#fff" : "#000",
          userSelect: "none",
        }}
      >
        Planner
      </Typography>
      <Box onClick={() => setOpen(false)}>
        <Button
          id="__agenda.week"
          size="large"
          disableRipple
          sx={styles(activeTab === "__agenda.week")}
          onMouseDown={() => setActiveTab("__agenda.week")}
          onClick={() => setActiveTab("__agenda.week")}
        >
          <Icon className={activeTab === "__agenda.week" ? "" : "outlined"}>
            view_week
          </Icon>
          This week
        </Button>
        <Button
          id="__agenda.month"
          size="large"
          disableRipple
          sx={styles(activeTab === "__agenda.month")}
          onMouseDown={() => setActiveTab("__agenda.month")}
          onClick={() => setActiveTab("__agenda.month")}
        >
          <Icon className={activeTab === "__agenda.month" ? "" : "outlined"}>
            calendar_view_month
          </Icon>
          Months
        </Button>
        <Button
          id="__agenda.year"
          size="large"
          disableRipple
          sx={styles(activeTab === "__agenda.year")}
          onMouseDown={() => setActiveTab("__agenda.year")}
          onClick={() => setActiveTab("__agenda.year")}
        >
          <Icon className={activeTab === "__agenda.year" ? "" : "outlined"}>
            calendar_month
          </Icon>
          Years
        </Button>
      </Box>
      <Divider
        sx={{
          my: 1,
          width: "90%",
          mx: "auto",
          opacity: 0.6,
          ...(data && data.length === 0 && { display: "none" }),
        }}
      />
      <Typography
        sx={{
          my: 1,
          opacity: 0.5,
          ...(data && data.length === 0 && { display: "none" }),
          fontSize: "13px",
          userSelect: "none",
          px: 1.5,
          color: global.user.darkMode ? "#fff" : "#000",
        }}
      >
        Boards
      </Typography>
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
      <Divider
        sx={{
          mb: 1,
          ...(data &&
            (data.length === 0 || !data.find((board) => board.archived)) && {
              display: "none",
            }),
          width: "90%",
          mx: "auto",
          opacity: 0.6,
        }}
      />
      <Button
        size="large"
        disableRipple
        onClick={() => setArchiveOpen(!archiveOpen)}
        sx={{
          ...styles(false),
          ...(data &&
            (data.length === 0 || !data.find((board) => board.archived)) && {
              display: "none",
            }),
        }}
      >
        Archived
        <Icon sx={{ ml: "auto" }}>
          {archiveOpen ? "expand_less" : "expand_more"}
        </Icon>
      </Button>
      <Collapse in={archiveOpen} orientation="vertical">
        {data &&
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
      </Collapse>
      <Divider
        sx={{
          mb: 1,
          display: { sm: "none" },
          ...(data &&
            (data.length === 0 || !data.find((board) => board.archived)) && {
              display: "none",
            }),
          width: "90%",
          mx: "auto",
          opacity: 0.6,
        }}
      />
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
        <Tooltip title="Toggle menu visibility (alt • q)">
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
        background: global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
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
        sx={{
          width: { xs: "100%", sm: 300 },
          flex: { xs: "100%", sm: "0 0 250px" },
          ml: -1,
          p: 3,
          background: global.user.darkMode
            ? "hsl(240,11%,7%)"
            : "hsl(240,11%,95%)",
          display: collapsed ? "none" : { xs: "none", sm: "flex" },
          minHeight: "100vh",
          height: { sm: "100vh" },
          overflowY: { sm: "scroll" },
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          maxHeight: { sm: "100vh" },
          minHeight: { sm: "100vh" },
          height: { sm: "100vh" },
          overflowY: { sm: "auto" },
          flexGrow: 1,
          // overflow:"sh"
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
        {activeTab.includes("__agenda.week") && (
          <Agenda setDrawerOpen={setOpen} view="week" />
        )}
        {activeTab.includes("__agenda.month") && (
          <Agenda setDrawerOpen={setOpen} view="month" />
        )}
        {activeTab.includes("__agenda.year") && (
          <Agenda setDrawerOpen={setOpen} view="year" />
        )}
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
