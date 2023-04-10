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
          height: "100vh",
          background: `hsl(240,11%,${session.user.darkMode ? 8 : 97}%)`,
          ml: -1,
          p: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            background: `hsl(240,11%,${session.user.darkMode ? 15 : 93}%)`,
            flex: "0 0 400px",
            p: 2,
            position: "relative",
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            width: "400px",
          }}
        >
          <h1 className="font-heading my-3 text-4xl font-light underline">
            Routines
          </h1>
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
                width: "100%",
                p: 3,
                borderRadius: 5,
                mt: "auto",
                gap: 4,
              }}
            >
              <picture>
                <img
                  src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3c6.png"
                  alt="trophy"
                  width={70}
                  height={70}
                />
              </picture>
              <Box>
                <Typography variant="h3" className="font-heading">
                  {session.user.trophies}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>trophies</Typography>
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
          <h1 className="font-heading my-3 text-4xl font-light underline">
            Progress
          </h1>
          <MyGoals setHideRoutine={setHideRoutine} />
        </Box>
      </Box>
    </Box>
  );
}
