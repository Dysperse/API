import { MyGoals } from "@/components/Coach/MyGoals";
import { ErrorHandler } from "@/components/Error";
import { useApi } from "@/lib/client/useApi";
import { useColor } from "@/lib/client/useColor";
import { useSession } from "@/lib/client/useSession";
import {
  Box,
  Chip,
  Icon,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import Head from "next/head";
import { mutate } from "swr";
import { Navbar } from "../zen";

export default function Render() {
  const session = useSession();
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, loading, url, error } = useApi("user/coach/streaks");
  const isTimeRunningOut = dayjs().hour() > 18;

  const hasCompletedForToday =
    dayjs().startOf("day").toDate().getTime() ===
    dayjs(data ? data.lastStreakDate : new Date())
      .startOf("day")
      .toDate()
      .getTime();

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
                sx={{ ml: "auto" }}
                icon={<Icon>local_fire_department</Icon>}
                label={
                  data?.streakCount && !isStreakBroken ? data.streakCount : 0
                }
              />
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              pt: 3,
              px: { sm: 3 },
            }}
          >
            <Typography
              sx={{
                p: 3,
                background: { xs: palette[2], sm: palette[4] },
                mb: 2,
                borderRadius: 5,
              }}
            >
              <b>Leagues coming soon</b>
              <Typography variant="body2">
                Leagues allow you to track progress and compete with friends and
                family to achieve your goals.
              </Typography>
            </Typography>
            <Box
              sx={{
                width: "100%",
                mb: 2,
                px: 2,
                border: "2px solid #CD7F32",
                color: "#CD7F32",
                p: 3,
                opacity: 0.6,
                display: "none",
                borderRadius: 5,
              }}
            >
              <Typography variant="body2">Current league</Typography>
              <Typography
                variant="h4"
                sx={{
                  background: "linear-gradient(45deg, #CD7F32, #7a4d20)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box>Bronze II</Box>
                <Box sx={{ display: "flex", ml: "auto" }}>
                  {[false, true, true].map((life, index) => (
                    <picture key={index}>
                      <img
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
                          life ? "2764" : "1f494"
                        }.png`}
                        alt="heart"
                        width={20}
                        height={20}
                      />
                    </picture>
                  ))}
                </Box>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ height: 20, borderRadius: 9, mb: 2, mt: 1 }}
                color="inherit"
              />
              <b>40</b> more days until{" "}
              <b>
                <span
                  style={{
                    color: "#7d7f80",
                    border: "2px solid",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    borderColor: "#7d7f80",
                  }}
                >
                  Silver III
                </span>
              </b>
            </Box>
          </Box>
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
