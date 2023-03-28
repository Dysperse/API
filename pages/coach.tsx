import { Alert, Box } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { MyGoals } from "../components/Coach/MyGoals";
import { Routines } from "../components/Coach/Routines";

export default function Render() {
  const [hideRoutine, setHideRoutine] = useState<boolean>(false);

  return (
    <Box sx={{ position: "relative" }}>
      <Head>
        <title>Coach &bull; Dysperse</title>
      </Head>
      <Box
        className="mt-5 sm:mt-10 "
        sx={{
          pb: 3,
        }}
      >
        <Box className="flex max-w-[100vw] flex-col gap-5 p-3 px-6 pt-2 sm:flex-row">
          <h1 className="font-heading my-3 text-4xl font-light underline">
            My goals
          </h1>
        </Box>
        <Routines />
        <Box className="max-w-[100vw] p-3 px-6 pt-0">
          <MyGoals setHideRoutine={setHideRoutine} />
          {!hideRoutine && (
            <Alert severity="info" icon="🔥" sx={{ mb: 15 }}>
              Your goals are only visible to you
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}
