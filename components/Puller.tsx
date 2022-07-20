import Box from "@mui/material/Box";
import React from "react";
import * as colors from "@mui/material/colors";

export function Puller() {
  return (
    <Box
      className="puller"
      sx={{
        background: colors[themeColor][50],
      }}
    ></Box>
  );
}
