import { ErrorHandler } from "@/components/Error";
import { TasksLayout } from "@/components/Tasks/Layout";
import { Task } from "@/components/Tasks/Task";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Grid,
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { mutate } from "swr";

/**
 * Top-level component for the dashboard page.
 */
export function Upcoming({ setMobileView }) {
  const session = useSession();

  const { data, url, error } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
    upcoming: true,
  });

  const [loading, setLoading] = useState(false);
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  return (
    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <Box
        sx={{
          ...(!data &&
            !error && {
              filter: "blur(10px)",
              transition: "all .2s",
              opacity: 0.5,
              pointerEvents: "none",
            }),
        }}
      >
        <Box
          sx={{
            p: 3,
            pt: 10,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography className="font-heading" variant="h2">
              Upcoming
            </Typography>
            <Typography sx={{ mb: 0.5 }}>{data?.length || 0} items</Typography>
            <IconButton
              onClick={() => setMobileView("backlog")}
              sx={{ display: { sm: "none" } }}
            >
              <Icon>west</Icon>
            </IconButton>
            <IconButton
              onClick={async () => {
                setLoading(true);
                await mutate(url);
                setLoading(false);
              }}
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
            {error && (
              <ErrorHandler
                callback={() => mutate(url)}
                error="Yikes! An error occured while trying to fetch your backlog. Please try again later."
              />
            )}
          </Box>
          {data && (
            <>
              {data.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    mt: 10,
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
                    sx={{
                      width: "300px",
                      maxWidth: "calc(100vw - 40px)",
                      mb: 2,
                      mx: "auto",
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                      Nothing there...
                    </Typography>
                    <Typography variant="body1">
                      Here is a place for you to view your upcoming stuff
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
            </>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const [mobileView, setMobileView] = useState("backlog");

  const { data, url, error } = useApi("property/tasks/backlog", {
    date: dayjs().startOf("day").subtract(1, "day").toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.themeColor, isDark);

  return (
    <TasksLayout open={open} setOpen={setOpen}>
      <Head>
        <title>
          {isMobile
            ? capitalizeFirstLetter(mobileView) + " • Stream"
            : "Stream"}
        </title>
      </Head>
      <Grid
        container
        sx={{
          background: palette[2],
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: "100%",
            height: "100vh",
            overflowY: "scroll",
            borderRight: { sm: "5px solid " + palette[2] },
            display: {
              xs: mobileView == "backlog" ? "block" : "none",
            },
            background: palette[1],
            borderRadius: "0 28px 28px 0 !important",
          }}
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Box
              sx={{
                ...(!data &&
                  !error && {
                    filter: "blur(10px)",
                    opacity: 0.5,
                    transition: "all .2s",
                    pointerEvents: "none",
                  }),
              }}
            >
              <Box
                sx={{
                  p: 3,
                  pt: 10,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography className="font-heading" variant="h2">
                    Backlog
                  </Typography>
                  <Typography sx={{ mb: 0.5 }}>
                    {data?.length || 0} unfinished
                  </Typography>
                  <IconButton
                    onClick={async () => {
                      setLoading(true);
                      await mutate(url);
                      setLoading(false);
                    }}
                    disabled={loading}
                  >
                    <Icon
                      sx={{
                        transition: "all .2s",
                        ...(loading && {
                          transform: "scale(.9)",
                          opacity: 0.9,
                        }),
                      }}
                    >
                      refresh
                    </Icon>
                  </IconButton>
                  <IconButton
                    onClick={() => setMobileView("upcoming")}
                    disabled={loading}
                    sx={{ display: { sm: "none" } }}
                  >
                    <Icon>east</Icon>
                  </IconButton>
                </Box>
                {error && (
                  <ErrorHandler
                    callback={() => mutate(url)}
                    error="Yikes! An error occured while trying to fetch your backlog. Please try again later."
                  />
                )}
              </Box>
              {data && (
                <Box>
                  {data.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <Image
                        src="/images/backlog.png"
                        width={256}
                        height={256}
                        alt="Backlog"
                        style={{
                          ...(isDark && {
                            filter: "invert(100%)",
                          }),
                        }}
                      />
                      <Box
                        sx={{
                          width: "300px",
                          maxWidth: "calc(100vw - 40px)",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                          You&apos;re on top of it!
                        </Typography>
                        <Typography variant="body1">
                          The backlog is a place where you can see all your
                          unfinished tasks.
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
          </motion.div>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: {
              xs: mobileView == "upcoming" ? "block" : "none",
            },
            height: "100vh",
            overflowY: "scroll",
            background: palette[1],
            borderLeft: { sm: "5px solid " + palette[2] },
            borderRadius: "28px 0 0 28px !important",
          }}
        >
          <Upcoming setMobileView={setMobileView} />
        </Grid>
      </Grid>
    </TasksLayout>
  );
}
