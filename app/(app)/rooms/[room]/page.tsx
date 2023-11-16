"use client";

import { Box } from "@mui/material";
import { JumpBackIn } from "../JumpBackIn";

export default function Page() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <JumpBackIn />
    </Box>
  );
}
