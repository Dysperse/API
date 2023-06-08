import { ErrorHandler } from "@/components/Error";
import { TasksLayout, taskStyles } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import { useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { vibrate } from "@/lib/client/vibration";
import { Box, Icon, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const { data, url, error } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
    upcoming: true,
  });
  const [loading, setLoading] = useState(false);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Box>
        <Head>
          <title>Backlog</title>
        </Head>
        <IconButton
          size="large"
          onContextMenu={() => {
            vibrate(50);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          sx={taskStyles(session).menu}
        >
          <Icon>menu</Icon>
        </IconButton>

        {!data ||
          (data?.length !== 0 && (
            <Box sx={{ p: 3, pb: 0, pt: 5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography
                    className="font-heading"
                    variant="h4"
                    gutterBottom
                  >
                    Upcoming
                  </Typography>
                  <Typography>{data.length} tasks</Typography>
                </Box>
                <IconButton
                  onClick={async () => {
                    setLoading(true);
                    await mutate(url);
                    setLoading(false);
                  }}
                  sx={{ ml: "auto" }}
                  disabled={loading}
                >
                  <Icon
                    sx={{
                      transition: "all .2s",
                      ...(loading && { transform: "scale(.9)", opacity: 0.9 }),
                    }}
                  >
                    refresh
                  </Icon>
                </IconButton>
              </Box>
              {error && (
                <ErrorHandler
                  callback={() => mutate(url)}
                  error="Yikes! An error occured while trying to fetch your backlog. Please try again later."
                />
              )}
            </Box>
          ))}
        {data && (
          <Box
            sx={{ px: { sm: 3 }, pb: data.length ? 15 : 0, maxWidth: "100vw" }}
          >
            {data.length === 0 && (
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
                    ...(session.user.darkMode && {
                      filter: "invert(100%)",
                    }),
                  }}
                />
                <Box
                  sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
                    Nothing there
                  </Typography>
                  <Typography variant="body1">
                    Here is a place for you to view your upcoming tasks
                  </Typography>
                </Box>
              </Box>
            )}
            {[
              ...data.filter((task) => task.pinned),
              ...data.filter((task) => !task.pinned),
            ].map((task) => (
              <Task
                isDateDependent={true}
                key={task.id}
                board={task.board || false}
                columnId={task.column ? task.column.id : -1}
                mutationUrl={url}
                task={task}
              />
            ))}
          </Box>
        )}
      </Box>
    </TasksLayout>
  );
}
