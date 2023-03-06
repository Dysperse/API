import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useApi } from "../../hooks/useApi";
import { useSession } from "../../pages/_app";
import { ErrorHandler } from "../Error";
import { Task } from "./Board/Column/Task";

export function Backlog({ setDrawerOpen }) {
  const { data, url, error } = useApi("property/boards/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });
  const session = useSession();

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "calc(100vh - var(--navbar-height) - 55px)",
            sm: "100vh",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <IconButton
        size="large"
        onContextMenu={() => {
          navigator.vibrate(50);
          setDrawerOpen(true);
        }}
        onClick={() => {
          navigator.vibrate(50);
          setDrawerOpen(true);
        }}
        sx={{
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
          background: session?.user?.darkMode
            ? "hsla(240,11%,14%,0.5)!important"
            : "rgba(255,255,255,.5)!important",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          backdropFilter: "blur(10px)",
          border: {
            xs: session?.user?.darkMode
              ? "1px solid hsla(240,11%,15%)"
              : "1px solid rgba(200,200,200,.3)",
            md: "unset",
          },
          fontWeight: "700",
          display: { md: "none" },
          fontSize: "15px",
          color: session?.user?.darkMode ? "#fff" : "#000",
        }}
      >
        <Icon>menu</Icon>
      </IconButton>

      {!data ||
        (data && data.length !== 0 && (
          <Box sx={{ p: 5, pb: 0 }}>
            <Typography className="font-heading" variant="h4" gutterBottom>
              Backlog
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {data.length} unfinished tasks
            </Typography>
            {error && (
              <ErrorHandler error="Yikes! An error occured while trying to fetch your backlog. Please try again later." />
            )}
          </Box>
        ))}
      <Box sx={{ px: 4, pb: 15, maxWidth: "100vw" }}>
        {data.length == 0 && (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              userSelect: "none",
              height: {
                xs: "calc(100vh - var(--navbar-height) - 55px)",
                sm: "100vh",
              },
            }}
          >
            <Image
              src="/images/backlog.png"
              width={256}
              height={256}
              alt="Backlog"
              style={{
                ...(session?.user?.darkMode && {
                  filter: "invert(100%)",
                }),
              }}
            />
            <Box sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
                You&apos;re on top of it!
              </Typography>
              <Typography variant="body1">
                The backlog is a place where you can see all your unfinished
                tasks.
              </Typography>
            </Box>
          </Box>
        )}
        {[
          ...data.filter((task) => task.pinned),
          ...data.filter((task) => !task.pinned),
        ].map((task, index) => (
          <Task
            key={task.id}
            board={task.board || false}
            columnId={task.column ? task.column.id : -1}
            isAgenda
            mutationUrl={url}
            task={task}
          />
        ))}
      </Box>
    </Box>
  );
}
