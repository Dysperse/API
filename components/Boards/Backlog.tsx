import { Box, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useApi } from "../../hooks/useApi";
import { ErrorHandler } from "../Error";
import { Task } from "./Board/Column/Task";

export function Backlog() {
  const { data, url, error } = useApi("property/boards/backlog", {
    date: dayjs().startOf("day").toISOString(),
  });

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
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
      <Box sx={{ p: 5, pb: 0 }}>
        <Typography className="font-heading" variant="h4" gutterBottom>
          Backlog
        </Typography>
        <Typography sx={{ mb: 2 }}>{data.length} unfinished tasks</Typography>
        {error && (
          <ErrorHandler error="Yikes! An error occured while trying to fetch your backlog. Please try again later." />
        )}
      </Box>
      <Box sx={{ px: 4, pb: 5 }}>
        {data.length !== 0 && (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              height: "calc(100vh - 180px)",
            }}
          >
            <Image
              src="/images/backlog.png"
              width={256}
              height={256}
              alt="Backlog"
              style={{
                ...(global.user.darkMode && {
                  filter: "invert(100%)",
                }),
                marginTop: "-40px",
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
        {data.map((task, index) => (
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
