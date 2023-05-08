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
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useAccountStorage } from "../../../lib/client/useAccountStorage";
import { useApi } from "../../../lib/client/useApi";
import { useSession } from "../../../lib/client/useSession";
import { vibrate } from "../../../lib/client/vibration";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
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

export function TasksLayout({ children }) {
  const { data, error } = useApi("property/boards");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const storage = useAccountStorage();
  const router = useRouter();
  const session = useSession();

  const [archiveOpen, setArchiveOpen] = useState<boolean>(false);

  const styles = (condition: boolean) => ({
    cursor: { sm: "unset!important" },
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

  const menuChildren = (
    <>
      {error && (
        <ErrorHandler error="An error occurred while loading your tasks" />
      )}

      <Typography sx={taskStyles(session).subheading}>Planner</Typography>
      <Box onClick={() => setOpen(false)}>
        {[
          {
            hash: "backlog",
            icon: "auto_mode",
            label: "Backlog",
          },
          {
            hash: "agenda/week",
            icon: "view_week",
            label: isMobile ? "Day" : "This week",
          },
          {
            hash: "agenda/month",
            icon: "calendar_view_month",
            label: "Months",
          },
          {
            hash: "agenda/year",
            icon: "calendar_month",
            label: "Years",
          },
          {
            hash: "color-coded",
            icon: "palette",
            label: "Color coded",
          },
        ].map((button) => (
          <Link
            href={`/tasks/${button.hash}`}
            key={button.hash}
            style={{ cursor: "default" }}
          >
            <Button
              size="large"
              id={`__agenda.${button.hash}`}
              sx={styles(router.asPath === `/tasks/${button.hash}`)}
            >
              <Icon
                className={
                  router.asPath === `/tasks/${button.hash}` ? "" : "outlined"
                }
              >
                {button.icon}
              </Icon>
              {button.label}
            </Button>
          </Link>
        ))}
      </Box>
      <Divider
        sx={{
          my: 1,
          width: "90%",
          mx: "auto",
          opacity: 0.5,
          ...(data?.length === 0 && { display: "none" }),
        }}
      />
      <Typography
        sx={{
          ...taskStyles(session).subheading,
          ...(data?.length === 0 && { display: "none" }),
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
              board={board}
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
                  board={board}
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
          <Link href="/tasks/boards/create">
            <Button
              disabled={
                Boolean(storage?.isReached) ||
                data?.filter((board) => !board.archived).length >= 5 ||
                session.permission === "read-only"
              }
              ref={ref}
              size="large"
              onClick={() => setOpen(false)}
              sx={{
                ...styles(router.asPath == "/tasks/boards/create"),
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
                className={router.asPath == "/tasks/create" ? "" : "outlined"}
                sx={{ ml: -0.5 }}
              >
                add_circle
              </Icon>
              Create
            </Button>
          </Link>
        </Tooltip>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
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
        <Box sx={{ p: 1 }}>{menuChildren}</Box>
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
        {menuChildren}
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
        {children}
      </Box>
    </Box>
  );
}
