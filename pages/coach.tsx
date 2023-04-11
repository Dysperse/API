import {
  Box,
  Chip,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import Head from "next/head";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";
import { useSession } from "../lib/client/useSession";
import { Navbar } from "./zen";

export default function Render() {
  const session = useSession();
  const trigger = useMediaQuery("(min-width: 600px)");

  return (
    <Box
      sx={{
        position: "relative",
        mt: { xs: "calc(-1 * calc(var(--navbar-height) + 14.4px))", sm: 0 },
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
            <Chip
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                m: 3,
                background: orange["300"],
                color: "#000",
              }}
              size="small"
              label="Preview"
            />
            <Box
              sx={{
                width: "100%",
                px: 2,
                color: {
                  xs: orange[400],
                  sm: orange[900],
                },
                background: {
                  xs: `linear-gradient(45deg, ${orange[50]}, ${orange[100]})`,
                  sm: `linear-gradient(45deg, ${orange[400]}, ${orange[200]})`,
                },
                p: 3,
                py: 6,
                pt: "calc(var(--navbar-height) + 14.4px)",
                textAlign: "center",
              }}
            >
              <Navbar />
              <Typography
                variant="h1"
                sx={{
                  background: {
                    xs: `linear-gradient(45deg, ${orange["400"]}, ${orange["200"]})`,
                    sm: `linear-gradient(45deg, ${orange["500"]}, ${orange["900"]})`,
                  },
                  backgroundClip: "text!important",
                  fontWeight: 700,
                  WebkitTextFillColor: "transparent!important",
                }}
              >
                127
              </Typography>
              coach streak
            </Box>
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
                mb: 2,
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
              <Typography variant="h5" sx={{ mt: 2, ml: 2 }}>
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
