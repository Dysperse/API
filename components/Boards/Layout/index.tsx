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
  useMediaQuery,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useAccountStorage } from "../../../lib/client/useAccountStorage";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { vibrate } from "../../../lib/client/vibration";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
import { CreateBoard } from "../Board/Create";
import { Loading } from "./Loading";
import { Tab } from "./Tab";

export const taskStyles = (session) => {
  return {
    subheading: {
      my: 1,
      textTransform: "uppercase",
      fontWeight: 700,
      opacity: 0.5,
      fontSize: "13px",
      px: 1.5,
      color: session.user.darkMode ? "#fff" : "#000",
      userSelect: "none",
    },
    menu: {
      transition: "transform .2s",
      "&:active": {
        transition: "none",
        transform: "scale(0.9)",
      },
      position: "fixed",
      bottom: {
        xs: "65px",
        md: "30px",
      },
      left: "10px",
      zIndex: 9,
      background: session.user.darkMode
        ? "hsla(240,11%,14%,0.5)!important"
        : "rgba(255,255,255,.5)!important",
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      backdropFilter: "blur(10px)",
      border: {
        xs: `1px solid hsla(240,11%,${session.user.darkMode ? 50 : 10}%,.1)`,
        md: "unset",
      },
      fontWeight: "700",
      display: { md: "none" },
      fontSize: "15px",
      color: session.user.darkMode ? "#fff" : "#000",
    },
  };
};

const DynamicLoader = () => (
  <Box
    sx={{
      width: "100%",
      height: { xs: "calc(100vh - var(--navbar-height) - 55px)", sm: "100vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

const Agenda = dynamic(() => import("../Agenda").then((mod) => mod.Agenda), {
  loading: () => <DynamicLoader />,
  ssr: false,
});
const Board = dynamic(() => import("../Board").then((mod) => mod.Board), {
  loading: () => <DynamicLoader />,
  ssr: false,
});
const Backlog = dynamic(() => import("../Backlog").then((mod) => mod.Backlog), {
  loading: () => <DynamicLoader />,
  ssr: false,
});
const ColoredTasks = dynamic(
  () => import("../ColoredTasks").then((mod) => mod.ColoredTasks),
  {
    loading: () => <DynamicLoader />,
    ssr: false,
  }
);

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
    const hashBoard = data.find(
      (a) => a.id === window.location.hash?.replace("#", "")
    );

    const defaultBoard = data[0];

    pinnedBoard ||
    (!window.location.hash.includes("agenda") &&
      !window.location.hash.includes("backlog") &&
      defaultBoard)
      ? setActiveTab(hashBoard?.id || defaultBoard?.id)
      : defaultBoard
      ? setActiveTab("__agenda.week")
      : setActiveTab("new");

    const hashToTabMap = {
      "#/agenda/week": "__agenda.week",
      "#/agenda/month": "__agenda.month",
      "#/agenda/year": "__agenda.year",
      "#/agenda/backlog": "__agenda.backlog",
      "#/colored-coded": "colored-coded",
    };

    const hash = window.location.hash;
    hashToTabMap[hash] && setActiveTab(hashToTabMap[hash]);
  }, [data]);

  const session = useSession();

  const styles = (condition: boolean) => ({
    transition: "none!important",
    px: 1.5,
    gap: 1.5,
    py: 1,
    mr: 1,
    mb: 0.3,
    width: "100%",
    fontSize: "15px",
    justifyContent: "flex-start",
    borderRadius: 4,
    "&:hover, &:focus": {
      background: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
    },
    ...(session.user.darkMode && {
      color: "hsl(240,11%, 80%)",
    }),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...(!condition
      ? {
          color: `hsl(240,11%,${session.user.darkMode ? 80 : 30}%)`,
          "&:hover": {
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 93}%)`,
          },
        }
      : {
          color: `hsl(240,11%,${session.user.darkMode ? 95 : 10}%)`,
          background: `hsl(240,11%,${session.user.darkMode ? 20 : 85}%)`,
          "&:hover, &:focus": {
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 85}%)`,
          },
        }),
  });
  const [open, setOpen] = useState<boolean>(false);

  const ref: any = useRef();
  const handleClick = (id) => document.getElementById(id)?.click();

  useHotkeys("alt+c", (c) => {
    c.preventDefault(), ref.current?.click();
  });

  useHotkeys("alt+w", (e) => {
    e.preventDefault(), handleClick("__agenda.week");
  });
  useHotkeys("alt+m", (a) => {
    a.preventDefault(), handleClick("__agenda.month");
  });

  useHotkeys("alt+y", (a) => {
    a.preventDefault(), handleClick("__agenda.year");
  });

  const [archiveOpen, setArchiveOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const children = (
    <>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}

      <Typography sx={taskStyles(session).subheading}>Planner</Typography>
      <Box onClick={() => setOpen(false)}>
        <Button
          id="__agenda.year"
          size="large"
          sx={styles(activeTab === "__agenda.backlog")}
          onMouseDown={() => setActiveTab("__agenda.backlog")}
          onClick={() => {
            window.location.hash = "#/agenda/backlog";
            setActiveTab("__agenda.backlog");
          }}
        >
          <Icon className={activeTab === "__agenda.backlog" ? "" : "outlined"}>
            auto_mode
          </Icon>
          Backlog
        </Button>
        {[
          {
            hash: "__agenda.week",
            icon: "view_week",
            label: isMobile ? "Day" : "This week",
          },
          {
            hash: "__agenda.month",
            icon: "calendar_view_month",
            label: "Months",
          },
          {
            hash: "__agenda.year",
            icon: "calendar_month",
            label: "Years",
          },
          {
            hash: "color-coded",
            icon: "palette",
            label: "Color coded",
          },
        ].map((button) => (
          <Button
            key={button.hash}
            id={button.hash}
            size="large"
            sx={styles(activeTab === button.hash)}
            onMouseDown={() => setActiveTab(button.hash)}
            onClick={() => {
              window.location.hash = `#/${button.hash}`;
              setActiveTab(button.hash);
            }}
          >
            <Icon className={activeTab === button.hash ? "" : "outlined"}>
              {button.icon}
            </Icon>
            {button.label}
          </Button>
        ))}
      </Box>
      <Divider
        sx={{
          my: 1,
          width: "90%",
          mx: "auto",
          opacity: 0.5,
          ...(data && data.length === 0 && { display: "none" }),
        }}
      />
      <Typography
        sx={{
          ...taskStyles(session).subheading,
          ...(data && data.length === 0 && { display: "none" }),
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
      <Box>
        <Button
          size="large"
          disableRipple
          onClick={() => setArchiveOpen(!archiveOpen)}
          sx={{
            ...styles(false),
            ...(!data ||
              (data &&
                (data.length === 0 ||
                  !data.find((board) => board.archived)) && {
                  display: "none",
                })),
          }}
        >
          Archived
          <Icon sx={{ ml: "auto" }}>
            {archiveOpen ? "expand_less" : "expand_more"}
          </Icon>
        </Button>
        <Collapse
          in={archiveOpen}
          orientation="vertical"
          sx={{
            mb: { sm: 5 },
            borderRadius: 5,
          }}
        >
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
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: "auto",
          mb: { sm: -2 },
          position: { sm: "sticky" },
          bottom: 0,
          backdropFilter: { sm: "blur(10px)" },
          zIndex: 999,
        }}
      >
        <Tooltip title="alt • c" placement="right">
          <Button
            disabled={
              storage?.isReached === true ||
              (data && data.filter((board) => !board.archived).length >= 5) ||
              session.permission === "read-only"
            }
            ref={ref}
            size="large"
            onClick={() => {
              setOpen(false);
              setActiveTab("new");
            }}
            sx={{
              ...styles(activeTab === "new"),
              px: 2,
              ...((storage?.isReached === true ||
                (data &&
                  data.filter((board) => !board.archived).length >= 5)) && {
                opacity: 0.5,
              }),
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

  return (
    <Box
      sx={{
        display: "flex",
        background: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
      }}
    >
      <SwipeableDrawer
        disableBackdropTransition
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          vibrate(50);
        }}
        open={open}
        disableSwipeToOpen
        PaperProps={{
          sx: { pb: 2, maxHeight: "90vh" },
        }}
        sx={{ zIndex: 999999999999 }}
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
          background: `hsl(240,11%,${session.user.darkMode ? 7 : 95}%)`,
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
        {activeTab.includes("__agenda") && (
          <Agenda
            setDrawerOpen={setOpen}
            view={activeTab.split(".")[1] as any}
          />
        )}
        {activeTab.includes("__agenda.backlog") && (
          <Backlog setDrawerOpen={setOpen} />
        )}
        {activeTab.includes("color-coded") && (
          <ColoredTasks setDrawerOpen={setOpen} />
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
