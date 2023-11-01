"use client";

import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Icon,
  Skeleton,
  SxProps,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { TaskNavbar } from "../navbar";

function Loader() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={500}
        width="700px"
        sx={{
          maxWidth: "100%",
        }}
      />
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Skeleton variant="circular" animation="wave" height={60} width={60} />
        <Skeleton variant="circular" animation="wave" height={60} width={60} />
      </Box>
    </>
  );
}

function Slides({ data }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const maxLength = data.length;
  const [progress, setProgress] = useState(0);
  const slide = data[progress];

  const styles: SxProps = {
    width: "100%",
    px: 5,
    py: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    textDecoration: "uppercase",
    fontSize: "13px",
    color: palette[11],
    borderRadius: 5,
    "& .MuiIcon-root": {
      background: palette[3],
      borderRadius: 99,
      color: palette[9],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      fontSize: "30px",
    },
    "&:hover": {
      background: palette[2],
    },
    "&:active": {
      background: palette[3],
      "& .MuiIcon-root": {
        background: palette[4],
      },
    },
  };

  return (
    <>
      <Box
        sx={{
          height: 500,
          width: 700,
          maxWidth: "100%",
          border: `2px solid ${palette[3]}`,
          borderRadius: 5,
        }}
      >
        {slide.name}
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: 2,
        }}
      >
        <Box sx={styles}>
          <Icon>close</Icon>
          Delete
        </Box>
        <Box sx={styles}>
          <Icon>south</Icon>
          Today
        </Box>
        <Box sx={styles}>
          <Icon>east</Icon>
          Postpone
        </Box>
      </Box>
    </>
  );
}

function Intro() {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const getGreeting = useMemo(() => {
    const time = new Date().getHours();
    if (time < 12) return "Good morning";
    else if (time < 17) return "Good afternoon";
    else if (time < 20) return "Good evening";
    else return "Good night";
  }, []);

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <Typography
          variant="h1"
          className="font-heading"
          sx={{
            textShadow: `0 0 100px ${palette[9]}`,
          }}
        >
          {getGreeting}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            textShadow: `0 0 100px ${palette[9]}`,
          }}
        >
          Let&apos;s take a moment to plan your day{" "}
          <Icon sx={{ verticalAlign: "middle" }}>east</Icon>
        </Typography>
      </motion.div>
    </>
  );
}

export default function Page() {
  const { session } = useSession();

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  const key = useMemo(() => {
    return [
      "space/tasks/plan",
      {
        timezone: session.user.timeZone,
        utcOffset: dayjs().utcOffset(),
        start: dayjs().subtract(7, "day").toISOString(),
        end: dayjs().endOf("day").toISOString(),
        type: "week",
      },
    ];
  }, [session.user.timeZone]);

  const { data, mutate, error, isLoading } = useSWR(key);

  return (
    <Box
      sx={{
        p: 5,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      }}
    >
      <TaskNavbar title="Plan" />
      <Box sx={{ maxWidth: "500px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 45, height: 45, borderRadius: 3 }}>
            <Icon className="outlined" sx={{ fontSize: "26px!important" }}>
              emoji_objects
            </Icon>
          </Avatar>
          <Typography variant="h6">Plan</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {showIntro && <Intro />}
        {!showIntro && data && <Slides data={data} />}
        {error && <ErrorHandler callback={mutate} />}
        {isLoading && !showIntro && <Loader />}
      </Box>
    </Box>
  );
}
