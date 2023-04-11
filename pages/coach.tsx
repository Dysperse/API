import { Box, Tooltip, Typography } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";
import { useSession } from "../lib/client/useSession";

export default function Render() {
  const session = useSession();
  const [hideRoutine, setHideRoutine] = useState<boolean>(false);

  return (
    <Box sx={{ position: "relative" }}>
      <Head>
        <title>Coach &bull; Dysperse</title>
      </Head>
      <Box
        sx={{
          pb: 3,
          display: "flex",
          height: {
            xs: "calc(calc(100vh - 55px) - var(--navbar-height))",
            md: "100vh",
          },
          background: { md: `hsl(240,11%,${session.user.darkMode ? 8 : 97}%)` },
          ml: { md: -1 },
          p: { xs: 0, sm: 2 },
          gap: { md: 2 },
        }}
      >
        <Box
          sx={{
            background: {
              md: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
            },
            flex: { xs: "0 0 100vw", md: "0 0 400px" },
            overflow: "scroll",
            p: 2,
            position: "relative",
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            width: "400px",
          }}
        >
          <Typography className="font-heading mt-3 text-4xl underline">
            Routines
          </Typography>
          <Routines isCoach />
          <Tooltip title="Earn tropies by completing goals">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: `hsla(240,11%,${
                  session.user.darkMode ? 25 : 90
                }%, 0.5)`,
                backdropFilter: "blur(10px)",
                px: 3,
                py: 2,
                borderRadius: 5,
                mt: "auto",
                width: { xs: "calc(100vw - 40px)", md: "100%" },
                gap: 4,
                "& img": {
                  width: { xs: 27, sm: 60 },
                  height: { xs: 27, sm: 60 },
                },

                position: { xs: "fixed", sm: "unset" },
                bottom: "65px",
                left: 0,
                m: { xs: "20px", sm: "0px" },
                mb: "0!important",
              }}
            >
              <picture>
                <img
                  src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
                  alt="trophy"
                />
              </picture>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: 25, sm: 50 },
                    fontWeight: 700,
                    display: "flex",
                    gap: 1,
                    "& span": {
                      display: { xs: "inline", md: "none" },
                    },
                  }}
                >
                  {session.user.trophies}
                  <span> trophies</span>
                </Typography>
                <Typography
                  sx={{ display: { xs: "none", sm: "unset" }, fontWeight: 700 }}
                >
                  trophies
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
        <Box
          sx={{
            background: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: 5,
            flexGrow: 1,
          }}
        >
          <MyGoals setHideRoutine={setHideRoutine} />
        </Box>
      </Box>
    </Box>
  );
}
