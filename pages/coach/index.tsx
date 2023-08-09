import { MyGoals } from "@/components/Coach/MyGoals";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Box,
  Button,
  CardActionArea,
  Chip,
  Icon,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { orange } from "@radix-ui/colors";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { Navbar } from "..";

export function RoutineTrigger({ sidebar = false, bottomNav = false }: any) {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const redPalette = useColor("red", useDarkMode(session.darkMode));

  const dayIndex = dayjs().diff(dayjs().startOf("week"), "days");
  const { data, error } = useApi("user/coach");

  const incompleteGoals = useMemo(
    () =>
      data &&
      data
        .filter((goal) => !goal.completed)
        // check for days of week
        .filter((goal) => goal.daysOfWeek[dayIndex])
        // check for last time goal was completed
        .filter(
          (goal) =>
            dayjs(goal.lastCompleted).format("YYYY-MM-DD") !==
            dayjs().format("YYYY-MM-DD")
        ),
    [data, dayIndex]
  );

  return sidebar &&
    incompleteGoals?.length > 0 &&
    !router.asPath.includes("coach") ? (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: bottomNav ? 15 : 17,
        height: bottomNav ? 15 : 17,
        m: bottomNav ? 4.3 : 3.5,
        mt: bottomNav ? 0.5 : 1,
        borderRadius: 99,
        background: redPalette[9],
        border: "3px solid " + palette[bottomNav ? 2 : 1],
      }}
    />
  ) : sidebar ? (
    <></>
  ) : (
    <CardActionArea
      onClick={() => router.push("/coach/routine")}
      sx={{
        flexGrow: 1,
        p: 3,
        my: 3,
        px: { sm: 3 },
        display: "flex",
        background: { xs: palette[3], sm: palette[4] },
        borderRadius: 5,
        alignItems: "center",
      }}
    >
      <Box>
        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {incompleteGoals?.length > 0 && (
            <Box
              sx={{
                width: 13,
                height: 13,
                borderRadius: 99,
                background: redPalette[9],
              }}
            />
          )}
          <b>Today&apos;s routine</b>
        </Typography>
        {incompleteGoals?.length > 0 ? (
          <Typography>{incompleteGoals.length} remaining</Typography>
        ) : (
          <Typography>Complete!</Typography>
        )}
      </Box>
      <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
    </CardActionArea>
  );
}

export default function Render() {
  const session = useSession();
  const router = useRouter();

  const { data, url, error } = useApi("user/coach/streaks");

  const isStreakBroken =
    dayjs().diff(dayjs(data ? data.lastStreakDate : new Date()), "day") >= 2;
  const useStreakStyles = data?.streakCount > 1 && !isStreakBroken;
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box sx={{ mb: "100px" }}>
      <Navbar
        showLogo={isMobile}
        showRightContent={isMobile}
        right={
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ marginLeft: "auto" }}
          >
            <Button
              onClick={() => router.push("/coach/explore")}
              sx={{
                mr: 1,
                color: palette[8],
                background: palette[2],
                px: 2,
              }}
            >
              <Icon className="outlined">add_circle</Icon>Create
            </Button>
          </motion.div>
        }
      />
      <Head>
        <title>Coach</title>
      </Head>
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <Box
          sx={{ maxWidth: "600px", px: 2, pt: { xs: 0, sm: 10 }, mx: "auto" }}
        >
          <Box sx={{ textAlign: "left", my: 4, ml: 1 }}>
            <Typography variant="h2" sx={{ mt: 5 }}>
              <span className="font-heading">My Goals</span>
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Streak">
                <Chip
                  onClick={() => {
                    toast.dismiss();
                    toast("Streak", {
                      ...toastStyles,
                      icon: <Icon>local_fire_department</Icon>,
                    });
                  }}
                  sx={{
                    ...(useStreakStyles && {
                      background: orange["orange9"] + "!important",
                      color: orange["orange1"] + "!important",
                    }),
                  }}
                  icon={
                    <Icon sx={{ color: "inherit!important" }}>
                      local_fire_department
                    </Icon>
                  }
                  label={
                    data?.streakCount && !isStreakBroken ? data.streakCount : 0
                  }
                />
              </Tooltip>
              <Chip
                onClick={() => {
                  toast.dismiss();
                  toast("Trophies earned", {
                    ...toastStyles,
                    icon: <Icon>military_tech</Icon>,
                  });
                }}
                icon={
                  <Icon sx={{ color: "inherit!important" }}>military_tech</Icon>
                }
                label={session.user.trophies}
              />
            </Box>
          </Box>
          {error && (
            <ErrorHandler
              error="Yikes! We couldn't load your streak. Please try again later"
              callback={() => mutate(url)}
            />
          )}

          <RoutineTrigger />
          <MyGoals />
        </Box>
      </motion.div>
    </Box>
  );
}
