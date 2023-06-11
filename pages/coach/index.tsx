import { MyGoals } from "@/components/Coach/MyGoals";
import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import { Box, CardActionArea, Chip, Icon, Typography } from "@mui/material";
import { orange } from "@radix-ui/colors";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Navbar } from "../zen";

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

  const palette = useColor(session.themeColor, session.user.darkMode);

  return (
    <Box
      sx={{
        ml: { md: -1 },
        pb: { xs: 15, sm: 0 },
        pt: "env(titlebar-area-height, 0px)",
      }}
    >
      <Navbar />
      <Head>
        <title>Coach</title>
      </Head>
      <Box
        sx={{
          pb: 3,
          display: { md: "flex" },
          flexDirection: { xs: "column", sm: "row" },
          height: {
            xs: "auto",
            md: "calc(100vh - env(titlebar-area-height, 0px))",
          },
          p: { xs: 0, sm: 2 },
          gap: { md: 2 },
        }}
      >
        <Box
          sx={{
            background: {
              md: palette[3],
            },
            flex: { xs: "0 0 auto", md: "0 0 400px" },
            overflow: "scroll",
            position: "relative",
            borderRadius: { md: 5 },
            px: { xs: 3, sm: 0 },
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
            width: { xs: "100vw", sm: "400px" },
          }}
        >
          <Box sx={{ position: "relative" }}>
            {error && (
              <ErrorHandler
                error="Yikes! We couldn't load your streak. Please try again later"
                callback={() => mutate(url)}
              />
            )}

            <Typography
              variant="h2"
              sx={{ display: "flex", mt: 4, alignItems: "center" }}
            >
              <span className="font-heading">My goals</span>
              <Chip
                sx={{
                  ml: "auto",
                  ...(!useStreakStyles && {
                    background: orange["orange9"],
                    color: orange["orange1"],
                  }),
                }}
                icon={<Icon>local_fire_department</Icon>}
                label={
                  data?.streakCount && !isStreakBroken ? data.streakCount : 0
                }
              />
            </Typography>
          </Box>
          <CardActionArea
            onClick={() => router.push("/coach/routine")}
            sx={{
              flexGrow: 1,
              p: 3,
              my: 3,
              borderRadius: 5,
              px: { sm: 3 },
              display: "flex",
              background: { xs: palette[2], sm: palette[4] },
              alignItems: "center",
            }}
          >
            <Box>
              <Typography>
                <b>Today&apos;s routine</b>
              </Typography>
              <Typography variant="body2">Tap to start</Typography>
            </Box>
            <Icon sx={{ ml: "auto" }}>arrow_forward_ios</Icon>
          </CardActionArea>
        </Box>
        <Box
          sx={{
            background: {
              md: palette[2],
            },
            overflow: "scroll",
            width: "100%",
            position: "relative",
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <MyGoals />
        </Box>
      </Box>
    </Box>
  );
}
