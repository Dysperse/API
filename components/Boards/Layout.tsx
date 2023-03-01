import {
  Box,
  Button,
  Collapse,
  Divider,
  Icon,
  SwipeableDrawer,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useApi } from "../../hooks/useApi";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useAccountStorage } from "../../pages/_app";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";
import { Agenda } from "./Agenda";
import { Board } from "./Board/Board";
import { CreateBoard } from "./Board/Create";
import { Loading } from "./Loading";
import { Tab } from "./Tab";

export function TasksLayout() {
  const { data, url, error } = useApi("property/boards");
  const [activeTab, setActiveTab] = useState("loading");
  const storage = useAccountStorage();

  useEffect(() => {
    if (!data) {
      setActiveTab("__agenda.week");
      return;
    }

    const pinnedBoard = data.find((board) => board.pinned);
    if (pinnedBoard) {
      const hashBoard = data.find(
        (x) => x.id === window.location.hash?.replace("#", "")
      );
      if (hashBoard) {
        setActiveTab(window.location.hash?.replace("#", ""));
      } else {
        setActiveTab(data[0].id);
      }
    } else if (!data[0]) {
      setActiveTab("new");
    } else {
      setActiveTab("__agenda.week");
    }

    switch (window.location.hash) {
      case "#/agenda/week":
        setActiveTab("__agenda.week");
        break;
      case "#/agenda/month":
        setActiveTab("__agenda.month");
        break;
      case "#/agenda/year":
        setActiveTab("__agenda.year");
        break;
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
  const [open, setOpen] = useState(false);

  const ref: any = useRef();

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
          sx={styles(activeTab === "__agenda.week")}
          onMouseDown={() => setActiveTab("__agenda.week")}
          onClick={() => {
            window.location.hash = "#/agenda/week";
            setActiveTab("__agenda.week");
          }}
        >
          <Icon className={activeTab === "__agenda.week" ? "" : "outlined"}>
            view_week
          </Icon>
          This week
        </Button>
        <Button
          id="__agenda.month"
          size="large"
          sx={styles(activeTab === "__agenda.month")}
          onMouseDown={() => setActiveTab("__agenda.month")}
          onClick={() => {
            window.location.hash = "#/agenda/month";
            setActiveTab("__agenda.month");
          }}
        >
          <Icon className={activeTab === "__agenda.month" ? "" : "outlined"}>
            calendar_view_month
          </Icon>
          Months
        </Button>
        <Button
          id="__agenda.year"
          size="large"
          sx={styles(activeTab === "__agenda.year")}
          onMouseDown={() => setActiveTab("__agenda.year")}
          onClick={() => {
            window.location.hash = "#/agenda/year";
            setActiveTab("__agenda.year");
          }}
        >
          <Icon className={activeTab === "__agenda.year" ? "" : "outlined"}>
            calendar_month
          </Icon>
          Years
        </Button>
      </Box>
      <Divider
        sx={{
          my: { xs: 2, md: 1 },
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
          mb: { xs: 2, md: 1 },
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
          ...(!data ||
            (data &&
              (data.length === 0 || !data.find((board) => board.archived)) && {
                display: "none",
              })),
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
          display: { md: "none" },
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
        <Tooltip title="alt • c" placement="right">
          <Button
            disabled={storage?.isReached === true}
            ref={ref}
            size="large"
            onClick={() => {
              setOpen(false);
              setActiveTab("new");
            }}
            sx={{
              ...styles(activeTab === "new"),
              px: 2,
              ...(storage?.isReached === true && { opacity: 0.5 }),
              justifyContent: "start",
            }}
          >
            <Icon
              className={activeTab === "new" ? "" : "outlined"}
              sx={{ ml: -0.5 }}
            >
              add_circle
            </Icon>
            Create
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
            maxHeight: "90vh",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 1 }}>{children}</Box>
      </SwipeableDrawer>
      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          flex: { xs: "100%", md: "0 0 250px" },
          ml: -1,
          p: 3,
          background: global.user.darkMode
            ? "hsl(240,11%,7%)"
            : "hsl(240,11%,95%)",
          display: { xs: "none", md: "flex" },
          minHeight: "100vh",
          height: { md: "100vh" },
          overflowY: { md: "scroll" },
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          maxHeight: { md: "100vh" },
          minHeight: { md: "100vh" },
          height: { md: "100vh" },
          overflowY: { md: "auto" },
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
                />
              )
          )}
      </Box>
    </Box>
  );
}
