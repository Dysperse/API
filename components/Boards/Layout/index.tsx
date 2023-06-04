import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import {
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { mutate } from "swr";
import { ErrorHandler } from "../../Error";
import { Puller } from "../../Puller";
import { CreateTask } from "../Board/Column/Task/Create";
import { Tab } from "./Tab";

function SearchTasks({ setOpen }) {
  const router = useRouter();
  const session = useSession();
  const [query, setQuery] = useState(
    router.asPath.includes("/search")
      ? decodeURIComponent(router.asPath.split("/search/")[1])
      : ""
  );

  return (
    <Box
      sx={{
        display: "flex",
        mb: { xs: 2, sm: 1.5 },
        gap: 1,
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search tasks..."
        {...(query.trim() && { label: "Search tasks..." })}
        onKeyDown={(e: any) => e.code === "Enter" && e.target.blur()}
        onBlur={() =>
          query.trim() !== "" &&
          router.push(`/tasks/search/${encodeURIComponent(query)}`)
        }
        value={query}
        sx={{
          transition: "all .2s",
          zIndex: 999,
          cursor: "default",
          ...(Boolean(query.trim()) && {
            mr: -6,
          }),
        }}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          sx: {
            cursor: "default",
            borderRadius: 4,
          },
          endAdornment: (
            <InputAdornment position="end">
              {query.trim() && (
                <IconButton size="small">
                  <Icon>east</Icon>
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: "none" }}>
        <CreateTask
          closeOnCreate
          column={{ id: "-1", name: "" }}
          defaultDate={dayjs().startOf("day")}
          label="New task"
          placeholder="Create a task..."
          mutationUrl={""}
          boardId={1}
        />
      </Box>
      <Tooltip
        placement="right"
        title={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            New task
            <span
              style={{
                background: `hsla(240,11%,${
                  session.user.darkMode ? 90 : 10
                }%, .1)`,
                padding: "0 10px",
                borderRadius: "5px",
              }}
            >
              /
            </span>
          </Box>
        }
      >
        <IconButton
          onClick={() => {
            document.getElementById("createTask")?.click();
            setOpen(false);
          }}
          sx={{
            ...(Boolean(query.trim()) && {
              transform: "scale(0)",
            }),
            cursor: "default",
            transition: "transform .2s",
            background: `hsl(240,11%,${session.user.darkMode ? 15 : 90}%)`,
            color: `hsl(240,11%,${session.user.darkMode ? 90 : 35}%)`,
            "&:hover": {
              background: `hsl(240,11%,${session.user.darkMode ? 20 : 85}%)`,
            },
            "&:active": {
              background: `hsl(240,11%,${session.user.darkMode ? 25 : 80}%)`,
            },
          }}
        >
          <Icon>add</Icon>
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export const taskStyles = (session) => {
  return {
    subheading: {
      my: { xs: 1, sm: 1.5 },
      mt: { xs: 1, sm: 1 },
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
      "&:active": { transform: "scale(0.95)" },
      position: "fixed",
      bottom: {
        xs: "70px",
        md: "30px",
      },
      left: "10px",
      zIndex: 9,
      background: session.user.darkMode
        ? "hsla(240,11%,14%,0.5)!important"
        : "rgba(255,255,255,.5)!important",
      backdropFilter: "blur(10px)",
      border: "1px solid",
      borderColor: `hsla(240,11%,${session.user.darkMode ? 25 : 80}%,.5)`,
      fontWeight: "700",
      display: { md: "none" },
      fontSize: "15px",
      color: session.user.darkMode ? "#fff" : "#000",
    },
  };
};

export function TasksLayout({ open, setOpen, children }) {
  const { data, url, error } = useApi("property/boards");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const storage = useAccountStorage();
  const router = useRouter();
  const session = useSession();

  useHotkeys("/", (e) => {
    e.preventDefault();
    document.getElementById("createTask")?.click();
  });

  const styles = (condition: boolean) => ({
    cursor: { sm: "unset!important" },
    transition: "none!important",
    px: 1.5,
    gap: 1.5,
    py: 0.8,
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
        <ErrorHandler
          callback={() => mutate(url)}
          error="An error occurred while loading your tasks"
        />
      )}
      <SearchTasks setOpen={setOpen} />
      <Typography sx={taskStyles(session).subheading}>Perspectives</Typography>
      <Box onClick={() => setOpen(false)}>
        {[
          {
            hash: "stream",
            icon: "view_stream",
            label: "Stream",
          },
          {
            hash: "agenda/week",
            icon: "view_week",
            label: isMobile ? "Day" : "Weeks",
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
          mt: 1,
          mb: 2,
          width: { sm: "90%" },
          mx: "auto",
          opacity: 0.5,
        }}
      />
      <Typography sx={taskStyles(session).subheading}>Boards</Typography>
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
      <Link
        href={
          Boolean(storage?.isReached) ||
          data?.filter((board) => !board.archived).length >= 7 ||
          session.permission === "read-only"
            ? "/tasks"
            : "/tasks/boards/create"
        }
        style={{ width: "100%" }}
      >
        <Button
          fullWidth
          disabled={
            Boolean(storage?.isReached) ||
            data?.filter((board) => !board.archived).length >= 7 ||
            session.permission === "read-only"
          }
          ref={ref}
          size="large"
          onClick={() => setOpen(false)}
          sx={{
            ...styles(router.asPath == "/tasks/boards/create"),
            px: 2,
            cursor: "default",
            ...((storage?.isReached === true ||
              (data &&
                data.filter((board) => !board.archived).length >= 7)) && {
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
          New board
        </Button>
      </Link>
      <Box>
        {data && data.filter((x) => x.archived).length !== 0 && (
          <>
            <Divider
              sx={{
                mt: 1,
                mb: 2,
                width: { sm: "90%" },
                mx: "auto",
                opacity: 0.5,
              }}
            />
            <Typography sx={taskStyles(session).subheading}>
              Archived
            </Typography>
          </>
        )}
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
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <SwipeableDrawer
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false);
          vibrate(50);
        }}
        open={open}
        PaperProps={{
          sx: {
            pb: 2,
            maxHeight: "90vh",
            background: `hsl(240,11%,${session.user.darkMode ? 7 : 97}%)`,
          },
        }}
        sx={{ zIndex: 999999999999 }}
      >
        <Puller />
        <Box sx={{ p: 1, pt: 0, mt: -2 }}>{menuChildren}</Box>
      </SwipeableDrawer>
      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          flex: { xs: "100%", md: "0 0 250px" },
          ml: -1,
          p: 3,
          px: 2,
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
