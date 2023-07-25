import { MyGoals } from "@/components/Coach/MyGoals";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
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
import { mutate } from "swr";
import { Navbar } from "..";

export default function Render() {
  const session = useSession();
  const router = useRouter();

  const { data, url, error } = useApi("user/coach/streaks");
  const isTimeRunningOut = dayjs().hour() > 18;

  // const hasCompletedForToday =
  //   dayjs().startOf("day").toDate().getTime() ===
  //   dayjs(data ? data.lastStreakDate : new Date())
  //     .startOf("day")
  //     .toDate()
  //     .getTime();

  const isStreakBroken =
    dayjs().diff(dayjs(data ? data.lastStreakDate : new Date()), "day") >= 2;
  const useStreakStyles = data?.streakCount > 1 && !isStreakBroken;
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <motion.div initial={{ y: -100 }} animate={{ y: 0 }}>
        {isMobile && (
          <Navbar
            showLogo
            showRightContent
            right={
              <Button
                onClick={() => router.push("/coach/explore")}
                sx={{
                  ml: "auto",
                  mr: 1,
                  color: palette[8],
                  background: palette[2],
                  px: 2,
                }}
              >
                <Icon className="outlined">add_circle</Icon>Create
              </Button>
            }
          />
        )}
      </motion.div>
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
              <Tooltip title="Trophies earned">
                <Chip
                  icon={
                    <Icon sx={{ color: "inherit!important" }}>
                      military_tech
                    </Icon>
                  }
                  label={session.user.trophies}
                />
              </Tooltip>
            </Box>
          </Box>
          {error && (
            <ErrorHandler
              error="Yikes! We couldn't load your streak. Please try again later"
              callback={() => mutate(url)}
            />
          )}

          <CardActionArea
            onClick={() => router.push("/coach/routine")}
            sx={{
              flexGrow: 1,
              p: 3,
              my: 3,
              borderRadius: 5,
              px: { sm: 3 },
              display: "flex",
              background: { xs: palette[3], sm: palette[4] },
              alignItems: "center",
            }}
          >
            <Box>
              <Typography>
                <b>Daily goals</b>
              </Typography>
            </Box>
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </CardActionArea>
          <MyGoals />
        </Box>
      </motion.div>
    </>
  );
}
