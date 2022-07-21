import * as React from "react";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";

export function Color({ color, setThemeColor }) {
  return (
    <Box
      onClick={() => setThemeColor(color)}
      sx={{
        width: 50,
        height: 50,
        borderRadius: 5,
        mr: 1,
        mt: 1,
        cursor: "pointer",
        display: "inline-block",
        background: colors[color]["700"],
      }}
    ></Box>
  );
}
