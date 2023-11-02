"use client";

import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  Box,
  Chip,
  Icon,
  Skeleton,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { TaskNavbar } from "../navbar";

function PlanNavbar({ subtitle }: { subtitle?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ width: 50, height: 50, borderRadius: 3 }}>
        <Icon className="outlined" sx={{ fontSize: "30px!important" }}>
          emoji_objects
        </Icon>
      </Avatar>
      <Box>
        <Typography variant="h6">Plan</Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              textTransform: "uppercase",
              fontWeight: 900,
              mt: -0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Loader() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={350}
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

function Slides({ setNavbarText, data }) {
  const { session } = useSession();
  const isDark = useDarkMode(session.darkMode);
  const orangePalette = useColor("orange", isDark);
  const palette = useColor(session.themeColor, isDark);

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

  useEffect(() => {
    setNavbarText(`${progress} of ${maxLength}`);
  }, [progress, maxLength]);
  const [isBroken, setIsBroken] = useState(false);
  return (
    <>
      <Box
        onClick={() => setIsBroken((s) => !s)}
        sx={{
          height: 350,
          width: 700,
          maxWidth: "100%",
          border: `2px solid ${palette[4]}`,
          transition: "all .8s",
          boxShadow: `0 0 100px ${palette[4]}`,
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 4,
          gap: 2,
          zIndex: 99,
          ...(isBroken && {
            animation: "delete .8s forwards",
            ["@keyframes delete"]: {
              "10%": {
                transform: "scale(.9) rotate(-5deg)",
                boxShadow: "none",
              },
              "50%": {
                transform: "scale(.9) rotate(-5deg)",
                boxShadow: "none",
              },
              "100%": {
                filter: "blur(5px)",
                transform: "scale(.5) rotate(-5deg) translate(-80vh, 100vh)",
                boxShadow: "none",
              },
            },
          }),
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {slide.pinned && (
            <Chip
              sx={{
                color: `${orangePalette[11]}!important`,
                background: `${orangePalette[5]}!important`,
              }}
              icon={<Icon>priority_high</Icon>}
              label="Urgent"
            />
          )}
          {slide.pinned && (
            <Chip
              icon={<Icon className="outlined">calendar_today</Icon>}
              label={dayjs(slide.due).format("MMMM Do")}
            />
          )}
          {!slide.dateOnly && (
            <Chip
              label={dayjs(slide.due).format("h:mm A")}
              sx={{ background: palette[3] }}
              icon={<Icon className="outlined">access_time</Icon>}
            />
          )}
          {slide.column && (
            <Tooltip title={slide.column?.name}>
              <Chip
                label={slide.column?.board?.name}
                sx={{ background: palette[3] }}
                avatar={
                  <Avatar
                    sx={{ borderRadius: 0 }}
                    src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${slide.column?.emoji}.png`}
                  />
                }
              />
            </Tooltip>
          )}
        </Box>
        <Typography variant="h3" className="font-heading">
          {slide.name}
        </Typography>
        <Typography className="font-heading">{slide.description}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          mb: 3,
          gap: 1,
        }}
      >
        <Box sx={styles}>
          <Icon>close</Icon>
          Delete
        </Box>
        <Box sx={{ ...styles, background: addHslAlpha(palette[4], 0.3) }}>
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
  const [navbarText, setNavbarText] = useState<null | string>(null);
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
        <PlanNavbar subtitle={navbarText} />
      </Box>
      <Box
        sx={{
          pt: 4,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {showIntro && <Intro />}
        {!showIntro && data && (
          <Slides setNavbarText={setNavbarText} data={data} />
        )}
        {error && <ErrorHandler callback={mutate} />}
        {isLoading && !showIntro && <Loader />}
      </Box>
    </Box>
  );
}
