import { ErrorHandler } from "@/components/Error";
import { TasksLayout } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";

/**
 * Top-level component for the dashboard page.
 */
export default function Upcoming() {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const { data, url, error } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
    upcoming: true,
  });

  const [loading, setLoading] = useState(false);
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Box>
        <Head>
          <title>Upcoming</title>
        </Head>
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
                    xs: "calc(100dvh - var(--navbar-height) - 55px)",
                    sm: "100dvh",
                  },
                }}
              >
                <Image
                  src="/images/noUpcoming.png"
                  width={256}
                  height={171}
                  alt="Backlog"
                  style={{
                    ...(isDark && {
                      filter: "invert(100%)",
                    }),
                  }}
                />
                <Box
                  sx={{ width: "300px", maxWidth: "calc(100vw - 40px)", mb: 2 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ mt: -2 }}>
                    Nothing there...
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
      </Box>{" "}
      {!data && !error && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100dvh",
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </TasksLayout>
  );
}
