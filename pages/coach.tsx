import {
  Box,
  Chip,
  Icon,
  LinearProgress,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { orange, red } from "@mui/material/colors";
import Head from "next/head";
import { useState } from "react";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";
import { useSession } from "../lib/client/useSession";

export default function Render() {
  const session = useSession();
  const [hideRoutine, setHideRoutine] = useState<boolean>(false);
  const trigger = useMediaQuery("(min-width: 600px)");

  return (
    <Box
      sx={{
        position: "relative",
        mt: { xs: "-14.4px", md: 0 },
        maxWidth: "100vw",
        overflowX: "hidden",
        ml: { md: -1 },
        pb: { xs: 15, sm: 0 },
      }}
    >
      <Head>
        <title>Coach &bull; Dysperse</title>
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
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
            width: { xs: "100vw", sm: "400px" },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Skeleton
              sx={{ opacity: 0.5 }}
              variant="rectangular"
              height={200}
              animation={false}
              width="100%"
            />
            <Chip
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                m: 2,
                background: red["A700"],
                color: "#fff",
              }}
              size="small"
              label="preview"
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                px: 2,
                border: "2px solid",
                borderColor: orange["A700"],
                color: orange["A700"],
                p: 3,
                mb: 2,
                borderRadius: 5,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: orange["A700"],
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Icon sx={{ fontSize: "30px!important" }} className="outlined">
                  local_fire_department
                </Icon>
                127
              </Typography>
              coach streak
            </Box>
            <Box
              sx={{
                width: "100%",
                px: 2,
                border: "2px solid #CD7F32",
                color: "#CD7F32",
                p: 3,
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
                }}
              >
                Bronze II
              </Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ height: 20, borderRadius: 9, mb: 2, mt: 1 }}
                color="inherit"
              />
              <b>40</b> more days until{" "}
              <b>
                <span style={{ color: "#7d7f80" }}>Silver III</span>
              </b>
              <Box sx={{ mt: 1, display: "flex" }}>
                {[false, true, true].map((life, index) => (
                  <picture key={index}>
                    <img
                      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
                        life ? "2764" : "1f494"
                      }.png`}
                      alt="heart"
                      width={30}
                      height={30}
                    />
                  </picture>
                ))}
              </Box>
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
              <Typography variant="h5" sx={{ mt: 2, ml: 2 }}>
                Routines
              </Typography>
              <Routines isCoach={trigger} />
            </>
          )}
          <MyGoals setHideRoutine={setHideRoutine} />
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
