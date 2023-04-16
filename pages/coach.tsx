import {
  Box,
  Icon,
  IconButton,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import dayjs from "dayjs";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";
import { ErrorHandler } from "../components/Error";
import { useApi } from "../lib/client/useApi";
import { useSession } from "../lib/client/useSession";
import { toastStyles } from "../lib/client/useTheme";

export default function Render() {
  const session = useSession();
  const trigger = useMediaQuery("(min-width: 600px)");

  const { data, url, error } = useApi("user/routines/streaks");

  const isTimeRunningOut = dayjs().hour() > 18;
  const hasCompletedForToday =
    dayjs().startOf("day").day ===
    dayjs(data ? data.lastStreakUpdated : new Date()).startOf("day").day;

  const isStreakBroken =
    dayjs().diff(dayjs(data ? data.lastStreakUpdated : new Date()), "day") >= 2;

  const useStreakStyles =
    data && data.streakCount && data.streakCount > 1 && !isStreakBroken;

  return (
    <Box
      sx={{
        ml: { md: -1 },
        pb: { xs: 15, sm: 0 },
      }}
    >
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
            md: "100vh",
          },
          background: { md: `hsl(240,11%,${session.user.darkMode ? 8 : 97}%)` },
          p: { xs: 0, sm: 2 },
          gap: { md: 2 },
        }}
      >
        <Box
          sx={{
            background: {
              md: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
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
            {data && (
              <IconButton
                onClick={() =>
                  toast(
                    hasCompletedForToday
                      ? "You completed at least one task today to maintain your streak!"
                      : isTimeRunningOut
                      ? "Time's running out! Make sure to complete at least one task to keep your streak alive!"
                      : "Complete at least one task to keep your streak alive",
                    toastStyles
                  )
                }
                sx={{ position: "absolute", bottom: 0, right: 0, m: 2 }}
              >
                <Icon>
                  {hasCompletedForToday
                    ? "check"
                    : isTimeRunningOut
                    ? "hourglass_empty"
                    : ""}
                </Icon>
              </IconButton>
            )}
            {error && (
              <ErrorHandler
                error="Yikes! We couldn't load your streak. Please try again later"
                callback={() => mutate(url)}
              />
            )}
            <Box
              sx={{
                width: "100%",
                px: 2,
                color: useStreakStyles
                  ? {
                      xs: orange[400],
                      sm: orange[900],
                    }
                  : "hsl(240,11%,10%,0.7)",
                background: useStreakStyles
                  ? {
                      xs: `linear-gradient(45deg, ${orange[50]}, ${orange[100]})`,
                      sm: `linear-gradient(45deg, ${orange[400]}, ${orange[200]})`,
                    }
                  : "hsl(240,11%,90%,0.5)",
                p: 3,
                py: 6,
                borderRadius: { xs: 5, sm: 0 },
                textAlign: "center",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  background: useStreakStyles
                    ? {
                        xs: `linear-gradient(45deg, ${orange["400"]}, ${orange["200"]})`,
                        sm: `linear-gradient(45deg, ${orange["500"]}, ${orange["900"]})`,
                      }
                    : "#303030",
                  backgroundClip: "text!important",
                  fontWeight: 700,
                  WebkitTextFillColor: "transparent!important",
                }}
              >
                {data && !isStreakBroken && data.streakCount
                  ? data.streakCount
                  : 0}
              </Typography>
              coach streak
            </Box>
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
                background: "rgba(200,200,200,.3)",
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
                filter: "blur(10px)",
                opacity: 0.6,
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
              md: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
            },
            overflow: "scroll",
            position: "relative",
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {!trigger && (
            <>
              <Typography variant="h5" sx={{ mt: 2, ml: 3 }}>
                Routines
              </Typography>
              <Routines isCoach={trigger} />
            </>
          )}
          <MyGoals />
        </Box>
        {trigger && (
          <Box
            sx={{
              background: {
                md: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
              },
              overflow: "scroll",
              p: { md: 2 },
              py: { md: 1 },
              position: "relative",
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Typography variant="h5" sx={{ mt: 2 }}>
              Routines
            </Typography>
            <Routines isCoach={trigger} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
